/*
    "Harmonograph" is a Javascript written project that simulates drawing of a harmonograph. It generates geometric drawings based on inputs.
    
    Copyright (C) 2023 - Jamshed Hossan

    This program is free software: you can redistribute it and/or modify it under the terms 
    of the GNU General Public License as published by the Free Software Foundation, 
    either version 3 of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
    without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
    PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with this program. 
    If not, see https://www.gnu.org/licenses/.
*/

var worker = new Worker('./assets/worker.js');
var frequency = 50,
drawing = false,
moveInterval = 0,
presetModal,
sel = {

},
board = {
    el: null,
    size:{
        width:0, 
        height: 0,
        min: 0,
    }
},
canvas = {
    el: null,
    scale: 1,
    strokeWidth: 1,
    accuracy: 2,
    context: null,
    size: {
        width:0, 
        height: 0
    },
    pos: {
        x: 0,
        y: 0,
    },
    penPos: {
        x: 0, y: 0,
        oldx:0, oldy: 0,
    },
    startDeg:{
        0: {
            parent: 0,
            child: 0,
        },
        1: {
            parent: 0,
            child: 0,
        },
        degLogged: false,
    }
},
machine = {
    el: null,
    gear: {
        0: { // left
            el: null,
            deg: 0,
            wallDistance: 34, // percent of board
            parent: {
                el: null,
                dir: -1, // positive 1, negative -1
                speed: 30,
                deg: 0,
                size: 14, //percent of board
            },
            child: {
                el: null,
                dir: 1, // positive 1, negative -1
                speed: 2,
                deg: 0,
                size: 35, //percent of parent
                conEl: null,
                conDeg: 0,
            },
            handle: null,
        },
        1: {
            el: null,
            deg: 0,
            wallDistance: 40,
            parent: {
                el: null,
                dir: -1, 
                speed: 30,
                deg: 0,
                size: 14, 
            },
            child: {
                el: null,
                dir: 1, 
                speed: 2,
                deg: 0,
                size: 35,
                conEl: null,
                conDeg: 0,
            },
            handle: null,
        },
    },
    hand: {
        arm: {
            el: {
                0: null,
                1: null
            },
            length: 5, // percent of board
            px: 0,
            bridge: {
                el: null,
                column: {
                    el: null,
                    tip: null,
                }
            },
            display:{
                0: null,
                1: null,
            }
        },
        forearm:{
            0: {
                el: null,
                tip: null
            },
            1: {
                el: null,
                tip: null
            },
            length: 10, // percent of arm
            px: 0,
            
        },
        palm:{
            el: {
                0: null,
                1: null
            },
            length: 100, // percent of forearm
            px: 0,
            bridge: {
                el: null,
                column: {
                    el: null,
                    tip: null,
                }
            },
        },
        pen: null,
    },
    spinDirection: 1, // 1 = spin one from other, 2 spin one to other, 3 both pos, 4 both neg
    controls: {
        0: { // left
            move: {
                el: null,
                valueEl: null,
            },
            rotate: {
                parent: {
                    el: null,
                    valueEl: null,    
                },
                child: {
                    el: null,
                    valueEl: null,    
                },
            },
            speed: {
                parent: {
                    el: null,
                    valueEl: null
                },
                child: {
                    el: null,
                    valueEl: null
                },
            },
            size: {
                parent: {
                    el: null,
                    valueEl: null
                },
                child: {
                    el: null,
                    valueEl: null
                },
            },
            dir: {
                parent: {
                    el: null,
                },
                child: {
                    el: null,
                },
            },
            color: null
        },
        1: {
            move: {
                el: null,
                valueEl: null,
            },
            rotate: {
                parent: {
                    el: null,
                    valueEl: null,    
                },
                child: {
                    el: null,
                    valueEl: null,    
                },
            },
            speed: {
                parent: {
                    el: null,
                    valueEl: null
                },
                child: {
                    el: null,
                    valueEl: null
                },
            },
            size: {
                parent: {
                    el: null,
                    valueEl: null
                },
                child: {
                    el: null,
                    valueEl: null
                },
            },
            dir: {
                parent: {
                    el: null,
                },
                child: {
                    el: null,
                },
            },
            color: null
        },
        play: null,
        pause: null,
        clear: null,
        save: null,
        config: null,
        showDrawingOnly: null,
        showEverything: null,
        spinDirection: null,
        hand:{
            arm:{
                length:{
                    el: null,
                    valueEl: null,
                },
            },
            forearm:{
                length:{
                    el: null,
                    valueEl: null,
                },
            },
            palm:{
                length:{
                    el: null,
                    valueEl: null,
                },
            },
        },
        accuracy: {
            el: null,
            valueEl: null
        },
        opacity: {
            el: null,
            valueEl: null
        },

    }
},
color = {
    start: "#000000",
    end: "#000000",
    size: 500,
    range: [],
    current: 0,
    opacity: .5,
};

