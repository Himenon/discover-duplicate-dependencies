import { findPackageJson, FoundPackageJson } from "./findPackageJson";

export interface Params {
  baseDir: string;
  ignore: string[];
}

export interface PrivateState {
  cacheData: FoundPackageJson | undefined;
  cacheFilename: string | undefined;
}

export const create = ({ baseDir, ignore }: Params) => {
  return {
    getPackageJsonData: () => {
      return findPackageJson(baseDir, ignore);
    },
  };
};

export type Type = ReturnType<typeof create>;
