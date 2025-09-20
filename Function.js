var module = new Module("Function", true, true, ModuleCategory.OTHER);
var showingMenu = false;

var menuW;
var menuA;
var menuS;
var menuD;
var menuLBC;
var menuRBC;
var menuFooter;

var backgroundDrawableW;
var backgroundDrawableA;
var backgroundDrawableS;
var backgroundDrawableD;
var backgroundDrawableLBC;
var backgroundDrawableRBC;
var backgroundDrawableFooter;

var menuTextViewLBC;
var menuTextViewRBC;
var menuTextViewFooter;

var xOffsetSlider;
var yOffsetSlider;

var menuWX = 110;
var menuWY = 50;
var menuAX = 50;
var menuAY = 110;
var menuSX = 110;
var menuSY = 110;
var menuDX = 170;
var menuDY = 110;
var menuLBCX = 50;
var menuLBCY = 170;
var menuRBCX = 143;
var menuRBCY = 170;
var menuFooterX = 50;
var menuFooterY = 230;

var lastAttackClickTimes = [];
var lastUseItemClickTimes = [];
const CPS_WINDOW_MS = 1000;

function createMenu(text, width, height) {
    var context = getContext();
    if (!context) {
        Level.displayClientMessage("Context is null, cannot create menu for " + text + ".");
        return null;
    }

    var menu = new android.widget.PopupWindow(context);
    var layout = new android.widget.LinearLayout(context);
    layout.setOrientation(android.widget.LinearLayout.VERTICAL);

    layout.setLayoutParams(new android.widget.LinearLayout.LayoutParams(width, height));

    var backgroundDrawable = new android.graphics.drawable.GradientDrawable();
    backgroundDrawable.setCornerRadius(5);

    var frameLayout = new android.widget.FrameLayout(context);
    frameLayout.setLayoutParams(new android.widget.LinearLayout.LayoutParams(width, height));
    frameLayout.setBackgroundDrawable(backgroundDrawable);

    var menuTextView = new android.widget.TextView(context);
    menuTextView.setText(text);
    menuTextView.setTextSize(17);
    menuTextView.setTextColor(android.graphics.Color.WHITE);
    menuTextView.setGravity(android.view.Gravity.CENTER);
    frameLayout.addView(menuTextView);

    menu.setContentView(frameLayout);
    menu.setWidth(width);
    menu.setHeight(height);
    menu.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
    menu.setFocusable(false);
    menu.update();

    return {
        menu: menu,
        background: backgroundDrawable,
        textView: menuTextView
    };
}

