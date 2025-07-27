// by toxindixhion

// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI

const themes = {
    dark: {
        backgroundColor: [0.12, 0.12, 0.12, 0.75],
        headerBackgroundColor: [0.25, 0.25, 0.25, 0.75],
        separatorColor: [0.25, 0.25, 0.25, 0.75]
    },
    black: {
        backgroundColor: [0.0, 0.0, 0.0, 0.75],
        headerBackgroundColor: [0.1, 0.1, 0.1, 0.75],
        separatorColor: [0.15, 0.15, 0.15, 0.75]
    },
    white: {
        backgroundColor: [0.8, 0.8, 0.8, 0.75],
        headerBackgroundColor: [0.95, 0.95, 0.95, 0.75],
        separatorColor: [0.7, 0.7, 0.7, 0.75]
    },
    red: {
        backgroundColor: [0.5, 0.05, 0.1, 0.75],
        headerBackgroundColor: [0.75, 0.1, 0.15, 0.75],
        separatorColor: [0.4, 0.0, 0.0, 0.75]
    },
    green: {
        backgroundColor: [0.05, 0.3, 0.05, 0.75],
        headerBackgroundColor: [0.1, 0.5, 0.1, 0.75],
        separatorColor: [0.0, 0.2, 0.0, 0.75]
    },
    blue: {
        backgroundColor: [0.05, 0.1, 0.5, 0.75],
        headerBackgroundColor: [0.1, 0.15, 0.75, 0.75],
        separatorColor: [0.0, 0.0, 0.4, 0.75]
    },
    purple: {
        backgroundColor: [0.3, 0.05, 0.3, 0.75],
        headerBackgroundColor: [0.5, 0.1, 0.5, 0.75],
        separatorColor: [0.2, 0.0, 0.2, 0.75]
    },
    orange: {
        backgroundColor: [0.6, 0.2, 0.05, 0.75],
        headerBackgroundColor: [0.8, 0.3, 0.1, 0.75],
        separatorColor: [0.5, 0.15, 0.0, 0.75]
    },
    pink: {
        backgroundColor: [0.7, 0.3, 0.4, 0.75],
        headerBackgroundColor: [0.9, 0.4, 0.5, 0.75],
        separatorColor: [0.6, 0.2, 0.3, 0.75]
    },
    cyan: {
        backgroundColor: [0.05, 0.4, 0.4, 0.75],
        headerBackgroundColor: [0.1, 0.6, 0.6, 0.75],
        separatorColor: [0.0, 0.3, 0.3, 0.75]
    },
    yellow: {
        backgroundColor: [0.7, 0.7, 0.05, 0.75],
        headerBackgroundColor: [0.9, 0.9, 0.1, 0.75],
        separatorColor: [0.6, 0.6, 0.0, 0.75]
    }
};

const settings = {
    language: 'ru',
    hud: {
        enabled: true,
        position: 'top-right',
        scale: 1.0,
        minWidth: 225,
        currentTheme: 'dark',
        textColor: '§f',
        labelColor: '§f',
        customTitle: null
    },
    components: {
        name: true,
        coords: true,
        health: true,
        time: true,
        fps: true,
        ping: true
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName];
    if (theme) {
        settings.hud.backgroundColor = theme.backgroundColor;
        settings.hud.headerBackgroundColor = theme.headerBackgroundColor;
        settings.hud.separatorColor = theme.separatorColor;
        settings.hud.currentTheme = themeName;

        if (themeName === "black") {
            settings.hud.textColor = "§f";
        } else if (themeName === "white") {
            settings.hud.textColor = "";
        }

        return true;
    }
    return false;
}

applyTheme(settings.hud.currentTheme);

