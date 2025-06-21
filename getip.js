var module = new Module("GetIP", true, false, ModuleCategory.OTHER);

function onServerConnect(addr, port) {
    if (module.isActive()) { 
        getContext().getSystemService(android.content.Context.CLIPBOARD_SERVICE).setText(addr+":"+port);
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}