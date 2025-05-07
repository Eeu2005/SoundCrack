import { querySelector } from "./utils/querySelector.ts"
 function mudarContexto(contexto: "login" | "cadastro") {
  const outroContexto = contexto == "login" ? "cadastro" : "login";
  querySelector<HTMLHeadingElement>("." + contexto).classList.remove(
    "escondido"
  );
  querySelector<HTMLHeadingElement>("." + outroContexto).classList.add(
    "escondido"
  );
}
querySelector(".login>h3").onclick= ()=> mudarContexto("cadastro")
querySelector(".cadastro>h3").onclick= ()=> mudarContexto("login")