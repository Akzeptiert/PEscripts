var module = new Module("BatterSpeed", true, true, ModuleCategory.MOVEMENT);
var shouldTick = true;
var speed = new SliderSetting("BatterSpeed", [0.30, 0, 5.0, 0.01]);

module.addSettings([speed]);

function onLevelTick() {
    if (module.isActive("BatterSpeed") && Module.isActive("Flight+") == false && Module.isActive("Flight") == false && Module.isActive("Scaffold") == false && Module.isActive("AirJump") == false) {
    if (LocalPlayer.isOnGround()) {
    if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
    LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
    LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
    LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
    }

    if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
    LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
    }
    }
    var yaw_strafe = LocalPlayer.getYaw();
    if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
        LocalPlayer.setVelocityX(-speed.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
        LocalPlayer.setVelocityZ(speed.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
    }
    if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
        LocalPlayer.setVelocityX(speed.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
        LocalPlayer.setVelocityZ(-speed.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
        LocalPlayer.setVelocityZ(speed.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
        LocalPlayer.setVelocityX(speed.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
        LocalPlayer.setVelocityZ(-speed.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
        LocalPlayer.setVelocityX(-speed.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
    }
    if (LocalPlayer.isOnGround()) {
        if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
             LocalPlayer.setVelocityX(-0.32 * Math.sin(yaw_strafe / 180 * Math.PI));
             LocalPlayer.setVelocityZ(0.32 * Math.cos(yaw_strafe / 180 * Math.PI));
        }
        if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
             LocalPlayer.setVelocityX(0.32 * Math.sin(yaw_strafe / 180 * Math.PI));
             LocalPlayer.setVelocityZ(-0.32 * Math.cos(yaw_strafe / 180 * Math.PI));
        }
        if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
             LocalPlayer.setVelocityZ(0.32 * Math.sin(yaw_strafe / 180 * Math.PI));
             LocalPlayer.setVelocityX(0.32 * Math.cos(yaw_strafe / 180 * Math.PI));
        }
        if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
             LocalPlayer.setVelocityZ(-0.32 * Math.sin(yaw_strafe / 180 * Math.PI));
             LocalPlayer.setVelocityX(-0.32 * Math.cos(yaw_strafe / 180 * Math.PI));
        }
    }
    
}
}




function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}