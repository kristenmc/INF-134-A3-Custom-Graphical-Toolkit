// File name: mytoolkit.js

import {SVG} from './svg.min.js';

var MyToolkit = (function() {
    var Button = function(){
        var draw = SVG().addTo('body').size('50%','50%');
        draw.attr({'overflow': 'visible'})
        var idleGradient = draw.gradient('linear', function(add) {
            add.stop(0, 'orange')
            add.stop(0.5, 'pink')
            add.stop(1, 'orange')
        })
        idleGradient.from(0, 0).to(0, 1)
        var rect = draw.rect(100,50).fill(idleGradient)
        rect.stroke({color: 'gray', width: 2, linecap: 'round', linejoin: 'round'});

        var boxText = draw.text('Text');
        boxText.move(49,17);
        boxText.fill('black');
        boxText.font({family: 'Trebuchet MS', anchor: 'middle'})

        var group = draw.group();
        group.add(rect);
        group.add(boxText);

        var clickEvent = null;
        var stateChangeEvent = null;

        group.mouseover(function(event){
            rect.fill({ color: 'orange'})
            rect.stroke({color: 'gray', width: 3});
            boxText.fill('black');
            stateChangeEvent(event)
        })
        group.mouseout(function(event){
            rect.fill({ color: idleGradient})
            rect.stroke({color: 'gray', width: 2})
            boxText.fill('black');
            stateChangeEvent(event)
        })
        group.mouseup(function(event){
            rect.fill({ color: 'orange'})
            rect.stroke({color: 'black', width: 3})
            boxText.fill('black');
            stateChangeEvent(event)
        })
        group.mousedown(function(event){
            rect.fill({ color: 'pink'})
            rect.stroke({color: 'black', width: 4})
            boxText.fill('gray');
            if(clickEvent != null)
                clickEvent(event)
            if (stateChangeEvent != null)
                stateChangeEvent(event)
        })
        return {
            move: function(x, y) {
                group.move(x, y);
            },
            onClick: function(eventHandler){
                clickEvent = eventHandler
            },
            onStateChange: function(eventHandler){
                stateChangeEvent = eventHandler
            },
            setText(string)
            {
                boxText.text(string);
            }
        }
    }
return {Button}
}());

class SingleCheckBox
{
    constructor(buttonNum, draw)
    {
        this.group = draw.group();

        this.rect = draw.rect(25,25).fill('white')
        this.rect.stroke({color: 'black', width: 4, linecap: 'round', linejoin: 'round'});

        this.checkmark = draw.polyline('8,14, 12,19 18,6');
        this.checkmark.fill('transparent');
        this.checkmark.stroke({color: 'transparent', width: 2, linecap: 'round', linejoin: 'round'});

        this.text = draw.text("Test " + buttonNum);
        this.text.move(35,3);
        this.text.font({family: 'Trebuchet MS'});

        this.group.add(this.rect);
        this.group.add(this.checkmark);
        this.group.add(this.text)

        this.buttonNum = buttonNum;
        this.clickEvent = null;
        this.stateChangeEvent = null;
        this.checked = false;
        this.previouslyChecked = false;


        this.rect.y((buttonNum+1)*35);
        this.checkmark.y((buttonNum+1)*35 + 5);
        this.text.y((buttonNum+1)*36);

        
        this.clickBox(this);
        this.otherStateChanges(this);
    }

    clickBox(self)
    {
        this.group.click(function(event){
            if (!self.checked)
            {
                self.checkmark.stroke({color: 'black'});
                self.checked = true;
                self.clickEvent = event;
            } 
            else
            {
                self.checkmark.stroke({color: 'transparent'});
                self.checked = false;
                self.clickEvent = event;
            }
            this.fire('checkboxClicked', self.buttonNum); 
            if (self.clickEvent != null)
                self.clickEvent(event);
            if (self.stateChangeEvent != null)
                self.stateChangeEvent(event);    
        })
    }

    otherStateChanges(self)
    {
        this.group.mouseover(function(event){
            if (self.stateChangeEvent != null)
                self.stateChangeEvent(event);
        })
        this.group.mouseout(function(event){
            if (self.stateChangeEvent != null)
                self.stateChangeEvent(event);
        })
    }