const translations = {
    ru: {
        hudTitle: "§l§fINFORMATION",
        playerName: "§lНикнейм",
        health: "§lЗдоровье",
        coords: "§lКоординаты",
        fps: "§lФпс",
        ping: "§lПинг",
        time: "§lВремя",
        scriptLoaded: "§a[HUD]§f Скрипт виджета обновлен! Введите §e.hud help§f для помощи.",
        scriptUnloaded: "§c[HUD]§f Скрипт виджета выгружен.",
        hudEnabled: "§a[HUD] Виджет включен.",
        hudDisabled: "§c[HUD] Виджет выключен.",
        componentToggle: (name, status) => `§f[HUD] Компонент '${name}' ${status}.`,
        statusEnabled: "§aвключен",
        statusDisabled: "§cвыключен",
        unknownComponent: (components) => `§c[HUD] Неизвестный компонент. Доступные: ${components}`,
        positionChanged: (pos) => `§f[HUD] Позиция изменена на ${pos}.`,
        invalidPosition: "§c[HUD] Неверная позиция. Используйте: top-left, top-right, bottom-left, bottom-right.",
        scaleChanged: (scale) => `§f[HUD] Масштаб изменен на ${scale}.`,
        invalidScale: "§c[HUD] Неверное значение масштаба. Введите число от 0.2 до 5.",
        widthChanged: (width) => `§f[HUD] Ширина изменена на ${width}.`,
        invalidWidth: "§c[HUD] Неверное значение ширины. Введите число от 50 до 500.",
        languageChanged: "§a[HUD] Язык изменен на Русский.",
        invalidLanguage: "§c[HUD] Неверный язык. Используйте 'ru' или 'en'.",
        themeChanged: (theme) => `§a[HUD] Тема изменена на '${theme}'.`,
        invalidTheme: (themes) => `§c[HUD] Неизвестная тема. Доступные: ${themes}.`,
        titleChanged: (title) => `§a[HUD] Заголовок изменен на '${title}'.`,
        changeTextColor: (colorCode) => `§a[HUD] Цвет текста изменён на '${colorCode}'`,
        invalidTextColor: "§c[HUD] Неверный цвет. Используйте коды типа §f, §0, §c и т.д.",
        helpTextColor: "§a.hud textcolor <код> §7- Установить цвет текста в HUD.",
        helpTitle: "§l§e--- HUD Help ---",
        helpToggle: "§a.hud on/off §7- Включить или выключить виджет.",
        helpToggleComponent: "§a.hud toggle <компонент> §7- Переключить видимость компонента.",
        helpAvailableComponents: `§7(Доступные: ${Object.keys(settings.components).join(', ')})`,
        helpPosition: "§a.hud position <позиция> §7- Изменить положение на экране.",
        helpAvailablePositions: "§7(Доступные: top-left, top-right, bottom-left, bottom-right)",
        helpScale: "§a.hud scale <число> §7- Изменить масштаб виджета (по умолчанию - 1.0).",
        helpWidth: "§a.hud width <число> §7- Изменить минимальную ширину виджета (по умолчанию - 225).",
        helpLang: "§a.hud lang <ru|en> §7- Сменить язык скрипта (по умолчанию - ru).",
        helpTheme: `§a.hud theme <тема> §7- Сменить цветовую тему виджета. (Доступные: ${Object.keys(themes).join(', ')})`,
        helpTitleCommand: "§a.hud title <текст> §7- Установить заголовок виджета.",
        helpHelp: "§a.hud help §7- Показать это сообщение."
    },
    en: {
        hudTitle: "§l§fINFORMATION",
        playerName: "Nickname",
        health: "Health",
        coords: "Coordinates",
        fps: "Fps",
        ping: "Ping",
        time: "Time",
        scriptLoaded: "§a[HUD]§f HUD script updated! Type §e.hud help§f for assistance.",
        scriptUnloaded: "§c[HUD]§f HUD script unloaded.",
        hudEnabled: "§a[HUD] HUD enabled.",
        hudDisabled: "§c[HUD] HUD disabled.",
        componentToggle: (name, status) => `§f[HUD] Component '${name}' is now ${status}.`,
        statusEnabled: "§aenabled",
        statusDisabled: "§cdisabled",
        unknownComponent: (components) => `§c[HUD] Unknown component. Available: ${components}`,
        positionChanged: (pos) => `§f[HUD] Position changed to ${pos}.`,
        invalidPosition: "§c[HUD] Invalid position. Use: top-left, top-right, bottom-left, bottom-right.",
        scaleChanged: (scale) => `§f[HUD] Scale changed to ${scale}.`,
        invalidScale: "§c[HUD] Invalid scale value. Enter a number between 0.2 and 5.",
        widthChanged: (width) => `§f[HUD] Width changed to ${width}.`,
        invalidWidth: "§c[HUD] Invalid width value. Enter a number between 50 and 500.",
        languageChanged: "§a[HUD] Language changed to English.",
        invalidLanguage: "§c[HUD] Invalid language. Use 'ru' or 'en'.",
        themeChanged: (theme) => `§a[HUD] Theme changed to '${theme}'.`,
        invalidTheme: (themes) => `§c[HUD] Unknown theme. Available: ${themes}.`,
        titleChanged: (title) => `§a[HUD] Title changed to '${title}'.`,
        changeTextColor: (colorCode) => `§a[HUD] Text color changed to '${colorCode}'`,
        invalidTextColor: "§c[HUD] Invalid color. Use codes like §f, §0, §c, etc.",
        helpTextColor: "§a.hud textcolor <code> §7- Set the HUD text color.",
        helpTitle: "§l§e--- HUD Help ---",
        helpToggle: "§a.hud on/off §7- Enable or disable the HUD.",
        helpToggleComponent: "§a.hud toggle <component> §7- Toggle a component's visibility.",
        helpAvailableComponents: `§7(Available: ${Object.keys(settings.components).join(', ')})`,
        helpPosition: "§a.hud position <position> §7- Change the on-screen position.",
        helpAvailablePositions: "§7(Available: top-left, top-right, bottom-left, bottom-right)",
        helpScale: "§a.hud scale <number> §7- Change the HUD scale (the default value is 1.0).",
        helpWidth: "§a.hud width <number> §7- Change the minimum HUD width (the default value is 225).",
        helpLang: "§a.hud lang <ru|en> §7- Change the script language (the default value is ru).",
        helpTheme: `§a.hud theme <theme> §7- Change the widget color theme. (Available: ${Object.keys(themes).join(', ')})`,
        helpTitleCommand: "§a.hud title <text> §7- Set a custom widget title.",
        helpHelp: "§a.hud help §7- Show this help message."
    }
};

