import {defineConfig} from "vite"
import {} from "fs"
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const func = (file)=> resolve(__dirname,"pages",file+".html")
export default defineConfig({
  plugins: [],
  appType: "mpa",
  base:"/",
  build: {
    rollupOptions: {
      input: [
        func("loja"),
        func("sobre"),
        func("cadastroAlbum"),
        func("cadastroUsuario"),
        func("albuns/index")
      ],
    },
    outDir:resolve(__dirname,"..","backend","dist")
  },
});