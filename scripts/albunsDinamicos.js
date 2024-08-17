
import o from "./color-thief.mjs" 
let colorthief = new o()
let albuns = document.querySelectorAll(".album")
for(let album of albuns){
    let img = album.querySelector("img")
        if (img.complete){
        let cor  = colorthief.getColor(img,5426)
        album.setAttribute("style",`--corAlbum:rgb(${cor[0]},${cor[1]},${cor[2]})`)
    }else{
        img.addEventListener("load",()=>{
            console.log("nao primeira")
            let cor  = colorthief.getColor(img,5426)
        album.setAttribute("style",`--corAlbum:rgb(${cor[0]},${cor[1]},${cor[2]})`)
        })
    }
}