let g_currentSpeed = 0;
let g_canCrit = false;
let registeredCommands = [];

function onScriptEnable() {
    registerCommands();
    Level.displayClientMessage(translations[settings.language].scriptLoaded);
}

function onScriptDisable() {
    unregisterCommands();
    Level.displayClientMessage(translations[settings.language].scriptUnloaded);
}

function onTick() {
    if (!isInGame()) return;
    try {
        const playerVel = LocalPlayer.getVel();
        g_currentSpeed = Math.sqrt(Math.pow(playerVel[0], 2) + Math.pow(playerVel[2], 2)) * 20;
        g_canCrit = LocalPlayer.getFallDistance() > 0 && !LocalPlayer.isInWater() && !LocalPlayer.isOnLadder();
    } catch (e) {
        g_currentSpeed = 0;
        g_canCrit = false;
    }
}

function onPostRender() {
    if (!isInGame() || !settings.hud.enabled) return;
    try {
        renderHud();
    } catch (e) {
        log(`[HUD] Render error: ${e.message}`);
    }
}

function gatherHudLines() {
    const lines = [];
    const t = translations[settings.language];
    const { textColor } = settings.hud;
    const comps = settings.components;

    if (comps.name) {
        const playerName = LocalPlayer.getUsername();
        lines.push({ label: t.playerName, value: `${playerName.split('\n')[0]}` });
    }
    if (comps.coords) {
        const pos = LocalPlayer.getPos();
        lines.push({ label: t.coords, value: `${pos[0].toFixed(1)}, ${pos[1].toFixed(1)}, ${pos[2].toFixed(1)}` });
    }
    if (comps.health) {
        const playerHealth = LocalPlayer.getHealth();
        const healthColor = playerHealth > 10 ? '' : (playerHealth > 5 ? '' : '');
        lines.push({ label: t.health, value: `${healthColor}${playerHealth.toFixed(1)} / 20` });
    }
    if (comps.time) {
        const d = new Date();
        const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
        lines.push({ label: t.time, value: timeStr });
    }
    if (comps.fps) {
        lines.push({ label: t.fps, value: `${Game.getFPS()} fps` });
    }
    if (comps.ping) {
        lines.push({ label: t.ping, value: `${Game.getPing()} ms` });
    }

    return lines;
}

