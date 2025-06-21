Data.getBoolean("edition-faker-dlc-loaded", !1) && (Data.remove("edition-faker-dlc-loaded"), Memory.write(12485936, [1, 33]), ModuleManager.addModule(new d("EditionFaker DLC", !1, !1, ModuleCategory.MISC).setOnClickListener((function (e) {
    if (Module.isActive("EditionFaker")) switch (Setting.getCurrentMode("EditionFaker", "Edition")) {
    case "Windows 10":
        Memory.write(11984038, [79, 240, 1, 0, 112, 71]);
        break;
    case "GamePad":
        Memory.write(11984038, [79, 240, 3, 0, 112, 71])
    } else Memory.write(11984038, [79, 240, 2, 0, 112, 71])
}))));
