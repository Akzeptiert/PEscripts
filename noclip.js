/*
  ╔══════════════════════════════════════╗
  ║           NoClip Module              ║
  ╠══════════════════════════════════════╣
  ║ Author:       SquateDev & Zeld      ║
  ║ Version:      1.1                    ║
  ║ Description:                         ║
  ║   Модуль сделан для того, чтобы     ║
  ║   можно было проходить сквозь стены  ║
  ║   и т.д.                             ║
  ║                                      ║
  ║ Telegram Channel:                    ║
  ║   tg:@zeld_script                    ║
  ║   tg:@squatedev_channel              ║
  ╚══════════════════════════════════════╝
*/

const noclip = new Module("NoClip", true, true, ModuleCategory.PLAYER);
const speed = new SliderSetting("Speed", [0.1, 0.05, 1, 0.05]);
const smoothFactor = new SliderSetting("Smooth Factor", [1, 0.1, 5, 0.1]);

noclip.addSettings([speed, smoothFactor]);

function onScriptEnabled() {
  ModuleManager.addModule(noclip);
}

function onScriptDisabled() {
  ModuleManager.removeModule(noclip);
}

function onFastTick() {
  if (noclip.isActive()) {
    const speeds = speed.getCurrentValue();
    const smooth = smoothFactor.getCurrentValue();
    const pitch = (LocalPlayer.getPitch() * Math.PI) / 180;
    const yaw = (LocalPlayer.getYaw() * Math.PI) / 180;
    const x = -Math.sin(yaw) * Math.cos(pitch);
    const y = -Math.sin(pitch);
    const z = Math.cos(yaw) * Math.cos(pitch);

    LocalPlayer.setPositionRelative(
      (x * speeds) / smooth,
      (y * speeds) / smooth,
      (z * speeds) / smooth
    );
  }
}