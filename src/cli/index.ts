import { PackageJson } from "type-fest";
import * as Graph from "@himenon/graph";
import * as Model from "../model";
import * as Repository from "../repository";
import * as Cli from "./cli";
import * as Query from "../query";
import chalk from "chalk";

const updateGraphParams = (graph: Graph.Type, packages: PackageJson[], kind: "dependencies" | "devDependencies" | "peerDependencies") => {
  packages.forEach((pkg) => {
    const pkgName = pkg.name;
    if (!pkgName) {
      return;
    }
    graph.addNode(pkgName);
    Object.keys({ ...pkg[kind] }).forEach((depName) => {
      graph.addEdge(pkgName, depName);
    });
  });
};

const main = async () => {
  const args = Cli.executeCommandLine();
  const model = Model.create({
    baseDir: args.root.absoluteRootPath,
    ignore: [],
  });
  const repository = Repository.create(model);
  const cacheGraphState = repository.getCache();
  const packages = repository.getPackages();
  const graph = Graph.create(cacheGraphState);
  updateGraphParams(graph, packages, "dependencies");
  const duplicateModules = Query.getDuplicateModules(graph, args["targetModuleName"]);
  // const result = Query.generate(graph, args["targetModuleName"], duplicateModules);
  console.info(JSON.stringify(duplicateModules, null, 2));
};

main().catch((error) => {
  console.error(chalk.red("Error") + `: ${error}`);
  console.error(error);
  process.exit(1);
});
