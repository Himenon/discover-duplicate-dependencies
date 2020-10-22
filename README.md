# discover-duplicate-dependencies

## Install

```sh
yarn global add discover-duplicate-dependencies
```

### Search top or deep or standalone libraries

```bash
discover-duplicate-dependencies --root . --display dev,devDep
```

```
duplicate dependencies!

packageA
  - packageB
  - packageC
  - packageD

duplicate devDependencies!

packageE
  - packageC
  - packageD
```

### Find dependency order

Using topological sort: (<https://en.wikipedia.org/wiki/Topological_sorting>)

```bash
discover-duplicate-dependencies \
    --root . \
    --cache-dir .cache \
    --start "@babel/plugin-codemod-object-assign-to-object-spread" \
    --stop "@babel/parser"
```

<details>
<summary>Result</summary>
Topological sorting result: @babel/plugin-codemod-object-assign-to-object-spread -> @babel/parser

1. @babel/plugin-codemod-object-assign-to-object-spread
2. @babel/core
3. @babel/helpers
4. @babel/traverse
5. @babel/helper-function-name
6. @babel/template
7. @babel/parser
   </details>

### Output dependency graph example

```bash
discover-duplicate-dependencies \
    --root .\
    --cache-dir .cache\
    --output library-map.png
```

[Image (very large)](./docs/library-map.png)

```bash
discover-duplicate-dependencies \
    --root . \
    --cache-dir .cache \
    --start "@babel/plugin-codemod-object-assign-to-object-spread" \
    --stop "@babel/parser" \
    --output sorted-graph.png
```

![Sorted graph](./docs/sorted-graph.png)

## License

discover-duplicate-dependencies is [MIT licensed](https://github.com/Himenon/discover-duplicate-dependencies/blob/master/LICENSE).
