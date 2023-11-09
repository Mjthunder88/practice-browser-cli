import * as esbuild from "esbuild-wasm";


//* Overall  the reason why we have to the option to select certain files to add functions too will depend on what we're trying to bundle. (EX: css file, typescript file, etc)

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // ? Handle root entry file of 'index.js
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });
      // ? Handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });
      // ? Handle main file of module
      // * This onResolve event tells Esbuild that it will find the path to a particular file
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });

      
    },
  };
};
