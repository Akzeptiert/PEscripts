const module = new Module("DetectHeads", true, true, ModuleCategory.OTHER); 

function onLevelTick() { 
    if (!module.isActive()) { return; } 
    for (var posx = Math.floor(LocalPlayer.getPositionX()) - 7; posx < Math.floor(LocalPlayer.getPositionX()) + 7; posx++) {
        for (var posy = Math.floor(LocalPlayer.getPositionY()) - 7; posy < Math.floor(LocalPlayer.getPositionY()) + 7; posy++) {
            for (var posz = Math.floor(LocalPlayer.getPositionZ()) - 7; posz < Math.floor(LocalPlayer.getPositionZ()) + 7; posz++) {
                if (Block.getID(posx, posy, posz) == 144) {
                    LocalPlayer.buildBlock(posx, posy, posz);
                }
    }}}
}

function onScriptEnabled() { 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(module); 
} 