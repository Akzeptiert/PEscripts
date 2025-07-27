const module = new Module("ModuleList", true, true, ModuleCategory.MISC);

const mode = new ModeSetting("Mode", ["Rainbow", "Custom"]);

const size = new SliderSetting("Size", [0.5, 0, 1, 0.01]);

const distanceBetweenElements = new SliderSetting("Distance between elements", [10, 0, 25, 0.1]);

const colorLimitation = new SliderSetting("Color limitation", [180, 0, 360, 1]);

const length = new SliderSetting("Length", [500, 1, 1000, 1]);

const speed = new SliderSetting("Speed", [20, 1, 50, 1]);

//const testSetting = new TextFieldSetting("Test", "test", "test 1;test 2;test 3");



var popup = null;

var layout = null;



if (Data.getBoolean("loaded", false)) {

    Data.remove("loaded");

    size.setOnCurrentValueChangedListener(value => {

        getContext().runOnUiThread(new java.lang.Runnable({

            run: function() {

                refreshMods(layout, java.lang.System.currentTimeMillis());

            }

        }));

    });

    distanceBetweenElements.setOnCurrentValueChangedListener(value => {

        getContext().runOnUiThread(new java.lang.Runnable({

            run: function() {

                refreshMods(layout, java.lang.System.currentTimeMillis());

            }

        }));

    });

    module.addSettings([mode, size, distanceBetweenElements, colorLimitation, length, speed/*, testSetting*/]);

    module.setOnToggleListener(function() {

        if (module.isActive()) {

            getContext().runOnUiThread(new java.lang.Runnable({

                run: function() {

                    popup.showAtLocation(getContext().getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 5);

                }

            }));

        } else {

            popup.dismiss();

        };

    });

    ModuleManager.addModule(module);

    arraylist();

};



function color(c) {

	var v1 = Math.ceil(java.lang.System.currentTimeMillis() + (c * length.getCurrentValue())) / speed.getCurrentValue();

    v1 %= 360;

	return android.graphics.Color.HSVToColor([mode.getCurrentMode() == "Rainbow"? v1: v1 > colorLimitation.getCurrentValue()? v1: 360 - v1, 0.6, 1]);

};



function dip2px(px) { 

    return getContext().getResources().getDisplayMetrics().density * px; 

};



function text(module, index) {

	var bg = new android.graphics.drawable.GradientDrawable();

	bg.setColor(android.graphics.Color.BLACK);

	bg.setAlpha(220);



	var text = new android.widget.TextView(getContext());

    text.setId(1337 + index);

	text.setText(module);

	text.setTypeface(android.graphics.Typeface.MONOSPACE);

	text.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, 20 * size.getCurrentValue());

	text.setPadding(dip2px(3), dip2px(1), dip2px(3), dip2px(1));

	text.setGravity(android.view.Gravity.RIGHT);

	text.setTextColor(android.graphics.Color.WHITE);

	text.setBackground(bg);



    var params = new android.widget.RelativeLayout.LayoutParams(android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);

    params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT, android.widget.RelativeLayout.TRUE);

    params.setMargins(0, (text.getLineHeight() + distanceBetweenElements.getCurrentValue()) * index, 0, 0);

	text.setLayoutParams(params);



	return text;

};



/*function check(n) {

    var blocked = testSetting.getText().split(';');

    for (let i = 0; i < blocked.length; i++) {

        if (n == blocked[i]) {

            return false;

        };

    };

    return true;

};*/



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



				var thread = function() {

                    new android.os.Handler().postDelayed({

                        run() {

                            try {

                                if (module.isActive()) {

                                    var number_of_modules = 0;

                                    var names = ModuleManager.getModuleNames();

						            names.forEach(function(e, i, a) {

								        if (Module.isActive(e)) {

                                            number_of_modules++;

                                        };

							        });



							        if (layout.getChildCount() != number_of_modules) {

                                        refreshMods(layout, java.lang.System.currentTimeMillis());

                                    };

							        for (var i = 0; i < layout.getChildCount(); i++) {

                                        layout.getChildAt(i).setTextColor(color(i));

                                        layout.getChildAt(i).setShadowLayer(5, 0, 0, color(i));

                                    };

                                };

                                thread();

                            } catch(e) {

                                print(e + " at #" + e.lineNumber);

                            };

                        }

                    }, 20);

                };

                thread();

            } catch (e) {

                throw e;

            };

        }

    }));

};
