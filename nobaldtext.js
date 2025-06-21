const module = new Module("NoBaldText", true, false, ModuleCategory.OTHER); 

function onReceiveServerMessage(content) { 
    if (!module.isActive()) { return; } 
    preventDefault(); 
    Level.displayClientMessage(
        new java.lang.String(content).replaceAll("§l", "")
    ); 
} 

function onScriptEnabled() { 
    ModuleManager.addModule(module); 
} 

function onScriptDisabled() { 
    ModuleManager.removeModule(module); 
} 