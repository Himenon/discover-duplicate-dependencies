import * as Graph from "@himenon/graph";

export interface Params {
  firstModuleName: string;
  graph: Graph.Type;
}

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

export const getDuplicateModules = ({ graph, firstModuleName }: Params): any => {
  const nodeNameList1 = graph.breadthFirstSearch(firstModuleName);
  const graph1 = graph.createGraphBySources(nodeNameList1);
  const duplicateModules: DuplicateModules = {};
  extractDuplicateModules(graph1, firstModuleName, duplicateModules);

  Object.keys(duplicateModules).forEach((moduleName) => {
    if (duplicateModules[moduleName].length <= 1) {
      delete duplicateModules[moduleName];
    }
  });
  return duplicateModules;
};
