/**
 * MecaDrive Simulator
 * Provides visual feedback for motor and mecanum wheel control in the MakeCode simulator
 */

namespace pxsim {
    export enum Motors {
        M1 = 0x1,
        M2 = 0x2,
        M3 = 0x3,
        M4 = 0x4
    }

    export enum Dir {
        CW = 1,
        CCW = -1,
    }

    export enum MecanumDirection {
        Forward,
        Backward,
        StrafeLeft,
        StrafeRight,
        RotateCW,
        RotateCCW,
        DiagonalForwardRight,
        DiagonalForwardLeft,
        DiagonalBackwardRight,
        DiagonalBackwardLeft
    }

    export interface MotorState {
        direction: number;
        speed: number;
    }

    export class MecaDriveBoard {
        motorStates: { [key: number]: MotorState } = {};
        reverseM1: boolean = false;
        reverseM2: boolean = false;
        reverseM3: boolean = true;
        reverseM4: boolean = true;
        brakePwmLevel: number = 1000;

        constructor() {
            // Initialize motor states
            this.motorStates[Motors.M1] = { direction: 0, speed: 0 };
            this.motorStates[Motors.M2] = { direction: 0, speed: 0 };
            this.motorStates[Motors.M3] = { direction: 0, speed: 0 };
            this.motorStates[Motors.M4] = { direction: 0, speed: 0 };
        }

        setMotor(index: Motors, direction: number, speed: number) {
            if (this.motorStates[index]) {
                this.motorStates[index].direction = direction;
                this.motorStates[index].speed = speed;
                this.updateDisplay();
            }
        }

        stopMotor(index: Motors) {
            if (index === Motors.M3 || index === Motors.M4) {
                // M3 and M4 share U2 chip - stop both
                this.motorStates[Motors.M3].direction = 0;
                this.motorStates[Motors.M3].speed = 0;
                this.motorStates[Motors.M4].direction = 0;
                this.motorStates[Motors.M4].speed = 0;
            } else if (this.motorStates[index]) {
                this.motorStates[index].direction = 0;
                this.motorStates[index].speed = 0;
            }
            this.updateDisplay();
        }

        stopAllMotors() {
            for (let i = 1; i <= 4; i++) {
                this.motorStates[i].direction = 0;
                this.motorStates[i].speed = 0;
            }
            this.updateDisplay();
        }

        setMecanumMovement(direction: MecanumDirection, speed: number) {
            // Clamp speed
            speed = Math.max(0, Math.min(255, speed));

            // Helper to apply reversal
            const applyReversal = (motor: number, dir: number): number => {
                if (motor === 1 && this.reverseM1) return -dir;
                if (motor === 2 && this.reverseM2) return -dir;
                if (motor === 3 && this.reverseM3) return -dir;
                if (motor === 4 && this.reverseM4) return -dir;
                return dir;
            };

            // Set motor states based on mecanum direction
            switch (direction) {
                case MecanumDirection.Forward:
                    this.setMotor(Motors.M1, applyReversal(1, 1), speed);
                    this.setMotor(Motors.M2, applyReversal(2, 1), speed);
                    this.setMotor(Motors.M3, applyReversal(3, -1), speed);
                    this.setMotor(Motors.M4, applyReversal(4, -1), speed);
                    break;

                case MecanumDirection.Backward:
                    this.setMotor(Motors.M1, applyReversal(1, -1), speed);
                    this.setMotor(Motors.M2, applyReversal(2, -1), speed);
                    this.setMotor(Motors.M3, applyReversal(3, 1), speed);
                    this.setMotor(Motors.M4, applyReversal(4, 1), speed);
                    break;

                case MecanumDirection.StrafeRight:
                    this.setMotor(Motors.M1, applyReversal(1, -1), speed);
                    this.setMotor(Motors.M2, applyReversal(2, 1), speed);
                    this.setMotor(Motors.M3, 0, 0);
                    this.setMotor(Motors.M4, 0, 0);
                    break;

                case MecanumDirection.StrafeLeft:
                    this.setMotor(Motors.M1, 0, 0);
                    this.setMotor(Motors.M2, 0, 0);
                    this.setMotor(Motors.M3, applyReversal(3, 1), speed);
                    this.setMotor(Motors.M4, applyReversal(4, 1), speed);
                    break;

                case MecanumDirection.RotateCW:
                    this.setMotor(Motors.M1, applyReversal(1, 1), speed);
                    this.setMotor(Motors.M2, applyReversal(2, 1), speed);
                    this.setMotor(Motors.M3, applyReversal(3, -1), speed);
                    this.setMotor(Motors.M4, applyReversal(4, -1), speed);
                    break;

                case MecanumDirection.RotateCCW:
                    this.setMotor(Motors.M1, applyReversal(1, -1), speed);
                    this.setMotor(Motors.M2, applyReversal(2, -1), speed);
                    this.setMotor(Motors.M3, applyReversal(3, 1), speed);
                    this.setMotor(Motors.M4, applyReversal(4, 1), speed);
                    break;

                case MecanumDirection.DiagonalForwardRight:
                    this.setMotor(Motors.M1, 0, 0);
                    this.setMotor(Motors.M2, applyReversal(2, 1), speed);
                    this.setMotor(Motors.M3, 0, 0);
                    this.setMotor(Motors.M4, applyReversal(4, -1), speed);
                    break;

                case MecanumDirection.DiagonalForwardLeft:
                    this.setMotor(Motors.M1, applyReversal(1, 1), speed);
                    this.setMotor(Motors.M2, 0, 0);
                    this.setMotor(Motors.M3, applyReversal(3, -1), speed);
                    this.setMotor(Motors.M4, 0, 0);
                    break;

                case MecanumDirection.DiagonalBackwardRight:
                    this.setMotor(Motors.M1, applyReversal(1, -1), speed);
                    this.setMotor(Motors.M2, 0, 0);
                    this.setMotor(Motors.M3, applyReversal(3, 1), speed);
                    this.setMotor(Motors.M4, 0, 0);
                    break;

                case MecanumDirection.DiagonalBackwardLeft:
                    this.setMotor(Motors.M1, 0, 0);
                    this.setMotor(Motors.M2, applyReversal(2, -1), speed);
                    this.setMotor(Motors.M3, 0, 0);
                    this.setMotor(Motors.M4, applyReversal(4, 1), speed);
                    break;
            }
        }

