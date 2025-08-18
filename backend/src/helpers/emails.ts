import nodemailer from "nodemailer"
import { env } from "../../env.js"
import type { Album, User } from "../types.js";
const tranponder = nodemailer.createTransport({
  host:env.MAILHOST,
  port:2525,
  auth:{
    user:env.MAILUSER,
    pass:env.MAILKEY
  }
})
tranponder.verify()
export async function EmailOla(user:User) {
  tranponder
    .sendMail({
      from: "<noreply.soundcrack@mail.com>",
      to: user.email,
      subject: "Ola de SoundCrack",
      text: `Bem vindo Ao Sound Crack ,${user.nome} 
      O lugar onde Aquele disco que estava buscando esta aqui!`,
    })
    .catch((e) => {
      console.log("erro ao Enviar o email");
      console.error(e);
    });
}
export async function EmailNovoAlbum(album:Album,user: User) {
  tranponder
    .sendMail({
      from: "<noreply.soundcrack@mail.com>",
      to: user.email,
      subject: "Confirmação da publicação do album",
      html: `Obrigado por Compartilhar o disco ${album.nome} 
      aguarde o processo de aceitação do ${album.nome} 
      `,
    })
    .catch((e) => {
      console.log("erro ao Enviar o email");
      console.error(e);
    });
}
export async function StatusAlbum(album:Album,user:User) {
  tranponder
    .sendMail({
      from: "<noreply.soundcrack@mail.com>",
      to: user.email,
      subject: "Status de "+album.nome,
      html: `O Album ${album.nome} está ${album.aprovado?"Aprovado Parabéns":"Reprovado"} 
      `,
    })
    .catch((e) => {
      console.log("erro ao Enviar o email");
      console.error(e);
    });
}