    move(x, y)
    {
        this.rect.move(x,(this.buttonNum+1)*35+y);
        this.checkmark.move(x + 7, ((this.buttonNum+1)*35 + 6) + y);
        this.text.move(x + 35, ((this.buttonNum+1)*36) + y)
    }

    setText(newText)
    {
        this.text.text(newText);
        if (self.stateChangeEvent != null)
            self.stateChangeEvent("Button " + this.buttonNum + " Text Change: " + newText);
    }

    onClick(eventHandler)
    {
        this.clickEvent = eventHandler;
    }

    onStateChange(eventHandler)
    {
        this.stateChangeEvent = eventHandler
    }
}

class CheckBoxes
{
    constructor(numButtons)
    {
        var draw = SVG().addTo('body').size('100%','100%');
        draw.attr({'overflow': 'visible'})
        this.checkboxList = [];

        for(var i = 0; i < numButtons; i++)
            this.checkboxList.push(new SingleCheckBox(i, draw));
    }

    move(x, y)
    {
        for(var i = 0; i < this.checkboxList.length; i++)
            this.checkboxList[i].move(x,y);
    }

    setText(buttonNum, newText)
    {
        if (buttonNum >= 0 & buttonNum < this.checkboxList.length)
            this.checkboxList[buttonNum].setText(newText);
    }

    onClick(eventHandler)
    {
        var self = this;
        for(var i = 0; i < this.checkboxList.length; i++)
        {
            this.checkboxList[i].group.on('checkboxClicked', function(event){
                self.checkboxList[event.detail].clickEvent = eventHandler;
            })
        }
    }

    onStateChange(eventHandler)
    {
        for(var i = 0; i < this.checkboxList.length; i++)
            this.checkboxList[i].stateChangeEvent = eventHandler;
    }
}


class SingleRadioButton
{
    constructor(buttonNum, draw)
    {
        this.buttonNum = buttonNum;
        this.group = draw.group();
        this.circle = draw.circle(25).fill('white');
        this.circle.stroke({color: 'black', width: 4});

        this.filling = draw.circle(15).fill('transparent');
        this.filling.move(5,5);

        this.text = draw.text("Test " + buttonNum);
        this.text.move(35,3);
        this.text.font({family: 'Trebuchet MS'});

        this.group.add(this.circle);
        this.group.add(this.filling);
        this.group.add(this.text);

        this.isChecked = false;
        this.previouslyChecked = false;
        this.clickEvent = null
        
        this.circle.y((buttonNum+1)*35);
        this.filling.y((buttonNum+1)*35 + 5);
        this.text.y((buttonNum+1)*36);

        self = this;

        this.colorChange(buttonNum);

        this.otherStateChanges(this)
    }

    move(x, y)
    {
        this.circle.move(x,(this.buttonNum+1)*35+y);
        this.filling.move(x + 5, ((this.buttonNum+1)*35 + 5) + y);
        this.text.move(x + 35, ((this.buttonNum+1)*36) + y)
    }

    onClick(eventHandler)
    {
        this.clickEvent = eventHandler;
    }

    onStateChange(eventHandler)
    {
        this.stateChangeEvent = eventHandler;
    }


    colorChange(button)
    {
        this.group.click(function(event){
            this.fire('buttonChecked', {buttonNum: button,Event: event});
        })
    }

    otherStateChanges(self)
    {
        this.group.mouseover(function(event){
            if (self.stateChangeEvent != null)
                self.stateChangeEvent(event);
        })
        this.group.mouseout(function(event){
            if (self.stateChangeEvent != null)
                self.stateChangeEvent(event);
        })
    }

    uncheckButton()
    {
        this.isChecked = false;
        this.filling.fill('transparent');
    }

    checkButton()
    {
        this.isChecked = true;
        this.filling.fill('purple');
    }

    setText(newText)
    {
        this.text.text(newText);
    }
}


