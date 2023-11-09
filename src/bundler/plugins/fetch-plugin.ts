import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {

      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
            loader: "jsx",
            contents: inputCode,
          }; 
      })

    build.onLoad({ filter: /.*/}, async (args: any) => {
        const cacheResult = await fileCache.getItem<esbuild.OnLoadResult>(
            args.path
          );
          if (cacheResult) {
            return cacheResult;
          }
    });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        

        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        // ? This contents var will create a style tag and import/set all off the css inside of that style element and then append it in the (head of the html file)
        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            docuemnt.head.appendChild(style);
            `

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // * This onLoad step is used to actually load the file on the system. It will overried Esbuilds natural path of trying to load it into the users filesystem.
        console.log("onLoad", args);

        const { data, request } = await axios.get(args.path);
  

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,    
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
