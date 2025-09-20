//breadix参数默认;Breadix config default;Параметры Breadix
var module = new Module("SpeedHop", true, true, ModuleCategory.MOVEMENT);
var slider = new SliderSetting("JumpSpeed", [0.28, 0, 5.0, 0.01]);
const slider1 = new SliderSetting("FallSpeed", [0.90, 0, 6.0, 0.01]);
const s = new SliderSetting("TestDelay", [2, 0, 50, 1]);
module.addSettings([slider, slider1, s]);
module.setOnToggleListener((view, a) => {
      i = 0
})

i = 0

function onLevelTick() {
      if (module.isActive("SpeedHop")) {
            if (!LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP) && LocalPlayer.isOnGround()) {
                  LocalPlayer.setVelocityX(0);
                  LocalPlayer.setVelocityZ(0);
            } else {
                  if (!LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isOnGround()) {
                        LocalPlayer.setVelocityX(0);
                        LocalPlayer.setVelocityZ(0);
                  }
            }
            if (!LocalPlayer.isOnGround()) {
                  i += 1;
                  if (i >= s.getCurrentValue()) {
                        i = 0;
                        if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                              LocalPlayer.setVelocityY(-slider1.getCurrentValue());
                              LocalPlayer.setSprinting(true)
                              i = 0;
                        }
                  }
            }
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
                  if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP)) {
                        LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
                  }
                  if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP)) {
                        LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
                  }
                  if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                        LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, !LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));
                  }
            }
            if (LocalPlayer.isOnGround()) {
                  var yaw_strafe = LocalPlayer.getYaw();
                  if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
                        if (LocalPlayer.isMoveButtonPressed(MoveButton.JUMP)) {
                              LocalPlayer.setVelocityX(-slider.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));
                              LocalPlayer.setVelocityZ(slider.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                        }
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