import { PackageJson } from "type-fest";
import * as Model from "./model";

export const create = (model: Model.Type) => {
  const getPathList = (packageName: string): string[] => {
    const packageJsonPathList = Object.keys(model.getPackageJsonData());
    return packageJsonPathList.filter((pathname) => {
      return pathname.match(`node_modules/${packageName}/package.json`);
    });
  };

  const getPackages = (): PackageJson[] => {
    return Object.values(model.getPackageJsonData());
  };

  return {
    getPackages,
    getPathList,
  };
};
