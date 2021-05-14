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
btn.setText("Hellooooooo");

var checkboxes = new CheckBoxes(3);
checkboxes.onClick(function(e){
	//console.log(e);
});
checkboxes.onStateChange(function(e){
	//console.log(e);
});

var radiobuttons = new RadioButtons(5);
radiobuttons.onClick(function(e){
	console.log(e);
});

radiobuttons.setText(3, "Hello!");
radiobuttons.setText(1, "Oh No!");

var textbox = new TextBox();

var scrollbar = new ScrollBar(300);

var progressbar = new ProgressBar(500, 50);
progressbar.setValue(50);
progressbar.setWidth(300);

var toggleswitch = new ToggleSwitch(false);
toggleswitch.move(300, 100);




