const env = import.meta.env;
import z from "zod"

const schema = z.object({
  BASE_URL:z.string().url().default(location.origin)
})
export const Consts= schema.parse(env)
