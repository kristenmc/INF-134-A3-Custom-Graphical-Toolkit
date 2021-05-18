// File name: demo.js

import {Button} from './mytoolkit.js';
import {CheckBoxes} from './mytoolkit.js';
import {RadioButtons} from './mytoolkit.js';
import {TextBox} from './mytoolkit.js';
import {ScrollBar} from './mytoolkit.js';
import {ProgressBar} from './mytoolkit.js';
import {ToggleSwitch} from './mytoolkit.js';

// Implement a MyToolkit Button
var btn = new Button;
btn.move(100,100);
btn.onClick(function(e){
	//console.log(e);
});
btn.onStateChange(function(e){
	//console.log(e);
});
btn.setText("OOOOOOOOO");

var checkboxes = new CheckBoxes(5);
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
radiobuttons.move(50, 400);

var textbox = new TextBox();
textbox.move(50,5)
textbox.onType(function(e){
	//console.log(e);
});
textbox.onStateChange(function(e){
	//console.log(e);
});

var scrollbar = new ScrollBar(100);
scrollbar.move(600,500)
scrollbar.setHeight(400)
scrollbar.move(500,300)
scrollbar.setHeight(250)
scrollbar.move(400,300)
scrollbar.setHeight(100)
//console.log(scrollbar.getThumbPosition())

scrollbar.onDrag(function(e){
	//console.log(e);
});
scrollbar.onStateChange(function(e){
	//console.log(e);
});




var progressbar = new ProgressBar(500, 100);
progressbar.onIncrement(function(e){
	//console.log(e);
});
progressbar.onStateChange(function(e){
	//console.log(e);
});

progressbar.setValue(0);
progressbar.setWidth(300);
progressbar.move(500,100);
progressbar.setValue(35);
progressbar.increment(100);


var toggleswitch = new ToggleSwitch(false, 'orange');
toggleswitch.move(300, 500);
toggleswitch.onClick(function(e){
	//console.log(e);
});
toggleswitch.onStateChange(function(e){
	//console.log(e);
});