function updateMenuColorAndText() {
    getContext().runOnUiThread(new java.lang.Runnable({
        run: function() {
            var currentLBC_Cps = calculateLBC_Cps();
            var currentRBC_Cps = calculateRBC_Cps();
            var isJumping = !LocalPlayer.isOnGround();
            var isSneaking = LocalPlayer.isSneaking();

            if (menuW && backgroundDrawableW) {
                if (LocalPlayer.isMovingForward()) {
                    backgroundDrawableW.setColor(android.graphics.Color.LTGRAY);
                } else {
                    backgroundDrawableW.setColor(android.graphics.Color.argb(150, 0, 0, 0));
                }
            }
            if (menuA && backgroundDrawableA) {
                if (LocalPlayer.isMoveButtonPressed(MoveButton.LEFT)) {
                    backgroundDrawableA.setColor(android.graphics.Color.LTGRAY);
                } else {
                    backgroundDrawableA.setColor(android.graphics.Color.argb(150, 0, 0, 0));
                }
            }
            if (menuS && backgroundDrawableS) {
                if (LocalPlayer.isMoveButtonPressed(MoveButton.BACK)) {
                    backgroundDrawableS.setColor(android.graphics.Color.LTGRAY);
                } else {
                    backgroundDrawableS.setColor(android.graphics.Color.argb(150, 0, 0, 0));
                }
            }
            if (menuD && backgroundDrawableD) {
                if (LocalPlayer.isMoveButtonPressed(MoveButton.RIGHT)) {
                    backgroundDrawableD.setColor(android.graphics.Color.LTGRAY);
                } else {
                    backgroundDrawableD.setColor(android.graphics.Color.argb(150, 0, 0, 0));
                }
            }
            if (menuLBC && backgroundDrawableLBC && menuTextViewLBC) {
                if (currentLBC_Cps > 0) {
                    backgroundDrawableLBC.setColor(android.graphics.Color.LTGRAY);
                } else {
                    backgroundDrawableLBC.setColor(android.graphics.Color.argb(150, 0, 0, 0));
                }
                menuTextViewLBC.setText("" + currentLBC_Cps + " CPS");
            }

            if (menuRBC && backgroundDrawableRBC && menuTextViewRBC) {
                if (currentRBC_Cps > 0) {
                    backgroundDrawableRBC.setColor(android.graphics.Color.LTGRAY);
                } else {
                    backgroundDrawableRBC.setColor(android.graphics.Color.argb(150, 0, 0, 0));
                }
                menuTextViewRBC.setText("" + currentRBC_Cps + " CPS");
            }

            if (menuFooter && backgroundDrawableFooter && menuTextViewFooter) {
                if (isJumping && isSneaking) {
                    backgroundDrawableFooter.setColor(android.graphics.Color.LTGRAY);
                    menuTextViewFooter.setText("J & S");
                } else if (isJumping) {
                    backgroundDrawableFooter.setColor(android.graphics.Color.LTGRAY);
                    menuTextViewFooter.setText("JUMP");
                } else if (isSneaking) {
                    backgroundDrawableFooter.setColor(android.graphics.Color.LTGRAY);
                    menuTextViewFooter.setText("SNEAK");
                } else {
                    backgroundDrawableFooter.setColor(android.graphics.Color.argb(150, 0, 0, 0));
                    menuTextViewFooter.setText("—");
                }
            }
        }
    }));
}

function showMenus() {
    if (!showingMenu && menuW) {
        var xOffset = xOffsetSlider ? xOffsetSlider.getCurrentValue() : 0;
        var yOffset = yOffsetSlider ? yOffsetSlider.getCurrentValue() : 0;

        getContext().runOnUiThread(new java.lang.Runnable({
            run: function() {
                menuW.showAtLocation(getContext().getWindow().getDecorView(), android.view.Gravity.NO_GRAVITY, menuWX + xOffset, menuWY + yOffset);
                menuA.showAtLocation(getContext().getWindow().getDecorView(), android.view.Gravity.NO_GRAVITY, menuAX + xOffset, menuAY + yOffset);
                menuS.showAtLocation(getContext().getWindow().getDecorView(), android.view.Gravity.NO_GRAVITY, menuSX + xOffset, menuSY + yOffset);
                menuD.showAtLocation(getContext().getWindow().getDecorView(), android.view.Gravity.NO_GRAVITY, menuDX + xOffset, menuDY + yOffset);
                menuLBC.showAtLocation(getContext().getWindow().getDecorView(), android.view.Gravity.NO_GRAVITY, menuLBCX + xOffset, menuLBCY + yOffset);
                menuRBC.showAtLocation(getContext().getWindow().getDecorView(), android.view.Gravity.NO_GRAVITY, menuRBCX + xOffset, menuRBCY + yOffset);
                menuFooter.showAtLocation(getContext().getWindow().getDecorView(), android.view.Gravity.NO_GRAVITY, menuFooterX + xOffset, menuFooterY + yOffset);
            }
        }));
        showingMenu = true;
    }
}

function hideMenus() {
    if (showingMenu) {
        if (menuW) menuW.dismiss();
        if (menuA) menuA.dismiss();
        if (menuS) menuS.dismiss();
        if (menuD) menuD.dismiss();
        if (menuLBC) menuLBC.dismiss();
        if (menuRBC) menuRBC.dismiss();
        if (menuFooter) menuFooter.dismiss();
        showingMenu = false;
    }
}

