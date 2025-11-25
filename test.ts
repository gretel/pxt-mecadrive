// MecaDrive Extension Test File
// This file tests all public API functions to ensure they compile correctly

// Test 1: Mecanum Movement - all 10 directions
motor.mecanumMove(motor.MecanumDirection.Forward, 100)
basic.pause(1000)
motor.mecanumMove(motor.MecanumDirection.Backward, 100)
basic.pause(1000)
motor.mecanumMove(motor.MecanumDirection.StrafeLeft, 100)
basic.pause(1000)
motor.mecanumMove(motor.MecanumDirection.StrafeRight, 100)
basic.pause(1000)
motor.mecanumMove(motor.MecanumDirection.RotateCW, 100)
basic.pause(1000)
motor.mecanumMove(motor.MecanumDirection.RotateCCW, 100)
basic.pause(1000)
motor.mecanumMove(motor.MecanumDirection.DiagonalForwardRight, 100)
basic.pause(1000)
motor.mecanumMove(motor.MecanumDirection.DiagonalForwardLeft, 100)
basic.pause(1000)
motor.mecanumMove(motor.MecanumDirection.DiagonalBackwardRight, 100)
basic.pause(1000)
motor.mecanumMove(motor.MecanumDirection.DiagonalBackwardLeft, 100)
basic.pause(1000)

// Test 2: Individual DC Motor Control - all 4 motors
motor.MotorRun(motor.Motors.M1, motor.Dir.CW, 150)
basic.pause(1000)
motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, 150)
basic.pause(1000)
motor.MotorRun(motor.Motors.M3, motor.Dir.CW, 150)
basic.pause(1000)
motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, 150)
basic.pause(1000)

// Test 3: Motor Stop - individual and all
motor.motorStop(motor.Motors.M1)
basic.pause(500)
motor.motorStop(motor.Motors.M2)
basic.pause(500)
motor.motorStopAll()
basic.pause(1000)

// Test 4: Advanced Configuration - Motor Directions
motor.configMotorDirections(false, false, true, true)
basic.pause(500)

// Test 5: Advanced Configuration - Brake Strength
motor.configBrakeStrength(1000)
basic.pause(500)

// Test 6: Variable speed control
motor.mecanumMove(motor.MecanumDirection.Forward, 50)
basic.pause(1000)
motor.mecanumMove(motor.MecanumDirection.Forward, 150)
basic.pause(1000)
motor.mecanumMove(motor.MecanumDirection.Forward, 255)
basic.pause(1000)

// Test 7: Heading-based control - cardinal directions
motor.mecanumMoveByHeading(0, 100)    // Forward
basic.pause(1000)
motor.mecanumMoveByHeading(90, 100)   // Right
basic.pause(1000)
motor.mecanumMoveByHeading(180, 100)  // Backward
basic.pause(1000)
motor.mecanumMoveByHeading(270, 100)  // Left
basic.pause(1000)

// Test 8: Heading-based control - diagonal movements
motor.mecanumMoveByHeading(45, 100)   // Northeast
basic.pause(1000)
motor.mecanumMoveByHeading(135, 100)  // Southeast
basic.pause(1000)
motor.mecanumMoveByHeading(225, 100)  // Southwest
basic.pause(1000)
motor.mecanumMoveByHeading(315, 100)  // Northwest
basic.pause(1000)

// Test 9: Smooth circular pattern
for (let heading = 0; heading <= 360; heading += 30) {
    motor.mecanumMoveByHeading(heading, 120)
    basic.pause(500)
}

// Test complete - stop all motors
motor.motorStopAll()
