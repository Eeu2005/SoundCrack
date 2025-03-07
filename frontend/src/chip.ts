export function chip(text:string,target:HTMLElement,id:string){
  const chip =document.createElement("span")
    const input = document.createElement("input")
  chip.classList.add("chip")
  chip.id = "q" + id;
  input.type="checkbox"
  input.value =id
  input.name="artistas"
  input.checked= true
  chip.textContent =text
  chip.appendChild(input)
  chip.onclick = function(){
    chip.remove()
  }
  target.appendChild(chip)
}