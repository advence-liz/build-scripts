const path = require('path');
const Config = require('webpack-chain');
const fs = require('fs');

const plugin = ({
  context,
  registerTask,
  onGetWebpackConfig,
  registerUserConfig,
  onHook,
}) => {
  const { rootDir } = context;

  registerTask('default', new Config());

  registerTask('web', new Config());
  registerTask('weex', new Config());

  onGetWebpackConfig('web', config => {
    config.entry('index');
    config.output.path(path.join(rootDir, 'web'));
  });

  onGetWebpackConfig('weex', config => {
    config.entry('index');
    config.output.path(path.join(rootDir, 'weex'));

    // fs.writeFileSync(
    //   'build.log.json',
    //   JSON.stringify(config.toConfig(), null, 2),
    // );
  });

  registerUserConfig({
    name: 'entry',
    validation: 'string',
    configWebpack: (config, value, context) => {
      config.entry('index').add(value);
    },
  });

  registerUserConfig({
    name: 'outputDir',
    validation: 'string',
    configWebpack: (config, value, context) => {
      config.output.path(path.join(rootDir, value));
    },
  });
  onGetWebpackConfig(config => {
    config.mode('development');
  });
  //{ args: CommandArgs; webpackConfig: WebpackConfig[] }
  onHook('before.build.run', opts => {
    // do something before dev
    fs.writeFileSync('build.log.json', JSON.stringify(opts, null, 2));
  });
};

module.exports = plugin;
