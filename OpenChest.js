var module = new Module("AimChest", true, true, ModuleCategory.PLAYER);
var slider = new SliderSetting("radius", [1, 0, 10, 1]);
module.addSettings([slider]);

function aimBlock(bX, bY, bZ) {
        var x = bX - LocalPlayer.getPositionX();
        var y = bY - LocalPlayer.getPositionY();
        var z = bZ - LocalPlayer.getPositionZ();
        var l = Math.sqrt(x * x + y * y + z * z);
        y = y / l;
        var pitch = -(Math.asin(y) * 180 / Math.PI);
        var yaw = -Math.atan2(bX + .5 - (LocalPlayer.getPositionX() + .5), bZ + .5 - (LocalPlayer.getPositionZ() + .5)) * (180 / Math.PI);
        if (pitch < 89 && pitch > -89) {
                LocalPlayer.setRot(yaw, pitch);
        }
}

function onLevelTick() {
        if (!module.isActive()) {
                return
        }
        for (var posx = Math.floor(LocalPlayer.getPositionX()) - slider.getCurrentValue(); posx < Math.floor(LocalPlayer.getPositionX()) + slider.getCurrentValue(); posx++) {
                for (var posz = Math.floor(LocalPlayer.getPositionZ()) - slider.getCurrentValue(); posz < Math.floor(LocalPlayer.getPositionZ()) + slider.getCurrentValue(); posz++) {
                        if (Block.getID(posx, Math.floor(LocalPlayer.getPositionY() - 1), posz) == 54) {
                                LocalPlayer.openContainer(posx, LocalPlayer.getPositionY() - 1, posz);
                                aimBlock(posx, LocalPlayer.getPositionY(), posz);
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