class RadioButtons  
{
    constructor(numButtons)
    {
        var draw = SVG().addTo('body').size('100%','100%');
        draw.attr({'overflow': 'visible'})
        this.radioList = [];
        self = this;

        for(var i = 0; i < numButtons; i++)
        {
            var newButton = new SingleRadioButton(i, draw);
            this.radioList.push(newButton);
            newButton.move(5,5);
        }

        for(var i = 0; i < this.radioList.length; i++)
        {
            this.checkColorChange(i, this.radioList.length, this.radioList);
        }   
    }

    move(x, y)
    {
        for(var i = 0; i < this.radioList.length; i++)
            this.radioList[i].move(x,y);  
    }

    checkColorChange(index, listLength, radioList)
    {
        this.radioList[index].group.on('buttonChecked', function(data) {
            self.currentlyChecked = data.detail.buttonNum;
            for (var i = 0; i < listLength; i++)
            {
                radioList[i].uncheckButton();
            }

            radioList[index].checkButton();
            if (radioList[index].clickEvent != null)
            {
                radioList[index].clickEvent("Button: " + data.detail.buttonNum)
                radioList[index].clickEvent(data.detail.Event);
            }    
        })
    }

    setText(buttonNum, newText)
    {
        if (buttonNum >= 0 & buttonNum < this.radioList.length)
            this.radioList[buttonNum].setText(newText);
    }

    onClick(eventHandler)
    {
        var self = this;
        for(var i = 0; i < this.radioList.length; i++)
        {
            this.radioList[i].group.on('buttonChecked', function(data){
                self.radioList[data.detail.buttonNum].clickEvent = eventHandler;
                if (!self.radioList[data.detail.buttonNum].previouslyChecked)
                {
                    self.radioList[data.detail.buttonNum].clickEvent("Button: " + data.detail.buttonNum);
                    self.radioList[data.detail.buttonNum].clickEvent(data.detail.Event);
                    self.radioList[data.detail.buttonNum].previouslyChecked = true;
                }
            })
        }
    }

    onStateChange(eventHandler)
    {
        for(var i = 0; i < this.radioList.length; i++)
            this.radioList[i].stateChangeEvent = eventHandler;
    }
}


class TextBox
{
    constructor()
    {
        var draw = SVG().addTo('body').size('100%','100%');
        draw.attr({'overflow': 'visible'})
        this.group = draw.group();
        this. polyline = draw.polyline('50,75, 50,50 50,75 400,75 400,50, 50,50') //400s are rectangle width. Change to make longer or shorter
        this.polyline.fill('white').move(20, 20)
        this.polyline.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' })
        this.textContents = "";
        this.text = draw.text(this.textContents);
        this.text.move(28,17);
        this.endBox = draw.polyline('360,50 360,17 30,17');
        this.endBox.stroke({ color: 'transparent', width: 4, linecap: 'round', linejoin: 'round', fill: 'transparent'})
        this.endBox.fill('transparent');
        this.group.add(this.polyline);
        this.group.add(this.text);
        this.group.add(this.endBox);
        this.canType = false;

        this.typeEvent = null;
        this.stateChangeEvent = null;
        self = this;

        this.enableTyping(self, draw);
        this.readUserInput(self);
    }

    move(x,y)
    {
        this.group.move(x,y)
    }

    getText()
    {
        return this.textContents;
    }

    onType(eventHandler)
    {
        this.typeEvent = eventHandler
    }

    onStateChange(eventHandler)
    {
        this.stateChangeEvent = eventHandler
    }


    enableTyping(self, draw)
    {
        self.group.mouseover(function(event){
            self.text.text(self.textContents + '|');
            self.canType = true;
            
            if(self.stateChangeEventt != null)
                self.stateChangeEvent(event)
        })

        self.group.mouseout(function(event){
            self.text.text(self.textContents);
            self.canType = false;

            if(self.stateChangeEvent != null)
                self.stateChangeEvent(event)
        })

        self.text.mouseout(function(){
            self.text.text(self.textContents);
            self.canType = false;
        })

        self.polyline.mouseout(function(){
            self.text.text(self.textContents);
            self.canType = false;
        })
        draw.mouseout(function(event){
            self.text.text(self.textContents);
            self.canType = false;

            if(self.stateChangeEvent != null)
                self.stateChangeEvent(event)
        })
    }

