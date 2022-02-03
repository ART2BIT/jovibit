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

  export class Strip {
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
    //% blockId="neopixel_set_strip_color" block="%strip|muestra el color %rgb=neopixel_colors"
    //% strip.defl=strip
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
    //% blockId="neopixel_set_strip_rainbow" block="%strip| muestra el arco iris"
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
     * Set LED to a given color (range 0-255 for r, g, b).
     * Se necesita llamar al 'show' para hacer los cambios visibles
     * @param pixeloffset position of the NeoPixel in the strip
     * @param rgb RGB color del LED
     *
     */
    //% blockId="neopixel_set_pixel_color" block="%strip|Establece pixel color en %pixeloffset|a %rgb=neopixel_colors"
    //% strip.defl=strip
    //% blockGap=8
    //% weight=80
    //% subcategory=Neopixel
    setPixelColor(pixeloffset: number, rgb: number): void {
      this.setPixelRGB(pixeloffset >> 0, rgb >> 0);
    }

    /**
     * Establece el número de píxeles en la matriz de strip
     * @param width número de pixeles en una fila
     */
    //% blockId=neopixel_set_matrix_width block="%strip|establece la amplitud de la matriz %width"
    //% strip.defl=strip
    //% blockGap=8
    //% weight=5
    //% subcategory=Neopixel
    setMatrixWidth(width: number) {
      this.matrixWidth = Math.min(this._length, width >> 0);
    }

    /**
     * Envía todos los cambios al strip.
     */
    //% blockId="neopixel_show" block="%strip|show" blockGap=8
    //% strip.defl=strip
    //% weight 79
    //% subcategory=Neopixel
    show() {
      ws2812b.sendBuffer(this.buf, this.pin);
    }

    /**
     * apagar los LEDs.
     * se tiene que llamar 'show' para hacer visible los cambios
     */
    //% blockId= "neopixel_clear" block"%clear"
    //% strip.defl=strip
    //% weight=76
    //% subcategory=Neopixel
    clear() {
      const stride = this.mode === NeoPixelMode.RGBW ? 4 : 3;
      this.buf.fill(0, this.start * stride, this._length * stride);
    }

    /**
     * Establece el brillo del cinta.
     * @param brightness
     */
    //% blockId="neopixel_set_brightness" block="%strip|Establece el brillo %brightness" blockGap=8
    //% strip.defl=strip
    //%weight=59
    //%subcategory=Neopixel
    setBrightness(brightness: number): void {
      this.brightness = brightness & 0xff;
    }

    /**
     * crea una dimensión de LEDs
     * @param start punto de partida de la dimensión
     * @param _length numero de LEDs que tiene la dimensión
     */
    //% weight=89
    //% blockId="neopixel_range" block="%strip|rango desde %start|con %_length|leds"
    //% strip.defl=strip
    //% blockSetVariable=range
    //% subcategory=Neopixel
    range(start: number, _length: number): Strip {
      start = start >> 0;
      _length = _length >> 0;
      let strip = new Strip();
      strip.buf = this.buf;
      strip.pin = this.pin;
      strip.brightness = this.brightness;
      strip.start = this.start + Math.clamp(0, this._length - 1, start);
      strip._length = Math.clamp(
        0,
        this._length - (strip.start - this.start),
        _length
      );
      strip.matrixWidth = 0;
      strip.mode = this.mode;
      return strip;
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
   * Crea un driver de NeoPixel para 'numleds' LEDs
   * @param pin the pin where the neopixel is connected.
   * @param numleds number of leds in the strip, eg: 24,30,60,64
   */
  //% blockId="neopixel_create" block="NeoPixel en %mode"
  //% wight=90 blockGap=8
  //% trackArgs=0,2
  //% blockSetVariable=strip
  //% subcategory=Neopixel
  export function create(mode: NeoPixelMode): Strip {
    let strip = new Strip();
    let stride = mode === NeoPixelMode.RGBW ? 4 : 3;
    strip.buf = pins.createBuffer(1 * stride);
    strip.start = 0;
    strip._length = 1;
    strip.mode = mode || NeoPixelMode.RGB;
    strip.matrixWidth = 0;
    strip.setBrightness(128);
    strip.setPin(DigitalPin.P16);
    return strip;
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
  //% weight=2 blockGap=8
  //% blockId="neopixel_colors" block="devuelve el valor del color %color"
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
    }
    return truePin;
  }
}
