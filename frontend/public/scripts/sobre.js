
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