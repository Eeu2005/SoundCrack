let burguer = document.querySelector(".burguer")
let nav = document.querySelector(".nav") 
burguer.addEventListener("click", ()=>{
nav.classList.toggle("active")
burguer.classList.toggle("active")
})
let titulo = document.querySelector( ".titulo" );
titulo.style.cursor = "pointer";
titulo.addEventListener("click", ()=>{
    location.href="../pages/loja.html"
   
})