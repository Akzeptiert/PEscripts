/*
  ╔══════════════════════════════════════╗
  ║           Auto-WTap Module           ║
  ╠══════════════════════════════════════╣
  ║ Author:    Zeld                      ║
  ║ Version:   1.0                       ║
  ║ Description:                         ║
  ║   Скрипт для автоматического         ║
  ║   наведения.  ║
  ║                                      ║
  ║ Telegram Channel:                    ║
  ║   tg:@zeld_script                    ║
  ╚══════════════════════════════════════╝
*/

var module = new Module("Auto-WTap", true, true, ModuleCategory.COMBAT);

const aimbotRadius = new SliderSetting("Aimbot radius", [10, 0, 20, 1]);
const attackRadius = new SliderSetting("Attack radius", [6, 0, 7, 1]);  
const cps = new SliderSetting("CPS", [10, 1, 20, 2]);
const aimbotSpeed = new ModeSetting("Aimbot speed", ["Normal", "Slow"]); 
const aimbotSensitivity = new SliderSetting("Aimbot Sensitivity", [0.1, 0.1, 1, 0.1]);
const fodba = new StateSetting("AutoFodba", false);    

let target = -1;     
let timer = 0;

function onLevelTick() {
  if (!module.isActive()) {
    return;
  }
   
  target = LocalPlayer.getNearestPlayer(aimbotRadius.getCurrentValue());
  
  let speed = aimbotSensitivity.getCurrentValue();

  if (aimbotSpeed.getCurrentMode() == "Slow") {
    speed *= 0.9;
  }

  if (target != null) {
    LocalPlayer.smoothLookAt(target, speed);
  }
   
  let target1 = LocalPlayer.getNearestPlayer(attackRadius.getCurrentValue());
   
  timer += cps.getCurrentValue() / 20;
  if (timer >= 1) {
    timer -= 1; 
    LocalPlayer.attack(target1);
  }  
}

function onScriptEnabled() {
  module.addSettings([aimbotRadius, aimbotSpeed, attackRadius, cps, aimbotSensitivity, fodba]);
  ModuleManager.addModule(module);
}

function onScriptDisabled() {
  ModuleManager.removeModule(module); 
}