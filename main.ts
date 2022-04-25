/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

enum Unitat_Distancia {
  //% block="mm" enumval=0
  Unitat_Distancia_mm,

  //% block="cm" enumval=1
  Unitat_Distancia_cm,

  //% block="pulgadas" enumval=2
  Unitat_Distancia_inch,
}
enum Pin {
  //% block="A"
  P0 = 0,

  //% block="B"
  P1 = 1,

  //% block="C"
  P2 = 2,

  //% block="D"
  P8 = 8,

  //% block="E"
  P13 = 13,

  //% block="F"
  P14 = 14,

  //% block="G"
  P15 = 15,
}

enum NeoPixelColors {
  //% block=rojo
  Red = 0xff0000,
  //% block=naranja
  Orange = 0xffa500,
  //% block=amarillo
  Yellow = 0xffff00,
  //% block=verde
  Green = 0x00ff00,
  //% block=azul
  Blue = 0x0000ff,
  //% block=indigo
  Indigo = 0x4b0082,
  //% block=violeta
  Violet = 0x8a2be2,
  //% block=purpura
  Purple = 0xff00ff,
  //% block=blanco
  White = 0xffffff,
  //% block=negre
  Black = 0x000000,
}

enum NeoPixelMode {
  //% block="RGB (GRB format)"
  RGB = 1,
  //% block="RGB+W"
  RGBW = 2,
  //% block="RGB (RGB format)"
  RGB_RGB = 3,
}

/**
 * Custom blocks
 */
//% color=#e89606 icon="\uf0e7"
namespace JoviBit {
  /**
   * obtiene la la distancia ultrasónica.
   */
  //% blockId=sonarbit
  //% block="Distancia ultrasónica en %Unitat_distancia |al|pin %Pin"
  //% weight=10
  //% subcategory=SonarBit
  export function sonarbit_distancia(
    unitat_distancia: Unitat_Distancia,
    pin: Pin
  ): number {
    // send pulse
    let truePin: DigitalPin = pinsHelper.pinToDigitalPin(pin);
    pins.setPull(truePin, PinPullMode.PullNone);
    pins.digitalWritePin(truePin, 0);
    control.waitMicros(2);
    pins.digitalWritePin(truePin, 0);
    control.waitMicros(10);
    pins.digitalWritePin(truePin, 0);

    // read pulse
    let d = pins.pulseIn(truePin, PulseValue.High, 25000);
    let distancia = d / 29 / 2;

    if (distancia > 400) {
      distancia = 401;
    }

    switch (unitat_distancia) {
      case 0:
        return Math.floor(distancia * 10); //mm
        break;
      case 1:
        return Math.floor(distancia); //cm
        break;
      case 2:
        return Math.floor(distancia / 254); //inch
        break;
      default:
        return Math.floor(distancia);
    }
  }

  //MOTOR

  /**
   * Activa o desactiva el motor
   */
  //% blockId=Motor_Brick block="Activa o desactiva el motor en el pin %Pin"
  //% weight=10
  //% subcategory=Motor
  export function motor(pin: Pin): void {
    let truePin: DigitalPin = pinsHelper.pinToDigitalPin(pin);
    if (pins.digitalReadPin(truePin) === 0) {
      pins.digitalWritePin(truePin, 1);
    } else {
      pins.digitalWritePin(truePin, 0);
    }
  }

  // Servo//

  //Funciones helper
  function initPCA(): void {}

  /**
   * Mueve el servo a la velocidad deseada
   * @param pin servo en el pin(A al G) eg:0
   * @param vel
   */
  //% blockId="MoverServo"
  //% block="Mueve el servo %pin| a la velocidad %vel"
  //% subcategory=Servo
  export function moverServo(pin: Pin, vel: number): void {
    pins.servoWritePin(pinsHelper.pinToAnalogPin(pin), vel);
  }
  /**
   * Detiene el servo
   * @param pin servo en el pin
   */
  //% blockId="PararServo"
  //% block="Para el servo %pin"
  //% subcategory=Servo
  export function pararServo(pin: Pin): void {
    pins.servoWritePin(pinsHelper.pinToAnalogPin(pin), 90);
  }

