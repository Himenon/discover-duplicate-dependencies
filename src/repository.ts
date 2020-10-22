import * as Graph from "@himenon/graph";
import { PackageJson } from "type-fest";
import * as Model from "./model";

export const create = (model: Model.Type) => {
  const getPathList = (packageName: string): string[] => {
    const packageJsonPathList = Object.keys(model.getPackageJsonData());
    return packageJsonPathList.filter((pathname) => {
      return pathname.match(`node_modules/${packageName}/package.json`);
    });
  };

  const getCache = () => {
    return model.getGraphStateData();
  };

  const getPackages = (): PackageJson[] => {
    return Object.values(model.getPackageJsonData());
  };

  const updateCache = (graphState: Graph.State) => {
    model.updateGraphStateData(graphState);
  };

  return {
    getCache,
    getPackages,
    getPathList,
    updateCache,
  };
};
