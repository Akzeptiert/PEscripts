var module = new Module("QNotifications", true, true, ModuleCategory.MISC);
var lastKnownModules = {};

function onLevelTick() {
    if (module.isActive()) {
        checkModules();
    }
}

function checkModules() {
    let currentModules = ModuleManager.getModuleNames().reduce((acc, name) => {
        const isActive = Module.isActive(name);
        acc[name] = isActive;
        return acc;
    }, {});

    Object.keys(currentModules).forEach(name => {
        if (lastKnownModules[name] !== currentModules[name]) {
            if (currentModules[name]) {
            if (name !== "QNotifications") {
                Level.displayClientMessage("[§l§3ModuleManager§r]" + " " + name + " §l§aWas Enabled");
                }
            } else {
            if (name !== "QNotifications") {
                Level.displayClientMessage("[§l§3ModuleManager§r]" + " " + name + " §l§cWas Disabled");
                }
            }
            lastKnownModules[name] = currentModules[name];
        }
    });
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
    lastKnownModules = ModuleManager.getModuleNames().reduce((acc, name) => {
        acc[name] = Module.isActive(name);
        return acc;
    }, {});
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}