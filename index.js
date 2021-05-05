const core = require("@actions/core");
const github = require("@actions/github");
const path = require("path");
const { encryptFile } = require("./src/encrypt");

try {
  const region = core.getInput("aws-region");
  const cmk = core.getInput("aws-cmk");
  const inputFile = core.getInput("config-file-location");

  console.log(
    configFileLocation,
    github.workspace,
    process.env.GITHUB_WORKSPACE
  );
  // const configFileLocation = path.join(github.workspace, inputFile);
  const encryptedFile = encryptFile({
    region,
    cmk,
    configFileLocation: inputFile,
  });
  core.setOutput("encrypted-file-location", encryptedFile);

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