function loadElements(){
    // console.log('loadElements');
    board.el = document.querySelector('.board');
    canvas.el = document.querySelector('.canvas');

    machine.el = document.querySelector('.machine');
    machine.gear[0].el = document.querySelector('.machine_gear_0');
    machine.gear[0].parent.el = document.querySelector('.machine_gear_0_parent');
    machine.gear[0].child.el = document.querySelector('.machine_gear_0_child');
    machine.gear[0].child.conEl = document.querySelector('.machine_gear_0_child_con');
    machine.gear[0].handle = document.querySelector('.machine_gear_0_handle');
    machine.gear[1].el = document.querySelector('.machine_gear_1');
    machine.gear[1].parent.el = document.querySelector('.machine_gear_1_parent');
    machine.gear[1].child.el = document.querySelector('.machine_gear_1_child');
    machine.gear[1].child.conEl = document.querySelector('.machine_gear_1_child_con');
    machine.gear[1].handle = document.querySelector('.machine_gear_1_handle');
    
    machine.hand.arm.el[0] = document.querySelector('.machine_hand_arm_0');
    machine.hand.arm.el[1] = document.querySelector('.machine_hand_arm_1');
    machine.hand.arm.display[0] = document.querySelector('.machine_hand_arm_0_display');
    machine.hand.arm.display[1] = document.querySelector('.machine_hand_arm_1_display');
    machine.hand.arm.bridge.el = document.querySelector('.machine_hand_arm_bridge');
    machine.hand.arm.bridge.column.el = document.querySelector('.machine_hand_arm_bridge_column');
    machine.hand.arm.bridge.column.tip = document.querySelector('.machine_hand_arm_bridge_column_tip');

    machine.hand.forearm[0].el = document.querySelector('.machine_hand_forearm_0');
    machine.hand.forearm[0].tip = document.querySelector('.machine_hand_forearm_0_tip');
    machine.hand.forearm[1].el = document.querySelector('.machine_hand_forearm_1');
    machine.hand.forearm[1].tip = document.querySelector('.machine_hand_forearm_1_tip');

    machine.hand.palm.el[0] = document.querySelector('.machine_hand_palm_0');
    machine.hand.palm.el[1] = document.querySelector('.machine_hand_palm_1');
    machine.hand.palm.bridge.el = document.querySelector('.machine_hand_palm_bridge');
    machine.hand.palm.bridge.column.el = document.querySelector('.machine_hand_palm_bridge_column');
    machine.hand.palm.bridge.column.tip = document.querySelector('.machine_hand_palm_bridge_column_tip');
    
    machine.hand.pen = document.querySelector('.machine_hand_pen');

    machine.controls[0].move.el = document.querySelector('.machine_controls_0_move');
    machine.controls[0].move.valueEl = document.querySelector('.machine_controls_0_move_value');
    machine.controls[0].rotate.parent.el = document.querySelector('.machine_controls_0_rotate_parent');
    machine.controls[0].rotate.parent.valueEl = document.querySelector('.machine_controls_0_rotate_parent_value');
    machine.controls[0].rotate.child.el = document.querySelector('.machine_controls_0_rotate_child');
    machine.controls[0].rotate.child.valueEl = document.querySelector('.machine_controls_0_rotate_child_value');
    machine.controls[0].speed.parent.el = document.querySelector('.machine_controls_0_speed_parent');
    machine.controls[0].speed.parent.valueEl = document.querySelector('.machine_controls_0_speed_parent_value');
    machine.controls[0].speed.child.el = document.querySelector('.machine_controls_0_speed_child');
    machine.controls[0].speed.child.valueEl = document.querySelector('.machine_controls_0_speed_child_value');
    machine.controls[0].size.parent.el = document.querySelector('.machine_controls_0_size_parent');
    machine.controls[0].size.parent.valueEl = document.querySelector('.machine_controls_0_size_parent_value');
    machine.controls[0].size.child.el = document.querySelector('.machine_controls_0_size_child');
    machine.controls[0].size.child.valueEl = document.querySelector('.machine_controls_0_size_child_value');
    machine.controls[0].dir.parent.el = document.querySelector('.machine_controls_0_dir_parent');
    machine.controls[0].dir.child.el = document.querySelector('.machine_controls_0_dir_child');
    machine.controls[0].color = document.querySelector('.machine_controls_0_color');

    machine.controls[1].move.el = document.querySelector('.machine_controls_1_move');
    machine.controls[1].move.valueEl = document.querySelector('.machine_controls_1_move_value');
    machine.controls[1].rotate.parent.el = document.querySelector('.machine_controls_1_rotate_parent');
    machine.controls[1].rotate.parent.valueEl = document.querySelector('.machine_controls_1_rotate_parent_value');
    machine.controls[1].rotate.child.el = document.querySelector('.machine_controls_1_rotate_child');
    machine.controls[1].rotate.child.valueEl = document.querySelector('.machine_controls_1_rotate_child_value');
    machine.controls[1].speed.parent.el = document.querySelector('.machine_controls_1_speed_parent');
    machine.controls[1].speed.parent.valueEl = document.querySelector('.machine_controls_1_speed_parent_value');
    machine.controls[1].speed.child.el = document.querySelector('.machine_controls_1_speed_child');
    machine.controls[1].speed.child.valueEl = document.querySelector('.machine_controls_1_speed_child_value');
    machine.controls[1].size.parent.el = document.querySelector('.machine_controls_1_size_parent');
    machine.controls[1].size.parent.valueEl = document.querySelector('.machine_controls_1_size_parent_value');
    machine.controls[1].size.child.el = document.querySelector('.machine_controls_1_size_child');
    machine.controls[1].size.child.valueEl = document.querySelector('.machine_controls_1_size_child_value');
    machine.controls[1].dir.parent.el = document.querySelector('.machine_controls_1_dir_parent');
    machine.controls[1].dir.child.el = document.querySelector('.machine_controls_1_dir_child');
    machine.controls[1].color = document.querySelector('.machine_controls_1_color');


    machine.controls.play = document.querySelector('.machine_controls_play');
    machine.controls.pause = document.querySelector('.machine_controls_pause');
    machine.controls.clear = document.querySelector('.machine_controls_clear');
    machine.controls.save = document.querySelector('.machine_controls_save');
    machine.controls.config = document.querySelector('.machine_controls_show_config');
    machine.controls.showDrawingOnly = document.querySelector('.machine_controls_show_drawing_only');
    machine.controls.showEverything = document.querySelector('.machine_controls_show_everything');

    machine.controls.hand.arm.length.el = document.querySelector('.machine_controls_hand_arm_length');
    machine.controls.hand.arm.length.valueEl = document.querySelector('.machine_controls_hand_arm_length_value');
    machine.controls.hand.forearm.length.el = document.querySelector('.machine_controls_hand_forearm_length');
    machine.controls.hand.forearm.length.valueEl = document.querySelector('.machine_controls_hand_forearm_length_value');
    machine.controls.hand.palm.length.el = document.querySelector('.machine_controls_hand_palm_length');
    machine.controls.hand.palm.length.valueEl = document.querySelector('.machine_controls_hand_palm_length_value');

    machine.controls.accuracy.el = document.querySelector('.machine_controls_accuracy');
    machine.controls.accuracy.valueEl = document.querySelector('.machine_controls_accuracy_value');
    machine.controls.opacity.el = document.querySelector('.machine_controls_opacity');
    machine.controls.opacity.valueEl = document.querySelector('.machine_controls_opacity_value');

    machine.controls.spinDirection = document.querySelector('.machine_controls_spin_direction');
    presetModal = new bootstrap.Modal(document.getElementById('preset_modal'));

}

