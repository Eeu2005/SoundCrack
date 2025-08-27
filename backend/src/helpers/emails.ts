import nodemailer from "nodemailer"
import type {SendMailOptions} from "nodemailer"
import { env } from "../../env.js"
import type { Album, User } from "../types.js";
const tranponder = env.EM_TESTE
  ? nodemailer.createTransport({
      host: env.MAILHOST,
      port: 2525,
      auth: {
        user: env.MAILUSER,
        pass: env.MAILKEY,
      },
    })
  : {
      sendMail:async ({to,subject,text,html}:SendMailOptions):Promise<void> =>console.log(`
        Simulando o envio de email para ${to} sobre ${subject}
        ${html??text}
        `),
      verify:():Promise<true> => Promise.resolve(true)
    };
tranponder.verify()
export async function EmailOla(user:User) {
  tranponder
    .sendMail({
      from: "<noreply.soundcrack@mail.com>",
      to: user.email,
      subject: "Ola de SoundCrack",
      text: `Bem vindo Ao Sound Crack ,<b>${user.nome}</b>
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
      html: `Obrigado por Compartilhar o disco <b>${album.nome}</b>
      aguarde o processo de aceitação do  <b>${album.nome}</b
      `,
    })
    .catch((e) => {
      console.log("erro ao Enviar o email");
      console.error(e);
    });
}
export async function emailStatusAlbum(album:Album,user:User) {
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
