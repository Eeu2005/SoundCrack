export function  querySelector<T  extends HTMLElement >(html:string):T{
  const tmp=  document.querySelector<T>(html)
  
  console.log(tmp)

  return tmp!
}