function setBoard(){
    // console.log('setBoard');
    var width = window.innerWidth;
    var height = window.innerHeight;
    board.size.width = width;
    board.size.height = height;
    board.size.min = Math.min(width, height);

    board.el.style.left = `0px`;
    board.el.style.width = `${board.size.width}px`;
    board.el.style.height = `${board.size.height}px`;

    canvas.size.width = board.size.width * canvas.scale;
    canvas.size.height = (board.size.height) * canvas.scale;

    canvas.el.width = canvas.size.width;
    canvas.el.height = canvas.size.height;

    canvas.context = canvas.el.getContext("2d");
    canvas.pos = canvas.el.getBoundingClientRect();
}

function setGear(no){
    // console.log('setGear', no);
        if(typeof no === "undefined"){
            setGear(0);
            setGear(1);
            return;
        }
        let gearwidth = (board.size.width / 100) * machine.gear[no].parent.size;
        machine.gear[no].el.style.width = `${gearwidth}px`;
        machine.gear[no].el.style.height = `${gearwidth}px`;
        
        machine.gear[no].child.conEl.style.width = `${(gearwidth / 100) * machine.gear[no].child.size}px`;
        machine.gear[no].child.conEl.style.height = `${(gearwidth / 100) * machine.gear[no].child.size}px`;
        // machine.gear[no].child.el.style.top = `${(((gearwidth / 100) * machine.gear[no].child.size)/2) * (-1) }px`;

        let wallDistance = (board.size.width / 100) * machine.gear[no].wallDistance;
        if(no == 0){
            let gear1Width = (board.size.width / 100) * machine.gear[1].parent.size;
            let max = board.size.width - (((board.size.width / 100) * machine.gear[1].wallDistance) + gearwidth + gear1Width);
            wallDistance = Math.min(wallDistance, max);
            if(wallDistance < 0){
                wallDistance = 0;
            }
            // console.log(machine.gear[no].el, wallDistance)
            machine.gear[no].el.style.left = `${wallDistance}px`;
        }
        else if(no == 1){
            let gear0Width = (board.size.width / 100) * machine.gear[0].parent.size;
            let max = board.size.width - (((board.size.width / 100) * machine.gear[0].wallDistance) + gearwidth + gear0Width);
            wallDistance = Math.min(wallDistance, max);
            if(wallDistance < 0){
                wallDistance = 0;
            }
            // console.log(machine.gear[no].el, wallDistance)
            machine.gear[no].el.style.right = `${wallDistance}px`;
        }

        machine.gear[no].el.style.transform = `rotate(${machine.gear[no].deg}deg)`;
        machine.gear[no].child.conEl.style.transform = `rotate(${machine.gear[no].child.conDeg}deg)`;
}

function setArmLength(){
    // console.log('setArmLength');
    let gear0Bound = machine.gear[0].el.getBoundingClientRect();
    let gear1Bound = machine.gear[1].el.getBoundingClientRect();
    let armMinLen = (gear1Bound.right - gear0Bound.left) / 2;
    
    // console.log((board.size.min / 100) * machine.hand.arm.length, armMinLen)
    machine.hand.arm.px = Math.max((board.size.min / 100) * machine.hand.arm.length, armMinLen);

    let forearmMinLen = (machine.hand.arm.px / 100) * 20;
    machine.hand.forearm.px = Math.max((machine.hand.arm.px / 100) * machine.hand.forearm.length, forearmMinLen);

    let palmMinLen = (machine.hand.forearm.px / 100) * 60;
    machine.hand.palm.px = Math.max((machine.hand.forearm.px / 100) * machine.hand.palm.length, palmMinLen);

}

