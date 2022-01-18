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

enum Servo{
    //% block="A" enumval = 0

    P0,

    //% block="B" enumval = 1

    P1,

    //% block="C" enumval = 2

    P2,
    
    //% block="D" enumval = 8

    P8,

    //% block="E" enumval = 13

    P13,

    //% block="F" enumval = 14

    P14,

    //% block="G" enumval = 15

    P15,
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
    //weight=10
    export function sonarbit_distancia(unitat_distancia: Unitat_Distancia, pin: DigitalPin): number {

        // send pulse
        pins.setPull(pin, PinPullMode.PullNone)
        pins.digitalWritePin(pin, 0)
        control.waitMicros(2)
        pins.digitalWritePin(pin, 0)
        control.waitMicros(10)
        pins.digitalWritePin(pin, 0)

        // read pulse
        let d = pins.pulseIn(pin, PulseValue.High, 25000)
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
                return Math.floor(distancia / 254)  //inch
                break
            default:
                return Math.floor(distancia)
        }

    }

    /**
    * Activa o desactiva el motor
    */
    //% blockId=Motor_Brick block="Activa o desactiva el motor al pin %pin"
    //% weight=10
    export function motor( pin : DigitalPin ): void {
        
        if (pins.digitalReadPin(pin) === 0) {
            pins.digitalWritePin(pin, 1)
        } else {
            pins.digitalWritePin(pin, 0)
        }
    }
    /**
     * Servo
     */
    let PCA = 0x40;
    let initI2C = false;
    let i2cError = 0;
    let SERVOS = 0x06;

    let servoTarget: number[]=[];
    let servoActual: number[]=[];
    let servoCancel: boolean []=[];
    

    //Funciones helper
    function initPCA(): void {
        
        let i2cData = pins.createBuffer(2);
        initI2C = true;

        i2cData[0] = 0;
        i2cData[1] = 0x10;
        pins.i2cWriteBuffer(PCA, i2cData, false);

        i2cData[0] = 0xFE;
        i2cData[1] = 101;
        pins.i2cWriteBuffer(PCA, i2cData, false);

        i2cData[0] =0;
        i2cData[1] = 0x81;
        pins.i2cWriteBuffer(PCA,i2cData, false);

        for (let servo = 0; servo < 16; servo++){
            i2cData[0] = SERVOS + servo*4+0;
            i2cData[1] = 0x00;
            pins.i2cWriteBuffer(PCA, i2cData, false);

            servoTarget[servo]=0;
            servoActual[servo]=0;
            servoCancel[servo]=false;

        }
    }

    /**
     * inicializa todos(pines) los servos al angulo 0
     */
    //%blockId = "centraServos"
    //%block="Centra todos los Servos"
    //% subcategory=Servo
    export function centraServos(): void{
        for(let i=0; i<16; i++){
            for (let i=0; i<16; i++){
                setServo(i, 0);
            }
        }
    }

    /**
     * establece la posición del servo
     * @param servo Servo numero(0 to 15)
     * @param angle degrees to turn servo(-90 to +90)
     */
    //% blockId="setServo" block="Establece el servo %Servo| al angulo %angle"
    //% weight=70
    //% angle.min=-90 angle.max=+90
    //% subcategory=Servo
    export function setServo(servo: Servo, angle:number):void{

        setServoRaw(servo, angle);
        servoTarget[servo] = angle;
    }

    function setServoRaw(servo: Servo, angle: number): void{

        if(initI2C == false){
            initPCA();
        }
        
        let i2cData = pins.createBuffer(2);
        let start = 0;
        angle = Math.max (Math.min(90, angle), -90);
        let stop = 369 + angle * 223 / 90;

        i2cData[0] = SERVOS + servo*4 + 2;
        i2cData[1] = (stop & 0xFF);
        pins.i2cWriteBuffer(PCA, i2cData, false);

        i2cData[0] = SERVOS + servo* 4 + 3;
        i2cData[1] = (stop >> 8);
        pins.i2cWriteBuffer(PCA, i2cData, false);
        servoActual[servo] = angle;

    }

    /**
     * Mueve el Servo a la Posición a la velocidad seleccionada
     * @param servo Servo number(0 to 15)
     * @param angle degrees to turn to (-90 to +90)
     * @param speed degrees per second to move (1  to 1000) eg: 60
     */
    //% blockId="moveServo" block="mover Servo %Servo| al angulo %angle| a la velocidad %speed| degrees/sec"
    //% weight=70
    //% angle.min=-90 angle.max=90
    //% speed.min=1 speed.max=1000
    //% subcategory=Servo
    export function moverServo(servo: Servo, angle: number, speed:number): void{
        let step = 1;
        let delay = 10; 
        if (servoTarget[servo] != servoActual[servo])
        {
            servoCancel[servo] = true;
            while(servoCancel[servo])
            basic.pause(1)
        }
        angle = Math.max(Math.min(90, angle),-90)
        speed = Math.max(Math.min(1000, speed),1)
        delay = Math.round(1000/speed)
        servoTarget[servo] = angle;
        if(angle < servoActual[servo]){
            step = -1;
            control.inBackground(() => {
                while (servoActual[servo] !=servoTarget[servo]){

                    if (servoCancel[servo]){

                        servoCancel[servo] = false
                        break                        
                    }
                    setServoRaw(servo, servoActual[servo]+ step);
                    basic.pause(delay)
                
                }

            })
        }
    }
    /**
     * devuelve la posición actual
     * @param servo Servo number (0 to 15)
     */
    //% blockId="getServoActual" block="servo %Servo| actual position"
    //% weight=10
    //% subcategory=Servo
    export function getServoActual(servo: Servo): number{
        return servoActual[servo];
    }

    /**
     * Devuelve la posición objetivo
     * @param servo Servo number (0 to 15)
     */
    //% blockId="getServoTarget" block="servo %Servo| posición objetivo"
    //% weight=5
    //% subcategory=Servo
    export function getServoTarget(servo: Servo): number{
        return servoTarget[servo];
    }

    /**
     * comprueba si el servo ha llegado al objetivo
     * @param servo Servo number (0 to 15)
     */
    //% blockId="isServoDone" block="servo %Servo| ha terminado"
    //% weight=5
    //% subcategory=Servo
    export function isServoDone(servo: Servo): boolean{
        return servoTarget[servo]==servoActual[servo];
    }

    /**
     * espera hasta que el servo llegue a la posicion objetivo
     * @param servo Servo number (0 hasta 15)
     */
    //% blockId="waitServo" block="espera por el servo %Servo"
    //% weight=5
    //% subcategory=Servo
    export function waitServo(servo: Servo): void{
        while (servoActual[servo] != servoTarget[servo]) { basic.pause(10); } //intentar no utilizar demasiado esta función
    }
}
