import {defineConfig} from "vite"
import {} from "fs"
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  appType:"mpa",
  build:{
    rollupOptions:{
    input:{
      main:resolve(__dirname,"pages/index.html")
    }
  }
}
})