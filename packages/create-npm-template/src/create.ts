import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as ora from 'ora';
import {
  isAliNpm, getNpmTarball, getAndExtractTarball, log,
} from 'ice-npm-utils';

// eslint-disable-next-line
const chalk = require('chalk');

async function getNpmRegistry(npmName: string): Promise<string> {
  if (process.env.REGISTRY) {
    return process.env.REGISTRY;
  } else if (isAliNpm(npmName)) {
    return 'https://registry.npm.alibaba-inc.com';
  } else {
    return 'https://registry.npm.taobao.org';
  }
}

async function checkEmpty(dir: string): Promise<boolean> {
  let files: string[] = await fs.readdir(dir);
  // filter some special files
  files = files.filter((filename) => {
    return [
      'node_modules', '.git', '.DS_Store', '.iceworks-tmp',
      'build', '.bzbconfig',
    ].indexOf(filename) === -1;
  });
  if (files.length && files.length > 0) {
    return false;
  } else {
    return true;
  }
};

export default async function create(dirPath: string, templateName: string, dirname: string): Promise<void> {
  await fs.ensureDir(dirPath);
  const empty = await checkEmpty(dirPath);

  if (!empty) {
    const { go } = await inquirer.prompt({
      type: 'confirm',
      name: 'go',
      message:
        'The existing file in the current directory. Are you sure to continue ？',
      default: false,
    });
    if (!go) process.exit(1);
  }

  const registry = await getNpmRegistry(templateName);
  const tarballURL = await getNpmTarball(templateName, 'latest', registry);

  log.verbose('download tarballURL', tarballURL);

  const spinner = ora(`download npm tarball start`).start();
  await getAndExtractTarball(
    dirPath,
    tarballURL,
    (state) => {
      spinner.text = `download npm tarball progress: ${Math.floor(state.percent*100)}%`;
    },
  );
  spinner.succeed('download npm tarball successfully.');

  console.log();
  console.log('Initialize project successfully.');
  console.log();
  console.log('Starts the development server.');
  console.log();
  console.log(chalk.cyan(`    cd ${dirname}`));
  console.log(chalk.cyan('    npm install'));
  console.log(chalk.cyan('    npm start'));
  console.log();
}
