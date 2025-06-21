const struct = [
    [0,0,0],
    [-1,0,0],
    [1,0,0],
    [0,1,0],
    [0,2,0],
    [0,3,0],
    [0,4,0],
],
    struct_nazi = [
        [0,0,0],
        [0,1,0],
        [0,2,0],
        [0,3,0],
        [0,4,0],
        [-1,0,0],
        [-2,0,0],
        [-1,2,0],
        [-2,2,0],
        [-2,3,0],
        [-2,4,0],
        [1,4,0],
        [2,4,0],
        [1,2,0],
        [2,2,0],
        [2,1,0],
        [2,0,0],
        [2,0,0]
];

var Utils = {
	state: -1,
    side: 1,
    delay: 3,
    gameTick: 0,
	pos: [0,0,0],
    ignore: [0,31,175],
    contains(item){
        if(Utils.ignore.indexOf(item) == -1) return false;
        return true;
    },
    findAngleDifference(angle1,angle2){
        let diff = angle2 - angle1;
        diff = ((diff + 180) % 360 + 360) % 360 - 180;
        return Math.abs(diff);
    },
    getSideFromYaw(x,z){
        //LocalPlayer.getYaw()
        let angle = Math.atan2(x-LocalPlayer.getPositionX(),z-LocalPlayer.getPositionZ())*180/Math.PI;
        if(Utils.findAngleDifference(angle,0) <= 45) return 0;
        if(Utils.findAngleDifference(angle,180) <= 45) return 0;
        if(Utils.findAngleDifference(angle,270) <= 45) return 2;
        if(Utils.findAngleDifference(angle,90) <= 45) return 2;
        return 0;
    },
	getOccupiedSide: function(x,y,z){
		if(!Utils.contains(Block.getID(x, y-1, z))) return [x, y-1, z,BlockSide.UP];
        if(!Utils.contains(Block.getID(x, y+1, z))) return [x, y+1, z,BlockSide.DOWN];
        if(!Utils.contains(Block.getID(x, y, z-1))) return [x, y, z-1,BlockSide.SOUTH];
        if(!Utils.contains(Block.getID(x, y, z+1))) return [x, y, z+1,BlockSide.NORTH];
        if(!Utils.contains(Block.getID(x-1, y, z))) return [x-1, y, z,BlockSide.EAST];
        if(!Utils.contains(Block.getID(x+1, y, z))) return [x+1, y, z,BlockSide.WEST];
		return 1;
	},

}

var module = new Module("AutoPenis", true, true, ModuleCategory.MISC);
var active = false;
var mode = "Nazi";
var slider = new SliderSetting("Delay", [3, 0, 40, 1]).setOnCurrentValueChangedListener(value => {Utils.delay = value;});
var mode1 = new ModeSetting("Mode", ["Nazi", "Penis"]).setOnModeSelectedListener(mode_s => {mode = mode_s});
module.setOnToggleListener((view,a) => {
    active = module.isActive();
});
module.addSettings([slider,mode1]);
ModuleManager.addModule(module);

function onLevelTick(){
    if(Utils.state < -1) Utils.state++;
    if(Utils.state >= 0 && Utils.state < (mode == "Nazi" ? struct_nazi.length : struct.length-1 )){
        Utils.gameTick++;
        if(Utils.gameTick>=Utils.delay && Item.isBlock(Inventory.getSelectedSlot())) {
            Utils.gameTick = 0;
            let occupied = Utils.getOccupiedSide(Utils.pos[0]+(mode == "Nazi" ? struct_nazi[Utils.state][Utils.side] : struct[Utils.state][Utils.side]),
                                                 Utils.pos[1]+(mode == "Nazi" ? struct_nazi[Utils.state][1] : struct[Utils.state][1]), 
                                                 Utils.pos[2]+(mode == "Nazi" ? struct_nazi[Utils.state][2-Utils.side] : struct[Utils.state][2-Utils.side]));//Я знаю что можно проще но мне похуй
            LocalPlayer.buildBlock(occupied[0], occupied[1], occupied[2], occupied[3]);
            Utils.state++;
            if(Utils.state >=((mode == "Nazi" ? struct_nazi.length-1 : struct.length-1 ))) Utils.state = -5;
        }
    }
}

function onUseItem(x, y, z, side,itemId,blockId){
    if(active && Utils.state == -1){
        if(Item.isBlock(Inventory.getSelectedSlot())) {
            preventDefault();
            Utils.state = 0;
            Utils.side = Utils.getSideFromYaw(x,z);
            Utils.pos = [x,y+1,z];
        }
    }
};


