/*
  ╔══════════════════════════════════════╗
  ║           Add Friend Module          ║
  ╠══════════════════════════════════════╣
  ║ Author:    Zeld                      ║
  ║ Version:   1.0                       ║
  ║ Description:                         ║
  ║   Добавляет игрока в друзья и        ║
  ║   отправляет ему сообщение.          ║
  ║                                      ║
  ║ Telegram Channel:                    ║
  ║   tg:@zeld_script                    ║
  ╚══════════════════════════════════════╝
*/

var addFriendModule = new Module("AddFriend", true, false, ModuleCategory.PLAYER);

var friendNameSetting = new TextFieldSetting("Friend Name", "Введите имя друга", "");
addFriendModule.addSetting(friendNameSetting);

addFriendModule.setOnToggleListener(function(view, active) {
    if (active) {
        var friendName = friendNameSetting.getText();
        if (friendName && !isFriend(friendName)) {
            addFriend(friendName);
            sendMessageToFriend(friendName, "Привет! Я только что добавил тебя в друзья.");
        }
    }
});

function sendMessageToFriend(friendName, message) {
    if (isFriend(friendName)) {
        LocalPlayer.sendChatMessage("/msg " + friendName + " " + message);
    }
}

ModuleManager.addModule(addFriendModule);