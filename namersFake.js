var module = new Module("FakeItemName", true, true, ModuleCategory.MOVEMENT);
var ids = new TextFieldSetting("ItemName", "Name", "");
module.addSettings([ids]);

function onLevelTick() {
    if (module.isActive("FakeItemName")) {

            if (Inventory.getSelectedSlot(0)) {
            Item.setName(0, ids.getText());
            }

            if (Inventory.getSelectedSlot(1)) {
            Item.setName(1, ids.getText());
            }

            if (Inventory.getSelectedSlot(2)) {
            Item.setName(2, ids.getText());
            }

            if (Inventory.getSelectedSlot(3)) {
            Item.setName(3, ids.getText());
            }

            if (Inventory.getSelectedSlot(4)) {
            Item.setName(4, ids.getText());
            }

            if (Inventory.getSelectedSlot(5)) {
            Item.setName(5, ids.getText());
            }

            if (Inventory.getSelectedSlot(6)) {
            Item.setName(6, ids.getText());
            }

            if (Inventory.getSelectedSlot(7)) {
            Item.setName(7, ids.getText());
            }

            if (Inventory.getSelectedSlot(8)) {
             Item.setName(8, ids.getText());
            }

            if (Inventory.getSelectedSlot(9)) {
            Item.setName(9, ids.getText());
            }
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}