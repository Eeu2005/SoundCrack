import {t} from 'tap'
import app from '../app.js'
import { modelUsers } from '../src/models/users.model.js'
const DEFAULT_USER = { email: "user@email.com", senha: "123456", nome: "user" };
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
  t.equal(res.statusMessage.toUpperCase(),"BAD REQUEST")
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

t.test("Devera cadastrar", async () => {
  const res = await app.inject({
    method: "post",
    path: "/cadastro",
    body: DEFAULT_USER,
  });
  t.equal(res.statusCode, 201, "Codigo deve ser 201");
  t.equal(res.body, "usuario criado");

  t.end();
});

t.teardown(app.betterClose)