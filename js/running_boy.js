var body, canvas, context;
body = canvas = context = null;
var fps = (1000/32);
var boy_standing = new Image();
var boy_running_left = new Image();
var boy_running_right = new Image();
var tree = new Image();
var bird_sitting = new Image();
var bird_flapping_up = new Image();
var bird_flapping_down = new Image();
var boy_state = null;
var boy_x = null;
var boy_y = null;
var running_fps = 6;
var run_step = 0;
var world_y = 0;
var tree_x = null;
var tree_y = null;
var footstep_fx = new Audio("audio/footstep.wav");
footstep_fx.preload = "auto";
var tree_distance = 1700;
var bird_distance = 550;
var bird_hasnt_flown = true;
var bird_x = null;
var bird_y = null;
var bird_speed = 15;
var bird_flap = 0;
var flap_fps = 5;
var bird_trajectory = 1;
var nature_fx = new Audio("audio/nature.wav");
nature_fx.preload = "auto";
nature_fx.loop = true;
var bird_fx = new Audio("audio/bird.wav");
bird_fx.preload = "auto";
bird_fx.loop = false;
var jeffmangum = new Audio("audio/jeffmangum.mp3");
jeffmangum.preload = "auto";
jeffmangum.volume = 0.0;
var music_distance = 30;
var volume_increase = null;
var jeff_is_playing = false;
var man_fps = 2;
var man_strum = 0;
var man_strum_up = new Image();
var man_strum_down = new Image();
var flower = new Image();
var flower_distance = 0;

var init = function() {
	body = document.getElementsByTagName("body")[0];
	canvas = document.createElement("canvas");
	canvas.id = "canvas";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context = canvas.getContext('2d');
	body.appendChild(canvas);

	// initialize images
	boy_standing.onload = function() { 
		boy_x = (canvas.width / 2) - (boy_standing.width / 2);
		// boy_y = (canvas.height / 2) - (boy_standing.height / 2);
		// boy_y = (canvas.height - ((boy_standing.height / 2) * 3));
		boy_y = (canvas.height - (boy_standing.height));
		boy_state = "standing";
	};
	bird_sitting.onload = function() {
		bird_x = (canvas.width + 1);
		bird_y = (canvas.height - ((2*bird_sitting.height)/3));
	};
	boy_standing.src = "./img/boy_standing.png";
	boy_running_left.src = "./img/boy_running_left.png";
	boy_running_right.src = "./img/boy_running_right.png";
	tree.src = "./img/tree.png";
	bird_sitting.src = "./img/bird_sitting.png";
	bird_flapping_up.src = "./img/bird_flapping_up.png";
	bird_flapping_down.src = "./img/bird_flapping_down.png";
	man_strum_up.src = "./img/man_strum_up.png";
	man_strum_down.src = "./img/man_strum_down.png";
	flower.src = "./img/flower.png";

	// initialize audio
	nature_fx.play();
};

var set_state = function() {
};

var every_step_you_take = function() {
	footstep_fx.play();
	run_step++;
	world_y += 5;
};

var draw_boy = function() {
	if (boy_state == "standing") {
		context.drawImage(boy_standing, boy_x, boy_y);
	}
	else if (boy_state == "running") {
		if (run_step < running_fps) {
			context.drawImage(boy_running_left, boy_x, boy_y);
			every_step_you_take();
			return;
		}
		else if (run_step < (running_fps*2)) {
			context.drawImage(boy_running_right, boy_x, boy_y);
			every_step_you_take();
			return;
		}
		context.drawImage(boy_running_left, boy_x, boy_y);
		run_step = 0;
	}
};

var draw_tree = function() {
	if (world_y >= tree_distance) {
		tree_x = ((canvas.width / 2) - 200);
		tree_y = ((-1 * tree.height) + (world_y - tree_distance));
		context.drawImage(tree, tree_x, tree_y);
	}
};

