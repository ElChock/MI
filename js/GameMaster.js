/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    var jugador;
    var enemigo=[20];
    var deltaTime = 0;
    var lastUpdateTime = 0;
    var renderColision=0;
    var timeShot=0;
$(document).ready(function () {
    GLM.initialize($('#webgl-canvas')[0]);
    GLM.getInstance().createProgram(ShaderManager.getBasicColorShader());
    GLM.getInstance().clear();
    jugador= Jugador.Create();
    enemigo[0]= Jugador.Create();
    enemigo[1]= Jugador.Create();
    enemigo[0].Move(25,1,-50);
    enemigo[1].Move(-25,10,-50);
    //key();
    tick();
});

function tick(time) {
    // Delta Time
    time *= .001;
     deltaTime = time - lastUpdateTime;
    if(isNaN(timeShot))
    {
    timeShot=0;
     timeShot += deltaTime ;
    }
    else
    {
        timeShot += deltaTime ;
    }
    lastUpdateTime = time;
    GLM.getInstance().clear();
    jugador.Draw();
    enemigo[0].Draw();
    enemigo[1].Draw();
    for (var i = 0; i < jugador.proyectil.length ; i++) {
        if(jugador.proyectil[i].position[2]<-50)
        {
            jugador.proyectil.splice(i,1);
        }
        else
        {
            jugador.proyectil[i].Move();
            //jugador.proyectil[i].Draw();
            jugador.proyectil[i].colision.Draw();
        }
    }
    key();
    requestAnimFrame(tick);
}

function key()
{
    $("#texto").keydown(function(event){
        
    $("#texto").val("");
    if(String.fromCharCode(event.which)==="A")
    {
        jugador.Move(-0.001,0,0);
    }
    if(String.fromCharCode(event.which)==="D")
    {
        jugador.Move(0.001,0,0);
    }
    if(String.fromCharCode(event.which)==="W")
    {
        jugador.Move(0,0.001,0);
    }
    if(String.fromCharCode(event.which)==="S")
    {
        jugador.Move(0,-0.001,0);
    }
    if(event.which===32)
    {
        if(timeShot>.5)
        {
            jugador.Disparar();
            timeShot=0;
        }
        
    }
    }); 
}



