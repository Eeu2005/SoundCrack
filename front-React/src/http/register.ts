import { Consts } from "@/env";
import type { User } from "@/types.js";

interface args {
  nome: string;
  email: string;
  senha: string;
}

export async function register(args: args): Promise<string> {
  const res = await fetch(`${Consts.BASE_URL}/cadastro`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(args),
  });
  const data = await res.text();
  return data;
}
