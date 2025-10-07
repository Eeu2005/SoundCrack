const env = import.meta.env;
import z from "zod"

const schema = z.object({
  VITE_BASE_URL: z.string().url().default(location.href),
});
export const Consts= schema.parse(env)