    readUserInput(self)
    {
        window.addEventListener('keydown', function(event){
            if(self.canType)
            {
                if (event.key == "Backspace")
                {
                    self.textContents = self.textContents.slice(0, self.textContents.length-1)

                    if(self.typeEvent != null)
                        self.typeEvent(event)
                    
                    if(self.stateChangeEvent != null)
                        self.stateChangeEvent(event)
                }    
                else if(self.checkEndOfTextBox())
                {
                   if (!(event.key.length > 1))
                   {
                        self.textContents = self.textContents+ event.key;

                        if(self.typeEvent != null)
                            self.typeEvent(event)
                
                        if(self.stateChangeEvent != null)
                            self.stateChangeEvent(event)
                   }           
                }
                else
                    console.log("texbox full.");
                
                self.text.text(self.textContents + '|');
            }
            else
                self.text.text(self.textContents);
        })
    }
    checkEndOfTextBox()
    {
        var textEdge = this.text.bbox();
        var endTexBox = this.endBox.bbox();

        return textEdge.width <= endTexBox.width;
    }
}

class ScrollBar
{
    constructor(length) //NOTE TO SELF: CHECK TO SEE IF MOVING SCROLL THUMB WOULD BE OVER LIMIT. IF SO, ONLY MOVE TO LIMIT, NOT PAST IT
    {
        if (length < 100)
            this.barLength = 100;
        else
            this.barLength = length;

        var draw = SVG().addTo('body').size('100%','75%');
        draw.attr({'overflow': 'visible'})
        this.upButton = draw.polyline('50,50 50,75 75,75 75,50 50,50');
        this.upButton.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this.upButton.fill('white');

        this.scrollArea = draw.polyline([[50,75], [50,this.barLength], [75,this.barLength], [75,75], [50,75]]);
        this.scrollArea.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this.scrollArea.fill('gray');
       
        this.downButton = draw.polyline([[50,this.barLength], [50,this.barLength+25], [75,this.barLength+25], [75,this.barLength]]);
        this.downButton.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this.downButton.fill('white');

        this.scroller = draw.polyline('54,78 54,96 71,96 71,78 54,78');
        this.scroller.stroke({ color: '#f23f8d', width: 4, linecap: 'round', linejoin: 'round' });
        this.scroller.fill('black');

        this.scrollBorderUpper = draw.line(50,78,75,78);
        this.scrollBorderUpper.stroke({ color: '#34b7eb', width: 4, linecap: 'round'});

        this.scrollBorderLower = draw.line(50,this.barLength-5, 75,this.barLength-5);
        this.scrollBorderLower.stroke({ color: '#34b7eb', width: 4, linecap: 'round'});

        this.isHeld = false;
        self=this;

        this.enableDrag();
        this.dragScroller(this.scroller, this);
        this.clickButtons(this.scroller, this);
    }

    enableDrag()
    {
        this.scroller.mousedown(function(event){
            self.isHeld = true;
        })

        this.scroller.mouseup(function(event){
            self.isHeld = false;
        })

        window.addEventListener('mouseup', function(event){
            self.isHeld = false;
          })
    }

    dragScroller(scroll, self)
    {
        window.addEventListener('mousemove', function(event){
            if (self.isHeld)
            {
                console.log("event: " + event.clientY)    
                console.log("scroller: " + scroll.y())

                if (self.atUpperBorder())
                {
                    console.log("At Top")
                    if(event.clientY > scroll.y())
                        scroll.y(event.clientY);     
                }
                else if (self.atLowerBorder())
                {
                    console.log("At Bottom")
                    if(event.clientY < scroll.y())
                        scroll.y(event.clientY); 
                }
                else
                    scroll.y(event.clientY);
            }     
        })
    }

