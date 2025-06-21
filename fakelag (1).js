let timer = 0;
let preventOnSendPacket = false; 

var module = new Module("FakeLag", true, true, ModuleCategory.MOVEMENT);
var slider = new SliderSetting("Speed", [0.1, 0, 5, 0.01]);
var sliderr = new SliderSetting("SpeedOfWalk", [0.05, 0, 1, 0.01]);
var slider1 = new SliderSetting("Time", [10, 0, 100, 1]);
var mode1 = new ModeSetting("Mode", ["Prov"]);
const Pon = new StateSetting("ВРУБАТЬ", true);
module.addSettings([slider, sliderr, slider1, mode1, Pon]);

var shouldTick = true;

module.setOnToggleListener((view, a) => { timer = 0; });

function onLevelTick() {
    if (Module.isActive("FakeLag")) {
        switch (mode1.getCurrentMode()) {
            case "Prov": 
    timer++;
        preventOnSendPacket = false;
          var yaw_strafe = LocalPlayer.getYaw();
    if (timer % slider1.getCurrentValue() === 0) {
        preventOnSendPacket = true; 
            if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
     LocalPlayer.setPositionRelativeX(-slider.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
     LocalPlayer.setPositionRelativeZ(slider.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
     LocalPlayer.setVelocityX(-sliderr.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI))
     LocalPlayer.setVelocityZ(sliderr.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI))
    }
                break;
    }
}
}
                
if (module.isActive("FakeLag") && Pon.isActive()) {
        if (LocalPlayer.isOnGround()) {
            if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {

                    LocalPlayer.setSprinting(true);
                LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP))
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {

        
                    LocalPlayer.setSprinting(true);
                LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP))
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {

        
                    LocalPlayer.setSprinting(true);
                LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP))
            }
            if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                    LocalPlayer.setSprinting(true);
                LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP))
            }
        }
        let yaw = ((LocalPlayer.getYaw() + 90) * Math.PI) / 180;
        LocalPlayer.setVelocityY(Math.imul(yaw) * -0.05);
        LocalPlayer.isOnGround(true)
}
}

module.setOnToggleListener(function() { 
    if (!LocalPlayer.isInGame()) { timer = 0; return; }
});

function onSendPacket() {
    if (!preventOnSendPacket && module.isActive()) { 
         preventDefault();
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}