/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                              ╔═╗┬ ┬┌─┐┬ ┬  ╔╦╗┬ ┬┌─┐┌─┐                      ║
║                              ║╣ ├─┤├┤ ├─┤   ║ ├─┤├─┤├┤                       ║
║                              ╚═╝┴ ┴└─┘┴ ┴   ╩ ┴ ┴┴ ┴└─┘                      ║
║══════════════════════════════════════════════════════════════════════════════║
║ Module:  SingleRightClick                                                           ║
║ Author:  Zeld                                                               ║
║ Version: 1.0                                                                ║
║                                                                              ║
║                                                                              ║
║                                                                              ║
║ Telegram Channel:                                                            ║
║   📢 tg:@zeld_script                                                         ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/


var module = new Module("SingleRightClick", true, true, ModuleCategory.COMBAT);

const cps = new SliderSetting("CPS", [1, 1, 100, 1]);

let timer = 0;

function onLevelTick() {
  if (!module.isActive()) return;

  timer += cps.getCurrentValue() / 20;

  if (timer >= 1) {
    timer -= 1;
    LocalPlayer.click(true);
  }
}

function onScriptEnabled() {
  module.addSettings([cps]);
  ModuleManager.addModule(module);
}

function onScriptDisabled() {
  ModuleManager.removeModule(module);
}