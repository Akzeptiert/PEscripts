//mode by shurora


var module=new Module("SpeedSiskaPopka",true,true,ModuleCategory.MOVEMENT);var shouldTick=true;var fall=new StateSetting("TypeFalling",false);var speed=new SliderSetting("SiskaPopka",[0.30,0,5.0,0.01]);var lowhop=new StateSetting("LowHop",false);const fallmode=new ModeSetting("Mode",["Mode1 (-0.2)","Mode2 (-0.4)","Mode3 (-0.6)","Mode4 (-0.8)","Mode5 (-1)","Mode6"]);const mode=new ModeSetting("Mode",["Strafe"]);module.addSettings([mode,fall,fallmode,speed,lowhop]);module.setOnToggleListener((view,a)=>{i=0})
i=0
mode.setOnModeSelectedListener((view,a)=>{if(mode.getCurrentMode()=="Strafe"){fall.setVisibility(true);speed.setVisibility(true);fallmode.setVisibility(false);lowhop.setVisibility(true);}});fall.setOnStateToggleListener((view,a)=>{if(fall.isActive()){fallmode.setVisibility(true);}
if(!fall.isActive()){fallmode.setVisibility(false);}});var time=0
function onLevelTick(){if(Module.isActive("AirJump")){return;}
if(module.isActive("SpeedSiskaPopka")){if(LocalPlayer.isOnGround()){if(!module.isActive()&&!shouldTick){return}
shouldTick=shouldTick;if(LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)){LocalPlayer.setMoveButtonStatus(MoveButton.JUMP,!LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));}
if(LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)){LocalPlayer.setMoveButtonStatus(MoveButton.JUMP,!LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));}
if(LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)){LocalPlayer.setMoveButtonStatus(MoveButton.JUMP,!LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));}
if(LocalPlayer.isMoveButtonPressed(MoveButton.BACK)){LocalPlayer.setMoveButtonStatus(MoveButton.JUMP,!LocalPlayer.isMoveButtonPressed(MoveButton.JUMP));}}
switch(mode.getCurrentMode()){case"Strafe":var yaw_strafe=LocalPlayer.getYaw();if(LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)){   LocalPlayer.setVelocityX(-speed.getCurrentValue()*Math.sin(yaw_strafe / 180*Math.PI));   LocalPlayer.setVelocityZ(speed.getCurrentValue()*Math.cos(yaw_strafe / 180*Math.PI));}
if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)){   LocalPlayer.setVelocityX(speed.getCurrentValue()*Math.sin(yaw_strafe / 180*Math.PI));   LocalPlayer.setVelocityZ(-speed.getCurrentValue()*Math.cos(yaw_strafe / 180*Math.PI));}
if(LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)){   LocalPlayer.setVelocityZ(speed.getCurrentValue()*Math.sin(yaw_strafe / 180*Math.PI));   LocalPlayer.setVelocityX(speed.getCurrentValue()*Math.cos(yaw_strafe / 180*Math.PI));}
if(LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)){   LocalPlayer.setVelocityZ(-speed.getCurrentValue()*Math.sin(yaw_strafe / 180*Math.PI));   LocalPlayer.setVelocityX(-speed.getCurrentValue()*Math.cos(yaw_strafe / 180*Math.PI));}
if(LocalPlayer.isOnGround()){if(LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)){   LocalPlayer.setVelocityX(-0.32*Math.sin(yaw_strafe / 180*Math.PI));   LocalPlayer.setVelocityZ(0.32*Math.cos(yaw_strafe / 180*Math.PI));}
if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)){   LocalPlayer.setVelocityX(0.32*Math.sin(yaw_strafe / 180*Math.PI));   LocalPlayer.setVelocityZ(-0.32*Math.cos(yaw_strafe / 180*Math.PI));}
if(LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)){   LocalPlayer.setVelocityZ(0.32*Math.sin(yaw_strafe / 180*Math.PI));   LocalPlayer.setVelocityX(0.32*Math.cos(yaw_strafe / 180*Math.PI));}
if(LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)){   LocalPlayer.setVelocityZ(-0.32*Math.sin(yaw_strafe / 180*Math.PI));   LocalPlayer.setVelocityX(-0.32*Math.cos(yaw_strafe / 180*Math.PI));}}
break;}
if(module!=null&&mode!=null&&module.isActive()){switch(fallmode.getCurrentMode()){case"Mode1 (-0.2)":if(fall.isActive()&&LocalPlayer.isFalling()){LocalPlayer.setVelocityY(-0.2);}
break;case"Mode2 (-0.4)":if(fall.isActive()&&LocalPlayer.isFalling()){LocalPlayer.setVelocityY(-0.4);}
break;case"Mode3 (-0.6)":if(fall.isActive()&&LocalPlayer.isFalling()){LocalPlayer.setVelocityY(-0.6);}
break;case"Mode4 (-0.8)":if(fall.isActive()&&LocalPlayer.isFalling()){LocalPlayer.setVelocityY(-0.8);}
break;case"Mode5 (-1)":if(fall.isActive()&&LocalPlayer.isFalling()){LocalPlayer.setVelocityY(-1);}
break;case"Mode6":if(fall.isActive()){LocalPlayer.setVelocityY(-0.3);}
break;}}
if(lowhop.isActive()){if(LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)){if(!LocalPlayer.isFalling()){LocalPlayer.setVelocityY(-0.001);}}
if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)){if(!LocalPlayer.isFalling()){LocalPlayer.setVelocityY(-0.001);}}
if(LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)){  if(!LocalPlayer.isFalling()){LocalPlayer.setVelocityY(-0.001);}}
if(LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)){if(!LocalPlayer.isFalling()){LocalPlayer.setVelocityY(-0.001);}}}}
if(module.isActive("SpeedSiskaPopka")&&LocalPlayer.isFalling()){i+=1;if(i>=(20)){i=0;LocalPlayer.setVelocityY(0.001);i=0;}}}
function onScriptEnabled(){ModuleManager.addModule(module);}
function onScriptDisabled(){ModuleManager.removeModule(module);}