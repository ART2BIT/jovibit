
> Abra esta pagina en [https://ART2BIT.github.io/jovibit/](https://ART2BIT.github.io/jovibit/)

# Art2Bit - JoviBit

## Blocks

## Sonar:bit

### ``Ultrasonic Distance``

```blocks
let distance = JoviBit.sonarbit_distance(Unit_Distance.Unit_Distance._mm, Pin.P0)
basic.pause(100)
basic.showNumber(distance)
```

This block returns the distance between the micro:bit and the object in front of it. 

## ``Motor``

### ``motor``

```blocks
JoviBit.turnOn(Pin.P0)
JoviBit.turnOff(Pin.P0)

```

These blocks send a pulse to the pin so that it activates or deactivates the motor.

## ``Servo``

### ``Servo initialisation``

```blocks
let servo: JoviBit.PinServo = JoviBit.createServo(Pin.P0)
```

To control Servo we have to declare a variable, this way we will instantiate the PinServo class highlighting the pin we want to connect the cable to. Once this is done we can manipulate the servo variables. 


### ```setAngle``

```blocks
let servo: JoviBit.PinServo = JoviBit.createServo(Pin.P0)
for (let index = 0; index < 8; index++) {
        servo.setAngle(125)
        basic.pause(200)
    }
```

Servo 360°. The setAngle block has a range of 0 to 180 degrees, you should think more about speed than position. The midpoint is 90, at this point the servo will not move, if it is set to 100, it will move slowly in a clockwise direction, it set at move in the same direction but at maximum speed, if it is set to 0 it will move counter clockwise at maximum speed. 
Servo 180°. If we have a standard servo, the parameters we use is the position we want to reach. So using the example about the servo axis will move to that position.  


### ```stop``

```blocks
servo.stop()
```

Stop the servo.



## ``NeoPixel``

In order to start NeoPixel and add colour to the LED on the extension board we must declare a variable. Every time the colour or intensity is changed you need to call the ``show`` block.

### ``Initialise NeoPixel``
```blocks
input.onButtonPressed(Button.A, function () {
    miLed.showRainbow()
    miLed.show()
    basic.pause(2000)
    miLed.clear()
    miLed.show()
})
let miLed: JoviBit.Led = JoviBit.create(NeoPixelMode.RGB, Pin.P16)

})
```
With this example, by pressing the ‘A’ button on the micro:bit we can show the colours of the rainbow. We start by declaring the variable in the “on start” block, there is a function on NeoPixel with the correct parameters, but we can create one ourselves. It is very important that we use the LED pin as a parameter for the variable, otherwise it will not work.  To show the LED colours we must introduce the ``show()`` block straight after the “on start” block, turn off the LED with the ``clear()`` block or off.


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

