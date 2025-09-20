const module = new Module("GroundSpeed", true, true, ModuleCategory.MOVEMENT);
const speedSlider = new SliderSetting("Speed", [1.0, 0.1, 10.0, 0.1]);
const mode = new ModeSetting("Mode", ["Ground"]);

module.addSettings([speedSlider, mode]);

module.setOnToggleListener((view, active) => {
    if (!active) {
        LocalPlayer.setVelocity(0, 0, 0);
    }
});

mode.setOnModeSelectedListener((view, mode) => {
});

function onLevelTick() {
    if (!module.isActive()) return;
    
    const speedValue = speedSlider.getCurrentValue();
    const isOnGround = LocalPlayer.isOnGround();

    switch (mode.getCurrentMode()) {
        case "Ground":
            if (isOnGround) {
                const yaw = LocalPlayer.getYaw();
                let baseSpeed = speedValue;

                if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                    LocalPlayer.setVelocityX(-baseSpeed * Math.sin(yaw * Math.PI / 180));
                    LocalPlayer.setVelocityZ(baseSpeed * Math.cos(yaw * Math.PI / 180));
                }
                if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                    LocalPlayer.setVelocityX(baseSpeed * Math.sin(yaw * Math.PI / 180));
                    LocalPlayer.setVelocityZ(-baseSpeed * Math.cos(yaw * Math.PI / 180));
                }
                if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                    LocalPlayer.setVelocityX(-baseSpeed * Math.cos(yaw * Math.PI / 180));
                    LocalPlayer.setVelocityZ(baseSpeed * Math.sin(yaw * Math.PI / 180));
                }
                if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                    LocalPlayer.setVelocityX(baseSpeed * Math.cos(yaw * Math.PI / 180));
                    LocalPlayer.setVelocityZ(-baseSpeed * Math.sin(yaw * Math.PI / 180));
                }
            }
            break;
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}

onScriptEnabled();