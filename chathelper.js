const module = new Module("ChatBot", true, true, ModuleCategory.MISC);

function onReceiveServerMessage(message) {
if (module.isActive()) {
  // Удаляет скучный цветной текст
  let cleanMessage = message.replace(/\§[0-9A-FK-OR]/ig, '');  


  // Проверяет, содержит ли сообщение команду /roll
  if (cleanMessage.includes("/roll")) {
      // Отправляет команду /roll
      Level.displayClientMessage("Отправлено!");
      LocalPlayer.sendChatMessage("/roll");
  }
    if (cleanMessage.includes("/robber")) {
          Level.displayClientMessage("Отправлено!");
      LocalPlayer.sendChatMessage("/robber");
  }
    if (cleanMessage.includes("/warp mist")) {
          Level.displayClientMessage("Отправлено!");
      LocalPlayer.sendChatMessage("/warp mist");
  }
  }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}
