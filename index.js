import * as core from "@actions/core";
import * as exec from '@actions/exec';
import * as path from 'path';

const identity = (a) => a;

const inputs = {
  apiKey: { required: true, secret: true },
  apiSecret: { required: true, secret: true },
  sourceDir: { default: '.' },
  ignoreFiles: { default: [] },
  channel: { default: 'unlisted' }
};

const outputs = {
  name: path.basename,
  path: path.dirname,
  target: identity
};

function execOptions() {
  const std = { out: '', err: '' };
  const append = (sink) =>
    (data) => {
      std[sink] += data.toString();
    };
  const options = {
    listeners: {
      stdout: append("out"),
      stderr: append("err")
    }
  };
  return [std, options];
}

async function run() {
  const params = Object.fromEntries(
    Object.entries(inputs)
      .map(([key, config]) => {
        const value = core.getInput(key, { required: config.required }) || config.default;
        if (config.secret) {
          core.setSecret(value);
        }
        return [key, value];
      }));

  core.startGroup("Installing web-ext");
  exec.exec('npm', ['install', '--global', 'web-ext']);
  core.endGroup();

  core.startGroup("Running web-ext sign");
  let [std, options] = execOptions();

  await exec.exec('web-ext', [
    'sign',
    `--source-dir=${params.sourceDir}`,
    `--ignore-files=${params.ignoreFiles.join(' ')}`,
    `--channel=${params.channel}`,
    `--api-key=${params.apiKey}`,
    `--api-secret=${params.apiSecret}`
  ], options);

  const match = std.out.match(/^(?<xpi>.*web-ext-artifacts.*)$/m);
  Object.entries(outputs)
    .forEach(([k, f]) =>
      core.setOutput(k, f(match.groups.xpi)));
  core.endGroup();
}

run()
  .catch(core.setFailed);
