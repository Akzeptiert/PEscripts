const module = new Module("RandomBar", true, true, ModuleCategory.PLAYER);
var searchFrom = new SliderSetting("Search from", [1, 1, 8, 1]); var searchTo = new SliderSetting("Search to", [9, 2, 9, 1]);
module.addSettings([searchFrom, searchTo]);

var tick = 0;

function onLevelTick() {
    if (!module.isActive()) { return; }
    tick++;
    if (tick < 19) { return; } if (searchFrom.getCurrentValue() > searchTo.getCurrentValue()) { java.lang.System.exit(0); }
    tick = 0;
    x = Math.random() * (searchTo.getCurrentValue() - searchFrom.getCurrentValue());
    let randomSlot = searchFrom.getCurrentValue() + Math.round(x) - 1;
    if (Item.isBlock(randomSlot)) {
        Level.displayClientMessage(x);
        Inventory.setSelectedSlot(randomSlot);
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}