import { PackageJson } from "type-fest";
import * as Graph from "@himenon/graph";
import * as Model from "../model";
import * as Repository from "../repository";
import * as Cli from "./cli";
import * as Query from "./query";
import * as fs from "fs";
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
  const result = Query.getDuplicateModules({ graph, firstModuleName: args["firstModuleName"] });
  fs.writeFileSync("data.json", JSON.stringify(result, null, 2), { encoding: "utf-8" });
};

main().catch((error) => {
  console.error(chalk.red("Error") + `: ${error.message}`);
  process.exit(1);
});
