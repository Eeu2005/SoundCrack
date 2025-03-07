import colorthief  from "colorthief" 
const o  = new colorthief()
export  function pegarCor(img:HTMLImageElement|null,div:HTMLElement){
  console.log(img?.complete)
  if(!img){
    return null
  }
  img.crossOrigin="anonymous"
  let res:number[] =[]
    img.addEventListener("load", ()=>{
      res = o.getPalette(img, 4, 10058)[0];
      const [r,g,b] =res
        console.log(res);
      div.setAttribute("style", `--corAlbum:rgb(${r},${g},${b})`);  
    })
  



}