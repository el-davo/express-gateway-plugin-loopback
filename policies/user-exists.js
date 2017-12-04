const request = require('request-promise');

module.exports = ({baseUrl, userExistsPath}) => {
    return {
        name: 'user-exists',
        policy: () => {
            return (req, res, next) => {

                if (!req.get('authorization')) {
                    return next('unauthorized');
                }

                request({
                    method: 'GET',
                    uri: `${baseUrl}${userExistsPath}`,
                    headers: {
                        authorization: req.get('authorization')
                    },
                    json: true
                }).then((body) => {
                    if (body.info.user) {
                        req.user = body.info.user;
                        next();
                    } else {
                        next('unauthorized');
                    }
                }).catch(() => {
                    next('unauthorized');
                });
            };
        }
    }
};