// File name: demo.js

import {MyToolkit} from './mytoolkit.js';
import {CheckBoxes} from './mytoolkit.js';
import {RadioButtons} from './mytoolkit.js';
import {TextBox} from './mytoolkit.js';
import {ScrollBar} from './mytoolkit.js';
import {ProgressBar} from './mytoolkit.js';

// Implement a MyToolkit Button
var btn = new MyToolkit.Button;
btn.move(100,100);
btn.onclick(function(e){
	console.log(e);
});

var checkboxes = new CheckBoxes(3);

var radiobuttons = new RadioButtons(5);

var textbox = new TextBox();

var scrollbar = new ScrollBar(200);

var progressbar = new ProgressBar(50);



