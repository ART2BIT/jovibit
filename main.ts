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

  /************
   * Motor    *
   ************/

  /**
   * Activa o desactiva el motor
   */
  //% blockId=Motor_Brick block="Activa o desactiva el motor al pin %pin"
  //% weight=10
  export function motor(pin: DigitalPin): void {
    if (pins.digitalReadPin(pin) === 0) {
      pins.digitalWritePin(pin, 1);
    } else {
      pins.digitalWritePin(pin, 0);
    }
  }
  /**************
   * Servo      *
   **************/

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

  /***************
   * Neopixel    *
   ***************/

  export class Strip{
    buf: Buffer;
    pin: DigitalPin;
    
    brightness: number;
    start: number;
    length: number;
    mode: NeoPixelMode;
    matrixWidth: number;

    /**
     * 
     */
  }
  
}
