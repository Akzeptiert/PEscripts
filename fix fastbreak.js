let on = false;

Data.getBoolean("Fast-loade", !1) && (Data.remove("Fast-loade"), ModuleManager.addModule(new d("FastBreakFix", !1, !1, ModuleCategory.OTHER).setOnClickListener((function (e) {

if (Module.isActive("FastBreak")) {
on = true;
} else {
on = false;
}

}))));

function onLevelTick() {
if (Module.isActive("FastBreak")) {
let tg = Setting.isActive("FastBreak", "Tap destroy");
let gg = Setting.getCurrentValue("FastBreak", "Amplifier");

if (!tg) {
Level.displayClientMessage(tg + " " + gg);

LocalPlayer.addEffect(3, 999999, gg, false);

    } else {
        LocalPlayer.removeEffect(3);
    }
} else {
on = false;
}
}