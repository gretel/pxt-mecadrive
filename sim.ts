/**
 * MecaDrive Simulator
 * Provides console logging for motor operations in the MakeCode simulator
 */

namespace pxsim.motor {
    let motorStates: { [key: number]: { direction: number, speed: number } } = {};
    let reverseM1 = false;
    let reverseM2 = false;
    let reverseM3 = true;
    let reverseM4 = true;
    let brakePwmLevel = 1000;

    function initMotorStates() {
        if (!motorStates[1]) {
            motorStates[1] = { direction: 0, speed: 0 };
            motorStates[2] = { direction: 0, speed: 0 };
            motorStates[3] = { direction: 0, speed: 0 };
            motorStates[4] = { direction: 0, speed: 0 };
        }
    }

    export function configMotorDirections(m1: boolean, m2: boolean, m3: boolean, m4: boolean): void {
        reverseM1 = m1;
        reverseM2 = m2;
        reverseM3 = m3;
        reverseM4 = m4;
        console.log(`Motor directions configured: M1=${m1 ? 'REV' : 'FWD'}, M2=${m2 ? 'REV' : 'FWD'}, M3=${m3 ? 'REV' : 'FWD'}, M4=${m4 ? 'REV' : 'FWD'}`);
    }

    export function configBrakeStrength(level: number): void {
        brakePwmLevel = Math.max(0, Math.min(4095, level));
        console.log(`Brake strength set to: ${brakePwmLevel}`);
    }

    export function MotorRun(index: number, direction: number, speed: number): void {
        initMotorStates();
        speed = Math.max(0, Math.min(255, speed));
        motorStates[index] = { direction: direction, speed: speed };

        const dirStr = direction === 1 ? 'CW' : direction === -1 ? 'CCW' : 'STOP';
        console.log(`Motor M${index}: ${dirStr} @ speed ${speed}`);
    }

    export function mecanumMove(direction: number, speed: number = 100): void {
        initMotorStates();
        speed = Math.max(0, Math.min(255, speed));

        const dirNames = [
            "Forward", "Backward", "Strafe Left", "Strafe Right",
            "Rotate CW", "Rotate CCW", "Diagonal Forward-Right",
            "Diagonal Forward-Left", "Diagonal Backward-Right", "Diagonal Backward-Left"
        ];

        console.log(`Mecanum: ${dirNames[direction]} @ speed ${speed}`);

        // Apply motor directions based on mecanum movement
        switch (direction) {
            case 0: // Forward
                setMotorForMecanum(1, 1, speed);
                setMotorForMecanum(2, 1, speed);
                setMotorForMecanum(3, -1, speed);
                setMotorForMecanum(4, -1, speed);
                break;
            case 1: // Backward
                setMotorForMecanum(1, -1, speed);
                setMotorForMecanum(2, -1, speed);
                setMotorForMecanum(3, 1, speed);
                setMotorForMecanum(4, 1, speed);
                break;
            case 2: // Strafe Left
                setMotorForMecanum(1, 0, 0);
                setMotorForMecanum(2, 0, 0);
                setMotorForMecanum(3, 1, speed);
                setMotorForMecanum(4, 1, speed);
                break;
            case 3: // Strafe Right
                setMotorForMecanum(1, -1, speed);
                setMotorForMecanum(2, 1, speed);
                setMotorForMecanum(3, 0, 0);
                setMotorForMecanum(4, 0, 0);
                break;
            case 4: // Rotate CW
                setMotorForMecanum(1, 1, speed);
                setMotorForMecanum(2, 1, speed);
                setMotorForMecanum(3, -1, speed);
                setMotorForMecanum(4, -1, speed);
                break;
            case 5: // Rotate CCW
                setMotorForMecanum(1, -1, speed);
                setMotorForMecanum(2, -1, speed);
                setMotorForMecanum(3, 1, speed);
                setMotorForMecanum(4, 1, speed);
                break;
            case 6: // Diagonal Forward-Right
                setMotorForMecanum(1, 0, 0);
                setMotorForMecanum(2, 1, speed);
                setMotorForMecanum(3, 0, 0);
                setMotorForMecanum(4, -1, speed);
                break;
            case 7: // Diagonal Forward-Left
                setMotorForMecanum(1, 1, speed);
                setMotorForMecanum(2, 0, 0);
                setMotorForMecanum(3, -1, speed);
                setMotorForMecanum(4, 0, 0);
                break;
            case 8: // Diagonal Backward-Right
                setMotorForMecanum(1, -1, speed);
                setMotorForMecanum(2, 0, 0);
                setMotorForMecanum(3, 1, speed);
                setMotorForMecanum(4, 0, 0);
                break;
            case 9: // Diagonal Backward-Left
                setMotorForMecanum(1, 0, 0);
                setMotorForMecanum(2, -1, speed);
                setMotorForMecanum(3, 0, 0);
                setMotorForMecanum(4, 1, speed);
                break;
        }

        logMotorStates();
    }

    function setMotorForMecanum(motor: number, dir: number, speed: number): void {
        // Apply reversal configuration
        if (motor === 1 && reverseM1) dir = -dir;
        if (motor === 2 && reverseM2) dir = -dir;
        if (motor === 3 && reverseM3) dir = -dir;
        if (motor === 4 && reverseM4) dir = -dir;

        motorStates[motor] = { direction: dir, speed: speed };
    }

    export function motorStop(index: number): void {
        initMotorStates();

        if (index === 3 || index === 4) {
            // M3 and M4 share U2 chip - stop both
            motorStates[3] = { direction: 0, speed: 0 };
            motorStates[4] = { direction: 0, speed: 0 };
            console.log(`Motors M3 and M4 stopped (shared chip)`);
        } else {
            motorStates[index] = { direction: 0, speed: 0 };
            console.log(`Motor M${index} stopped`);
        }
    }

    export function motorStopAll(): void {
        initMotorStates();
        motorStates[1] = { direction: 0, speed: 0 };
        motorStates[2] = { direction: 0, speed: 0 };
        motorStates[3] = { direction: 0, speed: 0 };
        motorStates[4] = { direction: 0, speed: 0 };
        console.log("All motors stopped");
    }

    function logMotorStates(): void {
        let activeMotors = [];
        for (let i = 1; i <= 4; i++) {
            const state = motorStates[i];
            if (state && state.speed > 0) {
                const dir = state.direction > 0 ? 'CW' : state.direction < 0 ? 'CCW' : 'STOP';
                activeMotors.push(`M${i}:${dir}@${state.speed}`);
            }
        }
        if (activeMotors.length > 0) {
            console.log(`  Active: ${activeMotors.join(', ')}`);
        }
    }
}
