import o from "./color-thief.mjs"
let capa = document.querySelector("#capa") 
let colorThief = new o()
if(capa.complete){
let cor = colorThief.getColor(capa, 5426)
    document.body.setAttribute( "style", `--CorAlbum:rgb(${cor[ 0 ]},${cor[ 1 ]},${cor[ 2 ]})` );
}else{
    capa.addEventListener("load", ()=>{
        let cor  =colorThief.getColor(capa, 5426)
        document.body.setAttribute("style",`--CorAlbum:rgb(${cor[0]},${cor[1]},${cor[2]})`)
    })
}
