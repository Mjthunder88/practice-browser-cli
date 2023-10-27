import * as esbuild from "esbuild-wasm";
import axios from "axios";

//* Overall  the reason why we have to the option to select certain files to add functions too will depend on what we're trying to bundle. (EX: css file, typescript file, etc)

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // * This onResolve event tells Esbuild that it will find the path to a particular file
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        if (args.path === "index.js") {
          return { path: args.path, namespace: "a" }; // * namespace is similar to filter. By saying it will only put certain functions/events on files with certain names
        }

        if (args.path.includes("./" || args.path.includes("../"))) {
          return {
            namespace: "a",
            path: new URL(
              args.path,
              "https://unpkg.com" + args.resolveDir + "/"
            ).href,
          };
        }

        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // * This onLoad step is used to actually load the file on the system. It will overried Esbuilds natural path of trying to load it into the users filesystem.
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
              import React from 'react'
              console.log(React);
            `,
          };
        }
        const { data, request } = await axios.get(args.path);
        console.log(request);
        return {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
      });
    },
  };
};
