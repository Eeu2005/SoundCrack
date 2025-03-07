import { writeFileSync } from "fs"
import path from "path/win32"
export function fazerArquivo(File:Buffer,nome:string) {
  const date = Date.now();
  const caminho = path.join(
    import.meta.dirname,
    "..",
    "..",
    "public",
    date.toString()+nome + ".jpeg"
  );
  writeFileSync(caminho,File)

return "/public/"+date.toString()+nome+".jpeg";
}
