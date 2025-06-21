var module = new Module("BatterSpeed", true, true, ModuleCategory.MOVEMENT);
var shouldTick = true;

var fall = new StateSetting("TypeFalling", false);
var ifScaffold = new StateSetting("WithScaffold(Test)", false);
var strafe = new StateSetting("Strafe", true);
var speed = new SliderSetting("BatterSpeed", [0.30, 0, 5.0, 0.01]);
var qi = new SliderSetting("test", [0.30, 0, 5.0, 0.01]);
const mode = new ModeSetting("Mode", ["Mode1 (-0.2)", "Mode2 (-0.4)", "Mode3 (-0.6)", "Mode4 (-0.8)", "Mode5 (-1)", "Mode6"]);

module.addSettings([strafe, fall, mode, speed, ifScaffold]);

strafe.setOnStateToggleListener((view, a) => {
if (strafe.isActive()) {
speed.setVisibility(true);
}
if (!strafe.isActive()) {
speed.setVisibility(false);
}
});
fall.setOnStateToggleListener((view, a) => {
if (fall.isActive()) {
mode.setVisibility(true);
}
if (!fall.isActive()) {
mode.setVisibility(false);
}
});
var time = 0

module.setOnToggleListener((view, a) => { time = 0; });

function onLevelTick() {
//Bhop
    if (Module.isActive("AirJump")) { return; }
    if (module.isActive("BatterSpeed")) {
    if (LocalPlayer.isOnGround()) {
    if (!module.isActive() && !shouldTick) { return }
    shouldTick = shouldTick;
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
    
    if (Module.isActive("Scaffold")) {
    if (!module.isActive() && !shouldTick) { return }
    shouldTick = shouldTick;
    if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
    !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
    !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
    !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
    !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.JUMP)) {
    !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
    }
    }
    
//Speed(Strafe true)
if (strafe.isActive()) {
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

//Speed(Strafe false)
if (!strafe.isActive() && LocalPlayer.isOnGround()) {
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
//If Scaffold
if (Module.isActive("BatterSpeed") && Module.isActive("Scaffold") && !Module.isActive("AirJump") && ifScaffold.isActive()) {
       if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
       !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP);
       LocalPlayer.setVelocityY(-6);
       }
       if  (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
       !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP);
       LocalPlayer.setVelocityY(-6);
       }
       if  (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
       !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP);
       LocalPlayer.setVelocityY(-6);
       }
       if  (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
       !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP);
       LocalPlayer.setVelocityY(-6);
       }
}
if (Module.isActive("BatterSpeed") && Module.isActive("Scaffold") && !Module.isActive("AirJump") && ifScaffold.isActive() && LocalPlayer.isOnGround()) {
       if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
       !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP);
       LocalPlayer.setVelocityY(0);
       }
       if  (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
       !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP);
       LocalPlayer.setVelocityY(0);
       }
       if  (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
       !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP);
       LocalPlayer.setVelocityY(0);
       }
       if  (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
       !LocalPlayer.setMoveButtonStatus(MoveButton.JUMP);
       LocalPlayer.setVelocityY(0);
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