        configureMotorDirections(m1: boolean, m2: boolean, m3: boolean, m4: boolean) {
            this.reverseM1 = m1;
            this.reverseM2 = m2;
            this.reverseM3 = m3;
            this.reverseM4 = m4;
        }

        configureBrakeStrength(level: number) {
            this.brakePwmLevel = Math.max(0, Math.min(4095, level));
        }

        updateDisplay() {
            // Log motor states to console for debugging
            const runtime = pxsim.runtime as any;
            if (runtime && runtime.board) {
                runtime.board.updateView();
            }
        }

        getMotorStateText(): string {
            let text = "MecaDrive Motors:\n";
            for (let i = 1; i <= 4; i++) {
                const state = this.motorStates[i];
                if (state.speed > 0) {
                    const dir = state.direction > 0 ? "CW" : state.direction < 0 ? "CCW" : "STOP";
                    text += `M${i}: ${dir} @ ${state.speed}\n`;
                } else {
                    text += `M${i}: STOP\n`;
                }
            }
            return text;
        }
    }

    export interface MecaDriveBoardDefinition {
        mecaDrive: MecaDriveBoard;
    }

    export function mecaDriveBoard(): MecaDriveBoard {
        return (pxsim.board() as MecaDriveBoardDefinition).mecaDrive;
    }
}

namespace pxsim.motor {
    export function configMotorDirections(m1: boolean, m2: boolean, m3: boolean, m4: boolean): void {
        const board = mecaDriveBoard();
        if (board) {
            board.configureMotorDirections(m1, m2, m3, m4);
        }
    }

    export function configBrakeStrength(level: number): void {
        const board = mecaDriveBoard();
        if (board) {
            board.configureBrakeStrength(level);
        }
    }

    export function MotorRun(index: Motors, direction: Dir, speed: number): void {
        const board = mecaDriveBoard();
        if (board) {
            speed = Math.max(0, Math.min(255, speed));
            board.setMotor(index, direction, speed);
            console.log(`Motor M${index} running ${direction === Dir.CW ? 'CW' : 'CCW'} at speed ${speed}`);
        }
    }

    export function mecanumMove(direction: MecanumDirection, speed: number = 100): void {
        const board = mecaDriveBoard();
        if (board) {
            const dirNames = [
                "Forward", "Backward", "Strafe Left", "Strafe Right",
                "Rotate CW", "Rotate CCW", "Diagonal Forward-Right",
                "Diagonal Forward-Left", "Diagonal Backward-Right", "Diagonal Backward-Left"
            ];
            board.setMecanumMovement(direction, speed);
            console.log(`Mecanum moving: ${dirNames[direction]} at speed ${speed}`);
        }
    }

    export function motorStop(index: Motors): void {
        const board = mecaDriveBoard();
        if (board) {
            board.stopMotor(index);
            console.log(`Motor M${index} stopped`);
        }
    }

    export function motorStopAll(): void {
        const board = mecaDriveBoard();
        if (board) {
            board.stopAllMotors();
            console.log("All motors stopped");
        }
    }
}

namespace pxsim.visuals {
    export function mkMecaDrivePart(): SVGElement {
        // Create a simple visual representation
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 200 200");
        svg.setAttribute("width", "200");
        svg.setAttribute("height", "200");

        // Background
        const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bg.setAttribute("x", "10");
        bg.setAttribute("y", "10");
        bg.setAttribute("width", "180");
        bg.setAttribute("height", "180");
        bg.setAttribute("fill", "#f0f0f0");
        bg.setAttribute("stroke", "#333");
        bg.setAttribute("stroke-width", "2");
        bg.setAttribute("rx", "5");
        svg.appendChild(bg);

        // Title
        const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
        title.setAttribute("x", "100");
        title.setAttribute("y", "30");
        title.setAttribute("text-anchor", "middle");
        title.setAttribute("font-size", "14");
        title.setAttribute("font-weight", "bold");
        title.setAttribute("fill", "#333");
        title.textContent = "MecaDrive";
        svg.appendChild(title);

        // Motor indicators (4 motors in corners)
        const motorPositions = [
            { x: 40, y: 70, label: "M1" },
            { x: 160, y: 70, label: "M2" },
            { x: 40, y: 170, label: "M3" },
            { x: 160, y: 170, label: "M4" }
        ];

        motorPositions.forEach((pos, i) => {
            // Motor circle
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", pos.x.toString());
            circle.setAttribute("cy", pos.y.toString());
            circle.setAttribute("r", "20");
            circle.setAttribute("fill", "#ddd");
            circle.setAttribute("stroke", "#666");
            circle.setAttribute("stroke-width", "2");
            circle.setAttribute("id", `motor-${i + 1}-indicator`);
            svg.appendChild(circle);

            // Motor label
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", pos.x.toString());
            label.setAttribute("y", (pos.y + 5).toString());
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("font-size", "12");
            label.setAttribute("font-weight", "bold");
            label.setAttribute("fill", "#333");
            label.textContent = pos.label;
            svg.appendChild(label);
        });

        return svg;
    }
}
