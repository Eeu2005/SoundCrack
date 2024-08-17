import o from "./color-thief.mjs";
let colorthief = new o();

let btn = document.querySelector("button");
const rgbToHex = ( r, g, b ) => '#' + [ r, g, b ].map( x =>
{
  const hex = x.toString( 16 );
  return hex.length === 1 ? '0' + hex : hex;
} ).join( '' );
let regex = /(.jpeg)|(.png)|(.jpg)/gi;
let inputsFiles = document.querySelectorAll("input[type='file']");
let album = document.createElement("div");
let form = document.querySelector("form");
album.classList.add("album");
let linkImage = "";
let imgAlbum = document.querySelector("#capaAlbum");
let nome = document.querySelector("#nomeAlbum");
let artista = document.querySelector("#artistas");
let preco = document.querySelector("#preco");
let img = document.createElement("img");
let corDoAlbum = document.querySelector("#corDoAlbum");
form.addEventListener("input", (e) => {
  if(e.target.type =="color") {
    return "nao vai"

  }
  if (form.checkValidity()) {
    btn.disabled = true;
    let file = new FileReader();
    file.onload = () => {
      linkImage = file.result;
      img.src = linkImage;
      album.appendChild(img);
    };
    file.readAsDataURL(imgAlbum.files[0]);
    album.innerHTML =`
            <h1>${nome.value}</h1 >
            <h2>Artista: ${artista.value}</h2>
            <p >Preço:R$${preco.value},00</p>
    document.querySelector("main").appendChild(album);
     `
    img.addEventListener("load", () => {
      let cor = colorthief.getColor(img, 5426);
      album.setAttribute(
        "style",
        `--corAlbum:rgb(${cor[0]},${cor[1]},${cor[2]})`
      );
      corDoAlbum.value = rgbToHex(cor[0],cor[1],cor[2])
      corDoAlbum.labels[0].classList.remove("invisivel");
      corDoAlbum.addEventListener("input", (e) =>
        album.setAttribute("style", `--corAlbum:${e.target.value}`)
      );
      if (window.innerWidth <= 750) {
        window.scrollTo({ top: 500, behavior: "smooth" });
      }
    });
  }
  btn.disabled = false;
});
btn.addEventListener("click", (e) => {
  e.preventDefault();
  if (btn.form.checkValidity()) {
    alert("Enviado para a analise");
    btn.form.submit();
  } else {
    alert("Campos faltando");
    btn.form.reportValidity();
  }
});
for (const input of inputsFiles)
  input.addEventListener("change", () => {
    {
      if (regex.test(input.value)) {
        btn.disabled = false;
      } else {
        btn.disabled = true;
        input.labels[1].innerText =
          "Os arquivos precisam estar em png,jpeg ou jpeg";
      }
    }
  });