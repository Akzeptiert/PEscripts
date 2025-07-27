var module = new Module("Text", true, true, ModuleCategory.OTHER);
var radius = 200;
var names = [];

var isNearActive = false;
var isNoBadEffectsActive = false;
var isRunActive = false;

var runSpeed = 0.31;
var crouchSpeed = 0.15;

function onChat(text) {
    if (text === ".help") {
        Level.displayClientMessage("\n§l§fСоздатель: §r§dDupCit\n§l§cВсе доступные функции:\n§fЧтобы вкл одну функцию напишите его один раз в чат, а чтобы выкл напишите ещё раз в чат\n1) §r.n §l§c= показ имен ближайшего игрока (отключается при крадущемся режиме)\n§f2) §r.nbe §l§a= убирание плохих эффектов\n§f3) §r.sp §l§b= ускоренный бег и ходьба при крадущемся режиме\n§r.sp <число> §l§6= установить скорость бега"); // Обновлено сообщение .help
        preventDefault();
    }
    if (text === ".n") {
        isNearActive = !isNearActive;
        if (isNearActive) {
            Level.displayClientMessage("§l§aпоказ имен ближайшего игрока включен.");
        } else {
            Level.displayClientMessage("§l§cпоказ имен ближайшего игрока выключено.");
        }
        preventDefault();
    }
    if (text === ".nbe") {
        isNoBadEffectsActive = !isNoBadEffectsActive;
        if (isNoBadEffectsActive) {
            Level.displayClientMessage("§l§aубирание плохих эффектов включено.");
        } else {
            Level.displayClientMessage("§l§cубирание плохих эффектов выключено.");
        }
        preventDefault();
    }
    
    // Команда .sp для включения/выключения
    if (text === ".sp") {
        isRunActive = !isRunActive;
        if (isRunActive) {
            Level.displayClientMessage("§l§bУскоренный бег и ходьба при крадущемся режиме включены.");
        } else {
            Level.displayClientMessage("§l§cУскоренный бег и ходьба при крадущемся режиме выключены.");
        }
        preventDefault();
    }

    // Новая команда для установки скорости бега
    if (text.startsWith(".sp ") && text.split(" ").length === 2) {
        var parts = text.split(" ");
        var newSpeed = parseFloat(parts[1]);
        if (!isNaN(newSpeed) && newSpeed > 0) {
            runSpeed = newSpeed;
            Level.displayClientMessage("§l§6Скорость бега установлена на: " + runSpeed);
        } else {
            Level.displayClientMessage("§l§cНеверное значение скорости. Используйте число больше 0.");
        }
        preventDefault();
    }
}

function updateNames() {
  names = [];
  var ids = Level.getAllPlayers();
  var closestPlayerId = null;
  var minDistance = Infinity;

  for (var i = 0; i < ids.length; i++) {
    var currentPlayerId = ids[i];
    if (!Player.isLocalPlayer(currentPlayerId)) {
      var distance = LocalPlayer.getDistanceTo(currentPlayerId);
      if (distance < minDistance) {
        minDistance = distance;
        closestPlayerId = currentPlayerId;
      }
    }
  }

  if (closestPlayerId !== null) {
    names.push(Player.getNameTag(closestPlayerId) + " (" + Math.round(minDistance) + " блоков)");
  }
}

function showMessage() {
  var text = "" + names.join(", ");
  Level.showTipMessage("" + text, 0, 0);
}

onLevelTick = () => {
  if (!LocalPlayer.isSneaking()) {
    if (isNearActive) {
      updateNames();
      showMessage();
    }
    
    if (isRunActive) {
        if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
            var yaw = LocalPlayer.getYaw();
            LocalPlayer.setVelocityX(-runSpeed * Math.sin(yaw / 180 * Math.PI));
            LocalPlayer.setVelocityZ(runSpeed * Math.cos(yaw / 180 * Math.PI));
            if (typeof LocalPlayer.setMoveButtonStatus === 'function') {
                LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, false);
            }
        }
    }
  } else {
    if (isNearActive) {
        Level.showTipMessage("", 0, 0);
    }

    if (isRunActive) {
        if (LocalPlayer.isMoveButtonPressed(MoveButton.FORWARD)) {
            var yaw = LocalPlayer.getYaw();
            LocalPlayer.setVelocityX(-crouchSpeed * Math.sin(yaw / 180 * Math.PI));
            LocalPlayer.setVelocityZ(crouchSpeed * Math.cos(yaw / 180 * Math.PI));
            if (typeof LocalPlayer.setMoveButtonStatus === 'function') {
                LocalPlayer.setMoveButtonStatus(MoveButton.JUMP, false);
            }
        }
    }
  }

  if (isNoBadEffectsActive) {
    [2, 7, 9, 15].forEach(function(elem) {
        LocalPlayer.removeEffect(elem); 
    });
  }
}

function onScriptEnabled() {
  ModuleManager.addModule(module);
}

function onScriptDisabled() {
  ModuleManager.removeModule(module);
}