function renderHud() {
    const lines = gatherHudLines();
    if (lines.length === 0) return;

    const t = translations[settings.language];
    const { position, scale, minWidth, backgroundColor, headerBackgroundColor, separatorColor, labelColor, textColor } = settings.hud;
    const padding = 5 * scale;
    const lineHeight = 11 * scale;
    const headerHeight = 12 * scale + (padding * 2);
    const title = settings.hud.customTitle !== null ? settings.hud.customTitle : t.hudTitle;

    let maxLabelWidth = 0;
    lines.forEach(line => {
        if (line.label) {
            const labelWidth = Renderer.getTextWidth(line.label.replace(/§[0-9a-fklmnor]/g, ''), scale);
            if (labelWidth > maxLabelWidth) {
                maxLabelWidth = labelWidth;
            }
        }
    });

    let maxValueWidth = 0;
    lines.forEach(line => {
        if (line.value) {
            const valueWidth = Renderer.getTextWidth(line.value.replace(/§[0-9a-fklmnor]/g, ''), scale);
            if (valueWidth > maxValueWidth) {
                maxValueWidth = valueWidth;
            }
        }
    });

    const totalWidth = Math.max(minWidth * scale, maxLabelWidth + maxValueWidth + padding * 3);
    let totalHeight = headerHeight;
    lines.forEach(line => {
        totalHeight += (line.type === 'separator' ? padding : lineHeight);
    });
    totalHeight += padding;

    const screenWidth = Game.getScreenWidth();
    const screenHeight = Game.getScreenHeight();
    let startX, startY;

    switch (position) {
        case 'top-right': startX = screenWidth - totalWidth - 10; startY = 10; break;
        case 'bottom-left': startX = 10; startY = screenHeight - totalHeight - 10; break;
        case 'bottom-right': startX = screenWidth - totalWidth - 10; startY = screenHeight - totalHeight - 10; break;
        default: startX = 10; startY = 10; break;
    }

    Renderer.drawFilledRect([startX, startY], [startX + totalWidth, startY + totalHeight], backgroundColor);
    Renderer.drawFilledRect([startX, startY], [startX + totalWidth, startY + headerHeight], headerBackgroundColor);

    const titleWidth = Renderer.getTextWidth(title.replace(/§[0-9a-fklmnor]/g, ''), scale * 1.1);
    const titleX = startX + (totalWidth / 2) - (titleWidth / 2);
    Renderer.drawText(title, [titleX, startY + padding], [1, 1, 1, 1], 0, scale * 1.1);

    let currentY = startY + headerHeight + padding / 2;

    lines.forEach(line => {
        if (line.type === 'separator') {
            currentY += padding / 2;
            Renderer.drawFilledRect([startX + padding, currentY], [startX + totalWidth - padding, currentY + 1], separatorColor);
            currentY += padding / 2;
            return;
        }

        if (line.label) {
            Renderer.drawText(`${labelColor}${line.label}`, [startX + padding, currentY], [1, 1, 1, 1], 0, scale);
        }
        if (line.value) {
            const valueWidth = Renderer.getTextWidth(line.value.replace(/§[0-9a-fklmnor]/g, ''), scale);
            Renderer.drawText(`${textColor}${line.value}`, [startX + totalWidth - padding - valueWidth, currentY], [1, 1, 1, 1], 0, scale);
        }
        currentY += lineHeight;
    });
}

