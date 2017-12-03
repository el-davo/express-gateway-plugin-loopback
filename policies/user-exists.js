const request = require('request-promise');

module.exports = ({baseUrl, userExistsPath}) => {
    return {
        name: 'user-exists',
        policy: () => {
            return (req, res, next) => {

                if (!req.get('authorization')) {
                    return next('Cannot verify user');
                }

                request({
                    method: 'POST',
                    uri: `${baseUrl}/${userExistsPath}`,
                    headers: {
                        authorization: req.get('authorization')
                    },
                    json: true
                }).then((body) => {
                    if (body.userExists) {
                        next();
                    } else {
                        next('User does not exist');
                    }
                }).catch((err) => {
                    next('Cannot verify user');
                });
            };
        }
    }
};