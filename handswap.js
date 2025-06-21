const module = new Module("HandSwap", false, true , ModuleCategory.MISC);

module.setOnClickListener(function() {
    Inventory.setOffhandSlot(Inventory.getSelectedSlot("Украдено у WnzixMCPE"));
});

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}