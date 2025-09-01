import { randomUUID } from "crypto";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import path from "path";
const pathImgs = path.join(import.meta.dirname, "..", "public");
export async function downloadImage(url: string) {
  if (!existsSync(pathImgs))
    mkdirSync(pathImgs);
  const data = await fetch(url);
  const buffer = Buffer.from(await data.arrayBuffer());
  const Stream = createWriteStream(
    `${pathImgs}/${randomUUID()}.png`
  );
  Stream.write(buffer);
  if (typeof Stream.path !== "string")
    throw new Error("Não Esta vindo o caminho string");
  return Stream.path.replace(`${pathImgs}/`,"/public/");
}
