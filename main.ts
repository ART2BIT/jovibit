/**
* Custom blocks
*/
//% color=#ffdc00 icon="\uf140"
namespace JoviBit {
    enum Unitat_Distancia {
        //% block="mm" enumval=0

        Unitat_Distancia_mm,

        //% block="cm" enumval=1
        Unitat_Distancia_cm,

        //% block="polzada" enumval=2
        Unitat_Distancia_inch,
    }
    /**
    * Obté la distància ultrasònica
    */
    //% blockId=sonarbit block="Distància ultrasònica en %unitat_distancia |al|pin %pin"
    //% weight=10
    export function sonarbit_distancia(unitat_distancia: Unitat_Distancia, pin: DigitalPin): number {

        // send pulse
        pins.setPull(pin, PinPullMode.PullNone)
        pins.digitalWritePin(pin, 0)
        control.waitMicros(2)
        pins.digitalWritePin(pin, 0)
        control.waitMicros(10)
        pins.digitalWritePin(pin, 0)

        // read pulse
        let d = pins.pulseIn(pin, PulseValue.High, 25000)  // 8 / 340 = 
        let distancia = d / 29 / 2

        if (distancia > 400) {
            distancia = 401
        }

        switch (unitat_distancia) {
            case 0:
                return Math.floor(distancia * 10) //mm
                break
            case 1:
                return Math.floor(distancia)  //cm
                break
            case 2:
                return Math.floor(distancia / 254)   //inch
                break
            default:
                return Math.floor(distancia)
        }

    }
    /**
    * Potenciòmetre
    */
    //% blockId=pontenciometre block="proves"
    //% weight=15
    export function pontenciometre(): void {

        basic.showNumber(420)
        basic.clearScreen()
    }

}
