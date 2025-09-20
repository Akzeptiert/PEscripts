// MineGPT
// v1.0
// By TriggerTrash (･θ･)

if (typeof JSON === 'undefined' || typeof JSON.stringify !== 'function') {
    var JSON = {
        stringify: function(obj) {
            var type = typeof obj; if (type !== "object" || obj === null) { if (type === "string") return '"' + obj.replace(/"/g, '\\"') + '"'; return String(obj); }
            var json = [], arr = (obj && obj.constructor === Array); for (var k in obj) { var v = obj[k]; type = typeof v; if (type === "string") v = '"' + v.replace(/"/g, '\\"') + '"'; else if (type === "object" && v !== null) v = this.stringify(v); json.push((arr ? "" : '"' + k + '":') + String(v)); }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };
}

var proxyUrl = "https://minegpt-proxy.vercel.app/api";
var MAX_HISTORY_LENGTH = 30; 
var CHAT_CHUNK_SIZE = 80;

var availableModels = [ "openai/gpt-oss-20b", "gemma2-9b-it", "moonshotai/kimi-k2-instruct", "meta-llama/llama-4-maverick-17b-128e-instruct", "meta-llama/llama-4-scout-17b-16e-instruct", "qwen/qwen3-32b", "deepseek-r1-distill-llama-70b", "openai/gpt-oss-120b", "compound-beta" ];
var currentModel = availableModels[0];
var isCounting = false;
var COMMAND_ALIASES = [".ai", ".ask", "ai", "ask"];
var teleportPoints = {}; 

var defaultSystemPrompt = "Ты — эрудированный ИИ-собеседник. Твоя главная задача — вести с пользователем подробные и содержательные диалоги на любые темы. ПРАВИЛА: 1. Всегда отвечай только на русском языке. 2. Никогда не используй форматирование (звездочки, маркеры) и эмодзи. Ответ — только чистый текст. 3. ИСКЛЮЧЕНИЕ: Только если пользователь прямо и недвусмысленно спрашивает о самой игре Minecraft, ты должен дать ответ, касающийся старых версий игры (около 1.1.5). Во всех остальных случаях считай, что вопрос касается реального мира.";
var systemPrompt = { "role": "system", "content": defaultSystemPrompt };
var conversationHistory = [systemPrompt]; 
var MEMORY_SUMMARIZE_TRIGGER = 6;
var messageCounter = 0;

var module = new Module("MineGPT", true, false, ModuleCategory.OTHER);

function sendLongMessage(text) {
    if (!text || text.length === 0) { Level.displayClientMessage("§b[MineGPT] §eПолучен пустой ответ.. Пипец ну как так? Ты что у него спрашивал? Наверное..это был вопрос человечества или даже вселенной..кто его знает ¯\_(ツ)_/¯"); return; }
    var prefix = "§b[MineGPT] §f";
    if (text.length <= CHAT_CHUNK_SIZE) { Level.displayClientMessage(prefix + text); }
    else {
        var words = text.split(" "); var currentMessage = "";
        for (var i = 0; i < words.length; i++) {
            if ((currentMessage + words[i]).length > CHAT_CHUNK_SIZE) { Level.displayClientMessage(prefix + currentMessage.trim()); currentMessage = words[i] + " "; try { java.lang.Thread.sleep(200); } catch(e){} }
            else { currentMessage += words[i] + " "; }
        }
        if (currentMessage.trim().length > 0) { Level.displayClientMessage(prefix + currentMessage.trim()); }
    }
}

function queryAI(history) {
    try {
        var url = new java.net.URL(proxyUrl); var conn=url.openConnection();
        conn.setRequestMethod("POST"); conn.setRequestProperty("Content-Type","application/json; charset=UTF-8"); conn.setDoOutput(true);
        var jsonPayload=JSON.stringify({"model":currentModel,"messages":history,"max_tokens":1600});
        var writer=new java.io.OutputStreamWriter(conn.getOutputStream(),"UTF-8"); writer.write(jsonPayload); writer.flush(); writer.close();
        var responseCode=conn.getResponseCode(); if(responseCode!=200){return"Ошибка: "+responseCode;}
        var buffReader=new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream(),"UTF-8")); var response=""; for(var line="";line!=null;line=buffReader.readLine()){response=response+line;} buffReader.close(); conn.disconnect();
        var parsedResponse=JSON.parse(response); if(parsedResponse&&parsedResponse.choices&&parsedResponse.choices.length>0&&parsedResponse.choices[0].message){var content=parsedResponse.choices[0].message.content; var thinkTag="</think>"; var tagIndex=content.lastIndexOf(thinkTag); if(tagIndex!==-1){return content.substring(tagIndex+thinkTag.length).trim();} return content.trim();} return "";
    } catch(e){print(e);return"Фатальная ошибка!!! :(";}
}

function summarizeMemory() {
    new java.lang.Thread(new java.lang.Runnable({ "run": function() {
        try {
            var summarizationPrompt = conversationHistory.concat({ "role": "user", "content": "Кратко суммируй наш диалог в одном параграфе. Эта информация для твоей собственной памяти. Начинай ответ со слов 'Сводка диалога:'" });
            var summary = queryAI(summarizationPrompt);
            if (summary && summary.length > 0) { conversationHistory = [systemPrompt, { "role": "assistant", "content": summary }]; Level.displayClientMessage("§b[MineGPT] §7Память оптимизирована :)"); }
        } catch (e) { print("Ошибка суммирования: " + e); }
    }})).start();
}

function openInGameBrowser(url) {
    try {
        var ctx = getContext();
        ctx.runOnUiThread(new java.lang.Runnable({
            run: function() {
                var webView = new android.webkit.WebView(ctx);
                var webSettings = webView.getSettings();
                webSettings.setJavaScriptEnabled(true);
                webSettings.setDomStorageEnabled(true);
                webView.setWebChromeClient(new android.webkit.WebChromeClient());
                webView.setWebViewClient(new android.webkit.WebViewClient());
                webView.loadUrl(url);

                var width = android.view.ViewGroup.LayoutParams.MATCH_PARENT;
                var height = android.view.ViewGroup.LayoutParams.MATCH_PARENT;
                var popupWindow = new android.widget.PopupWindow(webView, width, height, true);
                
                popupWindow.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.WHITE));
                
                var rootView = ctx.getWindow().getDecorView().getRootView();
                popupWindow.showAtLocation(rootView, android.view.Gravity.CENTER, 0, 0);

                webView.setOnKeyListener(new android.view.View.OnKeyListener({
                    onKey: function(view, keyCode, event) {
                        if (event.getAction() === android.view.KeyEvent.ACTION_DOWN && keyCode === android.view.KeyEvent.KEYCODE_BACK) {
                            if (webView.canGoBack()) {
                                webView.goBack();
                                return true;
                            } else {
                                popupWindow.dismiss();
                                return true;
                            }
                        }
                        return false;
                    }
                }));

                Level.displayClientMessage("§b[MineGPT] §aОткрываю браузер в игре...");
            }
        }));
    } catch (e) {
        Level.displayClientMessage("§b[MineGPT] §cНе удалось открыть браузер :(");
        print(e);
    }
}

function showHelp() {
    var helpMessage = "--- §bMineGPT §f---\n" +
                      "§eai <запрос>§f - Задать вопрос\n" +
                      "§eai browser <ссылка>§f - Открыть браузер в игре\n" +
                      "§eai fact§f - Случайный факт\n" +
                      "§eai reset§f - Очистить память\n" +
                      "§eai models set <1-9>§f - Установить модель\n" +
                      "§eai calc <пример>§f - Калькулятор\n" +
                      "§eai count start [частота]§f - Считалка 1-10\n" +
                      "§eai count stop§f - Остановить считалку\n" +
                      "§eai sethome <имя>§f - Сохранить точку дома\n" +
                      "§eai home <имя>§f - Телепорт на точку дома\n" +
                      "§eai delhome <имя>§f - Удалить точку дома\n" +
                      "§eai homelist§f - Список точек дома\n" +
                      "§eai roleplay <персонаж>§f - Задать роль\n" +
                      "§eai roleplay status§f - Показать текущую роль\n" +
                      "§eai roleplay reset§f - Сбросить роль";
    Level.displayClientMessage(helpMessage);
}

function onChat(message) {
    if (typeof message !== 'string' || !message) { return; }
    var usedAlias = ""; var messageLower = message.toLowerCase();
    for (var i = 0; i < COMMAND_ALIASES.length; i++) { var alias = COMMAND_ALIASES[i]; if (messageLower.startsWith(alias + " ") || messageLower === alias) { usedAlias = alias; break; } }
    if (!module.isActive() || usedAlias === "") { return; }
    preventDefault();
    var userPrompt = message.slice(usedAlias.length).trim();
    if (userPrompt.length === 0 || userPrompt === "help") { showHelp(); return; }
    var args = userPrompt.split(" ");
    var command = args.shift().toLowerCase();

    switch (command) {
        case "reset": conversationHistory = [systemPrompt]; messageCounter = 0; Level.displayClientMessage("§b[MineGPT] §eПамять очищена"); break;
        case "models":
            var subCommand = args.shift();
            if (subCommand === "list") { var modelList = "§aДоступные модели:§f\n"; for (var i = 0; i < availableModels.length; i++) { modelList += "§e" + (i + 1) + ". §f" + availableModels[i] + "\n"; } Level.displayClientMessage(modelList); }
            else if (subCommand === "set") { var modelNumber = parseInt(args.shift()); if (!isNaN(modelNumber) && modelNumber >= 1 && modelNumber <= availableModels.length) { currentModel = availableModels[modelNumber - 1]; Level.displayClientMessage("§b[MineGPT] §aМодель установлена на: §f" + currentModel); } else { Level.displayClientMessage("§b[MineGPT] §cНеверный номер :("); } }
            else { Level.displayClientMessage("§b[MineGPT] §cНеверная команда :("); }
            break;
        case "calc":
            var expression = args.join(" "); try { var result = eval(expression); Level.displayClientMessage("§e[Калькулятор] §fРезультат: " + result); }
            catch (e) { Level.displayClientMessage("§e[Калькулятор] §cОшибка :("); }
            break;
        case "count":
            var subCommand = args.shift();
            if (subCommand === "start") {
                if (isCounting) { Level.displayClientMessage("§6[Считалка] §cУже запущена ಠ_ಠ"); return; } isCounting = true; var delay = parseFloat(args.shift()) || 1.0; Level.displayClientMessage("§6[Считалка] §aЗапущена с частотой " + delay + " сек :)");
                new java.lang.Thread(new java.lang.Runnable({ "run": function() { for (var i = 1; i <= 10; i++) { if (!isCounting) break; Level.displayClientMessage("§6[Считалка] §f" + i); try { java.lang.Thread.sleep(delay * 1000); } catch (e) {} } isCounting = false; if (i > 10) Level.displayClientMessage("§6[Считалка] §aЗавершено :)"); }})).start();
            } else if (subCommand === "stop") {
                if (!isCounting) { Level.displayClientMessage("§6[Считалка] §cНе была запущена ಠ_ಠ"); return; } isCounting = false; Level.displayClientMessage("§6[Считалка] §cОстановлена");
            } else { Level.displayClientMessage("§b[MineGPT] §cНеверная команда :("); }
            break;
        case "fact":
            Level.displayClientMessage("§b[MineGPT] §7Ищу интересный факт... ᕕ( ᐛ )ᕗ");

            var factPrompt = [{ "role": "system", "content": "Ты — эрудит. Твоя задача — рассказать один интересный факт. ПРАВИЛА: 1. Всегда отвечай только на русском языке. 2. В ответе должен быть только сам факт, без лишних слов." }, { "role": "user", "content": "факт" }];
            new java.lang.Thread(new java.lang.Runnable({ "run": function() { try { var r = queryAI(factPrompt); sendLongMessage(r); } catch (e) { print(e); } }})).start();
            break;
        case "sethome":
            var name = args.shift();
            if (name) { var x = LocalPlayer.getPositionX(); var y = LocalPlayer.getPositionY(); var z = LocalPlayer.getPositionZ(); teleportPoints[name.toLowerCase()] = {x: x, y: y, z: z}; Level.displayClientMessage("§d[Дом] §aТочка дома '" + name + "' сохранена!"); }
            else { Level.displayClientMessage("§d[Дом] §cУкажи имя! >:("); }
            break;
        case "home":
            var name = args.shift();
            if (name && teleportPoints[name.toLowerCase()]) { var point = teleportPoints[name.toLowerCase()]; LocalPlayer.setPosition(point.x, point.y, point.z); Level.displayClientMessage("§d[Дом] §aТелепортация домой в точку '" + name + "'..."); }
            else { Level.displayClientMessage("§d[Дом] §cТочка дома не найдена :("); }
            break;
        case "homelist":
            var list = "§d--- Точки твоих домиков ---\n"; var count = 0;
            for (var name in teleportPoints) { var point = teleportPoints[name]; list += "§e" + name + "§f: " + Math.floor(point.x) + ", " + Math.floor(point.y) + ", " + Math.floor(point.z) + "\n"; count++; }
            if (count === 0) { list = "§d[Дом] §cНет сохраненных точек дома :("; }
            Level.displayClientMessage(list);
            break;
        case "delhome":
            var name = args.shift();
            if (name && teleportPoints[name.toLowerCase()]) { delete teleportPoints[name.toLowerCase()]; Level.displayClientMessage("§d[Дом] §eТочка дома '" + name + "' удалена"); }
            else { Level.displayClientMessage("§d[Дом] §cТочка дома не найдена :("); }
            break;
        case "roleplay":
            var subCommand = args.shift();
            if (subCommand === "reset") {
                systemPrompt.content = defaultSystemPrompt;
                Level.displayClientMessage("§b[MineGPT] §eРоль сброшена до обычного помощника");
            } else if (subCommand === "status") {
                Level.displayClientMessage("§b[MineGPT] §aТекущая роль: §f" + systemPrompt.content);
            } else if (subCommand) {
                var newRole = subCommand + " " + args.join(" ");
                systemPrompt.content = newRole.trim();
                Level.displayClientMessage("§b[MineGPT] §aНовая роль установлена!");
            } else {
                Level.displayClientMessage("§b[MineGPT] §cОпишите роль или используйте 'reset'/'status'");
            }
            conversationHistory = [systemPrompt];
            break;
        case "browser":
            var url = args.join(" ");
            if (!url) { Level.displayClientMessage("§b[MineGPT] §cУкажи ссылку! >:( Например: google.com или youtube.com"); return; }
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = "https://" + url;
            }
            openInGameBrowser(url);
            break;
        default:
            Level.displayClientMessage("§b[MineGPT] §7Думает...");
            conversationHistory.push({ "role": "user", "content": userPrompt }); messageCounter++;
            if (conversationHistory.length > MAX_HISTORY_LENGTH + 1) { conversationHistory = [systemPrompt].concat(conversationHistory.slice(-MAX_HISTORY_LENGTH)); }
            new java.lang.Thread(new java.lang.Runnable({ "run": function() {
                try {
                    var aiResponse = queryAI(conversationHistory);
                    var cleanedResponse = aiResponse.replace(/(\r\n|\n|\r)/gm, " ").replace(/[*#]/g, "");
                    
                    conversationHistory.push({ "role": "assistant", "content": cleanedResponse }); messageCounter++;
                    if (messageCounter >= MEMORY_SUMMARIZE_TRIGGER) { summarizeMemory(); messageCounter++; }
                    sendLongMessage(cleanedResponse);
                } catch (e) { print(e); }
            }})).start();
            break;
    }
}

function onScriptEnabled() { ModuleManager.addModule(module); Level.displayClientMessage("§b[MineGPT]§a Модуль загружен! Напиши §eai help§a для помощи в использовании ^^"); }
function onScriptDisabled() { isCounting = false; ModuleManager.removeModule(module); }