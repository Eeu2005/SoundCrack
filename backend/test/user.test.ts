import {t} from 'tap'
process.env.EM_TESTE="true"
import app from '../app.js'
import { modelUsers } from '../src/models/users.model.js'
import mongoose from 'mongoose';
import { env } from '../env.js';
const DEFAULT_USER = { email: "user1@email.com", senha: "123456", nome: "user" };
let cookie: { name: string
  value:string
  }
  let conn = await mongoose.connect(env.CONN_STR,{dbName:"soundcrack_db_test_artista"})
t.before(async ()=>{
  await modelUsers.deleteMany()
})

 t.test("o Cadastro deverá falhar",async()=>{
  const res = await app.inject({
    method:"post",
    path:"/cadastro",
    body:{email:"user@email.com",senha:"123"}
  })
  t.equal(res.statusCode,400,"Codigo deve ser 400")
  t.equal(
    res.json().message,
  `body/nome Required, body/senha A senha deve conter pelo menos 5 caracteres`
  );
  t.end()
})

t.test("o login devera falhar", async()=>{
  const res = await app.inject({
    method: "post",
    path: "/login",
    body: DEFAULT_USER,
  });
   t.equal(res.statusCode, 400, "Codigo deve ser 400");
   t.equal(res.statusMessage.toUpperCase(), "BAD REQUEST");
   
   t.end();
})

t.test("Deverá cadastrar", async () => {
  const res = await app.inject({
    method: "post",
    path: "/cadastro",
    body: DEFAULT_USER,
  });
  t.equal(res.statusCode, 201, "Codigo deve ser 201");
  t.equal(res.body, "usuario criado");
  t.end();
});
t.test("Deverá logar",async()=>{
  const res = await app.inject({
    method:"post",
    path:"/login",
    body:DEFAULT_USER,
  })
  t.equal(res.statusCode,201)
  t.equal(res.body,"Logado")
  cookie = res.cookies[0];
 
  t.end()
})
t.test("Falhar em caso não logado", async () => {
  const res = await app.inject({
    method: "get",
    path: "/login",
  });
  t.equal(res.statusCode, 401);
  t.equal(res.body, "não logado");
});

t.test("Checar se esta se mantendo o logado", async () => {
  const{name,value}= cookie
  const res = await app.inject({
    method: "get",
    path: "/login",
    cookies:{[name]:value}
  });
  t.equal(res.statusCode, 200);
  t.matchOnlyStrict(res.json(),{
    id:String,
    tipo:"padrao",
    nome:String,
  email:String,
  })
});
t.teardown(()=>{
  modelUsers.deleteMany()
  app.betterClose(conn)
})