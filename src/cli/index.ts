import * as Model from "../model";
import * as Repository from "../repository";
import * as Cli from "./cli";
import { PackageJson } from "type-fest";
import chalk from "chalk";

// const updateGraphParams = (packages: PackageJson[]) => {
//   packages.forEach((pkg) => {
//     const pkgName = pkg.name;
//     if (!pkgName) {
//       return;
//     }
//   });
// };

const main = async () => {
  const args = Cli.executeCommandLine();
  const model = Model.create({
    baseDir: args.root.absoluteRootPath,
    ignore: [],
  });
  const repository = Repository.create(model);
  const packages = repository.getPackages();
  console.log(packages);
};

main().catch((error) => {
  console.error(chalk.red("Error") + `: ${error.message}`);
  process.exit(1);
});