function setHand(){
    // console.log('setHand');
    let handle0Bound = machine.gear[0].handle.getBoundingClientRect(),
        handle1Bound = machine.gear[1].handle.getBoundingClientRect(),
        bridgeLen = Math.hypot(handle1Bound.y - handle0Bound.y, handle1Bound.right - handle0Bound.left),
        bridgeDeg    = Math.atan2(handle1Bound.y - handle0Bound.y, handle1Bound.right - handle0Bound.left) * 180 / Math.PI,
        halfParameter = (bridgeLen + (machine.hand.arm.px * 2)) / 2,
        area = Math.sqrt(halfParameter * (halfParameter - bridgeLen) * (halfParameter - machine.hand.arm.px) * (halfParameter - machine.hand.arm.px)),
        height = (2 * area) / bridgeLen;

    
    machine.hand.arm.bridge.el.style.width =  bridgeLen + "px";     
    machine.hand.arm.bridge.el.style.height =  1 + "px";     
    machine.hand.arm.bridge.el.style.left = handle0Bound.x + "px";   
    machine.hand.arm.bridge.el.style.top = handle0Bound.y + "px";   
    machine.hand.arm.bridge.el.style.transformOrigin = "left 50%";
    machine.hand.arm.bridge.el.style.transform = "rotate("+ bridgeDeg +"deg)";

    machine.hand.arm.bridge.column.el.style.height = `${height}px`;

    let elbowBound = machine.hand.arm.bridge.column.tip.getBoundingClientRect();
    var armWidth = machine.hand.arm.px;
    var arm0Deg = Math.atan2(elbowBound.y - handle0Bound.y, elbowBound.right - handle0Bound.left) * 180 / Math.PI;
	var arm1Deg = Math.atan2(elbowBound.y - handle1Bound.y, elbowBound.left - handle1Bound.right) * 180 / Math.PI;
    
    machine.hand.arm.el[0].style.width = `${armWidth}px`;
    machine.hand.arm.el[0].style.left = handle0Bound.x + "px";   
    machine.hand.arm.el[0].style.top = handle0Bound.y + "px";
    machine.hand.arm.el[0].style.transformOrigin = "left 50%";
    machine.hand.arm.el[0].style.transform = "rotate("+ arm0Deg +"deg)";

    machine.hand.arm.el[1].style.width = `${armWidth}px`;
    machine.hand.arm.el[1].style.left = handle1Bound.right + "px";   
    machine.hand.arm.el[1].style.top = handle1Bound.y + "px";
    machine.hand.arm.el[1].style.transformOrigin = "left 50%";
    machine.hand.arm.el[1].style.transform = "rotate("+ arm1Deg +"deg)";

    machine.hand.forearm[0].el.style.width = `${machine.hand.forearm.px}px`;
    machine.hand.forearm[1].el.style.width = `${machine.hand.forearm.px}px`;
    machine.hand.arm.display[0].style.width = `${armWidth+machine.hand.forearm.px}px`;
    machine.hand.arm.display[1].style.width = `${armWidth+machine.hand.forearm.px}px`;

    let wrist0Bound = machine.hand.forearm[1].tip.getBoundingClientRect(),
        wrist1Bound = machine.hand.forearm[0].tip.getBoundingClientRect(),
        palmBridgLen = Math.hypot(wrist1Bound.y - wrist0Bound.y, wrist1Bound.right - wrist0Bound.left),
        palmBridgDeg    = Math.atan2(wrist1Bound.y - wrist0Bound.y, wrist1Bound.right - wrist0Bound.left) * 180 / Math.PI,
        palmHalfParameter = (palmBridgLen + (machine.hand.palm.px * 2)) / 2,
        palmArea = Math.sqrt(palmHalfParameter * (palmHalfParameter - palmBridgLen) * (palmHalfParameter - machine.hand.palm.px) * (palmHalfParameter - machine.hand.palm.px)),
        palmHeight = (2 * palmArea) / palmBridgLen;

    machine.hand.palm.bridge.el.style.width =  palmBridgLen + "px";     
    machine.hand.palm.bridge.el.style.height =  1 + "px";     
    machine.hand.palm.bridge.el.style.left = wrist0Bound.x + "px";   
    machine.hand.palm.bridge.el.style.top = wrist0Bound.y + "px";   
    machine.hand.palm.bridge.el.style.transformOrigin = "left 50%";
    machine.hand.palm.bridge.el.style.transform = "rotate("+ palmBridgDeg +"deg)";

    machine.hand.palm.bridge.column.el.style.height = `${palmHeight}px`;


    let tipBound = machine.hand.palm.bridge.column.tip.getBoundingClientRect();
    var palmWidth = machine.hand.palm.px;
    var palm0Deg = Math.atan2(tipBound.y - wrist0Bound.y, tipBound.right - wrist0Bound.left) * 180 / Math.PI;
	var palm1Deg = Math.atan2(tipBound.y - wrist1Bound.y, tipBound.left - wrist1Bound.right) * 180 / Math.PI;
    
    machine.hand.palm.el[0].style.width = `${palmWidth}px`;
    machine.hand.palm.el[0].style.left = wrist0Bound.x + "px";   
    machine.hand.palm.el[0].style.top = wrist0Bound.y + "px";
    machine.hand.palm.el[0].style.transformOrigin = "left 50%";
    machine.hand.palm.el[0].style.transform = "rotate("+ palm0Deg +"deg)";

    machine.hand.palm.el[1].style.width = `${palmWidth}px`;
    machine.hand.palm.el[1].style.left = wrist1Bound.right + "px";   
    machine.hand.palm.el[1].style.top = wrist1Bound.y + "px";
    machine.hand.palm.el[1].style.transformOrigin = "left 50%";
    machine.hand.palm.el[1].style.transform = "rotate("+ palm1Deg +"deg)";

}

function setMachine(){
    setArmLength();
    setHand();
}

function setMachineAndGear(){
    setGear();
    setArmLength();
    setHand();
}

function colorRange(len = 10, opacity = 1){
    if(len < 2){
        len = 2;
    }
    len = parseInt(len/2);
    function convertToHex (rgb) {
        return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
    }

    function trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }

    function convertToRGB (hex) {
        var color = [];
        color[0] = parseInt ((trim(hex)).substring (0, 2), 16);
        color[1] = parseInt ((trim(hex)).substring (2, 4), 16);
        color[2] = parseInt ((trim(hex)).substring (4, 6), 16);
        return color;
    }

    var start = convertToRGB (color.start);
    var end   = convertToRGB (color.end); 
    // console.log(start, end)
    var alpha = 0;
    var colors = [];
    for (i = 0; i < len; i++) {
        var c = [];
        alpha += (1.0 / len);

        c[0] = start[0] * alpha + (1 - alpha) * end[0];
        c[1] = start[1] * alpha + (1 - alpha) * end[1];
        c[2] = start[2] * alpha + (1 - alpha) * end[2];

        c[0] = parseInt(c[0]);
        c[1] = parseInt(c[1]);
        c[2] = parseInt(c[2]);

        colors.push(`rgba(${c[0]},${c[1]},${c[2]},${opacity})`);
    }
    var reverseColors = [...colors]
    reverseColors.reverse();
    return [...reverseColors, ...colors, ];
}

function setColor(){
    color.current = 0;
    color.range = colorRange(color.size, color.opacity);
}

