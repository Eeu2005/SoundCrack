export async function mountSelect(data:string[],target:HTMLSelectElement) {
  for (const item of data) {
    const option = document.createElement("option")
    option.value = item
    option.textContent = item
    target.options.add(option)
  }

  
}