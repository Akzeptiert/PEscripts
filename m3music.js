let module = new Module("МП3 Плеер", true, true, ModuleCategory.OTHER).setOnToggleListener((view, active) => {
songer.reset();
songer.setDataSource(textField.getText());
songer.prepare();
songer.start();    
});
let slider = new SliderSetting("Звук", [1,0,1,0.1]).setOnCurrentValueChangedListener(value => songer.setVolume(value,value));
let state = new StateSetting("Повтор", false).setOnStateToggleListener(active => songer.setLooping(active));
let textField = new TextFieldSetting("Песня", "Path to song", "/storage/emulated/0/Music/", "buttonText");
let textField22 = new TextFieldSetting("Сделал", "CondoM", "CondoM", "buttonText");
module.addSettings([slider, state, textField,textField22]);

let music = android.media.MediaPlayer;
let songer = new music();

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}
