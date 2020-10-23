import { TreeData } from "@path-tree/collection";

const DELIMITER = "_" as const;
const SLASH = "/" as const;
const PRE_VERT = "|" as const;
const PRE_FILE = "├" as const;
const SPACE = " " as const;
const PRE_LAST_FILE = "└" as const;

// [
//   ["@babel/runtime"],                            level = 1, length: 1, arrayLength: 1
//   ["├", "mock-webstorage"],                      level = 2, length: 2, arrayLength: 2
//   ["|", "└", "@nicolive_ContainerInfra"],        level = 3, length: 3, arrayLength: 3
//   ["|", "" , "└", "@nicolive_ContainerDomain"],  level = 4, length: 4, arrayLength: 4
//   ["|", "" , "",  "├", "babel-plugin-macros"],   level = 5, length: 5, arrayLength: 5
//   ["|", "" , "",  "└", "babel-plugin-emotion"],  level = 5, length: 5, arrayLength: 5
//   ["└", "babel-plugin-emotion"],                 level = 2, length: 2, arrayLength: 2
// ]

type LevelOperator = typeof PRE_VERT | typeof PRE_FILE | typeof PRE_LAST_FILE | typeof SPACE;
type LevelInfo = LevelOperator[];

const listToTreeString = (list: string[], rootDir: string) => {
  const treeString: string[] = [];
  const levelInfo: LevelInfo = [];
  list.forEach((node, idx) => {
    if (idx === 0) {
      treeString.push(rootDir.replace("dir:", "").replace(DELIMITER, SLASH));
      return;
    }
    const splitModulePaths = node.split("/");
    const currentLevel = splitModulePaths.length;
    let operator: LevelOperator = SPACE;
    // 途中で、次の要素が子を保つ場合
    if (idx < list.length - 1) {
      const nextItem = list[idx + 1].split("/");
      const nextLevel = nextItem.length;
      if (nextLevel > currentLevel) {
        // 現在よりも深い階層が存在し、同じ階層にファイルが存在しない場合
        operator = PRE_LAST_FILE;
      } else if (nextLevel === currentLevel) {
        // 同等の場合
        operator = SPACE;
      }
    }
    // 最後の場合
    if (idx === list.length - 1) {
      operator = PRE_LAST_FILE;
    }
    // 末端が`PRE_LAST_FILE`で次に続く場合はSPACEに置き換える
    if (levelInfo[levelInfo.length - 1] === PRE_LAST_FILE) {
      levelInfo[levelInfo.length - 1] = SPACE;
    }
    levelInfo.push(operator);
    treeString.push([...levelInfo, splitModulePaths[currentLevel - 1].replace(DELIMITER, SLASH)].join(" "));
  });
  return treeString;
};

export const generate = (treeData: TreeData, rootDir: string) => {
  const list = treeData.nodes.filter((node) => node.match(new RegExp("^" + rootDir)));
  return listToTreeString(list, rootDir);
};