  //Neopixel//

  export class Led {
    buf: Buffer;
    pin: DigitalPin;

    brightness: number;
    start: number;
    _length: number;
    mode: NeoPixelMode;
    matrixWidth: number;

    /**
     * Enciende el LED con el color elegido
     */
    //% blockId="neopixel_set_led_color" block="%led|muestra el color %rgb=neopixel_colors"
    //% led.defl=led
    //% weight=85 blockGap=8
    //% subcategory=Neopixel
    showColor(rgb: NeoPixelColors) {
      rgb = rgb >> 0;
      this.setALLRGB(rgb);
      this.show();
    }

    /**
     * Muestra un arco iris
     * @param startHue
     * @param endHue
     */
    //% blockId="neopixel_set_led_rainbow" block="%led| muestra el arco iris"
    //% weight=85 blockGap=8
    //% subcategory=Neopixel
    showRainbow(startHue: number = 1, endHue: number = 360) {
      this.setPixelColor(0, NeoPixelColors.Violet);
      this.show();
      basic.pause(1000);
      this.setPixelColor(0, NeoPixelColors.Indigo);
      this.show();
      basic.pause(1000);
      this.setPixelColor(0, NeoPixelColors.Blue);
      this.show();
      basic.pause(1000);
      this.setPixelColor(0, NeoPixelColors.Green);
      this.show();
      basic.pause(1000);
      this.setPixelColor(0, NeoPixelColors.Yellow);
      this.show();
      basic.pause(1000);
      this.setPixelColor(0, NeoPixelColors.Orange);
      this.show();
      basic.pause(1000);
      this.setPixelColor(0, NeoPixelColors.Red);
      this.show();
      basic.pause(1000);
    }

    private showBarGraph(value: number, high: number): void {
      if (high < +0) {
        this.clear();
        this.setPixelColor(0, NeoPixelColors.Yellow);
        this.show();
        return;
      }

      value = Math.abs(value);
      const n = this._length;
      const n1 = n - 1;
      let v = Math.idiv(value * n, high);
      if (v == 0) {
        this.setPixelColor(0, 0x666600);
        for (let i = 1; i < n; ++i) this.setPixelColor(i, 0);
      } else {
        for (let i = 0; i < n; ++i) {
          if (i <= v) {
            const b = Math.idiv(i * 255, n1);
            this.setPixelColor(i, JoviBit.rgb(b, 0, 255 - b));
          } else this.setPixelColor(i, 0);
        }
      }
      this.show();
    }

    /**
     * Establece el led con un color a selección (range 0-255 for r, g, b).
     * Se necesita llamar al 'show' para hacer los cambios visibles
     * @param rgb RGB color del LED
     *
     */
    //% blockId="neopixel_set_pixel_color" block="%led|Establece en el pixel el color %rgb=neopixel_colors"
    //% led.defl=led
    //% blockGap=8
    //% weight=80
    //% subcategory=Neopixel
    setPixel(rgb: NeoPixelColors): void {
      this.setPixelColor(0, rgb);
    }

    private setPixelColor(pixeloffset: number, rgb: number): void {
      this.setPixelRGB(pixeloffset >> 0, rgb >> 0);
    }

    /**
     * Envía todos los cambios al led.
     */
    //% blockId="neopixel_show" block="%led|show" blockGap=8
    //% led.defl=led
    //% weight=79
    //% subcategory=Neopixel
    show() {
      ws2812b.sendBuffer(this.buf, this.pin);
    }

    /**
     * apaga los LEDs.
     * se tiene que llamar 'show' para hacer visible los cambios
     */
    //% blockId="neopixel_clear" block="%led| apaga" blockGap=8
    //% led.defl=led
    //% weight=78
    //% subcategory="Neopixel"
    clear() {
      const stride = this.mode === NeoPixelMode.RGBW ? 4 : 3;
      this.buf.fill(0, this.start * stride, this._length * stride);
    }

    /**
     * Establece el brillo del cinta.
     * @param brightness
     */
    //% blockId="neopixel_set_brightness" block="%led|Establece el brillo %brightness" blockGap=8
    //% led.defl=led
    //%weight=59
    //%subcategory=Neopixel
    setBrightness(brightness: number): void {
      this.brightness = brightness & 0xff;
    }

