
> Abra esta pagina en [https://ART2BIT.github.io/jovibit/](https://ART2BIT.github.io/jovibit/)

# Art2Bit - JoviBit

## Bloques

## Sonarbit

### ``Distancia Ultrasónica``

```blocks
let distancia = JoviBit.sonarbit_distancia(Unitat_Distancia.Unitat_Distancia._mm, Pin.P0)
basic.pause(100)
basic.showNumber(distancia)
```

Este bloque devuelve la distancia que hay entre la microbit y el objeto que tiene delante.

## ``Motor``

### ``motor``

```blocks
JoviBit.turnOn(Pin.P0)
JoviBit.turnOff(Pin.P0)

```

Estos bloques manda un pulso al pin por lo que activa o desactiva el motor.

## ``Servo``

### ``moverServo``

```blocks
for (let index = 0; index < 8; index++) {
        JoviBit.moverServo(Pin.P0, 125)
        basic.pause(200)
    }
```

El bloque ``moverServo`` tiene un rango de 0 a 180 grados, se debe pensar más en velocidad que no en posición. 
El punto medio es 90, aquí el servo no se moverá, si se pone a 100 se moverá en sentido horario lento, si se pone 180 irá en el mismo sentido pero a máxima velocidad, 
si se pone a 0 irá a máxima velocidad en sentido antihorario.


### ```pararServo``

```blocks
JoviBit.pararServo(Pin.P0)
```

detiene el servo(le pasa por parametro 90 grados).

## ``NeoPixel``

Para poder iniciar NeoPixel y dar color al led de la placa de extensión debemos declarar la variable ``miLed = JoviBit.create(NeoPixelMode.RGB, Pin.P16)``.
Cada vez que se modifique el color o la intensidad, se debe llamar bloque ``show``

### ``Inicializar NeoPixel``
```blocks
input.onButtonPressed(Button.A, function () {
    miLed.showRainbow()
    miLed.show()
    basic.pause(2000)
    miLed.clear()
    miLed.show()
})
miLed = JoviBit.create(NeoPixelMode.RGB, Pin.P16)
})
```
En este ejemplo utilizamos declaramos la variable en el bloque al iniciar, es importante recalcar que donde debe apuntar la variable es el PIN "Led", al darle al botón 'A' de la microbit procedemos a enseñar los colores del arcoiris.
Para que nos muestres los colores en el Led debemos introducir el bloque ``show`` justo después. después apagamos el led con el bloque ``clear()`` o apaga.



## Usar como extensión

Este repositorio puede ser añadido como una **extensión** en MakeCode.

* abra [https://makecode.microbit.org/](https://makecode.microbit.org/)
* haga clic en **New Project**
* haga clic en **Extensiones** en el menú del engranaje
* buscar **https://github.com/ART2BIT/jovibit** e importar

## Edita este proyecto ![Insignia de estado de compilación](https://github.com/ART2BIT/jovibit/workflows/MakeCode/badge.svg)

Para editar este repositorio en MakeCode.

* abra [https://makecode.microbit.org/](https://makecode.microbit.org/)
* haga clic en **Import** luego haga clic en **Import URL**
* pegue **https://github.com/ART2BIT/jovibit** y haga clic en importar

#### Metadatos (utilizados para búsqueda, renderizado)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
