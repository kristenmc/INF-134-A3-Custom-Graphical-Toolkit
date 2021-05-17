// File name: demo.js

import {MyToolkit} from './mytoolkit.js';
import {CheckBoxes} from './mytoolkit.js';
import {RadioButtons} from './mytoolkit.js';
import {TextBox} from './mytoolkit.js';
import {ScrollBar} from './mytoolkit.js';
import {ProgressBar} from './mytoolkit.js';
import {ToggleSwitch} from './mytoolkit.js';

// Implement a MyToolkit Button
var btn = new MyToolkit.Button;
btn.move(100,100);
btn.onClick(function(e){
	//console.log(e);
});
btn.onStateChange(function(e){
	//console.log(e);
});
btn.setText("OOOOOOOOO");

var checkboxes = new CheckBoxes(3);
checkboxes.onClick(function(e){
	//console.log(e);
});
checkboxes.onStateChange(function(e){
	//console.log(e);
});
checkboxes.setText(0, "Hi");
checkboxes.move(300,100)

var radiobuttons = new RadioButtons(5);
radiobuttons.onClick(function(e){
	//console.log(e);
});
radiobuttons.onStateChange(function(e){
	//console.log(e);
});

radiobuttons.setText(3, "Hello!");
radiobuttons.setText(1, "Oh No!");
radiobuttons.move(0, -500);

var textbox = new TextBox();
textbox.move(50,5)
textbox.onType(function(e){
	console.log(e);
});
textbox.onStateChange(function(e){
	//console.log(e);
});

var scrollbar = new ScrollBar(300);




var progressbar = new ProgressBar(500, 100);
progressbar.onIncrement(function(e){
	//console.log(e);
});
progressbar.onStateChange(function(e){
	//console.log(e);
});

progressbar.setValue(0);
progressbar.setWidth(150);
progressbar.move(200,100);
progressbar.setValue(35);
progressbar.increment(100);


var toggleswitch = new ToggleSwitch(false);
toggleswitch.move(300, 100);
toggleswitch.onClick(function(e){
	//console.log(e);
});
toggleswitch.onStateChange(function(e){
	//console.log(e);
});






