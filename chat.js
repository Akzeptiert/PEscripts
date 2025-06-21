const module = new Module("Chat", false, true , ModuleCategory.MISC);
var message = new TextFieldSetting("Chat", "Text", "");
module.addSetting(message);
module.setOnClickListener(function() {
    Level.displayClientMessage(message.getText());
});

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}