function handleHudCommand(args) {
    const subCommand = args[1] ? args[1].toLowerCase() : "help";
    const t = translations[settings.language];

    switch (subCommand) {
        case "on": settings.hud.enabled = true; Level.displayClientMessage(t.hudEnabled); break;
        case "off": settings.hud.enabled = false; Level.displayClientMessage(t.hudDisabled); break;
        case "toggle": {
            if (component && settings.components.hasOwnProperty(component)) {
                settings.components[component] = !settings.components[component];
                const status = settings.components[component] ? t.statusEnabled : t.statusDisabled;
                Level.displayClientMessage(t.componentToggle(component, status));
            } else {
                Level.displayClientMessage(t.unknownComponent(Object.keys(settings.components).join(', ')));
            }
            break;
        }
        case "position": {
            const pos = args[2] ? args[2].toLowerCase() : null;
            const validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
            if (pos && validPositions.includes(pos)) {
                settings.hud.position = pos;
                Level.displayClientMessage(t.positionChanged(pos));
            } else {
                Level.displayClientMessage(t.invalidPosition);
            }
            break;
        }
        case "scale": {
            const newScale = parseFloat(args[2]);
            if (!isNaN(newScale) && newScale > 0.1 && newScale < 5) {
                settings.hud.scale = newScale;
                Level.displayClientMessage(t.scaleChanged(newScale));
            } else {
                Level.displayClientMessage(t.invalidScale);
            }
            break;
        }
        case "width": {
            const newWidth = parseInt(args[2]);
            if (!isNaN(newWidth) && newWidth >= 50 && newWidth <= 500) {
                settings.hud.minWidth = newWidth;
                Level.displayClientMessage(t.widthChanged(newWidth));
            } else {
                Level.displayClientMessage(t.invalidWidth);
            }
            break;
        }
        case "lang":
        case "language": {
            const newLang = args[2] ? args[2].toLowerCase() : null;
            if (newLang === 'ru' || newLang === 'en') {
                settings.language = newLang;
                Level.displayClientMessage(translations[settings.language].languageChanged);
            } else {
                Level.displayClientMessage(t.invalidLanguage);
            }
            break;
        }
        case "theme": {
            const newTheme = args[2] ? args[2].toLowerCase() : null;
            if (newTheme && applyTheme(newTheme)) {
                Level.displayClientMessage(t.themeChanged(newTheme));
            } else {
                Level.displayClientMessage(t.invalidTheme(Object.keys(themes).join(', ')));
            }
            break;
        }
        case "textcolor": {
            const color = args[2];
            if (typeof color === "string" && /^§[0-9a-f]$/i.test(color)) {
            settings.hud.textColor = color;
            Level.displayClientMessage(t.changeTextColor(color));
        } else {
            Level.displayClientMessage(t.invalidTextColor);
            }
            break;
}
        case "title": {
            const newTitle = args.slice(2).join(' ');
            if (newTitle) {
                settings.hud.customTitle = newTitle;
                Level.displayClientMessage(t.titleChanged(newTitle));
            } else {
                settings.hud.customTitle = null;
                Level.displayClientMessage(t.titleChanged(t.hudTitle));
            }
            break;
        }
        default: displayHelp(); break;
    }
}

function displayHelp() {
    const t = translations[settings.language];
    Level.displayClientMessage(t.helpTitle);
    Level.displayClientMessage(t.helpToggle);
    Level.displayClientMessage(t.helpToggleComponent);
    Level.displayClientMessage(`§7(Доступные: ${Object.keys(settings.components).join(', ')})`);
    Level.displayClientMessage(t.helpPosition);
    Level.displayClientMessage(t.helpAvailablePositions);
    Level.displayClientMessage(t.helpScale);
    Level.displayClientMessage(t.helpWidth);
    Level.displayClientMessage(t.helpLang);
    Level.displayClientMessage(t.helpTheme);
    Level.displayClientMessage(t.helpTitleCommand);
    Level.displayClientMessage(t.helpTextColor);
    Level.displayClientMessage(t.helpHelp);
}

function registerCommands() {
    unregisterCommands();
    const hudCommand = new Command("hud", "Управление виджетом HUD.", ".hud <subcommand> [args]", { onExecute: (args) => handleHudCommand(args) }, []);
    CommandManager.addCommand(hudCommand);
    registeredCommands.push(hudCommand);
}

function unregisterCommands() {
    registeredCommands.forEach(cmd => {
        if (cmd) CommandManager.removeCommand(cmd);
    });
    registeredCommands = [];
}

function log(message) {
    log(`[HUD] ${message}`);
}

// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI
// ???????????????????????????????????????????????? IDITE NAHUI



















































































































































































































































































































































































































































































