function setValueToInputs(){
    
    machine.controls[0].move.el.value = machine.gear[0].wallDistance;
    machine.controls[0].move.valueEl.innerHTML = machine.gear[0].wallDistance;
    machine.controls[0].rotate.parent.el.value = machine.gear[0].deg;
    machine.controls[0].rotate.parent.valueEl.innerHTML = machine.gear[0].deg;
    machine.controls[0].rotate.child.el.value = machine.gear[0].child.conDeg;
    machine.controls[0].rotate.child.valueEl.innerHTML = machine.gear[0].child.conDeg;
    machine.controls[0].speed.parent.el.value = machine.gear[0].parent.speed;
    machine.controls[0].speed.parent.valueEl.innerHTML = machine.gear[0].parent.speed;
    machine.controls[0].speed.child.el.value = machine.gear[0].child.speed;
    machine.controls[0].speed.child.valueEl.innerHTML = machine.gear[0].child.speed;
    machine.controls[0].size.parent.el.value = machine.gear[0].parent.size;
    machine.controls[0].size.parent.valueEl.innerHTML = machine.gear[0].parent.size;
    machine.controls[0].size.child.el.value = machine.gear[0].child.size;
    machine.controls[0].size.child.valueEl.innerHTML = machine.gear[0].child.size;
    machine.controls[0].dir.parent.el.checked = machine.gear[0].parent.dir == 1;
    machine.controls[0].dir.child.el.checked = machine.gear[0].child.dir == 1;
    machine.controls[0].color.value = color.start;

    machine.controls[1].move.el.value = machine.gear[1].wallDistance;
    machine.controls[1].move.valueEl.innerHTML = machine.gear[1].wallDistance;
    machine.controls[1].rotate.parent.el.value = machine.gear[1].deg;
    machine.controls[1].rotate.parent.valueEl.innerHTML = machine.gear[1].deg;
    machine.controls[1].rotate.child.el.value = machine.gear[1].child.conDeg;
    machine.controls[1].rotate.child.valueEl.innerHTML = machine.gear[1].child.conDeg;
    machine.controls[1].speed.parent.el.value = machine.gear[1].parent.speed;
    machine.controls[1].speed.parent.valueEl.innerHTML = machine.gear[1].parent.speed;
    machine.controls[1].speed.child.el.value = machine.gear[1].child.speed;
    machine.controls[1].speed.child.valueEl.innerHTML = machine.gear[1].child.speed;
    machine.controls[1].size.parent.el.value = machine.gear[1].parent.size;
    machine.controls[1].size.parent.valueEl.innerHTML = machine.gear[1].parent.size;
    machine.controls[1].size.child.el.value = machine.gear[1].child.size;
    machine.controls[1].size.child.valueEl.innerHTML = machine.gear[1].child.size;
    machine.controls[1].dir.parent.el.checked = machine.gear[1].parent.dir == 1;
    machine.controls[1].dir.child.el.checked = machine.gear[1].child.dir == 1;
    machine.controls[1].color.value = color.end;

    machine.controls.hand.arm.length.el.value = machine.hand.arm.length;
    machine.controls.hand.arm.length.valueEl.innerHTML = machine.hand.arm.length;
    machine.controls.hand.forearm.length.el.value = machine.hand.forearm.length;
    machine.controls.hand.forearm.length.valueEl.innerHTML = machine.hand.forearm.length;
    machine.controls.hand.palm.length.el.value = machine.hand.palm.length;
    machine.controls.hand.palm.length.valueEl.innerHTML = machine.hand.palm.length;

    machine.controls.accuracy.el.value = canvas.accuracy;
    machine.controls.accuracy.valueEl.innerHTML = canvas.accuracy;

    machine.controls.opacity.el.value = color.opacity;
    machine.controls.opacity.valueEl.innerHTML = color.opacity;
}

function settingToCache(){
    var setting = {
        color:{
            start: color.start,
            end: color.end,
            opacity: color.opacity,
        },
        canvas:{
            accuracy: canvas.accuracy,
        },
        machine: {
            gear: {
                0: { // left
                    deg: machine.gear[0].deg,
                    wallDistance: machine.gear[0].wallDistance,
                    parent: {
                        dir: machine.gear[0].parent.dir,
                        speed: machine.gear[0].parent.speed,
                        // deg: machine.gear[0].parent.deg,
                        size: machine.gear[0].parent.size,
                    },
                    child: {
                        dir: machine.gear[0].child.dir,
                        speed: machine.gear[0].child.speed,
                        // deg: machine.gear[0].child.deg,
                        size: machine.gear[0].child.size,
                        conDeg: machine.gear[0].child.conDeg,
                    },
                },
                1: {
                    deg: machine.gear[1].deg,
                    wallDistance: machine.gear[1].wallDistance,
                    parent: {
                        dir: machine.gear[1].parent.dir,
                        speed: machine.gear[1].parent.speed,
                        // deg: machine.gear[1].parent.deg,
                        size: machine.gear[1].parent.size,
                    },
                    child: {
                        dir: machine.gear[1].child.dir,
                        speed: machine.gear[1].child.speed,
                        // deg: machine.gear[1].child.deg,
                        size: machine.gear[1].child.size,
                        conDeg: machine.gear[1].child.conDeg,
                    },
                },
            },
            hand: {
                arm: {
                    length: machine.hand.arm.length,
                },
                forearm:{
                    length: machine.hand.forearm.length,
                },
                palm:{
                    length: machine.hand.palm.length,
                }
            },
        }
    };
    localStorage.setItem('harmonograph_v2_setting', JSON.stringify(setting));
    // console.log(localStorage)
}

