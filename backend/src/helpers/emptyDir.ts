import fs from "fs/promises"
import { join } from "path";
export async function emptyDir(dir:string,save?:string):Promise<[null, true] | [unknown, null]>{
try {
    const list = await fs.readdir(dir)
    for (const file of list) {
      if(file === save){
        continue
      }
      await fs.rm(join(dir , file));
    }
   return [null,true]
} catch (error) {
   return [error, null];
}
}