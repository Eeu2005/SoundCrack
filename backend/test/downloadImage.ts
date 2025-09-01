import { randomUUID } from "crypto"
import { createWriteStream, existsSync, mkdirSync } from "fs"
let conter =0
export  async function downloadImage (url:string){
  if (!existsSync(`${import.meta.dirname}/imgs`)) mkdirSync(`${import.meta.dirname}/imgs`);
    const data = await fetch(url);
  const buffer =  Buffer.from(await data.arrayBuffer())
const Stream  = createWriteStream(`${import.meta.dirname}/imgs/${randomUUID()}.png`)
  Stream.write(buffer);
  if (typeof Stream.path !== "string")
    throw new Error("Não Esta vindo o caminho string");
  return Stream.path;
}