function updateMenusPosition() {
    if (!showingMenu) return;
    
    var xOffset = xOffsetSlider ? xOffsetSlider.getCurrentValue() : 0;
    var yOffset = yOffsetSlider ? yOffsetSlider.getCurrentValue() : 0;
    
    getContext().runOnUiThread(new java.lang.Runnable({
        run: function() {
            if (menuW) menuW.update(menuWX + xOffset, menuWY + yOffset, -1, -1);
            if (menuA) menuA.update(menuAX + xOffset, menuAY + yOffset, -1, -1);
            if (menuS) menuS.update(menuSX + xOffset, menuSY + yOffset, -1, -1);
            if (menuD) menuD.update(menuDX + xOffset, menuDY + yOffset, -1, -1);
            if (menuLBC) menuLBC.update(menuLBCX + xOffset, menuLBCY + yOffset, -1, -1);
            if (menuRBC) menuRBC.update(menuRBCX + xOffset, menuRBCY + yOffset, -1, -1);
            if (menuFooter) menuFooter.update(menuFooterX + xOffset, menuFooterY + yOffset, -1, -1);
        }
    }));
}

function calculateLBC_Cps() {
    var now = java.lang.System.currentTimeMillis();
    while (lastAttackClickTimes.length > 0 && lastAttackClickTimes[0] < now - CPS_WINDOW_MS) {
        lastAttackClickTimes.shift();
    }
    return Math.floor(lastAttackClickTimes.length);
}

function calculateRBC_Cps() {
    var now = java.lang.System.currentTimeMillis();
    while (lastUseItemClickTimes.length > 0 && lastUseItemClickTimes[0] < now - CPS_WINDOW_MS) {
        lastUseItemClickTimes.shift();
    }
    return Math.floor(lastUseItemClickTimes.length);
}

function onLevelTick() {
    if (module.isActive()) {
        if (!showingMenu) {
            showMenus();
        }
        updateMenuColorAndText();
        updateMenusPosition();
    } else if (showingMenu) {
        hideMenus();
    }
}

function onAttack(playerID) {
    if (module.isActive()) {
        lastUseItemClickTimes.push(java.lang.System.currentTimeMillis());
    }
}

function onUseItem(blockId) {
    if (module.isActive()) {
        lastAttackClickTimes.push(java.lang.System.currentTimeMillis());
    }
}

function onScriptEnabled() {
    xOffsetSlider = new SliderSetting("X Offset", [0, 0, 837, 1]);
    yOffsetSlider = new SliderSetting("Y Offset", [0, 0, 267, 1]);
    module.addSetting(xOffsetSlider);
    module.addSetting(yOffsetSlider);
    
    // Создаем все меню один раз при включении скрипта
    var resW = createMenu("W", 50, 50);
    if (resW) {
        menuW = resW.menu;
        backgroundDrawableW = resW.background;
    }

    var resA = createMenu("A", 50, 50);
    if (resA) {
        menuA = resA.menu;
        backgroundDrawableA = resA.background;
    }

    var resS = createMenu("S", 50, 50);
    if (resS) {
        menuS = resS.menu;
        backgroundDrawableS = resS.background;
    }

    var resD = createMenu("D", 50, 50);
    if (resD) {
        menuD = resD.menu;
        backgroundDrawableD = resD.background;
    }

    var resLBC = createMenu("0 CPS", 77, 50);
    if (resLBC) {
        menuLBC = resLBC.menu;
        backgroundDrawableLBC = resLBC.background;
        menuTextViewLBC = resLBC.textView;
    }

    var resRBC = createMenu("0 CPS", 77, 50);
    if (resRBC) {
        menuRBC = resRBC.menu;
        backgroundDrawableRBC = resRBC.background;
        menuTextViewRBC = resRBC.textView;
    }

    var resFooter = createMenu("—", 170, 50);
    if (resFooter) {
        menuFooter = resFooter.menu;
        backgroundDrawableFooter = resFooter.background;
        menuTextViewFooter = resFooter.textView;
    }
    
    ModuleManager.addModule(module);
}

function onScriptDisabled() {
    ModuleManager.removeModule(module);
    if (showingMenu) {
        hideMenus();
    }
    lastAttackClickTimes = [];
    lastUseItemClickTimes = [];
}