    clickButtons(scroll, self)
    {
        this.upButton.mousedown(function(event){
            this.fill('pink');

            if (self.atUpperBorder())
            {
                if(event.clientY > scroll.y())
                    scroll.y(scroll.y()-5);
            }  
            else
                scroll.y(scroll.y()-5);
        })

        this.downButton.mousedown(function(event){
            this.fill('pink');

            if (self.atLowerBorder())
            {
                if(event.clientY < scroll.y())
                    scroll.y(scroll.y()+5);
            }
            else
                scroll.y(scroll.y()+5);
        })

        this.upButton.mouseup(function(event){
            this.fill('white');
        })

        this.downButton.mouseup(function(event){
            this.fill('white');
        })
    }

    atUpperBorder()
    {
        var upperBorderBox = this.scrollBorderUpper.bbox();
        var scrollerBox = this.scroller.bbox();

        return scrollerBox.y <= upperBorderBox.y;
    }

    atLowerBorder()
    {
        var lowerBorderBox = this.scrollBorderLower.bbox();
        var scrollerBox = this.scroller.bbox();

        return (scrollerBox.y + 2*(scrollerBox.cy -scrollerBox.y))>= lowerBorderBox.y;
    }
}

class ProgressBar
{
    constructor(barWidth, barPercentage)
    {
        if (barWidth < 30)
            this._barWidth = 30;
        else
            this._barWidth = barWidth;

        if (barPercentage < 0)
            this._barPerc = 0
        else if (barPercentage > 100)
            this._barPerc = 100;
        else
            this._barPerc = barPercentage

        var draw = SVG().addTo('body').size('100%','100%');
        draw.attr({'overflow': 'visible'})
        this._bar = draw.rect(this._barWidth, 20)
        this._bar.move(50,50);
        this._bar.radius(15)
        this._bar.stroke({color: 'black', width: 4});
        this._bar.fill('transparent');

        var leftCircle1 = draw.circle(11);
        leftCircle1.move(52,51);
        var leftCircle2 = draw.circle(11);
        leftCircle2.move(52,58);
        var leftCircle3 = draw.circle(5);
        leftCircle3.move(50,58);
        this._leftEdge = draw.line(62,50,62,70).stroke({color: 'black' ,width: 2})

        this._staticParts = draw.group();
        this._staticParts.add(leftCircle1);
        this._staticParts.add(leftCircle2);
        this._staticParts.add(leftCircle3);
        this._staticParts.add(this._leftEdge);

        var rightCircle1 = draw.circle(11);
        rightCircle1.move(386,51);
        var rightCircle2 = draw.circle(11);
        rightCircle2.move(386,58);
        var rightCircle3 = draw.circle(8);
        rightCircle3.move(393,56);
        this._rightEdge = draw.line(387,50,387,70).stroke({color: 'black' ,width: 2})

        this._movingParts = draw.group();
        this._movingParts.add(rightCircle1);
        this._movingParts.add(rightCircle2);
        this._movingParts.add(rightCircle3);
        this._movingParts.add(this._rightEdge);

        var rightFilling = this._bar.width()+37;
        this._movingParts.x(rightFilling);

        this._fullBarValue = this._rightEdge.x() - this._leftEdge.x(); 
        this._barFillNum = this._barPerc*0.01*this._fullBarValue;
        this._barFilling = draw.rect(this._barFillNum,16);
        this._barFilling.fill('pink');
        this._barFilling.move(63,52);

        this._group = draw.group();
        this._group.add(this._barFilling);
        this._group.add(this._bar);

        this._incrementEvent = null
        this._stateChangeEvent = null
    }

