/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                              ╔═╗┬ ┬┌─┐┬ ┬  ╔╦╗┬ ┬┌─┐┌─┐                      ║
║                              ║╣ ├─┤├┤ ├─┤   ║ ├─┤├─┤├┤                       ║
║                              ╚═╝┴ ┴└─┘┴ ┴   ╩ ┴ ┴┴ ┴└─┘                      ║
║══════════════════════════════════════════════════════════════════════════════║
║ Module:  Auto-WTap                                                           ║
║ Author:  Zeld                                                               ║
║ Version: 1.2                                                                ║
║                                                                              ║
║                                                                              ║
║                                                                              ║
║ Telegram Channel:                                                            ║
║   📢 tg:@zeld_script                                                         ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

var module = new Module("Auto-WTap", true, true, ModuleCategory.COMBAT);

const aimbotRadius = new SliderSetting("Aimbot radius", [10, 0, 20, 1]);
const attackRadius = new SliderSetting("Attack radius", [6, 0, 7, 1]);  
const cps = new SliderSetting("CPS", [10, 1, 20, 2]);
const aimbotSpeed = new ModeSetting("Aimbot speed", ["Normal", "Slow"]); 
const aimbotSensitivity = new SliderSetting("Aimbot Sensitivity", [0.1, 0.1, 1, 0.1]);
const fodba = new StateSetting("AutoFodba", false);
const autoAttack = new StateSetting("Auto Attack", true);

let target = null;     
let timer = 0;

function onLevelTick() {
  if (!module.isActive()) {
    return;
  }
  
  let potentialTarget = LocalPlayer.getNearestPlayer(aimbotRadius.getCurrentValue());
  if (potentialTarget !== null && !Player.isLocalPlayer(potentialTarget) && Player.isAlive(potentialTarget)) {
    target = potentialTarget;
  } else {
    target = null;
  }
  
  if (target !== null) {
    let speed = aimbotSensitivity.getCurrentValue();
    if (aimbotSpeed.getCurrentMode() === "Slow") {
      speed *= 0.9;
    }
    
    LocalPlayer.smoothLookAt(target, speed);
    
    if (autoAttack.isActive()) {
      if (LocalPlayer.getDistanceTo(target) <= attackRadius.getCurrentValue()) {
        timer += cps.getCurrentValue() / 20;
        if (timer >= 1) {
          timer -= 1;
          LocalPlayer.attack(target);
        }
      }
    }
  }
}

function onScriptEnabled() {
  module.addSettings([aimbotRadius, aimbotSpeed, attackRadius, cps, aimbotSensitivity, fodba, autoAttack]);
  ModuleManager.addModule(module);
}

function onScriptDisabled() {
  ModuleManager.removeModule(module); 
}