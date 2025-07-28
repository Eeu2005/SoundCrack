import { modelUsers } from "../models/users.model.ts";
import {compareSync, hash} from "bcrypt"
import {env} from "../../env.ts"
import type { User } from "../types.js";
interface UserProps{
  nome:string,
  email:string,
  senha:string
}
export async function cadastroUsuario({email,senha,nome}:UserProps):Promise<User>{
    if(await modelUsers.exists({email:email})){
      throw new Error("Consta um usuario com esse email")
    }
    const senhaIncrimentada = await hash(senha,env.SALT)

    const user =new modelUsers({email,senha:senhaIncrimentada,nome}).save()
    return user
}
export async function loginUsuario(email:string,senha:string):Promise<User>{
  const user = await modelUsers.findOne({email:email})
    if(!user) throw new Error("Não existe usuario com esse email cadastrado")
    if (!compareSync(senha,user.senha)) throw new Error("Senha incorreta");
  return user
}

