import commander from "commander";
import { SourcePathInvalidError, CliArgumentError } from "./exceptions";
import * as PathFactory from "./PathFactory";
import * as path from "path";
import * as dot from "./dot";

const isInvalidPath = require("is-invalid-path");

export type Output = {
  filename: PathFactory.Type;
  extension: string;
  skipRender: boolean;
};

export interface CLIArguments {
  /** Root Directory */
  root: PathFactory.Type;
  kinds: Array<"dev" | "devDep">;
  firstModuleName: string;
}

export const validateCliArguments = (args: commander.Command): CLIArguments => {
  if (typeof args["root"] !== "string" || isInvalidPath(args["root"])) {
    throw new SourcePathInvalidError("`--root` arguments does not selected.");
  }
  if (args["cacheDir"] && (typeof args["cacheDir"] !== "string" || isInvalidPath(args["cacheDir"]))) {
    throw new CliArgumentError("`--cache-dir` require valid directory path.");
  }
  if (args["ignore"] && typeof args["ignore"] !== "string") {
    throw new CliArgumentError("`--ignore` please input string path pattern.");
  }
  if (args["output"] && typeof args["output"] !== "string" && ![".png", ".svg"].includes(path.extname(args["output"]))) {
    throw new SourcePathInvalidError("`--output` invalid value.");
  }
  return {
    root: PathFactory.create({ source: args["root"] }),
    kinds: ["dev"],
    firstModuleName: args["start"],
  };
};

export const executeCommandLine = (): CLIArguments => {
  commander
    .version(require("../../package.json").version) // add webpack.DefinePlugin
    .option("--root [directory]", "Root directory")
    .option("--start [package.json name]", "Start library name")
    .option("--display [package.json name]", "dev or devDep")
    .parse(process.argv);
  return validateCliArguments(commander);
};
