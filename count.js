const module = new Module("Count", false, true , ModuleCategory.MISC);
var count = new SliderSetting("Count", [-2, -2, 100, 1]);
module.addSetting(count);
module.setOnClickListener(function() {
   Item.setCount(Inventory.getSelectedSlot(), count.getCurrentValue());
});

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}