var draw_bird = function() {
	if (world_y >= bird_distance) {
		if (bird_hasnt_flown) {
			if (bird_x > (canvas.width / 2)) { bird_fx.play(); }
			bird_x -= bird_speed;
			bird_y -= 10;
			if (bird_flap < flap_fps) { context.drawImage(bird_flapping_up, bird_x, bird_y); bird_flap++; }
			else if (bird_flap < (2*flap_fps)) { context.drawImage(bird_flapping_down, bird_x, bird_y); bird_flap++; }
			else { context.drawImage(bird_flapping_up, bird_x, bird_y); bird_flap = 0; }
			if (bird_x < 0) { bird_hasnt_flown = false; }
		}
		// if (!bird_hasnt_flown && (world_y >= tree_distance)) {
		// 	context.drawImage(bird_sitting, (tree_x + 315), (tree_y-45));
		// }
	}
};

var play_music = function() {
	if (tree.height == 0) { return; }
	if (((tree_distance + tree.height) - world_y) <= 1000) {
		if (!jeff_is_playing) {
			jeffmangum.play();
			jeffmangum.currentTime = 60;
			jeff_is_playing = true;
		}
		if (((tree_distance + tree.height)- world_y) > 0) {
			// console.log("tree_distance: " + tree_distance + "; tree.height: " + tree.height);
			volume_increase = (1 - (((tree_distance + tree.height) - world_y) / 1000));
			// console.log("vol: " + volume_increase);
			if (volume_increase < 1) { jeffmangum.volume = volume_increase; }
		}
	};
};

var draw_debug = function() {
	context.font = "bold 12px sans-serif";
	var debug = "world_y: " + world_y + "\ntree_distance: " + tree_distance + "\njeffmangum.volume: " + jeffmangum.volume;
	var debug2 = "tree.height: " + tree.height + "; volume_increase: " + volume_increase;
	var debug3 = "1 - " + ((tree_distance + tree.height) - world_y) / 1000 + " = " + (1 - (((tree_distance + tree.height) - world_y) / 1000));
	var debug4 = "((tree_distance + tree.height) - world_y) = " + ((tree_distance + tree.height) - world_y);
	context.fillText(debug, 15, 15);
	context.fillText(debug2, 15, 30);
	context.fillText(debug3, 15, 45);
	context.fillText(debug4, 15, 60);
};

var draw_man = function() {
	if (world_y >= tree_distance && tree_x && tree_y) {
		var man_x = (tree_x + 80);
		var man_y = (tree_y + 300);
		if (man_strum < man_fps) { context.drawImage(man_strum_down, man_x, man_y); man_strum++; return; }
		else if (man_strum < (2*man_fps)) { context.drawImage(man_strum_up, man_x, man_y); man_strum++; return; }
		context.drawImage(man_strum_down, man_x, man_y); 
		man_strum = 0;
	}
};

var draw_flower = function() {
	if (world_y >= flower_distance) {
		var flower_x = ((canvas.height/3) * 1);
		var flower_y = ((1*canvas.height/3) + world_y);
		context.drawImage(flower, flower_x, flower_y);
	}
};

var draw = function() {
	draw_tree();
	draw_boy();
	draw_bird();
	draw_man();
	draw_flower();
	play_music();
	// draw_debug();
	var debug = "world_y: " + world_y + "tree_y: " + tree_y;
	// console.log(debug);	
};

var clear = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
};

var key_down = function(e) {
	switch (e.keyCode) {
		case 38:
			if (tree_y >= 5) { boy_state = "standing"; }
			else { boy_state = "running"; }
			break;
	}
};

var key_up = function(e) {
	switch (e.keyCode) {
		case 38:
			boy_state = "standing";
			run_step = 0;
			break;
	}
};

var loop = function() {
	// set_state();
	// console.log("boy x and y: " + boy_x + ", " + boy_y);
	clear();
	draw();
	setTimeout(loop, fps);
};

var start = function() {
	init();
	loop();
};