    setValue(newValue)
    {
        if (newValue < 0)
        {
            this._barFillNum = 0;
            this._barPerc = 0;
        }
            
        else if (newValue > 100)
        {
            this._barFillNum = this._fullBarValue;
            this._barPerc = 100;
        } 
        else
        {
            this._barPerc = newValue;
            this._barFillNum = this._barPerc*0.01*this._fullBarValue;
        }
        this._barFilling.width(this._barFillNum);

        if (this._incrementEvent != null)
            this._incrementEvent("New Bar Percentage: " + this._barPerc);
        if (this._stateChangeEvent != null)
            this._stateChangeEvent("New Bar Percentage: " + this._barPerc);
    }
    setWidth(newWidth) 
    {
        if (newWidth < 30)
            this._barWidth = 30;
        else
            this._barWidth = newWidth;

        this._bar.width(newWidth);

        this._movingParts.x(this._bar.width()+37);

        this._fullBarValue = this._rightEdge.x() - this._leftEdge.x(); 

        this._barFilling.width(this._barPerc*0.01*this._fullBarValue);

        if (this._stateChangeEvent != null)
            this._stateChangeEvent("New Bar Width: " + this._barWidth);
    }
    increment(inc)
    {
        if (this._barPerc + inc > 100)
            this._barPerc = 100
        else if (this._barPerc + inc < 0)
            this._barPerc = 0
        else
            this._barPerc += inc

        this._barFillNum = this._barPerc*0.01*this._fullBarValue;
        this._barFilling.width(this._barFillNum);
        

        if (this._incrementEvent != null)
            this._incrementEvent("New Bar Percentage: " + this._barPerc);
        if (this._stateChangeEvent != null)
            this._stateChangeEvent("New Bar Percentage: " + this._barPerc);
    }


    getValue()
    {
        return this._barPerc;
    }

    move(x,y) 
    {
        this._bar.move(x,y);
        this._barFilling.move(x+13,y+2);
        this._staticParts.move(x,y);
        this._movingParts.move(x+ this._barWidth-15,y)  
    }

    onIncrement(eventHandler)
    {
        this._incrementEvent = eventHandler;
    }

    onStateChange(eventHandler)
    {
        this._stateChangeEvent = eventHandler;
    }
}

class ToggleSwitch
{
    constructor(startState)
    {
        var draw = SVG().addTo('body').size('100%','100%');
        draw.attr({'overflow': 'visible'})
        this._switchArea = draw.rect(60, 40); 
        this._switchArea.radius(20)
        this._switchArea.move(50,50); 
        this._switchArea.fill('gray');
        this._switchArea.stroke({color: 'black', width: 4});

        this._switch = draw.circle(34);
        this._switch.move(53,53)
        this._switch.fill('white');
        this._switch.stroke({color: '#ccd1d9', width: 2});
        
        this._group = draw.group();

        this._group.add(this._switchArea);
        this._group.add(this._switch);

        this._offX = 53;
        this._onX = 73;

        this._isOn = false;
        this._clickEvent = null;
        this._onChangeEvent = null;

        if (startState)
        {
            this._isOn = true;
            this._switch.move(this._onX, this._switch.y());
            this._switchArea.fill('#60e356');
        }
        this._flipSwitch();
        this._otherStateChanges(this);
    }

    move(x,y)
    {
        this._group.move(x,y);
        this._onX = x+23;
        this._offX = x+3;
    }

    isEnabled()
    {
        return this._isOn;
    }

    onClick(eventHandler)
    {
        this._clickEvent = eventHandler;
    }

    onStateChange(eventHandler)
    {
        this._stateChangeEvent = eventHandler;
    }


    _flipSwitch()
    {
        var self = this;
        this._group.click(function(event){
            if (!self._isOn)
                self._switchOn();    
            else
                self._switchOff();   
            
            if (self._clickEvent != null)
                self._clickEvent(event);

            if (self._stateChangeEvent != null)
                self._stateChangeEvent(event);
        })
                
    }

    _switchOff()
    {
        this._isOn = false;
        this._switch.animate({duration: 100}).move(this._offX, this._switch.y());
        this._switchArea.fill('gray');
    }

    _switchOn()
    {
        this._isOn = true;
        this._switch.animate({duration: 100}).move(this._onX, this._switch.y());
        this._switchArea.fill('#60e356');
    }

    _otherStateChanges(self)
    {
        this._group.mouseover(function(event){
            if (self._stateChangeEvent != null)
                self._stateChangeEvent(event);
        })
        this._group.mouseout(function(event){
            if (self._stateChangeEvent != null)
                self._stateChangeEvent(event);
        })
    }
}

export{MyToolkit}
export{ScrollBar}
export{TextBox}
export{RadioButtons}
export{CheckBoxes}
export{ProgressBar}
export{ToggleSwitch}