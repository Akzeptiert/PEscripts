const ctx = getContext();

var button_popup = null;
var button_view = null;
var anim = new android.view.animation.RotateAnimation(0, 360,android.view.animation.Animation.RELATIVE_TO_SELF, 0.5, android.view.animation.Animation.RELATIVE_TO_SELF, 0.5);
anim.setDuration(1500);
anim.setRepeatCount(android.view.animation.Animation.INFINITE);
anim.setInterpolator(new android.view.animation.LinearInterpolator());

var button = () => {
    ctx.runOnUiThread({
        run() {
            try {
                button_view = new android.widget.TextView(ctx);
                button_view.setText("+");
                button_view.setTextColor(android.graphics.Color.WHITE);
                button_view.setTextSize(15);
                button_view.setGravity(android.view.Gravity.CENTER);
    
                button_popup = new android.widget.PopupWindow(button_view, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
                button_popup.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.CENTER, -1, -1);
                button_popup.setTouchable(false);
                
                button_view.startAnimation(anim);
                var thread = () => {
                    new android.os.Handler()
                        .postDelayed({
                        run() {
                             button_view.setTextColor(android.graphics.Color.HSVToColor([Math.ceil((java.lang.System.currentTimeMillis()) / 20) % 360, 100, 100]));
                             thread();
                        }
                    }, 20)
                };
                thread();
            } catch (e) {
                print(e)
            }
        }
    });
}

var module = new Module("StarCrosshair", true, false, ModuleCategory.OTHER);
module.setOnToggleListener((view, active) => {
    
    if(module.isActive()){
	    Memory.patch(0x125E5CE, [0x00, 0xbf, 0x00, 0xbf]);
	}else{
	    Memory.patch(0x125E5CE, [0xf6, 0xf4, 0x72, 0xcb]);
	}
    ctx.runOnUiThread({
        run() {
            try {
                if(button_popup == null){
                    button();
                }else{
                    button_popup.dismiss();
                    button_popup = null;
                }
            } catch (e) {
                print(e)
            }
        }
    });
});
ModuleManager.addModule(module);

