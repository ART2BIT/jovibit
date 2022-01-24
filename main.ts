/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

enum Unitat_Distancia {
  //% block="mm" enumval=0

  Unitat_Distancia_mm,

  //% block="cm" enumval=1
  Unitat_Distancia_cm,

  //% block="polzada" enumval=2
  Unitat_Distancia_inch,
}

enum NeoPixelColors {
  //% block=red
  Red = 0xff0000,
  //% block=orange
  Orange = 0xffa500,
  //% block=yellow
  Yellow = 0xffff00,
  //% block=green
  Green = 0x00ff00,
  //% block=blue
  Blue = 0x0000ff,
  //% block=indigo
  Indigo = 0x4b0082,
  //% block=violet
  Violet = 0x8a2be2,
  //% block=purple
  Purple = 0xff00ff,
  //% block=white
  White = 0xffffff,
  //% block=black
  Black = 0x000000,
}

enum NeoPixelMode {
  //% block="RGB (GRB forma)"
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
   * Obté la distància ultrasònica en la mesura seleccionada
   */
  //% blockId=sonarbit
  //% block="Distància ultrasònica en %Unitat_distancia |al|pin %pin"
  //% weight=10
  //% subcategory =SonarBit
  export function sonarbit_distancia(
    unitat_distancia: Unitat_Distancia,
    pin: DigitalPin
  ): number {
    // send pulse
    pins.setPull(pin, PinPullMode.PullNone);
    pins.digitalWritePin(pin, 0);
    control.waitMicros(2);
    pins.digitalWritePin(pin, 0);
    control.waitMicros(10);
    pins.digitalWritePin(pin, 0);

    // read pulse
    let d = pins.pulseIn(pin, PulseValue.High, 25000);
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
  //% blockId=Motor_Brick block="Activa o desactiva el motor al pin %pin"
  //% weight=10
  //% subcategory=Motor
  export function motor(pin: DigitalPin): void {
    if (pins.digitalReadPin(pin) === 0) {
      pins.digitalWritePin(pin, 1);
    } else {
      pins.digitalWritePin(pin, 0);
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
  //%blockId="MoverServo"
  //%block="Mueve el servo %pin| a la velocidad %vel"
  //% subcategory=Servo
  export function moverServo(pin: AnalogPin, vel: number): void {
    pins.servoWritePin(pin, vel);
  }
  /**
   * detiene el servo
   * @param pin servo en el pin
   */
  //% blockId="PararServo"
  //% block="Para el servo %pin"
  //% subcategory=Servo
  export function pararServo(pin: AnalogPin): void {
    pins.servoWritePin(pin, 90);
  }

  //Neopixel//


  export class Strip {
    buf: Buffer;
    pin: DigitalPin;

    brightness: number;
    start: number;
    length: number;
    mode: NeoPixelMode;
    matrixWidth: number;

    /**
     * 
     * @param startHue 
     * @param endHue 
     */

    showRainbow(startHue: number = 1, endHue: number = 360) {
      if (this.length <= 0) return;

      startHue = startHue >> 0;
      endHue = endHue >> 0;
      const saturation = 100;
      const luminance = 50;
      const steps = this.length;
      const direction = HueInterpolationDirection.Clockwise
    
      const h1 = startHue;
      const h2 = endHue;
      const hDistCW = ((h2 + 360) - h1) % 360;
      const hStepCW = Math.idiv((hDistCW * 100), steps);
      const hDistCCW = ((h1 + 360) - h2) % 360;
      const hStepCCW = Math.idiv(-(hDistCCW * 100), steps);
      let hStep = hStepCW;
      if (direction === HueInterpolationDirection.Clockwise) {
        hStep = hStepCCW;
      } else if (direction === HueInterpolationDirection.CounterClockwise) {
        hStep = hStepCCW;
      } else {
        hStep = hDistCW < hDistCCW ? hStepCW : hStepCCW
      }
      const h1_100 = h1 * 100;

      //sat
      const s1 = saturation;
      const s2 = saturation;
      const sDist = s2 - s1;
      const sStep = Math.idiv(sDist, steps);
      const s1_100 = s1 * 100;

      //lum
      const l1 = luminance;
      const l2 = luminance;
      const lDist = l2 - l1;
      const lStep = Math.idiv(lDist, steps);
      const l1_100 = l1 * 100;

      //interpolate
      if (steps === 1) {
        this.setPixelColor(0, hsl(h1 + hStep, s1, sStep, l1 + lStep));
      } else {
        this.setPixelColor(0, hsl(startHue, saturation, luminance));
        for (let i = 1; i < steps - 1; i++){
          const h = Math.idiv(h1_100 + i * hStep, 100) + 360;
          const s = Math.idiv(s1_100 + i * sStep, 100);
          const l = Math.idiv(l1_100 + i * lStep, 100);
          this.setPixelColor(i, hsl(h, s, l))
        }
        this.setPixelColor(steps - 1, hls(endHue, saturation, luminance));
      }
      this.show();
    }
    
    /**
     * 
     * @param value
     * @param high
     */

    showBarGraph(value: number, high: number): void {
      if (high < + 0) {
        this.clear();
        this.setPixelColor(0, NeoPixelColors.Yellow);
        this.show();
        return;
      }
      value = Math.abs(value);
      const n = this.length;
      const n1 = n - 1;
      let v = Math.idiv(value * n, high);
      if (v == 0) {
        this.setPixelColor(0, 0x666600);
        for (let i = 1; i < n; ++i) this.setPixelColor(i, 0);
      } else {
        for (let i = 0; i < n; ++i){
          if (i <= v) {
            const b = Math.idiv(i * 255, n1);
            this.setPixelColor(i, neopixel.rgb(b, 0, 255 - b));
          } else this.setPixelColor(i, 0);
        }
      }
      this.show();
    }

    /**
     * Set LED to a given color (range 0-255 for r, g, b).
     * Se necesita llamar al 'show' para hacer los cambios visibles
     * @param pixeloffset position of the NeoPixel in the str
     */
    //%blockId="neopixel_set_pixel_color" block="%strip|set pixel color at %pixeloffset|to %rgb=neopixel_colors"
    //%strip.defl=strip
    //%blockGap=8
    
  }
  export enum HueInterpolationDirection {
    Clockwise,
    CounterClockwise,
    Shortest
  }
}
