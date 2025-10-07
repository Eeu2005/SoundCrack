import { Consts } from "@/env.ts"

interface args {} 

 export async function getGeneros({}:args){
  const res = await fetch(`${Consts.VITE_BASE_URL}/generos`)
  if(!res.ok){
    throw new Error("Erro ao buscar generos")
  }
const data = await res.json()as string[]
return data
}
