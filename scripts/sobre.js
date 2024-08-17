import o from "./color-thief.mjs"
const colorThief = new  o()

const albuns= [
    {
        musica:"Miucha & Tom Jobim Vol. 1",
        artista:["Tom Jobin","Miucha"],
        capa:"../imgs/albuns/Miucha & Tom Jobim Vol. 1.jpeg"
    },
    {
        musica: "Clube da Esquina",
        artista: [ "Milton Nascimento", "Jô borges" ],
        capa: "../imgs/albuns/Clube da esquina.jpeg"
    }, {
        musica: "A Night At The Opera",
        artista: [ "Queen" ],
        capa: "../imgs/albuns/A Night At The Opera.jpeg"
    }, {
        musica: "Are You Experienced",
        artista: [ "Jimi Hendrix" ],
        capa: "../imgs/albuns/Are you Experienced.jpeg"
    }, {
        musica: "Construção",
        artista: [ "Chico Buarque" ],
        capa: "../imgs/albuns/Construção.jpeg"
    }, {
        musica: "Thriller",
        artista: [ "Michael jackson" ],
        capa: "../imgs/albuns/thriller.jpeg"
    }, {
        musica: "Tim Maia",
        artista: [ "Tim Maia" ],
        capa: "../imgs/albuns/TimMaia1973.jpeg"
    },
]

let albumSortido
let x
do{
     x = Math.random() * 10;
}while((x >albuns.length-1))
albumSortido = albuns[ x.toFixed( 0 ) ];
let artista = document.querySelector("#artistas")
let album = document.querySelector("#album")
let capaAlbum = document.querySelector("#capaAlbum")
let capaDistorcida = document.querySelector("#capaDistorcida")

if(albumSortido){
    artista.innerText = `De: ${[...albumSortido.artista]}`
    album.innerText = `${albumSortido.musica}`
    capaAlbum.src = `${albumSortido.capa}`
    capaAlbum.alt = `capa album ${albumSortido.musica}`
    capaDistorcida.src =albumSortido.capa
    if(capaAlbum.complete){
      let cor =  colorThief.getColor( capaAlbum, 5426 )
        document.body.setAttribute("style", `--corAlbum:rgb(${cor[0]},${cor[1]},${cor[2]})`)
    }else{
        capaAlbum.addEventListener("load", ()=>{
            let cor = colorThief.getColor( capaAlbum, 526 );
            document.body.setAttribute( "style", `--corAlbum:rgb(${cor[ 0 ]},${cor[ 1 ]},${cor[ 2 ]})` )
        })
    }
}
// /*
//   Author : Sebastien Koss
//   Copyright © 2017 All rights reserved. 
// */

 let  wrapperMatrix = $( ".wrapper" ), matrix3D = $( ".caixa3d" );

// // set some css
TweenLite.set( wrapperMatrix, { perspective: 500 } );
TweenLite.set( matrix3D, { perspective: 500, transformStyle: "preserve-3d" } );

// // function to run matrix3D effect on block
var matrix3dWrapper = function ( positionX, positionY )
{
    var screenWidth = window.screen.availWidth, screenHeight = window.screen.availHeight;
    TweenLite.to( matrix3D, 2, {
        rotationY: mousePosition( positionX, screenWidth ),
        rotationX: ( mousePosition( positionY, screenHeight ) + 10 ),
        backgroundPosition: ( mousePosition( positionX, screenWidth ) + 120 ) + "% 50%"
    } );
};

// // mouse move on block
$( matrix3D ).on( "mousemove", function ( event )
{
    // run matrix3D effect
    matrix3dWrapper( event.clientX, event.clientY );
} );

// // reset block on mouse leave
$( matrix3D ).on( "mouseleave", function ()
{
    var reset = TweenLite.to( matrix3D, 2, {
        backgroundPosition: "120% 50%",
        transform: "matrix3d(1, 0, 0, 1, 0, 0)"
    } );
} );

// // make some calculations for mouse position
function mousePosition ( mousePos, dimension )
{
    return ( Math.floor( mousePos / dimension * 40 ) - 20 );
}