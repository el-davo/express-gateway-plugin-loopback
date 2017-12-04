# express-gateway-plugin-loopback

### What is this?

This is a simple plugin for express-gateway which allows you to use loopback as your user management system

### Install

Use the command below if you are using yarn

```
yarn add express-gateway-plugin-loopback
```

If you prefer npm

```
npm install --save express-gateway-plugin-loopback
```

### Setup

Add the following to ./config/system-config.yml

```
plugins:
  express-gateway-plugin-loopback:
    baseUrl: "http://localhost:3000"
    userExistsPath: "/api/me"
```

Add the following policy to ./config/gateway-config.yml

```
http:
  port: 8080
admin:
  port: 9876
  hostname: localhost
apiEndpoints:
  graphql:
    host: '*'
    paths:
      - /graphiql
      - /graphql
serviceEndpoints:
  users:
    url: 'http://localhost:3000/api'
  graphql:
    url: 'http://some-api:3000'
policies:
  - user-exists
  - proxy
pipelines:
  my-api:
    apiEndpoints:
      - graphql
    policies:
      - user-exists:
      - proxy:
        - action:
            serviceEndpoint: graphql
            changeOrigin: true
```

You will also need to add a custom endpoint to loopback to determine if the user is real

Add the following to your models folder and call it me.js

```
'use strict';

module.exports = Me => {
  Me.me = (req, next) => {
    let AccessToken = Me.app.models.AccessToken;
    AccessToken.findForRequest(req, {}, (aux, accesstoken) => {
      let UserModel = Me.app.models.User;
      UserModel.findById(accesstoken.userId, (error, user) => {
        if (error) {
          return next(error);
        }

        next(error, {user});
      });
    });
  };

  Me.remoteMethod(
    'me',
    {
      accepts: {arg: 'req', type: 'object', http: {source: 'req'}},
      returns: {arg: 'info', type: 'object'},
      http: {path: '/', verb: 'get'}
    }
  );
};

```

And add the following called me.json to the same directory

```
{
  "name": "me",
  "base": "Model",
  "plural": "me",
  "acls": [
    {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    },
    {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$authenticated",
      "permission": "ALLOW"
    }
  ]
}

```

Make sure you have activated the me endpoint in ./server/model-config.json