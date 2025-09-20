var module = new Module("SomeY", true, true, ModuleCategory.MOVEMENT);
var shouldTick = true;

var ifScaffold = new StateSetting("WithScaffold(Test)", false);
var lowhop= new StateSetting("LowHop", false);
var speed = new SliderSetting("SomeY", [0.30, 0, 5.0, 0.01]);
var speedmode = new ModeSetting("SpeedMode", ["Strafe"]);
var testivar = -10

module.addSettings([speedmode, speed, lowhop, ifScaffold]);

module.setOnToggleListener((view, a) => {
i = 0
})

i = 0

speedmode.setOnModeSelectedListener((view, a) => {
if (speedmode.getCurrentMode() == "Strafe") {
speed.setVisibility(true);
}
});

var time = 0


function onLevelTick() {
//Bhop
if (!ifScaffold.isActive()) {
    if (module.isActive("SomeY") &&  speedmode != null && Module.isActive("Flight+") == false && Module.isActive("Flight") == false && Module.isActive("AirJump") == false) {
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
    

    
//Mode Speed
switch (speedmode.getCurrentMode()) {
    case "Strafe": 
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
    break;
    
}

//LowHop
if (lowhop.isActive()) {
   if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
   if (!LocalPlayer.isFalling()) {
    LocalPlayer.setVelocityY(-0.001);
    }
    }
    if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
    if (!LocalPlayer.isFalling()) {
    LocalPlayer.setVelocityY(-0.001);
    }
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
     if (!LocalPlayer.isFalling()) {
    LocalPlayer.setVelocityY(-0.001);
    }
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
    if (!LocalPlayer.isFalling()) {
    LocalPlayer.setVelocityY(-0.001);
    }
    }
}
    }
    if (module.isActive("SomeY") && LocalPlayer.isFalling()) {
    i += 1;
    if (i >= (20)) {
        i = 0;
        LocalPlayer.setVelocityY(0.001);
         i = 0;
    }
    }
}


if (ifScaffold.isActive()) {
    if (module.isActive("SomeY") &&  speedmode != null && Module.isActive("Flight+") == false && Module.isActive("Flight") == false && Module.isActive("AirJump") == false) {
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
    

    
//Mode Speed
switch (speedmode.getCurrentMode()) {
    case "Strafe": 
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
    break;
     
}

//LowHop
if (lowhop.isActive()) {
   if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
   if (!LocalPlayer.isFalling()) {
    LocalPlayer.setVelocityY(-0.001);
    }
    }
    if  (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
    if (!LocalPlayer.isFalling()) {
    LocalPlayer.setVelocityY(-0.001);
    }
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
     if (!LocalPlayer.isFalling()) {
    LocalPlayer.setVelocityY(-0.001);
    }
    }
    if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
    if (!LocalPlayer.isFalling()) {
    LocalPlayer.setVelocityY(-0.001);
    }
    }
}
    }
}
    if (module.isActive("SomeY") && LocalPlayer.isFalling()) {
    i += 1;
    if (i >= (20)) {
        i = 0;
        LocalPlayer.setVelocityY(0.001);
         i = 0;
    }
    }
}

let timer = 0; 
let view = undefined; 
let color = android.graphics.Color.HSVToColor([Math.ceil((java.lang.System.currentTimeMillis()) / 20) % 360, 100, 100]); 

module.setOnClickListener(function(view2) { 
    view = view2; 
}); 

function onFastTick() { 
    timer++; 
    if (!module.isActive() || timer < 50 ||  view == undefined) { return; }  // последняя проверка обязательно нужна
    timer = 0; 
    color = android.graphics.Color.HSVToColor([Math.ceil((java.lang.System.currentTimeMillis()) / 20) % 360, 100, 100]);  // 🌈
    view.setTextColor(color); 
    view.setShadowLayer(45, 0, 0, color);  // ЖЕЛАТЕЛЬНО НИЧЕГО НЕ МЕНЯТЬ!!! если поставить радиус слишком большой, то "тень" не вылезет за пределы TextView, будет выглядеть некрасиво!!!!!
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}