import type { Object3D } from "three";

export const CAR_NODE_NAMES = {
  wheels: {
    frontLeftSteeringPivot: "AR_Wheel_FL_SteeringPivot",
    frontLeftRollPivot: "AR_Wheel_FL_RollPivot",

    frontRightSteeringPivot: "AR_Wheel_FR_SteeringPivot",
    frontRightRollPivot: "AR_Wheel_FR_RollPivot",

    rearLeftRollPivot: "AR_Wheel_RL_RollPivot",
    rearRightRollPivot: "AR_Wheel_RR_RollPivot",
  },

  engine: {
    mechanism: "AR_ENGINE_MECHANISM",
    crankshaft: "AR_ENGINE_CRANKSHAFT_PIVOT",

    piston1: "AR_ENGINE_PISTON_1_SLIDER",
    rod1: "AR_ENGINE_ROD_1_PIVOT",

    piston2: "AR_ENGINE_PISTON_2_SLIDER",
    rod2: "AR_ENGINE_ROD_2_PIVOT",

    piston3: "AR_ENGINE_PISTON_3_SLIDER",
    rod3: "AR_ENGINE_ROD_3_PIVOT",

    piston4: "AR_ENGINE_PISTON_4_SLIDER",
    rod4: "AR_ENGINE_ROD_4_PIVOT",
  },

  hybrid: {
    generator: "AR_Hybrid_Generator",
    inverter: "AR_Hybrid_Inverter",
    electricMotor: "AR_Hybrid_ElectricMotor",

    // Actual GLB node.
    // Legacy contract name AR_Hybrid_Battery is NOT used.
    battery: "car_battery",

    busCable: "AR_Hybrid_BusCable",
  },

  energy: {
    engineOutput: "AR_ENERGY_ENGINE_OUTPUT",

    generatorInput: "AR_ENERGY_GENERATOR_INPUT",
    generatorOutput: "AR_ENERGY_GENERATOR_OUTPUT",

    inverterInput: "AR_ENERGY_INVERTER_INPUT",
    inverterOutput: "AR_ENERGY_INVERTER_OUTPUT",

    motorInput: "AR_ENERGY_MOTOR_INPUT",
    motorOutput: "AR_ENERGY_MOTOR_OUTPUT",

    batteryInput: "AR_ENERGY_BATTERY_INPUT",
    batteryOutput: "AR_ENERGY_BATTERY_OUTPUT",
  },
} as const;

export type CarNodeRegistry = {
  wheels: {
    frontLeftSteeringPivot: Object3D;
    frontLeftRollPivot: Object3D;

    frontRightSteeringPivot: Object3D;
    frontRightRollPivot: Object3D;

    rearLeftRollPivot: Object3D;
    rearRightRollPivot: Object3D;
  };

  engine: {
    mechanism: Object3D;
    crankshaft: Object3D;

    piston1: Object3D;
    rod1: Object3D;

    piston2: Object3D;
    rod2: Object3D;

    piston3: Object3D;
    rod3: Object3D;

    piston4: Object3D;
    rod4: Object3D;
  };

  hybrid: {
    generator: Object3D;
    inverter: Object3D;
    electricMotor: Object3D;
    battery: Object3D;
    busCable: Object3D;
  };

  energy: {
    engineOutput: Object3D;

    generatorInput: Object3D;
    generatorOutput: Object3D;

    inverterInput: Object3D;
    inverterOutput: Object3D;

    motorInput: Object3D;
    motorOutput: Object3D;

    batteryInput: Object3D;
    batteryOutput: Object3D;
  };
};

function getRequiredNode(
  root: Object3D,
  nodeName: string,
): Object3D {
  const node = root.getObjectByName(nodeName);

  if (!node) {
    throw new Error(
      `[VELOTHERM] Required GLB node not found: ${nodeName}`,
    );
  }

  return node;
}