    /**
     * Establece la posición del led.
     */
    //% weight=10
    //% subcategory=Neopixel
    setPin(pin: DigitalPin = DigitalPin.P16): void {
      this.pin = pin;
      pins.digitalWritePin(this.pin, 0);
      // don't yield to avoid races on initialization
    }

    private setBufferRGB(
      offset: number,
      red: number,
      green: number,
      blue: number
    ): void {
      if (this.mode === NeoPixelMode.RGB_RGB) {
        this.buf[offset + 0] = red;
        this.buf[offset + 1] = green;
      } else {
        this.buf[offset + 0] = green;
        this.buf[offset + 1] = red;
      }
      this.buf[offset + 2] = blue;
    }

    private setALLRGB(rgb: number) {
      let red = unpackR(rgb);
      let green = unpackG(rgb);
      let blue = unpackB(rgb);

      const end = this.start + this._length;
      const stride = this.mode === NeoPixelMode.RGBW ? 4 : 3;
      for (let i = this.start; i < end; ++i) {
        this.setBufferRGB(i * stride, red, green, blue);
      }
    }
    private setAllW(white: number) {
      if (this.mode !== NeoPixelMode.RGBW) return;

      let br = this.brightness;
      if (br < 255) {
        white = (white * br) >> 8;
      }
      let buf = this.buf;
      let end = this.start + this._length;
      for (let i = this.start; i < end; ++i) {
        let ledoffset = i * 4;
        buf[ledoffset + 3] = white;
      }
    }

    private setPixelRGB(pixeloffset: number, rgb: number): void {
      if (pixeloffset < 0 || pixeloffset >= this._length) return;

      let stride = this.mode === NeoPixelMode.RGBW ? 4 : 3;
      pixeloffset = (pixeloffset + this.start) * stride;

      let red = unpackR(rgb);
      let green = unpackG(rgb);
      let blue = unpackB(rgb);

      let br = this.brightness;
      if (br < 255) {
        red = (red * br) >> 8;
        green = (green * br) >> 8;
        blue = (blue * br) >> 8;
      }
      this.setBufferRGB(pixeloffset, red, green, blue);
    }
    private setPixelW(pixeloffset: number, white: number): void {
      if (this.mode !== NeoPixelMode.RGBW) return;

      if (pixeloffset < 0 || pixeloffset >= this._length) return;

      pixeloffset = (pixeloffset + this.start) * 4;

      let br = this.brightness;
      if (br < 255) {
        white = (white * br) >> 8;
      }
      let buf = this.buf;
      buf[pixeloffset + 3] = white;
    }
  }
  /**
   * Crea un driver de NeoPixel para el LED
   */
  //% blockId="neopixel_create" block="NeoPixel en %mode"
  //% wight=90 blockGap=8
  //% trackArgs=0,2
  //% blockSetVariable=led
  //% subcategory=Neopixel
  export function create(mode: NeoPixelMode, pin : DigitalPin): Strip {
    let led = new Strip();
    let stride = mode === NeoPixelMode.RGBW ? 4 : 3;
    led.buf = pins.createBuffer(1 * stride);
    led.start = 0;
    led._length = 1;
    led.mode = mode || NeoPixelMode.RGB;
    led.matrixWidth = 0;
    led.setBrightness(128);
    led.setPin(pin);
    return led;
  }

  /**
   * Convierte los canales red, green, blue en color RGB
   * @param red
   * @param green
   * @param blue
   */
  //% weight=1
  //% blockId="neopixel_colors" block="rojo %red| verde %green |azul %blue"
  //% subcategory=Neopixel
  export function rgb(red: number, green: number, blue: number): number {
    return packRGB(red, green, blue);
  }

  /**
   * devuelve el valor RGB de un color conocido.
   * @param color
   *
   */
  //% blockId="neopixel_colors" block="devuelve el valor del color %color"
  //% weight=2 blockGap=8
  //% subcategory=Neopixel
  export function colors(color: NeoPixelColors): number {
    return color;
  }

