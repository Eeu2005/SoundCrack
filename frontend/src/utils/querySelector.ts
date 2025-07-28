export function  querySelector<T  extends HTMLElement >(html:string):T{
  const tmp=  document.querySelector<T>(html)
  if(!tmp){
    throw new Error("Elemento não encontrado");
  }

  return tmp
}