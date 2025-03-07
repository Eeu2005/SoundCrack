export function mountDatalist(list:{nome:string,_id:string}[],target:HTMLInputElement,id="defaut"){
  const datalist = document.createElement("datalist")
  datalist.id =id
  for (const data of list) {
    const opt = document.createElement("option")
    opt.value =data.nome
    opt.id = data._id
    datalist.appendChild(opt)
  }
  target.append(datalist)
  target.setAttribute("list",id)
}