export function createCarNodeRegistry(
  root: Object3D,
): CarNodeRegistry {
  return {
    wheels: {
      frontLeftSteeringPivot: getRequiredNode(
        root,
        CAR_NODE_NAMES.wheels.frontLeftSteeringPivot,
      ),
      frontLeftRollPivot: getRequiredNode(
        root,
        CAR_NODE_NAMES.wheels.frontLeftRollPivot,
      ),

      frontRightSteeringPivot: getRequiredNode(
        root,
        CAR_NODE_NAMES.wheels.frontRightSteeringPivot,
      ),
      frontRightRollPivot: getRequiredNode(
        root,
        CAR_NODE_NAMES.wheels.frontRightRollPivot,
      ),

      rearLeftRollPivot: getRequiredNode(
        root,
        CAR_NODE_NAMES.wheels.rearLeftRollPivot,
      ),
      rearRightRollPivot: getRequiredNode(
        root,
        CAR_NODE_NAMES.wheels.rearRightRollPivot,
      ),
    },

    engine: {
      mechanism: getRequiredNode(
        root,
        CAR_NODE_NAMES.engine.mechanism,
      ),
      crankshaft: getRequiredNode(
        root,
        CAR_NODE_NAMES.engine.crankshaft,
      ),

      piston1: getRequiredNode(
        root,
        CAR_NODE_NAMES.engine.piston1,
      ),
      rod1: getRequiredNode(
        root,
        CAR_NODE_NAMES.engine.rod1,
      ),

      piston2: getRequiredNode(
        root,
        CAR_NODE_NAMES.engine.piston2,
      ),
      rod2: getRequiredNode(
        root,
        CAR_NODE_NAMES.engine.rod2,
      ),

      piston3: getRequiredNode(
        root,
        CAR_NODE_NAMES.engine.piston3,
      ),
      rod3: getRequiredNode(
        root,
        CAR_NODE_NAMES.engine.rod3,
      ),

      piston4: getRequiredNode(
        root,
        CAR_NODE_NAMES.engine.piston4,
      ),
      rod4: getRequiredNode(
        root,
        CAR_NODE_NAMES.engine.rod4,
      ),
    },

    hybrid: {
      generator: getRequiredNode(
        root,
        CAR_NODE_NAMES.hybrid.generator,
      ),
      inverter: getRequiredNode(
        root,
        CAR_NODE_NAMES.hybrid.inverter,
      ),
      electricMotor: getRequiredNode(
        root,
        CAR_NODE_NAMES.hybrid.electricMotor,
      ),
      battery: getRequiredNode(
        root,
        CAR_NODE_NAMES.hybrid.battery,
      ),
      busCable: getRequiredNode(
        root,
        CAR_NODE_NAMES.hybrid.busCable,
      ),
    },

    energy: {
      engineOutput: getRequiredNode(
        root,
        CAR_NODE_NAMES.energy.engineOutput,
      ),

      generatorInput: getRequiredNode(
        root,
        CAR_NODE_NAMES.energy.generatorInput,
      ),
      generatorOutput: getRequiredNode(
        root,
        CAR_NODE_NAMES.energy.generatorOutput,
      ),

      inverterInput: getRequiredNode(
        root,
        CAR_NODE_NAMES.energy.inverterInput,
      ),
      inverterOutput: getRequiredNode(
        root,
        CAR_NODE_NAMES.energy.inverterOutput,
      ),

      motorInput: getRequiredNode(
        root,
        CAR_NODE_NAMES.energy.motorInput,
      ),
      motorOutput: getRequiredNode(
        root,
        CAR_NODE_NAMES.energy.motorOutput,
      ),

      batteryInput: getRequiredNode(
        root,
        CAR_NODE_NAMES.energy.batteryInput,
      ),
      batteryOutput: getRequiredNode(
        root,
        CAR_NODE_NAMES.energy.batteryOutput,
      ),
    },
  };
}