const packageJson = require('./package.json');

module.exports = {
    version: packageJson.version,
    init: ({settings}) => {
        const policy = require('./policies/user-exists')(settings);

        pluginContext.registerPolicy(policy)
    },
    policies: ['user-exists'],
    options: {
        url: {
            type: 'string',
            required: true
        },
        userExistsPath: {
            type: 'string',
            required: true
        }
    }
};