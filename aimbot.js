// by toxindixhion

// ??????????? IDITE NAHUI

const module = new Module("AimBot near", true, true, ModuleCategory.COMBAT);
const slider = new SliderSetting("Distance", [1, 0, 100, 1]);
module.addSetting(slider);

function onTick() {
    if (!module.isEnabled()) return;

    const value = slider.getValue();
    const players = Level.getPlayers();
    let near = null;
    let nearDist = value + 1;

    for (let player of players) {
        if (player.getNameTag() === LocalPlayer.getNameTag()) continue;
        const dist = LocalPlayer.getDistanceTo(player);
        if (dist < nearDist) {
            near = player;
            nearDist = dist;
        }
    }

    if (near) {
        const x = near.getPosX() - LocalPlayer.getPosX();
        const z = near.getPosZ() - LocalPlayer.getPosZ();
        const yaw = Math.atan2(z, x) * (180 / Math.PI) - 90;
        const pitch = -Math.atan2(near.getPosY() - LocalPlayer.getPosY(), Math.sqrt(x * x + z * z)) * (180 / Math.PI);
        LocalPlayer.setRot([pitch, yaw]);
    }
}

function onScriptEnable() {
    ModuleManager.addModule(module);
    notification("Модуль AimBot NEAR включен")
}

function onScriptDisable() {
    ModuleManager.removeModule(module);
    notification("Модуль AimBot NEAR выключен")
}
