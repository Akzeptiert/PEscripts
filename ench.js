const module = new Module("Ench", false, true , ModuleCategory.MISC);
var enchant = new SliderSetting("Ids", [0, 0, 32, 1]);
var number = new SliderSetting("Level", [-1, -1, 32767, 1]);
module.addSettings([enchant,number]);
module.setOnClickListener(function() {
  Item.enchant(Inventory.getSelectedSlot(), enchant.getCurrentValue(), number.getCurrentValue());
});
function onScriptEnabled() {
    ModuleManager.addModule(module);
}
function onScriptDisabled() {
    ModuleManager.removeModule(module);
}