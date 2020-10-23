import * as Graph from "@himenon/graph";
import { findTopologicalSortedGroup } from "sort-dependency";
import { collect, PathItem } from "@path-tree/collection";
import * as OutputTree from "./OutputTree";
import * as fs from "fs";

type ModuleName = string;

export interface DuplicateModules {
  [moduleName: string]: ModuleName[];
}

const extractDuplicateModules = (graph: Graph.Type, source: string, duplicateModules: DuplicateModules) => {
  (graph.getStateByName(source).edges[source] || []).forEach((childSource) => {
    if (duplicateModules[childSource] && !duplicateModules[childSource].includes(source)) {
      duplicateModules[childSource].push(source);
    } else {
      duplicateModules[childSource] = [source];
    }
    extractDuplicateModules(graph, childSource, duplicateModules);
  });
};

/**
 * 重複のあるモジュールを抽出する
 */
export const getDuplicateModules = (graph: Graph.Type, targetModuleName: string): DuplicateModules => {
  const nodeNameList1 = graph.breadthFirstSearch(targetModuleName);
  const graph1 = graph.createGraphBySources(nodeNameList1);
  const duplicateModules: DuplicateModules = {};
  extractDuplicateModules(graph1, targetModuleName, duplicateModules);
  Object.keys(duplicateModules).forEach((moduleName) => {
    if (duplicateModules[moduleName].length <= 1) {
      delete duplicateModules[moduleName];
    }
  });
  return duplicateModules;
};

export const generate = (graph: Graph.Type, targetModuleName: string, duplicateModules: DuplicateModules): any => {
  const pathItems: PathItem[] = [];
  const tmp: any[] = [];
  Object.entries(duplicateModules).forEach(([stopModuleName, targets]) => {
    const { sortResult } = findTopologicalSortedGroup({
      graph,
      start: targetModuleName,
      stop: stopModuleName,
      nodeFilterPattern: new RegExp(".*"),
      edgeFilterPattern: new RegExp(".*"),
    });

    const filteredResult = sortResult.filter((item) => targets.includes(item));
    tmp.push(filteredResult);
    pathItems.push({
      path: filteredResult
        // .filter(item => {
        //   return targets.includes(item)
        // })
        .map((p) => p.replace("/", "_"))
        .reverse()
        .join("/"),
      type: "file",
    });
  });
  fs.writeFileSync("pathItems.json", JSON.stringify(tmp, null, 2), { encoding: "utf-8" });
  const treeData = collect(pathItems);
  const dirs = treeData.edges["dir:."];
  return dirs.map((dir) => OutputTree.generate(treeData, dir)).filter((o) => o.length !== 1);
};
