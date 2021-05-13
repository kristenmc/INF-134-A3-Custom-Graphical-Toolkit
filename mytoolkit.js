// File name: mytoolkit.js

import {SVG} from './svg.min.js';

var MyToolkit = (function() {
    var Button = function(){
        var draw = SVG().addTo('body').size('50%','50%');
        var rect = draw.rect(100,50).fill('red')
        rect.stroke({color: 'gray', width: 4, linecap: 'round', linejoin: 'round'});
        var clickEvent = null

        rect.mouseover(function(){
            this.fill({ color: 'orange'})
        })
        rect.mouseout(function(){
            this.fill({ color: 'red'})
            this.stroke({color: 'gray'})
        })
        rect.mouseup(function(){
            this.fill({ color: 'orange'})
            this.stroke({color: 'gray'})
        })
        rect.mousedown(function(event){
            this.fill({ color: 'pink'})
            this.stroke({color: 'black'})
            if(clickEvent != null)
                clickEvent(event)
        })
        return {
            move: function(x, y) {
                rect.move(x, y);
            },
            onclick: function(eventHandler){
                clickEvent = eventHandler
            }
        }
    }
return {Button}
}());

class SingleCheckBox
{
    constructor()
    {
        var draw = SVG().addTo('body').size('60%','36');
        this.group = draw.group();

        this.rect = draw.rect(25,25).fill('white')
        this.rect.stroke({color: 'black', width: 4, linecap: 'round', linejoin: 'round'});

        this.checkmark = draw.polyline('8,14, 12,19 18,6');
        this.checkmark.fill('transparent');
        this.checkmark.stroke({color: 'transparent', width: 2, linecap: 'round', linejoin: 'round'});

        this.group.add(this.rect);
        this.group.add(this.checkmark);

        this.group.move(5,5);

        this.clickEvent = null
        this.checked = false;
        
        this.clickBox(this);
   
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
        })
    }

    move(x, y)
    {
        this.rect.move(x, y);
    }

    onclick(eventHandler)
    {
        this.clickEvent = eventHandler;
    }
}

class CheckBoxes
{
    constructor(numButtons)
    {
        this.checkboxList = [];
        this.clickEvent = null;

        for(var i = 0; i < numButtons; i++)
            this.checkboxList.push(new SingleCheckBox());
    }

    move(x, y)
    {
        for(var i = 0; i > this.checkboxList.length; i++)
            this.checkboxList[i].move(x,y);
    }

    onclick(eventHandler)
    {
        this.clickEvent = eventHandler;
    }
}


class SingleRadioButton
{
    constructor(buttonNum)
    {
        this.buttonNum = buttonNum;
        var draw = SVG().addTo('body').size('100%','36');
        this.group = draw.group();
        this.circle = draw.circle(25).fill('white');
        this.circle.stroke({color: 'black', width: 4});

        this.filling = draw.circle(15).fill('transparent');
        this.filling.move(5,5);

        this.group.add(this.circle);
        this.group.add(this.filling);


        this.isChecked = false;
        this.clickEvent = null

        self = this;

        this.colorChange(buttonNum);
    }

    move(x, y)
    {
        this.group.move(x, y);
    }

    onclick(eventHandler)
    {
        this.clickEvent = eventHandler;
    }

