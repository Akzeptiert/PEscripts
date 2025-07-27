/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                              ╔═╗┬ ┬┌─┐┬ ┬  ╔╦╗┬ ┬┌─┐┌─┐                      ║
║                              ║╣ ├─┤├┤ ├─┤   ║ ├─┤├─┤├┤                       ║
║                              ╚═╝┴ ┴└─┘┴ ┴   ╩ ┴ ┴┴ ┴└─┘                      ║
║══════════════════════════════════════════════════════════════════════════════║
║ Module:  Spam Chat                                                           ║
║ Author:  Zeld                                                               ║
║ Version: 1.0                                                                ║
║                                                                              ║
║                                                                              ║
║                                                                              ║
║ Telegram Channel:                                                            ║
║   📢 tg:@zeld_script                                                         ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

var spamChatModule = new Module("Spam Chat", true, true, ModuleCategory.MISC);

const spamText1 = new TextFieldSetting("Spam Text 1", "Hello, World!");
const spamInterval1 = new SliderSetting("Interval for Text 1", [1.0, 0.5, 60.0, 0.5]);

const spamText2 = new TextFieldSetting("Spam Text 2", "How are you?");
const spamInterval2 = new SliderSetting("Interval for Text 2", [1.0, 0.5, 60.0, 0.5]);

const spamText3 = new TextFieldSetting("Spam Text 3", "Good morning!");
const spamInterval3 = new SliderSetting("Interval for Text 3", [1.0, 0.5, 60.0, 0.5]);

const spamText4 = new TextFieldSetting("Spam Text 4", "Good night!");
const spamInterval4 = new SliderSetting("Interval for Text 4", [1.0, 0.5, 60.0, 0.5]);

const spamText5 = new TextFieldSetting("Spam Text 5", "See you soon!");
const spamInterval5 = new SliderSetting("Interval for Text 5", [1.0, 0.5, 60.0, 0.5]);

const addSymbols = new StateSetting("Add Random Symbols", true);

let timers = [0, 0, 0, 0, 0];

function generateRandomSymbols(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function onLevelTick() {
  if (!spamChatModule.isActive()) {
    return;
  }

  if (LocalPlayer && LocalPlayer.isInGame()) {
    const spamTexts = [spamText1, spamText2, spamText3, spamText4, spamText5];
    const spamIntervals = [spamInterval1, spamInterval2, spamInterval3, spamInterval4, spamInterval5];

    for (let i = 0; i < spamTexts.length; i++) {
      timers[i] += 1 / (spamIntervals[i].getCurrentValue() * 20);
      if (timers[i] >= 1) {
        timers[i] -= 1;
        for (let j = 0; j < 5; j++) {
          const message = addSymbols.isActive() ? addRandomSymbols(spamTexts[i].getText()) : spamTexts[i].getText();
          sendGlobalChatMessage(message);
        }
      }
    }
  }
}

function sendGlobalChatMessage(message) {
  LocalPlayer.sendChatMessage(message);
}

function addRandomSymbols(text) {
  const prefix = generateRandomSymbols(5);
  const suffix = generateRandomSymbols(5);
  return `${prefix} ${text} ${suffix}`;
}

function onScriptEnabled() {
  spamChatModule.addSettings([
    spamText1, spamInterval1,
    spamText2, spamInterval2,
    spamText3, spamInterval3,
    spamText4, spamInterval4,
    spamText5, spamInterval5,
    addSymbols
  ]);
  ModuleManager.addModule(spamChatModule);
}

function onScriptDisabled() {
  ModuleManager.removeModule(spamChatModule); 
}