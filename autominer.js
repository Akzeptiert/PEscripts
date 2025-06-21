var module = new Module("AutoMiner", true, true, ModuleCategory.PLAYER);
var radius = new SliderSetting("Radius", [2, 1, 7, 1]); var ids = new TextFieldSetting("Block IDs", "1,2,3", "");
var inspector = new StateSetting("Inspector", false); module.addSettings([radius, ids, inspector]); 

function onLevelTick() {
    if (!module.isActive()) { return; }
    for (var posx = Math.floor(LocalPlayer.getPositionX()) - radius.getCurrentValue(); posx < Math.floor(LocalPlayer.getPositionX()) + radius.getCurrentValue() + 1; posx++) {
        for (var posy = Math.floor(LocalPlayer.getPositionY()) - radius.getCurrentValue(); posy < Math.floor(LocalPlayer.getPositionY()) + radius.getCurrentValue() + 1; posy++) {
            for (var posz = Math.floor(LocalPlayer.getPositionZ()) - radius.getCurrentValue(); posz < Math.floor(LocalPlayer.getPositionZ()) + radius.getCurrentValue() + 1; posz++) {
                if (Block.getID(posx, posy, posz) != 0 && ids.getText().split(",").includes(Block.getID(posx, posy, posz).toString())) {
                    LocalPlayer.destroyBlock(posx, posy, posz);
                }
    }}}
}

function onUseItem(x, y, z, side, item, block) {
    if (!inspector.isActive()) { return; }
    Level.showTipMessage("Block: " + block);
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}