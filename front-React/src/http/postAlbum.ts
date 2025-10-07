import { Consts } from "@/env.ts";
import { toast } from "sonner";
import {mutationOptions} from "@tanstack/react-query"
import type { AlbumRes } from "@/types.js";

  async function postAlbum(form:FormData){
const response = await fetch(`${Consts.VITE_BASE_URL}/albuns`,{
  method:"POST",
  body:form,
  credentials:"include"
})
if(!response.ok){
  if(response.status<=500){
    const data= await response.json()
    toast.error(data.message)
    throw new Error(data.message)
  }else{
    toast.error("Erro no servidor, tente novamente mais tarde")
    throw new Error("Erro no servidor, tente novamente mais tarde")
  }
}
const data =await response.json() as AlbumRes
return data
}
export const optsPostAlbum= mutationOptions({
  mutationKey: ['postAlbum'],
  mutationFn: postAlbum,
})
