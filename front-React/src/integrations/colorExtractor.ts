import { Consts } from "@/const.ts";
import { extractColorsFromSrc } from "extract-colors";
export   async function colorExtract(capa:string){
  const e = await extractColorsFromSrc(Consts.BASE_URL+capa, {
    pixels:80000,
    distance:0.0,
    hueDistance:0.55,
    saturationDistance:0.65,
    lightnessDistance:0.85,
    colorValidator(red, green, blue) {
      if ((red >= 255 && green >= 255 && blue >= 255) ||
        (red >= 10 && green >= 10 && blue >= 10)) {
        return true;
      } else {
        return false;
      }
    },
  });

 let {hex} = e[0]
console.log("%c asffas",`background-color:${hex}`)
 return hex;
}
