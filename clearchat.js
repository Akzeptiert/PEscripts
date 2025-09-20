var module = new Module("ChatClear", false, true, ModuleCategory.OTHER);

module.setOnClickListener(function() {
    Level.displayClientMessage("                ".repeat(20));
});

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}