function cacheToSetting(setting){
    if(typeof setting === "undefined"){
        try{
            setting = JSON.parse(localStorage.getItem('harmonograph_v2_setting'));
        }
        catch(e){
            setting = null;
        }
    }
    if(setting){
        if(typeof setting?.machine?.gear?.[0]?.deg !== "undefined"){
            machine.gear[0].deg = setting.machine.gear[0].deg;
        }
        if(typeof setting?.machine?.gear?.[0]?.child?.conDeg !== "undefined"){
            machine.gear[0].child.conDeg = setting.machine.gear[0].child.conDeg;
        }
        if(typeof setting?.machine?.gear?.[0]?.wallDistance !== "undefined"){
            machine.gear[0].wallDistance = setting.machine.gear[0].wallDistance;
        }
        if(typeof setting?.machine?.gear?.[0]?.parent?.dir !== "undefined"){
            machine.gear[0].parent.dir = setting.machine.gear[0].parent.dir;
        }
        if(typeof setting?.machine?.gear?.[0]?.parent?.speed !== "undefined"){
            machine.gear[0].parent.speed = setting.machine.gear[0].parent.speed;
        }
        // if(typeof setting?.machine?.gear?.[0]?.parent?.deg !== "undefined"){
        //     machine.gear[0].parent.deg = setting.machine.gear[0].parent.deg;
        // }
        if(typeof setting?.machine?.gear?.[0]?.parent?.size !== "undefined"){
            machine.gear[0].parent.size = setting.machine.gear[0].parent.size;
        }
        if(typeof setting?.machine?.gear?.[0]?.child?.dir !== "undefined"){
            machine.gear[0].child.dir = setting.machine.gear[0].child.dir;
        }
        if(typeof setting?.machine?.gear?.[0]?.child?.speed !== "undefined"){
            machine.gear[0].child.speed = setting.machine.gear[0].child.speed;
        }
        // if(typeof setting?.machine?.gear?.[0]?.child?.deg !== "undefined"){
        //     machine.gear[0].child.deg = setting.machine.gear[0].child.deg;
        // }
        if(typeof setting?.machine?.gear?.[0]?.child?.size !== "undefined"){
            machine.gear[0].child.size = setting.machine.gear[0].child.size;
        }

        if(typeof setting?.machine?.gear?.[1]?.deg !== "undefined"){
            machine.gear[1].deg = setting.machine.gear[1].deg;
        }
        if(typeof setting?.machine?.gear?.[1]?.child?.conDeg !== "undefined"){
            machine.gear[1].child.conDeg = setting.machine.gear[1].child.conDeg;
        }
        if(typeof setting?.machine?.gear?.[1]?.wallDistance !== "undefined"){
            machine.gear[1].wallDistance = setting.machine.gear[1].wallDistance;
        }
        if(typeof setting?.machine?.gear?.[1]?.parent?.dir !== "undefined"){
            machine.gear[1].parent.dir = setting.machine.gear[1].parent.dir;
        }
        if(typeof setting?.machine?.gear?.[1]?.parent?.speed !== "undefined"){
            machine.gear[1].parent.speed = setting.machine.gear[1].parent.speed;
        }
        // if(typeof setting?.machine?.gear?.[1]?.parent?.deg !== "undefined"){
        //     machine.gear[1].parent.deg = setting.machine.gear[1].parent.deg;
        // }
        if(typeof setting?.machine?.gear?.[1]?.parent?.size !== "undefined"){
            machine.gear[1].parent.size = setting.machine.gear[1].parent.size;
        }
        if(typeof setting?.machine?.gear?.[1]?.child?.dir !== "undefined"){
            machine.gear[1].child.dir = setting.machine.gear[1].child.dir;
        }
        if(typeof setting?.machine?.gear?.[1]?.child?.speed !== "undefined"){
            machine.gear[1].child.speed = setting.machine.gear[1].child.speed;
        }
        // if(typeof setting?.machine?.gear?.[1]?.child?.deg !== "undefined"){
        //     machine.gear[1].child.deg = setting.machine.gear[1].child.deg;
        // }
        if(typeof setting?.machine?.gear?.[1]?.child?.size !== "undefined"){
            machine.gear[1].child.size = setting.machine.gear[1].child.size;
        }
        
        if(typeof setting?.machine?.hand?.arm?.length !== "undefined"){
            machine.hand.arm.length = setting.machine.hand.arm.length;
        }
        if(typeof setting?.machine?.hand?.forearm?.length !== "undefined"){
            machine.hand.forearm.length = setting.machine.hand.forearm.length;
        }
        if(typeof setting?.machine?.hand?.palm?.length !== "undefined"){
            machine.hand.palm.length = setting.machine.hand.palm.length;
        }

        if(typeof setting?.canvas?.accuracy !== "undefined"){
            canvas.accuracy = setting.canvas.accuracy;
        }

        if(typeof setting?.color?.start !== "undefined"){
            color.start = setting.color.start;
        }
        if(typeof setting?.color?.end !== "undefined"){
            color.end = setting.color.end;
        }
        if(typeof setting?.color?.opacity !== "undefined"){
            color.opacity = setting.color.opacity;
        }
        else{
            color.opacity = .5;
        }
    }
}



function init() {
    loadElements();
    cacheToSetting();
    setValueToInputs();
    setBoard(); 
    setMachineAndGear();
    setColor();
    initEvents();
    loadPresets();
    enablePopovers();
}

function enablePopovers(){
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
    })
}

function turnMotor(reset){    
    if(typeof reset === "undefined"){
        reset = false;
    }
    // console.log('turnMotor');
    function calSpeed(sec, dir){
        if(!sec){
            return 0;
        }
        return (360/(sec*1000)) * frequency * dir;
    }

    function roundDeg(deg){
        if(reset){
            return 0;
        }
        deg = deg%360;
        deg = _parseFloat(deg.toFixed(canvas.accuracy));
        if(deg === -0){
            deg = 0;
        }
        else if(deg === 360 || deg === -360){
            deg = 0;
        }
        return deg;
    }

    machine.gear[0].parent.deg = roundDeg(machine.gear[0].parent.deg + calSpeed(machine.gear[0].parent.speed, machine.gear[0].parent.dir));
    machine.gear[0].parent.el.style.transform = `rotate(${ machine.gear[0].parent.deg }deg)`;

    machine.gear[0].child.deg = roundDeg(machine.gear[0].child.deg + calSpeed(machine.gear[0].child.speed, machine.gear[0].child.dir));
    machine.gear[0].child.el.style.transform = `rotate(${ machine.gear[0].child.deg }deg)`;

    machine.gear[1].parent.deg = roundDeg(machine.gear[1].parent.deg + calSpeed(machine.gear[1].parent.speed, machine.gear[1].parent.dir));
    machine.gear[1].parent.el.style.transform = `rotate(${ machine.gear[1].parent.deg }deg)`;

    machine.gear[1].child.deg = roundDeg(machine.gear[1].child.deg + calSpeed(machine.gear[1].child.speed, machine.gear[1].child.dir));
    machine.gear[1].child.el.style.transform = `rotate(${ machine.gear[1].child.deg }deg)`;

}

function save() {
    var dataURL = canvas.el.toDataURL();
    document.getElementById("canvasimg").href = dataURL;
    document.getElementById("canvasimg").click();
}

function doClear(){
    canvas.context.clearRect(0, 0, canvas.el.width, canvas.el.height);
    setColor();
    turnMotor(true);
    setMachineAndGear();
    logStartPosition(false);
}

