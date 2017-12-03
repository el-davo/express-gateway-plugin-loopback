const packageJson = require('./package.json');

module.exports = {
    version: packageJson.version,
    init: (pluginContext) => {
        let policy = require('./policies/user-exists')(pluginContext.settings);
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