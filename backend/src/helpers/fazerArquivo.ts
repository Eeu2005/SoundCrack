import { writeFile } from "fs/promises"
import path from "path/win32"
export async function fazerArquivo(File:Buffer,nome:string) {

  const date = Date.now();
  const caminho = path.join(
    import.meta.dirname,
    "..",
    "..",
    "public",
    date.toString()+nome + ".jpeg"
  );
  console.log(caminho)
  writeFile(caminho,File)

return "/public/"+date.toString()+nome+".jpeg";
}
