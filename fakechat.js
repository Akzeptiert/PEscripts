const module = new Module("FakeChat", false, true, ModuleCategory.MISC);
const deviceSetting = new ModeSetting("Device", ["§l§f(§eIOS§f)", "§l§f(§ePC§f)", "§l§f(§eAndroid§f)", ""]);
const clanSetting = new TextFieldSetting("Clan", "...", "");
const donateSetting = new TextFieldSetting("Donate", "...", "");
const nameSetting = new TextFieldSetting("Name", "...", "");
const strelaSetting = new ModeSetting("Strela", ["§r§7>§r", ""]);
const textSetting = new TextFieldSetting("Text", "§7...", "");
const spaceSetting = new StateSetting("Probel", true);

module.addSettings([deviceSetting, clanSetting, donateSetting, nameSetting, strelaSetting, textSetting, spaceSetting]);

// Обновление значения пробела
function updateSpaceValue() {
    return spaceSetting.isActive() ? " " : "";
}

module.setOnClickListener(function() {
    const spaceValue = updateSpaceValue();
    const message = [
        deviceSetting.getCurrentMode(),
        spaceValue,
        clanSetting.getText(),
        spaceValue,
        donateSetting.getText(),
        spaceValue,
        nameSetting.getText(),
        spaceValue,
        strelaSetting.getCurrentMode(),
        spaceValue,
        textSetting.getText()
    ].join('');

    Level.displayClientMessage(message);
});

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}