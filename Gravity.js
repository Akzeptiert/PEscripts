// Gravity
// v1.0
// By TriggerTrash

var gravityModule = new Module("Gravity", true, false, ModuleCategory.MOVEMENT);

var isEngineActive = false;
var isClassicFlight = false;
var wasOnGround = true;

var settings = {
    jumpMultiplier: 1.0,
    gravity: 0.08,
    flightSpeed: 1.5
};

var OFFSETS = {
    VELOCITY_Y: 0x70,
    NO_GRAVITY: 0x56C
};
var NATIVE_GRAVITY = 0.08;

var engineToggle = new StateSetting("Включить", false);
var flightModeToggle = new StateSetting("Полет", false);
var flightSpeedSlider = new SliderSetting("Скорость Полета", [settings.flightSpeed, 1.0, 10.0, 0.5]);
var jumpSlider = new SliderSetting("Множитель Прыжка", [settings.jumpMultiplier, 1.0, 20.0, 0.5]);
var gravityField = new TextFieldSetting("Сила Гравитации", "0.08 = Default", settings.gravity.toString());
var applyGravityButton = new ButtonSetting("Применить", function() {
    var newGravity = parseFloat(gravityField.getText());
    if (!isNaN(newGravity)) {
        settings.gravity = newGravity;
        Level.displayClientMessage("§aГравитация установлена на: §f" + settings.gravity);
    } else {
        Level.displayClientMessage("§cНеверное число!");
    }
});

gravityModule.addSettings([
    engineToggle,
    flightModeToggle,
    flightSpeedSlider,
    jumpSlider,
    gravityField,
    applyGravityButton
]);

function onScriptEnabled() {
    ModuleManager.addModule(gravityModule);
    
    Setting.setVisibility("Gravity", "Полет", false);
    Setting.setVisibility("Gravity", "Скорость Полета", false);
    Setting.setVisibility("Gravity", "Множитель Прыжка", false);
    Setting.setVisibility("Gravity", "Сила Гравитации", false);
    Setting.setVisibility("Gravity", "Применить", false);

    engineToggle.setOnStateToggleListener(function(state) {
        isEngineActive = state;
        Setting.setVisibility("Gravity", "Полет", state);
        if (!state) {
            Setting.setVisibility("Gravity", "Скорость Полета", false);
            Setting.setVisibility("Gravity", "Множитель Прыжка", false);
            Setting.setVisibility("Gravity", "Сила Гравитации", false);
            Setting.setVisibility("Gravity", "Применить", false);
 
            isClassicFlight = false; 
            
            restoreGravity();
        } else {
             updateUIVisibility();
        }
    });

    flightModeToggle.setOnStateToggleListener(function(state) {
        isClassicFlight = state;
        if (!state) restoreGravity(); 
        updateUIVisibility();
    });

    flightSpeedSlider.setOnCurrentValueChangedListener(function(v) { settings.flightSpeed = v; });
    jumpSlider.setOnCurrentValueChangedListener(function(v) { settings.jumpMultiplier = v; });
    
    Level.displayClientMessage("§aGravity загружен. Спасибо за скачивание моего скрипта <3 - §7TriggerTrash");
}

function updateUIVisibility() {
    Setting.setVisibility("Gravity", "Скорость Полета", isClassicFlight);
    Setting.setVisibility("Gravity", "Множитель Прыжка", !isClassicFlight);
    Setting.setVisibility("Gravity", "Сила Гравитации", !isClassicFlight);
    Setting.setVisibility("Gravity", "Применить", !isClassicFlight);
}

function onLevelTick() {
    if (!LocalPlayer.isInGame() || !isEngineActive) return;
    
    var isOnGroundNow = LocalPlayer.isOnGround();

    try {
        var playerAddr = Memory.getLocalPlayer();
        if (!playerAddr) return;
        
        if (isClassicFlight) {
            Memory.setBoolean(playerAddr, OFFSETS.NO_GRAVITY, true);
            
            var speed = 0.5 * settings.flightSpeed;
            var velY = 0;
            if (LocalPlayer.isMoveButtonPressed(MoveButton.JUMP)) velY = speed;
            else if (LocalPlayer.isMoveButtonPressed(MoveButton.SHIFT)) velY = -speed;
            
            if (velY < 0) {
                var pX=Math.floor(LocalPlayer.getPositionX()), pY=Math.floor(LocalPlayer.getPositionY()), pZ=Math.floor(LocalPlayer.getPositionZ());
                for (var i = 1; i <= 4; i++) {
                    if (Block.isSolid(Block.getID(pX, pY - i, pZ))) {
                        LocalPlayer.setOnGround(true);
                        break; 
                    }
                }
            }
            LocalPlayer.setVelocityY(velY);
            if (LocalPlayer.isMovingForward()) {
                 var yaw=LocalPlayer.getYaw(), pitch=LocalPlayer.getPitch();
                 LocalPlayer.setVelocityX(-Math.sin(yaw/180*Math.PI)*Math.cos(pitch/180*Math.PI)*speed);
                 LocalPlayer.setVelocityZ(Math.cos(yaw/180*Math.PI)*Math.cos(pitch/180*Math.PI)*speed);
            }
        } else {
            var currentVelY = Memory.getFloat(playerAddr, OFFSETS.VELOCITY_Y);
            if (wasOnGround && !isOnGroundNow && currentVelY > 0) {
                Memory.setFloat(playerAddr, OFFSETS.VELOCITY_Y, currentVelY * settings.jumpMultiplier);
                currentVelY = Memory.getFloat(playerAddr, OFFSETS.VELOCITY_Y);
            }
            if (!isOnGroundNow) {
                var gravityCorrection = NATIVE_GRAVITY - settings.gravity;
                var newVelY = currentVelY + gravityCorrection;
                Memory.setFloat(playerAddr, OFFSETS.VELOCITY_Y, newVelY);
            }
        }
    } catch(e) {}
    
    wasOnGround = isOnGroundNow;
}

function restoreGravity() {
    if (!LocalPlayer.isInGame()) return;
    try {
        var p = Memory.getLocalPlayer();
        if (p) Memory.setBoolean(p, OFFSETS.NO_GRAVITY, false);
    } catch(e) {}
}

function onScriptDisabled() {
    restoreGravity();
    if (gravityModule) {
        ModuleManager.removeModule(gravityModule);
    }
}