  function packRGB(a: number, b: number, c: number): number {
    return ((a & 0xff) << 16) | ((b & 0xff) << 8) | (c & 0xff);
  }
  function unpackR(rgb: number): number {
    let r = (rgb >> 16) & 0xff;
    return r;
  }
  function unpackG(rgb: number): number {
    let g = (rgb >> 8) & 0xff;
    return g;
  }
  function unpackB(rgb: number): number {
    let b = rgb & 0xff;
    return b;
  }

  /**
   * convierte el valor de la saturación en un color RGB
   * @param h hue de 0 hasta 360
   * @param s saturacion de 0 hasta 99
   * @param l luminosidad de 0 hasta 99
   */
  //% block=neopixelHLS block="hue %h|saturacion %s|luminosidad %l"
  //% subcategory=Neopixel
  export function hsl(h: number, s: number, l: number): number {
    h = Math.round(h);
    s = Math.round(s);
    l = Math.round(l);

    h = h % 360;
    s = Math.clamp(0, 99, s);
    l = Math.clamp(0, 99, l);
    let c = Math.idiv(((100 - Math.abs(2 * 1 - 100)) * s) << 8, 10000); //chroma, [0,255]
    let h1 = Math.idiv(h, 60); //[0,6]
    let h2 = Math.idiv((h - h1 * 60) * 256, 60); //[0,255]
    let temp = Math.abs((h1 % 2 << 8) + h2 - 256);
    let x = (c * (256 - temp)) >> 8; //[0, 255], second largest component of this color
    let r$: number;
    let g$: number;
    let b$: number;
    if (h1 == 0) {
      r$ = c;
      g$ = x;
      b$ = 0;
    } else if (h1 == 1) {
      r$ = x;
      g$ = c;
      b$ = 0;
    } else if (h1 == 2) {
      r$ = 0;
      g$ = c;
      b$ = x;
    } else if (h1 == 3) {
      r$ = 0;
      g$ = x;
      b$ = c;
    } else if (h1 == 4) {
      r$ = x;
      g$ = 0;
      b$ = c;
    } else if (h1 == 5) {
      r$ = x;
      g$ = 0;
      b$ = x;
    }
    let m = Math.idiv(Math.idiv((l * 2) << 8, 100) - c, 2);
    let r = r$ + m;
    let g = g$ + m;
    let b = b$ + m;
    return packRGB(r, g, b);
  }

  export enum HueInterpolationDirection {
    Clockwise,
    CounterClockwise,
    Shortest,
  }
  /**
   * Pins helper es un encapsulador que tiene como objetivo
   * "traducción" del pin de la microbit al pin de jovibit.
   */
}
namespace pinsHelper {
  export function pinToDigitalPin(pin: Pin): DigitalPin {
    let truePin: DigitalPin;
    if (pin === 0) {
      truePin = DigitalPin.P0;
    } else if (pin === 1) {
      truePin = DigitalPin.P1;
    } else if (pin === 2) {
      truePin = DigitalPin.P2;
    } else if (pin === 8) {
      truePin = DigitalPin.P8;
    } else if (pin === 13) {
      truePin = DigitalPin.P13;
    } else if (pin === 14) {
      truePin = DigitalPin.P14;
    } else if (pin === 15) {
      truePin = DigitalPin.P15;
    } else if (pin === 16){
      truePin = DigitalPin.P16
    }
    return truePin;
  }
  export function pinToAnalogPin(pin: Pin): AnalogPin {
    let truePin: AnalogPin;
    if (pin === 0) {
      truePin = AnalogPin.P0;
    } else if (pin === 1) {
      truePin = AnalogPin.P1;
    } else if (pin === 2) {
      truePin = AnalogPin.P2;
    } else if (pin === 8) {
      truePin = AnalogPin.P8;
    } else if (pin === 13) {
      truePin = AnalogPin.P13;
    } else if (pin === 14) {
      truePin = AnalogPin.P14;
    } else if (pin === 15) {
      truePin = AnalogPin.P15;
    } else if (pin === 16) {
      truePin = AnalogPin.P16;
    }
    return truePin;
  }
}
