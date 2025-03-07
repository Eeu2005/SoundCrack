import { readFileSync } from "fs";
import { parseEnv } from "util";
const a = parseEnv(readFileSync(".env").toString())
import { z } from "zod";

 export const env = z
   .object({
     CONN_STR: z.string(),
     PORT: z.coerce.number(),
     producao: z.coerce.boolean(),
     SALT:z.coerce.number()
   })
   .parse(a);