function clear(){
    if (confirm("Are you sure to clear the Board?") == true) {
        doClear();
    }
}

function logStartPosition(a){
    if(a && !canvas.startDeg.degLogged){
        // canvas.startDeg[0].parent = _parseFloat(machine.gear[0].parent.deg.toFixed(2));
        // canvas.startDeg[0].child = _parseFloat(machine.gear[0].child.deg.toFixed(2));
        // canvas.startDeg[1].parent = _parseFloat(machine.gear[1].parent.deg.toFixed(2));
        // canvas.startDeg[1].child = _parseFloat(machine.gear[1].child.deg.toFixed(2));
        canvas.startDeg[0].parent = machine.gear[0].parent.deg;
        canvas.startDeg[0].child = machine.gear[0].child.deg;
        canvas.startDeg[1].parent = machine.gear[1].parent.deg;
        canvas.startDeg[1].child = machine.gear[1].child.deg;
    }
    canvas.startDeg.degLogged = a;
}

function checkCurrentPosition(){
    // let gear0parentDeg = _parseFloat(machine.gear[0].parent.deg.toFixed(2));
    // let gear0childDeg = _parseFloat(machine.gear[0].child.deg.toFixed(2));
    // let gear1parentDeg = _parseFloat(machine.gear[1].parent.deg.toFixed(2));
    // let gear1childDeg = _parseFloat(machine.gear[1].child.deg.toFixed(2));
    let gear0parentDeg = machine.gear[0].parent.deg;
    let gear0childDeg = machine.gear[0].child.deg;
    let gear1parentDeg = machine.gear[1].parent.deg;
    let gear1childDeg = machine.gear[1].child.deg;
    // console.log(gear0parentDeg, gear0childDeg, gear1parentDeg, gear1childDeg)
    if(
        gear0parentDeg == canvas.startDeg[0].parent &&
        gear0childDeg == canvas.startDeg[0].child && 
        gear1parentDeg == canvas.startDeg[1].parent &&
        gear1childDeg == canvas.startDeg[1].child
    ){
        stop();
    }
}

function start(){
    // console.log('start');
    if(!drawing){
        drawing = true;
        board.el.classList.add('drawing')
        board.el.classList.remove('show-config');
        setMachineAndGear();

        logStartPosition(true);

        var bound = machine.hand.pen.getBoundingClientRect();
        canvas.penPos.x = bound.left;
        canvas.penPos.y = bound.top;
        objectPosChange();
    }
}

function stop(){
    if(drawing){
        board.el.classList.remove('drawing')
        drawing = false;
        // setMachineAndGear();
    }
}

function draw() {
    // console.log('draw');
    // console.log((new Date()).getTime())
    canvas.context.beginPath();
    canvas.context.moveTo((canvas.penPos.oldx - canvas.pos.x) * canvas.scale, (canvas.penPos.oldy - canvas.pos.y) * canvas.scale);
    canvas.context.lineTo((canvas.penPos.x - canvas.pos.x) * canvas.scale, (canvas.penPos.y - canvas.pos.y) * canvas.scale);
    // console.log(color.range[color.current])
    canvas.context.strokeStyle = color.range[color.current];
    color.current++;
    if(color.current >= color.range.length){
        color.current = 0;
    }
    canvas.context.lineWidth = canvas.strokeWidth;
    canvas.context.stroke();
    canvas.context.closePath();


    // console.log(
    //     machine.gear[0].parent.deg,
    //     machine.gear[0].child.deg,
    //     machine.gear[1].parent.deg,
    //     machine.gear[1].child.deg
    // )

    checkCurrentPosition();
}

worker.addEventListener('message', function(e){
    if(drawing){
        objectPosChange();
    }
});

function objectPosChange(){
    // console.log('objectPosChange');
    if(!machine.gear[0].parent.speed && !machine.gear[1].parent.speed && !machine.gear[0].child.speed && !machine.gear[1].child.speed){
        return;
    }
    // console.log(canvas.penPos);
    canvas.penPos.oldx = canvas.penPos.x;
    canvas.penPos.oldy = canvas.penPos.y;
    turnMotor();
    setMachine();
    var bound = machine.hand.pen.getBoundingClientRect();
    canvas.penPos.x = bound.left;
    canvas.penPos.y = bound.top;

    draw();	
    
    if(drawing){
        // setTimeout(function(){
        //     if(drawing){
        //         objectPosChange();
        //     }
        // }, frequency)
        worker.postMessage({frequency: frequency})
    }
    
}

function _parseInt(num){
    if(num){
        num = parseInt(num);
        if(isNaN(num)){
            num = 0;
        }
    }
    else{
        num = 0;
    }
    return num;
}

function _parseFloat(num){
    if(num){
        num = parseFloat(num);
        if(isNaN(num)){
            num = 0;
        }
    }
    else{
        num = 0;
    }
    return num;
}

