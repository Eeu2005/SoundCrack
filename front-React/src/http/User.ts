import { Consts } from "@/env.ts";
import type { User } from "@/types.js";
import {
  type AnyUseBaseQueryOptions,
  type AnyUseMutationOptions,
  type UseBaseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface LoginArgs {
  email: string;
  senha: string;
}

export async function login({ email, senha }: LoginArgs) {
  const res = await fetch(`${Consts.VITE_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
    credentials: "include",
  });
  if (!res.ok) {
    toast.error("Email ou senha inválidos");
    throw new Error("Login falhou");
  }
  const data = res.text();
  return data;
}


interface RegisterArgs {
  nome: string;
  email: string;
  senha: string;
}

export async function register(args: RegisterArgs): Promise<string> {
  const res = await fetch(`${Consts.VITE_BASE_URL}/cadastro`, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if(!res.ok){
    const err = await res.json()
    toast.error(err.message)
    throw new Error(err)
  }
  const data = await res.text();

  return data;
}

async function getUser() {
  const res = await fetch(`${Consts.VITE_BASE_URL}/login`, {
    credentials: "include",
  });
  if(!res.ok){
    if(res.status >=400){
      throw new Error( await res.text())
    }else{
      throw new Error("Erro interno")
    }
  }
  const data = (await res.json()) as User;
  return data;
}
export const OptsGetUser:UseBaseQueryOptions<User>  = {
  queryKey: ["user"],
    retry:false,
retryOnMount:false,
  queryFn: getUser,
};
async function deslogar() {
  const res = await fetch(`${Consts.VITE_BASE_URL}/logout`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.text();
  return data;
}
export const OptsDeslogar: AnyUseMutationOptions = {
  mutationKey: ["user", "Deslogar"],

  mutationFn: deslogar,
  onSuccess(data, variables, context) {
    console.log(context);
  },
};
