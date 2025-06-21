/*
  ╔══════════════════════════════════════╗
  ║           Scaffold Bypass Module     ║
  ╠══════════════════════════════════════╣
  ║ Author:    Zeld                      ║
  ║ Version:   1.0                       ║
  ║ Description:                         ║
  ║   Обход Scaffold                     ║
  ║                                      ║
  ║                                      ║
  ║                                      ║
  ║                                      ║
  ║ Telegram Channel:                    ║
  ║   tg:@zeld_script                    ║
  ╚══════════════════════════════════════╝
*/

const module = new Module("Scaffold Bypass", true, true, ModuleCategory.MOVEMENT);

const cpsSetting = new SliderSetting("CPS", [5, 1, 20, 1]);
const blockModeSetting = new ModeSetting("Block Mode", ["1 Block", "2 Blocks"]);
module.addSettings([cpsSetting, blockModeSetting]);

var timer = 0;

function onLevelTick() {
    if (module.isActive()) {
        LocalPlayer.setRot(LocalPlayer.getYaw(), 60);

        const cps = cpsSetting.getCurrentValue();
        const ticksPerClick = Math.floor(20 / cps);

        timer++;
        if (timer >= ticksPerClick) {
            if (blockModeSetting.getCurrentMode() === "1 Block") {
                LocalPlayer.click(true);
            } else {
                LocalPlayer.click(true);
                LocalPlayer.setPositionRelative(0, 0, 1);
                LocalPlayer.click(true);
                LocalPlayer.setPositionRelative(0, 0, -1);
            }
            timer = 0;
        }
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}