import { z } from "zod";
 export const env = z
   .object({
     CONN_STR: z.string(),
     PORT: z.coerce.number(),
     producao: z.coerce.boolean(),
     SALT: z.coerce.number(),
     MAILUSER: z.string(),
     MAILKEY:z.string(),
     MAILHOST:z.string(),
     EM_TESTE:z.coerce.boolean()
   })
   .parse(process.env);


