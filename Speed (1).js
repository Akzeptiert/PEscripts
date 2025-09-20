var module = new Module("Speed", true, true, ModuleCategory.MOVEMENT);
var mode = new ModeSetting("Mode", ["Vanilla", "Breadix", "Ground", "StrafeLess", ]);
var speed = new SliderSetting("Speed", [0.30, 0, 5.0, 0.01]);
var speed1 = new SliderSetting("GroundStrafe", [0.35, 0, 5.0, 0.01]);
var speed2 = new SliderSetting("GroundSpeed", [0.19, 0, 5.0, 0.01]);
var speed3 = new SliderSetting("StrafeSpeed", [0.35, 0, 5.0, 0.01]);
module.addSettings([mode, speed, speed1, speed2, speed3]);
mode.setOnModeSelectedListener((view, a) => {
      if (mode.getCurrentMode() == "Vanilla") {
            speed1.setVisibility(false);
            speed.setVisibility(true);
            speed2.setVisibility(false);
            speed3.setVisibility(false);
      }
      if (mode.getCurrentMode() == "Breadix") {
            speed.setVisibility(false);
            speed1.setVisibility(true);
            speed2.setVisibility(false);
            speed3.setVisibility(false);
      }
      if (mode.getCurrentMode() == "Ground") {
            speed1.setVisibility(false);
            speed.setVisibility(false);
            speed2.setVisibility(true);
            speed3.setVisibility(false);
      }
      if (mode.getCurrentMode() == "StrafeLess") {
            speed1.setVisibility(false);
            speed.setVisibility(false);
            speed3.setVisibility(true);
            speed2.setVisibility(false);
      }
});
//计时器
module.setOnToggleListener((view, a) => {
      i = 0
})

i = 0


function onLevelTick() {
      if (module.isActive()) {
//fullstop
            if (!LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP) && LocalPlayer.isOnGround()) {
                  LocalPlayer.setVelocityX(0);
                  LocalPlayer.setVelocityZ(0);
            } else {
                  if (!LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT) && !LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT) && !LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP) && !LocalPlayer.isMoveButtonPressed(MoveButton.BACK) && !LocalPlayer.isOnGround()) {
                        LocalPlayer.setVelocityX(0);
                        LocalPlayer.setVelocityZ(0);
                  }
            }
//vanilla
            switch (mode.getCurrentMode()) {
                  case "Vanilla":
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
                        var yaw_strafe = LocalPlayer.getYaw();
                        if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {   LocalPlayer.setVelocityX(-speed.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                        }
                        if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {   LocalPlayer.setVelocityX(speed.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(-speed.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                        }
                        if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP)) {   LocalPlayer.setVelocityX(-speed.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                        }
                        if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {   LocalPlayer.setVelocityZ(speed.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityX(speed.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                        }
                        if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP)) {   LocalPlayer.setVelocityX(-speed.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                        }
                        if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {   LocalPlayer.setVelocityZ(-speed.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityX(-speed.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                        }
//Breadix   
                        break;
                  case "Breadix":
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
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.JUMP)) {
                                    var yaw_strafe = LocalPlayer.getYaw();
                                    if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {   LocalPlayer.setVelocityX(-speed1.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed1.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                                    if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {   LocalPlayer.setVelocityX(speed1.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(-speed1.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                                    if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP)) {   LocalPlayer.setVelocityX(-speed1.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed1.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                                    if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {   LocalPlayer.setVelocityZ(speed1.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityX(speed1.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                                    if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP)) {   LocalPlayer.setVelocityX(-speed1.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed1.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                                    if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {   LocalPlayer.setVelocityZ(-speed1.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityX(-speed1.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                              }
                        }
                        i += 1;
                        if (i >= 7) {
                              i = 0;
                              var yaw_strafe = LocalPlayer.getYaw();
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {   LocalPlayer.setVelocityX(-0.31 * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(0.31 * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                              if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {   LocalPlayer.setVelocityX(0.31 * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(-0.31 * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP)) {   LocalPlayer.setVelocityX(-0.31 * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(0.31 * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {   LocalPlayer.setVelocityZ(0.31 * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityX(0.31 * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP)) {   LocalPlayer.setVelocityX(-0.31 * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(0.31 * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {   LocalPlayer.setVelocityZ(-0.31 * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityX(-0.31 * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                              i = 0;
                        }
//Ground
                        break;
                  case "Ground":
                        if (LocalPlayer.isOnGround()) {
                              LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, false);
                              var yaw_strafe = LocalPlayer.getYaw();
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {   LocalPlayer.setVelocityX(-speed2.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed2.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                              if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {   LocalPlayer.setVelocityX(speed2.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(-speed2.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP)) {   LocalPlayer.setVelocityX(-speed2.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed2.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {   LocalPlayer.setVelocityZ(speed2.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityX(speed2.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP)) {   LocalPlayer.setVelocityX(-speed2.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed2.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {   LocalPlayer.setVelocityZ(-speed2.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityX(-speed2.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                              }
                        }
//StrafeLess
                        break;
                  case "StrafeLess":
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
                              if (LocalPlayer.isMoveButtonPressed(MoveButton.JUMP)) {
                                    var yaw_strafe = LocalPlayer.getYaw();
                                    if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {   LocalPlayer.setVelocityX(-speed3.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed3.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                                    if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {   LocalPlayer.setVelocityX(speed.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(-speed.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                                    if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT_TOP)) {   LocalPlayer.setVelocityX(-speed3.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed3.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                                    if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {   LocalPlayer.setVelocityZ(speed3.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityX(speed3.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                                    if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT_TOP)) {   LocalPlayer.setVelocityX(-speed3.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityZ(speed3.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                                    if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {   LocalPlayer.setVelocityZ(-speed3.getCurrentValue() * Math.sin(yaw_strafe / 180 * Math.PI));   LocalPlayer.setVelocityX(-speed3.getCurrentValue() * Math.cos(yaw_strafe / 180 * Math.PI));
                                    }
                              }
                        }
                        break;
            }
      }
}

function onScriptEnabled() {
      ModuleManager.addModule(module);
}

function onScriptDisabled() {
      ModuleManager.removeModule(module);
}