const Utils = {
        speed_strafe1: 1,
        speed_strafe2: 0.5,
        speed_strafe: 0,
        tick_time: 0,
        i: 0,
};

var module = new Module("spin", true, true, ModuleCategory.MOVEMENT);
var slider = new SliderSetting("radius", [1, 0, 5, 1]);
var slider1 = new SliderSetting("RadiusSpin", [1, 0, 5, 1]);
var slider2 = new SliderSetting("Speed", [0.1, 0, 2, 0.1]);

module.addSettings([slider, slider1, slider2]);

let radius = slider1.getCurrentValue();

function onLevelTick() {
    if (Module.isActive("spin")) {
                if (Utils.i >= 0.5) {
                        if (Utils.speed_strafe != Utils.speed_strafe2) Utils.speed_strafe = Utils.speed_strafe2;
                        else Utils.speed_strafe = Utils.speed_strafe1;
                        Utils.i = 0;
                }
               else Utils.i += 1;
   var target = LocalPlayer.getNearestPlayer(slider.getCurrentValue()); 
  if (target > 1) {
    
        let dx = Math.floor(Player.getPositionX(target));
        let dy = Math.floor(Player.getPositionY(target));
        let dz = Math.floor(Player.getPositionZ(target));
           var yaw_strafe = LocalPlayer.getYaw();
    let newX = dx + (radius * Math.cos(yaw_strafe));
    let newZ = dz + (radius * Math.sin(yaw_strafe));
    let newY = dy // ту 
        let l = newY + (Utils.speed_strafe);
      
      LocalPlayer.setPosition(newX, l, newZ);
        // Увеличиваем угол вращения
    yaw_strafe += slider2.getCurrentValue(); // можно настроить скорость вращения (для примера установим 0.1)

    // Проверяем, если угол становится больше 2π, то сбрасываем его
    if (yaw_strafe >= 2 * Math.PI) {
        yaw_strafe = 0;
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