const module = new Module("ChatBot_Ban2.0", true, true, ModuleCategory.MISC);

let playerMessages = {}; // Хранение сообщений игроков
let messageThreshold = 4; // Количество повторений для объявления нарушителем

// Список слов для фильтрации (увеличено до 300 слов)
const badWords = [
    "блядь", "сука", "пидор", "хуй", "урод", "тупой", "дебил", "козел", "мудила",
    "жопа", "гандон", "педик", "гнида", "сучка", "тварь", "пошел в жопу", "уродина", "петух",
    "сучар", "гондоны", "выебать", "залупа", "пизда", "хуесос", "отсосать", "похуист", "ебать",
    "сосать", "засос", "соска", "жопник", "ебливый", "охуел", "блядский", "курва", "гебня", "куриный",
    "лох", "педарас", "ебать", "дрочить", "ебанутый", "пиздатый", "пидорский", "пидр",
    "сучий", "чмо", "чмоеб", "гандонить", "придурок", "свиное", "блядовать", "голая жопа",
    "чисто ебаный", "шлюха", "псина", "бомж", "жертва", "пиздюк", "отстой", "ебаный", "ебучий", "покемон",
    "пиздуй", "в жопу", "на хуй", "нахуя", "нахер", "козлина", "ебанутые", "сучара", "покидать", "мразь",
    "пахать на хуй", "черножопый", "ебучий", "даун", "отморозок", "придурок", "запарить", "гад", "гуджон",
    "пидорасина", "задрот", "сикс", "клоун", "гомосек", "сучий сын", "морозилка", "петушка", "чипсинка",
    "смотри как обрубило", "пресс", "трахать", "сраная", "ебальник", "пухлик", "шлюш", "сдох", "смешной",
    "сукин сын", "скажи что ты задрот", "выродок", "трахарь", "себя в гроб", "молодая тварь",
    "нахуй иди", "проебал", "какая блядь", "пиздец", "ебашить", "кричать", "перебирать", "кикать", "драчун",
    "ублюдок", "тупая мразь", "соси жопу", "пикап", "петухобрат", "трахнул","затрахать",
    "ебло", "свинья", "ебанный рот", "хабал", "мутная", "покажись в живую", "шалава",
    "чмошник", "молоко ебаное", "капеник", "негр", "шарик", "сука ты", "паскуда", "пикапер", "вшивый", "долбоеб", "балван",
    "колдун", "гнильё", "черта", "лузер", "голос сраный", "торчок", "свинарник", "гребаный", "дерьмо",
    "блядство", "блядовать", "сучара", "поганый", "сука ебучая", "гниль", "сраный", "поебень", 
    "всратый", "задохлик", "педофил", "ебаный рот", "мудила", "долбаеб", "псина ебаная", "взял в рот", 
    "трахаться", "пацан ебаный", "гнильца", "сучий син", "ублюдочный", "пиздос", "хребет ебучий",
    "наебал", "наебщик", "пососи", "типа пидор", "обосранный", "сучка ебаная", "мразота", 
    "сука ты", "залупа", "бляди", "иудиот", "жирдяй", "курва сраная", "хрен", "ебала тварь", 
    "хуячил", "сраная сука", "сучатина", "конченый", "залупиться", "мразь с бляди", "блядский",
    "херня", "сучин сын", "пошел на хуй", "инвалид", "выебывать", "гнида ты", "трахай меня", 
    "жрешь говно", "сука мразь", "припиздишься", "выебался", "слизняк ебаный", "сука тупая",
    "блядище", "поехавший на всю голову", "ебать за всех", "нечем ебаться", "пососи хуй"
];

// Функция для очистки сообщения от форматирования
function cleanMessage(message) {
    return message.replace(/\§[0-9A-FK-OR]/ig, "").toLowerCase();
}

function checkForRepeatedMessages(playerName, message) {
    const cleanedMessage = cleanMessage(message);

    if (!playerMessages[playerName]) {
        playerMessages[playerName] = [];
    }

    // Проверяем, если сообщение уже было отправлено более 4 раз
    const messageCount = playerMessages[playerName].filter(msg => msg === cleanedMessage).length;
    if (messageCount >= messageThreshold) {
        LocalPlayer.sendChatMessage("/mute " + playerName + " 60 Спам.");
        return true;
    }

    // Добавляем сообщение в историю игрока
    playerMessages[playerName].push(cleanedMessage);
    return false;
}

function getSimilarWords(message) {
    // Получаем слова из сообщения
    const words = message.split(/\s+/).map(word => word.replace(/[^\w\s]/g, ''));
    
    // Сортируем слова и фильтруем повторяющиеся
    const wordCount = {};
    words.forEach(word => {
        if (wordCount[word]) {
            wordCount[word]++;
        } else {
            wordCount[word] = 1;
        }
    });

    // Фильтруем только те слова, которые повторяются более одного раза
    return Object.keys(wordCount).filter(word => wordCount[word] > 1);
}

// Функция для проверки, содержит ли сообщение мат или оскорбления
function containsBadWords(message) {
    let cleanMsg = cleanMessage(message);
    for (let word of badWords) {
        if (cleanMsg.includes(word)) {
            return true; // Если слово найдено, возвращаем true
        }
    }
    return false; // Если не нашли запрещенных слов
}

function checkForSimilarWords(playerName, message) {
    const cleanedMessage = cleanMessage(message);
    const similarWords = getSimilarWords(cleanedMessage);

    // Если есть 3 или больше похожих слов
    if (similarWords.length >= 3) {
        LocalPlayer.sendChatMessage("/mute " + playerName + " 60 Спам.");
        return true;
    }

    return false;
}

function extractPlayerName(message) {
    const colonIndex = message.indexOf(":");
    if (colonIndex !== -1) {
        const beforeColon = message.substring(0, colonIndex).trim();
        const parts = beforeColon.split(" ");
        return parts[parts.length - 1]; // Последнее слово перед двоеточием
    }
    return "";
}

// Функция обработки входящих сообщений
function onReceiveServerMessage(message) {
    if (module.isActive()) {

        const playerNamee = extractPlayerName(message);
        const cleanedMessage = cleanMessage(message);

        // Проверка на одинаковые сообщения
        if (checkForRepeatedMessages(playerNamee, message)) {
            return;
        }

        // Проверка на похожие слова
        if (checkForSimilarWords(playerNamee, message)) {
            return;
        }
        
        if (containsBadWords(message)) {

        // Находим двоеточие и извлекаем слово слева от него
        const colonIndex = cleanedMessage.indexOf(":");
        if (colonIndex !== -1) {
            const beforeColon = cleanedMessage.substring(0, colonIndex).trim();
            const parts = beforeColon.split(" ");
            const playerName = parts[parts.length - 1]; // Последнее слово перед двоеточием
            if (playerName) {
            print("Ник нарушителя: " + playerName);
            LocalPlayer.sendChatMessage("/ban " + playerName + " Найдено оскорбление в сообщении: " + message);
            } else {
            print("Неудалось извлечь ник.")
            }
            // Здесь можно заблокировать, отреагировать или удалить сообщение
            }
        }
    }
}

function onScriptEnabled() {
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
}