function initEvents(){
    
    
    
    // document.getElementById('stop_btn').addEventListener('click', function(e) { e.preventDefault(); stop() }, false);
    window.addEventListener('click', function(e) {
        if(e.target.closest('.machine_controls_play') && !drawing){
            e.preventDefault();
            start();
        }
        else if(e.target.closest('.machine_controls_show_drawing_only')){
            e.preventDefault();
            board.el.classList.add('show_drawing_only');
        }
        else if(e.target.closest('.machine_controls_show_everything')){
            e.preventDefault();
            board.el.classList.remove('show_drawing_only');
        }
        else if(e.target.closest('.machine_controls_save')){
            e.preventDefault();
            save();
        }
        else if(e.target.closest('.machine_controls_show_config')){
            e.preventDefault();
            board.el.classList.add('show-config');
        }
        else if(e.target.closest('.machine_controls_clear')){
            e.preventDefault();
            clear();
        }
        else if(e.target.closest('.preset_element')){
            e.preventDefault();
            let el = e.target.closest('.preset_element');
            let index = el.getAttribute('data-id');
            index = _parseInt(index);
            setPreset(index);
        }
        else if(e.target.closest('.machine_controls_pause') && drawing){
            e.preventDefault();
            stop();
        }
        else{
            stop();
        }
    }, false);
    // document.getElementById('start_btn').addEventListener('click', function(e) { e.preventDefault(); start() }, false);
    
    machine.controls[0].color.addEventListener('change', function(e) {
        color.start = this.value;
        color.end = this.value;
        machine.controls[1].color.value = this.value;
        settingToCache();
        setColor();
        logStartPosition(false);
    }, false);
    machine.controls[1].color.addEventListener('change', function(e) {
        color.end = this.value;
        settingToCache();
        setColor();
        logStartPosition(false);
    }, false);

    machine.controls[0].move.el.addEventListener('input', function(e) {
        machine.gear[0].wallDistance = _parseFloat(this.value);
        machine.controls[0].move.valueEl.innerHTML = this.value;
        setGear(0);
        setTimeout(function(){setMachine()}, 10)
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[1].move.el.addEventListener('input', function(e) {
        machine.gear[1].wallDistance = _parseFloat(this.value);
        machine.controls[1].move.valueEl.innerHTML = this.value;
        setGear(1);
        setTimeout(function(){setMachine()}, 10)
        settingToCache();
        logStartPosition(false);
    }, false);

    machine.controls[0].rotate.parent.el.addEventListener('input', function(e) {
        machine.gear[0].deg = _parseFloat(this.value);
        machine.controls[0].rotate.parent.valueEl.innerHTML = this.value;
        setMachineAndGear();
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[0].rotate.child.el.addEventListener('input', function(e) {
        machine.gear[0].child.conDeg = _parseFloat(this.value);
        machine.controls[0].rotate.child.valueEl.innerHTML = this.value;
        setMachineAndGear();
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[1].rotate.parent.el.addEventListener('input', function(e) {
        machine.gear[1].deg = _parseFloat(this.value);
        machine.controls[1].rotate.parent.valueEl.innerHTML = this.value;
        setMachineAndGear();
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[1].rotate.child.el.addEventListener('input', function(e) {
        machine.gear[1].child.conDeg = _parseFloat(this.value);
        machine.controls[1].rotate.child.valueEl.innerHTML = this.value;
        setMachineAndGear();
        settingToCache();
        logStartPosition(false);
    }, false);

    machine.controls[0].speed.parent.el.addEventListener('input', function(e) {
        machine.gear[0].parent.speed = _parseFloat(this.value);
        machine.controls[0].speed.parent.valueEl.innerHTML = this.value;
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[0].speed.child.el.addEventListener('input', function(e) {
        machine.gear[0].child.speed = _parseFloat(this.value);
        machine.controls[0].speed.child.valueEl.innerHTML = this.value;
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[1].speed.parent.el.addEventListener('input', function(e) {
        machine.gear[1].parent.speed = _parseFloat(this.value);
        machine.controls[1].speed.parent.valueEl.innerHTML = this.value;
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[1].speed.child.el.addEventListener('input', function(e) {
        machine.gear[1].child.speed = _parseFloat(this.value);
        machine.controls[1].speed.child.valueEl.innerHTML = this.value;
        settingToCache();
        logStartPosition(false);
    }, false);

    machine.controls[0].size.parent.el.addEventListener('input', function(e) {
        machine.gear[0].parent.size = _parseFloat(this.value);
        machine.controls[0].size.parent.valueEl.innerHTML = this.value;
        setMachineAndGear();
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[0].size.child.el.addEventListener('input', function(e) {
        machine.gear[0].child.size = _parseFloat(this.value);
        machine.controls[0].size.child.valueEl.innerHTML = this.value;
        setMachineAndGear();
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[1].size.parent.el.addEventListener('input', function(e) {
        machine.gear[1].parent.size = _parseFloat(this.value);
        machine.controls[1].size.parent.valueEl.innerHTML = this.value;
        setMachineAndGear();
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[1].size.child.el.addEventListener('input', function(e) {
        machine.gear[1].child.size = _parseFloat(this.value);
        machine.controls[1].size.child.valueEl.innerHTML = this.value;
        setMachineAndGear();
        settingToCache();
        logStartPosition(false);
    }, false);

    machine.controls[0].dir.parent.el.addEventListener('change', function(e) {
        let dir = this.checked ? 1 : -1;
        machine.gear[0].parent.dir = dir;
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[0].dir.child.el.addEventListener('change', function(e) {
        let dir = this.checked ? 1 : -1;
        machine.gear[0].child.dir = dir;
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[1].dir.parent.el.addEventListener('change', function(e) {
        let dir = this.checked ? 1 : -1;
        machine.gear[1].parent.dir = dir;
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls[1].dir.child.el.addEventListener('change', function(e) {
        let dir = this.checked ? 1 : -1;
        machine.gear[1].child.dir = dir;
        settingToCache();
        logStartPosition(false);
    }, false);

    machine.controls.hand.arm.length.el.addEventListener('input', function(e) {
        machine.hand.arm.length = _parseFloat(this.value);
        machine.controls.hand.arm.length.valueEl.innerHTML = this.value;
        setMachine();
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls.hand.forearm.length.el.addEventListener('input', function(e) {
        machine.hand.forearm.length = _parseFloat(this.value);
        machine.controls.hand.forearm.length.valueEl.innerHTML = this.value;
        setMachine();
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls.hand.palm.length.el.addEventListener('input', function(e) {
        machine.hand.palm.length = _parseFloat(this.value);
        machine.controls.hand.palm.length.valueEl.innerHTML = this.value;
        setMachine();
        settingToCache();
        logStartPosition(false);
    }, false);

    machine.controls.accuracy.el.addEventListener('input', function(e) {
        canvas.accuracy = _parseInt(this.value);
        machine.controls.accuracy.valueEl.innerHTML = this.value;
        setMachine();
        settingToCache();
        logStartPosition(false);
    }, false);
    machine.controls.opacity.el.addEventListener('input', function(e) {
        color.opacity = _parseFloat(this.value);
        machine.controls.opacity.valueEl.innerHTML = this.value;
        setMachine();
        setColor();
        settingToCache();
        logStartPosition(false);
    }, false);

}
