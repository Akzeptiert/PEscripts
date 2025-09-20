const module = new Module("Ench", false, true , ModuleCategory.MISC);
var enchant = new ModeSetting("Ids", ["Защита","Огнеустойчивость","Лёгкость","Взрывоустойчивость","Защита от снарядов","Шипы","Дыхание","Родство с водой","Странник глубин","Острота","Небесная кара","Бич членистоногих","Отбрасывание","Облик огня","Добыча","Эффективность","Шёлковое касание","Неразрушимость","Удача","Мощь","Отдача","Воспламенение","Бесконечность","Морская удача","Приманка","Морозная поступь","Починка"]);
var number = new TextFieldSetting("Level", "32767", "");

var protection = Enchantment.PROTECTION;
var fire_protection = Enchantment.FIRE_PROTECTION;
var feather_falling = Enchantment.FEATHER_FALLING;
var blast_protection = Enchantment.BLAST_PROTECTION;
var projecrtile_protection = Enchantment.PROJECTILE_PROTECTION;
var thorns = Enchantment.THORNS;
var respiration = Enchantment.RESPIRATION;
var aqua_affinity = Enchantment.AQUA_AFFINITY;
var depth_strider = Enchantment.DEPTH_STRIDER;
var sharpness = Enchantment.SHARPNESS;
var smite = Enchantment.SMITE;
var bane_of_arthropods = Enchantment.BANE_OF_ARTHROPODS;
var knockback = Enchantment.KNOCKBACK;
var fire_aspect = Enchantment.FIRE_ASPECT;
var looting = Enchantment.LOOTING;
var efficiency = Enchantment.EFFICIENCY;
var silk_touch = Enchantment.SILK_TOUCH;
var unbreaking = Enchantment.UNBREAKING;
var fortune = Enchantment.FORTUNE;
var power = Enchantment.POWER;
var punch = Enchantment.PUNCH;
var flame = Enchantment.FLAME;
var infinity = Enchantment.INFINITY;
var luck_of_the_sea = Enchantment.LUCK_OF_THE_SEA;
var lure = Enchantment.LURE;
var frost_walker = Enchantment.FROST_WALKER;
var mending = Enchantment.MENDING;
module.addSettings([enchant,number]);

module.setOnClickListener(function() {
  if (enchant.getCurrentMode() == "Защита") {
    Item.enchant(Inventory.getSelectedSlot(), protection, number.getText());
  }
  if (enchant.getCurrentMode() == "Огнеустойчивость") {
    Item.enchant(Inventory.getSelectedSlot(), fire_protection, number.getText());
  }
  if (enchant.getCurrentMode() == "Лёгкость") {
    Item.enchant(Inventory.getSelectedSlot(), feather_falling, number.getText());
  }
  if (enchant.getCurrentMode() == "Взрывоустойчивость") {
    Item.enchant(Inventory.getSelectedSlot(), blast_protection, number.getText());
  }
  if (enchant.getCurrentMode() == "Защита от снарядов") {
    Item.enchant(Inventory.getSelectedSlot(), projecrtile_protection, number.getText());
  }
  if (enchant.getCurrentMode() == "Шипы") {
    Item.enchant(Inventory.getSelectedSlot(), thorns, number.getText());
  }
  if (enchant.getCurrentMode() == "Дыхание") {
    Item.enchant(Inventory.getSelectedSlot(), respiration, number.getText());
  }
  if (enchant.getCurrentMode() == "Странник глубин") {
    Item.enchant(Inventory.getSelectedSlot(), aqua_affinity, number.getText());
  }
  if (enchant.getCurrentMode() == "Родство с водой") {
    Item.enchant(Inventory.getSelectedSlot(), depth_strider, number.getText());
  }
  if (enchant.getCurrentMode() == "Острота") {
    Item.enchant(Inventory.getSelectedSlot(), sharpness, number.getText());
  }
  if (enchant.getCurrentMode() == "Небесная кара") {
    Item.enchant(Inventory.getSelectedSlot(), smite, number.getText());
  }
  if (enchant.getCurrentMode() == "Бич членистоногих") {
    Item.enchant(Inventory.getSelectedSlot(), bane_of_arthropods, number.getText());
  }
  if (enchant.getCurrentMode() == "Отбрасывание") {
    Item.enchant(Inventory.getSelectedSlot(), knockback, number.getText());
  }
  if (enchant.getCurrentMode() == "Облик огня") {
    Item.enchant(Inventory.getSelectedSlot(), fire_aspect, number.getText());
  }
  if (enchant.getCurrentMode() == "Добыча") {
    Item.enchant(Inventory.getSelectedSlot(), looting, number.getText());
  }
  if (enchant.getCurrentMode() == "Эффективность") {
    Item.enchant(Inventory.getSelectedSlot(), efficiency, number.getText());
  }
  if (enchant.getCurrentMode() == "Шёлковое касание") {
    Item.enchant(Inventory.getSelectedSlot(), silk_touch, number.getText());
  }
  if (enchant.getCurrentMode() == "Неразрушимость") {
    Item.enchant(Inventory.getSelectedSlot(), unbreaking, number.getText());
  }
  if (enchant.getCurrentMode() == "Удача") {
    Item.enchant(Inventory.getSelectedSlot(), fortune, number.getText());
  }
  if (enchant.getCurrentMode() == "Мощь") {
    Item.enchant(Inventory.getSelectedSlot(), power, number.getText());
  }
  if (enchant.getCurrentMode() == "Отдача") {
    Item.enchant(Inventory.getSelectedSlot(), punch, number.getText());
  }
  if (enchant.getCurrentMode() == "Воспламенение") {
    Item.enchant(Inventory.getSelectedSlot(), flame, number.getText());
  }
  if (enchant.getCurrentMode() == "Бесконечность") {
    Item.enchant(Inventory.getSelectedSlot(), infinity, number.getText());
  }
  if (enchant.getCurrentMode() == "Морская удача") {
    Item.enchant(Inventory.getSelectedSlot(), luck_of_the_sea, number.getText());
  }
  if (enchant.getCurrentMode() == "Приманка") {
    Item.enchant(Inventory.getSelectedSlot(), lure, number.getText());
  }
  if (enchant.getCurrentMode() == "Морозная поступь") {
    Item.enchant(Inventory.getSelectedSlot(), frost_walker, number.getText());
  }
  if (enchant.getCurrentMode() == "Починка") {
    Item.enchant(Inventory.getSelectedSlot(), mending, number.getText());
  }
});
function onScriptEnabled() {
    ModuleManager.addModule(module);
}
function onScriptDisabled() {
    ModuleManager.removeModule(module);
}