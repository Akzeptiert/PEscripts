var Utils = {
    speed: 1.0,
    maxSpeed: 2.0,
    acceleration: 0.05,
    deceleration: 0.05,
    accelerationTimer: 0,
    decelerationTimer: 0,
    accelerationInterval: 20,
    decelerationInterval: 20
};

var Module = new Module("SpeedControl", true, true, ModuleCategory.MOVEMENT);

Module.setOnToggleListener((view, active) => {
    if (active) {
        Utils.speed = 1.0;
    }
});

var speedMode = new ModeSetting("SpeedMode", ["ConstantSpeed", "Accelerate"]);
var speedRate = new SliderSetting("SpeedRate", [0.05, 0.01, 1.0, 0.01]);

Module.addSettings([speedMode, speedRate]);

function onLevelTick() {
    if (Module.isActive("SpeedControl")) {
        if (speedMode.getCurrentMode() === "Accelerate") {
            if (Utils.accelerationTimer >= Utils.accelerationInterval) {
                Utils.speed += Utils.acceleration * speedRate.getCurrentValue();
                Utils.accelerationTimer = 0;
            } else {
                Utils.accelerationTimer += 1;
            }
        } else {
            if (Utils.decelerationTimer >= Utils.decelerationInterval) {
                Utils.speed -= Utils.deceleration * speedRate.getCurrentValue();
                Utils.decelerationTimer = 0;
            } else {
                Utils.decelerationTimer += 1;
            }
        }
        Utils.speed = Math.min(Utils.maxSpeed, Utils.speed);

        LocalPlayer.setVelocityX(LocalPlayer.getVelocityX() * Utils.speed);
        LocalPlayer.setVelocityZ(LocalPlayer.getVelocityZ() * Utils.speed);
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(Module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(Module);
}

onScriptEnabled();
onScriptDisabled();
