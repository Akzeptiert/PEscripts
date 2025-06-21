const module = new Module("NO RENDERe+", true, true, ModuleCategory.MISC);
const name = new StateSetting("Name tags", false);
module.addSettings([name]);

function onLevelTick() {
if (module.isActive()) {
Memory.setInt(Memory.getLocalPlayer(), 102, 20); // Set hunger saturation level to 20
Memory.setInt(Memory.getLocalPlayer(), 103, 0); // Set hunger exhaustion level to 0
Memory.setInt(Memory.getLocalPlayer(), 105, 0); // Set hunger depletion rate to 0
Memory.setFloat(Memory.getLocalPlayer(), 106, 0); // Set hunger multiplier to 0.0
Memory.setFloat(Memory.getLocalPlayer(), 107, 1); // Set hunger saturation multiplier to 1.0
Memory.setFloat(Memory.getLocalPlayer(), 108, 0); // Set hunger exhaustion multiplier to 0.0
Memory.setBoolean(Memory.getLocalPlayer(), 200, false); // Disable hunger
Memory.setBoolean(Memory.getLocalPlayer(), 201, true); // Enable hunger regeneration
         }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}