var module = new Module("LongJumpFix", true, true, ModuleCategory.MOVEMENT);
var fall = new StateSetting("TypeFalling", false);
var speed = new SliderSetting("LongJumpFix", [0.30, 0, 5.0, 0.01]);
const mode = new ModeSetting("Mode", ["Mode1 (-0.2)", "Mode2 (-0.4)", "Mode3 (-0.6)", "Mode4 (-0.8)", "Mode5 (-1)", "Mode6"]);

module.addSettings([fall, mode, speed,]);

fall.setOnStateToggleListener((view, a) => {
if (fall.isActive()) {
mode.setVisibility(true);
}
if (!fall.isActive()) {
mode.setVisibility(false);
}
});
var time = 0;
let timer = 0;
let preventOnSendPacket = false; 

module.setOnToggleListener((view, a) => { time = 0; });

function onLevelTick() {
     if (LocalPlayer.isMoveButtonPressed(MoveButton.JUMP)) {
    if (Module.isActive("AirJump")) { return; }
    if (module.isActive("LongJumpFix")) {
    
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

if (LocalPlayer.isOnGround()) {
    var yaw_strafe = LocalPlayer.getYaw();
     if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
         LocalPlayer.setVelocityX(-0.29 * Math.sin(yaw_strafe / 180 * Math.PI));
         LocalPlayer.setVelocityZ(0.29 * Math.cos(yaw_strafe / 180 * Math.PI));
     }
     if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
         LocalPlayer.setVelocityX(0.29 * Math.sin(yaw_strafe / 180 * Math.PI));
         LocalPlayer.setVelocityZ(-0.29 * Math.cos(yaw_strafe / 180 * Math.PI));
     }
     if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
         LocalPlayer.setVelocityZ(0.29 * Math.sin(yaw_strafe / 180 * Math.PI));
         LocalPlayer.setVelocityX(0.29 * Math.cos(yaw_strafe / 180 * Math.PI));
     }
     if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
         LocalPlayer.setVelocityZ(-0.29 * Math.sin(yaw_strafe / 180 * Math.PI));
         LocalPlayer.setVelocityX(-0.29 * Math.cos(yaw_strafe / 180 * Math.PI));
     }
}
         
//Type falling
        if (module != null && mode != null && module.isActive()) {
            switch (mode.getCurrentMode()) {
                case "Mode1 (-0.2)": 
                if (fall.isActive() && LocalPlayer.isFalling()) {
                    LocalPlayer.setVelocityY(-0.2);
                }
                break;
                case "Mode2 (-0.4)": 
                if (fall.isActive() && LocalPlayer.isFalling()) {
                    LocalPlayer.setVelocityY(-0.4);
                }
                break;
                case "Mode3 (-0.6)": 
                if (fall.isActive() && LocalPlayer.isFalling()) {
                    LocalPlayer.setVelocityY(-0.6);
                }
                break;
                case "Mode4 (-0.8)": 
                if (fall.isActive() && LocalPlayer.isFalling()) {
                    LocalPlayer.setVelocityY(-0.8);
                }
                break;
                case "Mode5 (-1)": 
                if (fall.isActive() && LocalPlayer.isFalling()) {
                    LocalPlayer.setVelocityY(-1);
                }
                break;
                case "Mode6":
                if (fall.isActive()) {
                    LocalPlayer.setVelocityY(-0.3);
                }
                break;
            }
        }
}
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
    mode.setVisibility(false);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}