    colorChange(button)
    {
        this.group.click(function(event){
            this.fire('buttonChecked', button);
            console.log("Button " + button + " has been pressed");
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
}


class RadioButtons  //FIRE CUSTOM EVEN FROM SINGLE RADIO BUTTON TO TELL OTHER BUTTONS TO TURN PURPLE AGAIN
{
    constructor(numButtons)
    {
        var draw = SVG().addTo('body').size('0','0');
        this.radioList = [];
        self = this;

        for(var i = 0; i < numButtons; i++)
        {
            var newButton = new SingleRadioButton(i);
            this.radioList.push(newButton);
            newButton.move(25,5);
        }

        for(var i = 0; i < this.radioList.length; i++)
        {
            this.checkColorChange(i, this.radioList.length, this.radioList);
        }   
    }

    move(x, y)
    {
        for(var i = 0; i > this.radioList.length; i++)
            this.radioList[i].move(x,y);
    }

    checkColorChange(index, listLength, radioList)
    {
        this.radioList[index].group.on('buttonChecked', function(num) {
            self.currentlyChecked = num.detail;
            console.log(index)
            console.log(num)

            for (var i = 0; i < listLength; i++)
            {
                radioList[i].uncheckButton();
            }

            radioList[index].checkButton();
        })
    }

}


class TextBox //Note to self: remove caret on window.mouseout
{
    constructor()
    {
        var draw = SVG().addTo('body').size('100%','20%');
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
        this.maxTextLength = 44;
        this.clickEvent = null
        self = this;

        this.enableTyping(self);
        this.readUserInput(self);
    }

    enableTyping(self)
    {
        self.group.mouseover(function(){
            self.text.text(self.textContents + '|');
            self.canType = true;
        })

        self.group.mouseout(function(){
            self.text.text(self.textContents);
            self.canType = false;
        })

        self.text.mouseout(function(){
            self.text.text(self.textContents);
            self.canType = false;
        })

        self.polyline.mouseout(function(){
            self.text.text(self.textContents);
            self.canType = false;
        })
    }

    readUserInput(self)
    {
        window.addEventListener('keydown', function(event){
            if(self.canType)
            {
                if (event.key == "Backspace")
                    self.textContents = self.textContents.slice(0, self.textContents.length-1)

                else if(self.checkEndOfTextBox())
                {
                   console.log(event);
                   if (!(event.key.length > 1))
                        self.textContents = self.textContents+ event.key;       
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
            this.barWidth = 30;
        else
            this.barWidth = barWidth;

        if (barPercentage < 0)
            this.barPerc = 0
        else if (barPercentage > 100)
            this.barPerc = 100;
        else
            this.barPerc = barPercentage

        var draw = SVG().addTo('body').size('100%','100%');
        this.bar = draw.rect(this.barWidth, 20)
        this.bar.move(50,50);
        this.bar.radius(15)
        this.bar.stroke({color: 'black', width: 4});
        this.bar.fill('transparent');

        var leftCircle1 = draw.circle(11);
        leftCircle1.move(52,51);
        var leftCircle2 = draw.circle(11);
        leftCircle2.move(52,58);
        var leftCircle3 = draw.circle(5);
        leftCircle3.move(50,58);
        this.leftEdge = draw.line(62,50,62,70).stroke({color: 'black' ,width: 2})

        var rightCircle1 = draw.circle(11);
        rightCircle1.move(386,51);
        var rightCircle2 = draw.circle(11);
        rightCircle2.move(386,58);
        var rightCircle3 = draw.circle(8);
        rightCircle3.move(393,56);
        this.rightEdge = draw.line(387,50,387,70).stroke({color: 'black' ,width: 2})

        this.movingParts = draw.group();
        this.movingParts.add(rightCircle1);
        this.movingParts.add(rightCircle2);
        this.movingParts.add(rightCircle3);
        this.movingParts.add(this.rightEdge);

        var rightFilling = this.bar.width()+37;
        this.movingParts.x(rightFilling);

        this.fullBarValue = this.rightEdge.x() - this.leftEdge.x(); 
        this.barFillNum = this.barPerc*0.01*this.fullBarValue;
        this.barFilling = draw.rect(this.barFillNum,16);
        this.barFilling.fill('pink');
        this.barFilling.move(63,52);
    }

    setValue(newValue)
    {
        if (newValue < 0)
        {
            this.barFillNum = 0;
            this.barPerc = 0;
        }
            
        else if (newValue > 100)
        {
            this.barFillNum = this.fullBarValue;
            this.barPerc = 100;
        } 
        else
        {
            this.barPerc = newValue;
            this.barFillNum = this.barPerc*0.01*this.fullBarValue;
        }
            

        this.barFilling.width(this.barFillNum);
    }
    setWidth(newWidth)
    {
        if (newWidth < 30)
            this.barWidth = 30;
        else
            this.barWidth = newWidth;

        this.bar.width(newWidth);

        var rightFilling = this.bar.width()+37;
        this.movingParts.x(rightFilling);

        this.fullBarValue = this.rightEdge.x() - this.leftEdge.x(); 

        this.barFilling.width(this.barPerc*0.01*this.fullBarValue);
    }
    getValue()
    {
        return this.barPerc;
    }
}



class ToggleSwitch
{
    constructor(startState)
    {
        var draw = SVG().addTo('body').size('100%','100%');
        this.switchArea = draw.rect(60, 40); 
        this.switchArea.radius(20)
        this.switchArea.move(50,50); 
        this.switchArea.fill('gray');
        this.switchArea.stroke({color: 'black', width: 4});

        this.switch = draw.circle(34);
        this.switch.move(53,53)
        this.switch.fill('white');
        this.switch.stroke({color: '#ccd1d9', width: 2});
        
        this.group = draw.group();

        this.group.add(this.switchArea);
        this.group.add(this.switch);

        this.offX = 53;
        this.onX = 73;

        this.isOn = false;
        self = this;

        if (startState)
        {
            this.isOn = true;
            this.switch.move(this.onX, this.switch.y());
            this.switchArea.fill('#60e356');
        }



        this.flipSwitch();
    }

    flipSwitch()
    {
        this.group.mousedown(function(event){
            if (!self.isOn)
                self.switchOn();    
            else
                self.switchOff();    
        })
                
    }

    switchOff()
    {
        this.isOn = false;
        this.switch.animate({duration: 100}).move(this.offX, this.switch.y());
        this.switchArea.fill('gray');
    }

    switchOn()
    {
        this.isOn = true;
        this.switch.animate({duration: 100}).move(this.onX, this.switch.y());
        this.switchArea.fill('#60e356');
    }

    move(x,y)
    {
        this.group.move(x,y);
        this.onX = x+23;
        this.offX = x+3;
    }

    isEnabled()
    {
        return this.isOn;
    }


}

export{MyToolkit}
export{ScrollBar}
export{TextBox}
export{RadioButtons}
export{CheckBoxes}
export{ProgressBar}
export{ToggleSwitch}