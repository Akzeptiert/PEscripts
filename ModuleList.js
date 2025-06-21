const module = new Module("ModuleList", true, true, ModuleCategory.MISC);

const mode = new ModeSetting("Mode", ["Rainbow", "Custom"]);
const modeback = new ModeSetting("Mode BackGround", ["Просто Чёрный", "Прозрачно Чёрный"]);
const size = new SliderSetting("Size", [0.6, 0, 1, 0.01]);
const distanceBetweenElements = new SliderSetting("Distance between elements", [5, 0, 25, 0.1]);
const colorLimitation = new SliderSetting("Color limitation", [180, 0, 360, 1]);
const length = new SliderSetting("Length", [500, 1, 1000, 1]);
const speed = new SliderSetting("Speed", [20, 1, 50, 1]);

var popup = null;
var layout = null;

if (Data.getBoolean("loaded", true)) {
    Data.remove("loaded");

    size.setOnCurrentValueChangedListener(value => {
        updateLayout();
    });

    distanceBetweenElements.setOnCurrentValueChangedListener(value => {
        updateLayout();
    });

    module.addSettings([mode, modeback, size, distanceBetweenElements, colorLimitation, length, speed]);

    module.setOnToggleListener(function() {
        if (module.isActive()) {
            getContext().runOnUiThread(new java.lang.Runnable({
                run: function() {
                    popup.showAtLocation(getContext().getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 5);
                }
            }));
        } else {
            popup.dismiss();
        }
    });

    ModuleManager.addModule(module);
    arraylist();
}

function updateLayout() {
    getContext().runOnUiThread(new java.lang.Runnable({
        run: function() {
            refreshMods(layout, java.lang.System.currentTimeMillis());
        }
    }));
}

function color(c) {
    var v1 = Math.ceil(java.lang.System.currentTimeMillis() + (c * length.getCurrentValue())) / speed.getCurrentValue();
    v1 %= 360;
    return android.graphics.Color.HSVToColor([mode.getCurrentMode() == "Rainbow" ? v1 : v1 > colorLimitation.getCurrentValue() ? v1 : 360 - v1, 0.6, 1]);
}

function dip2px(px) {
    return getContext().getResources().getDisplayMetrics().density * px;
}

function text(module, index) {
    var transparentBlack = android.graphics.Color.HSVToColor(128, [0, 0, 0]);

    // Создание фона
    var bg = new android.graphics.drawable.GradientDrawable();
    let mod = modeback.getCurrentMode();
    
    if (mod == "Просто Чёрный") {
        bg.setColor(android.graphics.Color.BLACK);
    } else if (mod == "Прозрачно Чёрный") {
        bg.setColor(transparentBlack);
    } else {
        bg.setColor(android.graphics.Color.BLACK);
    }
    bg.setAlpha(220);

    // Создание Drawable для обводки
    var strokeDrawable = new android.graphics.drawable.GradientDrawable();
    strokeDrawable.setColor(android.graphics.Color.TRANSPARENT); // Прозрачный фон для обводки
        var transparentBlak = android.graphics.Color.HSVToColor(80, [0, 0, 0]);
        var transparentBlac = android.graphics.Color.HSVToColor(205, [0, 0, 0]);
        if (mod == "Просто Чёрный") {
        strokeDrawable.setStroke(dip2px(2), transparentBlak);
    } else if (mod == "Прозрачно Чёрный") {
        strokeDrawable.setStroke(dip2px(2), transparentBlac);
    } else {
        strokeDrawable.setStroke(dip2px(2), android.graphics.Color.BLACK);
    }

    // Создание LayerDrawable для комбинирования фона и обводки
    var layers = new android.graphics.drawable.LayerDrawable([strokeDrawable, bg]);

    var text = new android.widget.TextView(getContext());
    text.setId(1337 + index);
    text.setText(module);
    text.setTypeface(android.graphics.Typeface.MONOSPACE);
    text.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, 20 * size.getCurrentValue());
    text.setPadding(dip2px(3), dip2px(1), dip2px(3), dip2px(1));
    text.setGravity(android.view.Gravity.RIGHT);
    text.setTextColor(android.graphics.Color.WHITE);

    // Установка фона с обводкой
    text.setBackground(layers);

    // Установка параметров для текста
    var params = new android.widget.RelativeLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
    params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT, android.widget.RelativeLayout.TRUE);
    params.setMargins(0, (text.getLineHeight() + 3 + distanceBetweenElements.getCurrentValue()) * index, 0, 0);
    text.setLayoutParams(params);

    // Установка отступов для обводки
    layers.setLayerInset(0, 0, 0, dip2px(-15), dip2px(2)); // Нижняя обводка
    layers.setLayerInset(0, dip2px(-0.5), 0, dip2px(-15), 0); // Левая обводка
    layers.setLayerInset(0, 0, dip2px(-30), dip2px(-15), 0); // Верхняя обводка

    return text;
}

function refreshMods(layout, time) {
	layout.removeAllViews();
    var names = new Array();
    ModuleManager.getModuleNames().forEach(function (e, i, a) {
        if (Module.isActive(e) && e != "Notifications" && e != "ModuleList"/* && check(e)*/) {
            names.push(e);
        };
	});

    var paint = new android.graphics.Paint();
    paint.setTypeface(android.graphics.Typeface.MONOSPACE);
    paint.setTextSize(0x539);
    names.sort(function(s1, s2) {
        return paint.measureText(s2) - paint.measureText(s1);
    });

	names.forEach(function (e, i, a) {
        if (Module.isActive(e)) {
            var view = new text(e, i, layout);
            view.setGravity(android.view.Gravity.CENTER_VERTICAL | android.view.Gravity.RIGHT);
	        layout.addView(view);
        };
	});
};

function arraylist() {
    getContext().runOnUiThread(new java.lang.Runnable({
        run: function() {
            try {
                layout = new android.widget.RelativeLayout(getContext());
                refreshMods(layout, java.lang.System.currentTimeMillis());

                popup = new android.widget.PopupWindow(layout, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.MATCH_PARENT);
                popup.setAnimationStyle(android.R.style.Animation_Translucent);
                popup.setTouchable(false);

                startRefreshThread();

            } catch (e) {
                throw e;
            }
        }
    }));
}

function startRefreshThread() {
    var handler = new android.os.Handler();
    var thread = function() {
        handler.postDelayed(new java.lang.Runnable({
            run: function() {
                try {
                    if (module.isActive()) {
                        var number_of_modules = 0;
                        var names = ModuleManager.getModuleNames();
                        names.forEach(function(e) {
                            if (Module.isActive(e)) {
                                number_of_modules++;
                            }
                        });

                        if (layout.getChildCount() != number_of_modules) {
                            refreshMods(layout, java.lang.System.currentTimeMillis());
                        }

                        for (var i = 0; i < layout.getChildCount(); i++) {
                            layout.getChildAt(i).setTextColor(color(i));
                            layout.getChildAt(i).setShadowLayer(5, 0, 0, color(i));
                        }
                    }
                    thread();
                } catch (e) {
                    print(e + " at #" + e.lineNumber);
                }
            }
        }), 20);
    };
    thread();
}

function onFaskTick() {
if (module.isActive()) {
refreshMods(layout, java.lang.System.currentTimeMillis());
}
}