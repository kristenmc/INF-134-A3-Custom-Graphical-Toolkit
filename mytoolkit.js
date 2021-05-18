// File name: mytoolkit.js

import {SVG} from './svg.min.js';

var svgDraw = SVG().addTo('body').size('10000','10000'); 
svgDraw.attr({'overflow': 'visible'})


class Button
{
    constructor(text='Text')
    {
        this.idleGradient = svgDraw.gradient('linear', function(add) {
            add.stop(0, 'orange')
            add.stop(0.5, 'pink')
            add.stop(1, 'orange')
        })

        this.idleGradient.from(0, 0).to(0, 1)
        this.rect = svgDraw.rect(100,50).fill(this.idleGradient)
        this.rect.stroke({color: 'gray', width: 2, linecap: 'round', linejoin: 'round'});

        this.boxText = svgDraw.text(text);
        this.boxText.move(49,17);
        this.boxText.fill('black');
        this.boxText.font({family: 'Trebuchet MS', anchor: 'middle'})

        this.group = svgDraw.group();
        this.group.add(this.rect);
        this.group.add(this.boxText);

        this.clickEvent = null;
        this.stateChangeEvent = null;

        this.mouseEvents(this)
    }

    mouseEvents(self)
    {
        this.group.mouseover(function(event){
            self.rect.fill({ color: 'orange'})
            self.rect.stroke({color: 'gray', width: 3});
            self.boxText.fill('black');

            if (self.stateChangeEvent != null)
                self.stateChangeEvent(event)
        })
        this.group.mouseout(function(event){
            self.rect.fill({ color: self.idleGradient})
            self.rect.stroke({color: 'gray', width: 2})
            self.boxText.fill('black');

            if (self.stateChangeEvent != null)
                self.stateChangeEvent(event)
        })
        this.group.mouseup(function(event){
            self.rect.fill({ color: 'orange'})
            self.rect.stroke({color: 'black', width: 3})
            self.boxText.fill('black');

            if (self.stateChangeEvent != null)
                self.stateChangeEvent(event)
        })
        this.group.mousedown(function(event){
            self.rect.fill({ color: 'pink'})
            self.rect.stroke({color: 'black', width: 4})
            self.boxText.fill('gray');
            
            if(self.clickEvent != null)
                self.clickEvent(event)
            if (self.stateChangeEvent != null)
                self.stateChangeEvent(event)
        })
    }

    move(x,y)
    {
        this.group.move(x, y)
    }

    onClick(eventHandler)
    {
        this.clickEvent = eventHandler
    }

    onStateChange(eventHandler)
    {
        this.stateChangeEvent = eventHandler
    }

    setText(string)
    {
        this.boxText.text(string);
    }
}
   

class SingleCheckBox
{
    constructor(buttonNum)
    {
        this.group = svgDraw.group();

        this.rect = svgDraw.rect(25,25).fill('white')
        this.rect.stroke({color: 'black', width: 4, linecap: 'round', linejoin: 'round'});

        this.checkmark = svgDraw.polyline('8,14, 12,19 18,6');
        this.checkmark.fill('transparent');
        this.checkmark.stroke({color: 'transparent', width: 2, linecap: 'round', linejoin: 'round'});

        this.text = svgDraw.text("Test " + buttonNum);
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
            self.stateChangeEvent({Button: this.buttonNum, text: newText});
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
        this.checkboxList = [];

        for(var i = 0; i < numButtons; i++)
            this.checkboxList.push(new SingleCheckBox(i, svgDraw));
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
    constructor(buttonNum)
    {
        this.buttonNum = buttonNum;
        this.group = svgDraw.group();
        this.circle = svgDraw.circle(25).fill('white');
        this.circle.stroke({color: 'black', width: 4});

        this.filling = svgDraw.circle(15).fill('transparent');
        this.filling.move(5,5);

        this.text = svgDraw.text("Test " + buttonNum);
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
        this.filling.fill('orange');
    }

    setText(newText)
    {
        this.text.text(newText);
        if (self.stateChangeEvent != null)
            self.stateChangeEvent({Button: this.buttonNum, text: newText});
    }
}


class RadioButtons  
{
    constructor(numButtons)
    {
        this.radioList = [];
        self = this;

        for(var i = 0; i < numButtons; i++)
        {
            var newButton = new SingleRadioButton(i, svgDraw);
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
                radioList[index].clickEvent({Button: data.detail.buttonNum, clickEvent: data.detail.Event})  
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
                    self.radioList[data.detail.buttonNum].clickEvent({Button: data.detail.buttonNum, clickEvent: data.detail.Event});
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
        this.group = svgDraw.group();
        this. polyline = svgDraw.polyline('50,75, 50,50 50,75 400,75 400,50, 50,50') 
        this.polyline.fill('white').move(20, 20)
        this.polyline.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' })
        this.textContents = "";
        this.text = svgDraw.text(this.textContents);
        this.text.font({family: 'Trebuchet MS'});
        this.text.move(28,17);
        this.endBox = svgDraw.polyline('360,50 360,17 30,17');
        this.endBox.stroke({ color: 'transparent', width: 4, linecap: 'round', linejoin: 'round', fill: 'transparent'})
        this.endBox.fill('transparent');
        this.group.add(this.polyline);
        this.group.add(this.text);
        this.group.add(this.endBox);
        this.canType = false;

        this.typeEvent = null;
        this.stateChangeEvent = null;
        self = this;

        this.enableTyping(self, svgDraw);
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
                {
                    if(self.stateChangeEvent != null)
                        self.stateChangeEvent({boxStatus: "Full", typeEvent: event})
                }
                
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
    constructor(length)
    {
        if (length < 50)
            this.barHeight = 50;
        else
            this.barHeight = length;

        this.upButton = svgDraw.rect(25,25);
        this.upButton.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this.upButton.fill('white');

        this.scrollArea = svgDraw.rect(25,this.barHeight);
        this.scrollArea.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this.scrollArea.fill('gray');
        this.scrollArea.move(0,25)
       
        this.downButton = svgDraw.rect(25,25);
        this.downButton.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this.downButton.fill('white');
        this.downButton.move(0,this.barHeight+25);

        this.scroller = svgDraw.rect(17, 30);
        this.scroller.stroke({ color: 'pink', width: 4, linecap: 'round', linejoin: 'round' });
        this.scroller.fill('orange');
        this.scroller.move(4,28);

        this.scrollBorderUpper = svgDraw.line(0,30,25,30);
        this.scrollBorderUpper.stroke({ color: 'transparent', width: 4, linecap: 'round'});

        this.scrollBorderLower = svgDraw.line(0,this.barHeight+20, 25,this.barHeight+20);
        this.scrollBorderLower.stroke({ color: 'transparent', width: 4, linecap: 'round'});

        this.upArrow = svgDraw.polyline('4,20 10,10 16,20');
        this.upArrow.fill('none');
        this.upArrow.stroke({ color: 'black', width: 2, linecap: 'round'})
        this.upArrow.move(6.5,8)


        this.downArrow = svgDraw.polyline('4,10 10,20  16,10');
        this.downArrow.fill('none');
        this.downArrow.stroke({ color: 'black', width: 2, linecap: 'round'})
        this.downArrow.move(6,this.barHeight+32)


        this.group = svgDraw.group();
        this.group.add(this.scrollArea)
        this.group.add(this.scroller)
        this.group.add(this.scrollBorderUpper)
        this.group.add(this.scrollBorderLower)

        this.upGroup = svgDraw.group()
        this.upGroup.add(this.upButton)
        this.upGroup.add(this.upArrow)


        this.downGroup = svgDraw.group();
        this.downGroup.add(this.downButton)
        this.downGroup.add(this.downArrow)

        this.isHeld = false;
        
        this.dragEvent = null
        this.stateChangeEvent = null

        this.enableDrag();
        this.dragScroller(this.scroller, this);
        this.clickButtons(this.scroller, this);
    }
    move(x,y)
    {
        this.group.move(x,y)
        this.upGroup.move(x,y-25)
        this.downGroup.move(x,y+this.barHeight)
    }

    setHeight(newHeight)
    {
        if (newHeight >= 50)
            this.barHeight = newHeight;
        else
            this.barHeight = 50;
        this.scrollArea.height(this.barHeight);

        this.downGroup.y(this.scrollArea.y()+this.barHeight)
        this.scrollBorderLower.y(this.scrollArea.y()+this.barHeight-5)
    }
    getThumbPosition()
    {
        return {x: this.scroller.x(), y: this.scroller.y()}
    }

    onDrag(eventHandler)
    {
        this.dragEvent = eventHandler
    }

    onStateChange(eventHandler)
    {
        this.stateChangeEvent = eventHandler
    }

    enableDrag()
    {
        var self=this;
        this.scroller.mousedown(function(event){
            self.isHeld = true;
            if  (self.stateChangeEvent != null)
                self.stateChangeEvent(event)
        })

        this.scroller.mouseup(function(event){
            self.isHeld = false;
            if (self.stateChangeEvent != null)
                self.stateChangeEvent(event)
        })

        window.addEventListener('mouseup', function(event){
            self.isHeld = false;
            if (self.stateChangeEvent != null)
                self.stateChangeEvent(event)
          })
    }

    dragScroller(scroll, self)
    {
        window.addEventListener('mousemove', function(event){
            if (self.isHeld)
            {
                var CTM = event.target.getScreenCTM();
                var newY = (event.clientY - CTM.f)/CTM.d;

                if (self.atUpperBorder())
                {
                    if(newY > scroll.y())
                        scroll.y(newY);
                }
                else if (self.atLowerBorder())
                {
                    if(newY < scroll.y())
                        scroll.y(newY);
                }
                else
                {
                    if(self.dragEvent != null)
                    {
                        if(scroll.y() > newY)
                            self.dragEvent({dragDirection: 'Up', dragEvent: event})
                        else if(scroll.y() < newY)
                            self.dragEvent({dragDirection: 'Down', dragEvent: event})
                    }
                    if (newY >= self.scrollArea.y() & newY < self.scrollArea.y()+self.barHeight)
                        scroll.y(newY);
                }
                if (self.stateChangeEvent != null)
                    self.stateChangeEvent(event)     
            }     
        })
    }
             
    clickButtons(scroll, self)
    {
        this.upGroup.mousedown(function(event){
            self.upButton.fill('pink');
            self.upArrow.stroke({color:'gray'})

            if (!self.atUpperBorder())
            {
                if (self.dragEvent != null)
                    self.dragEvent({dragDirection: 'Up', dragEvent: event})
                scroll.y(scroll.y()-5);   
            }    
        })

        this.downGroup.mousedown(function(event){
            self.downButton.fill('pink');
            self.downArrow.stroke({color:'gray'})

            if (!self.atLowerBorder())
            {
                if (self.dragEvent != null)
                    self.dragEvent({dragDirection: 'Down', dragEvent: event})
                scroll.y(scroll.y()+5);   
            }    
        })

        this.upButton.mouseup(function(event){
            this.fill('white');
            self.upArrow.stroke({color:'black'})
        })

        this.downButton.mouseup(function(event){
            this.fill('white');
            self.downArrow.stroke({color:'black'})
        })

        window.addEventListener('mouseup', function(event){
            self.upButton.fill('white')
            self.downButton.fill('white')
            self.upArrow.stroke({color:'black'})
            self.downArrow.stroke({color:'black'})
          })
          if (self.stateChangeEvent != null)
            self.stateChangeEvent(event)
    }

    atUpperBorder()
    {
        return this.scroller.y() <= this.scrollBorderUpper.y();
    }

    atLowerBorder()
    {
        return (this.scroller.y() + 2*(this.scroller.cy() -this.scroller.y()))>= this.scrollBorderLower.y();
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

        this._bar = svgDraw.rect(this._barWidth, 20)
        this._bar.move(50,50);
        this._bar.radius(15)
        this._bar.stroke({color: 'black', width: 4});
        this._bar.fill('transparent');

        var leftCircle1 = svgDraw.circle(11);
        leftCircle1.move(52,51);
        var leftCircle2 = svgDraw.circle(11);
        leftCircle2.move(52,58);
        var leftCircle3 = svgDraw.circle(5);
        leftCircle3.move(50,58);
        this._leftEdge = svgDraw.line(62,50,62,70).stroke({color: 'black' ,width: 2})

        this._staticParts = svgDraw.group();
        this._staticParts.add(leftCircle1);
        this._staticParts.add(leftCircle2);
        this._staticParts.add(leftCircle3);
        this._staticParts.add(this._leftEdge);

        var rightCircle1 = svgDraw.circle(11);
        rightCircle1.move(386,51);
        var rightCircle2 = svgDraw.circle(11);
        rightCircle2.move(386,58);
        var rightCircle3 = svgDraw.circle(8);
        rightCircle3.move(393,56);
        this._rightEdge = svgDraw.line(387,50,387,70).stroke({color: 'black' ,width: 2})

        this._movingParts = svgDraw.group();
        this._movingParts.add(rightCircle1);
        this._movingParts.add(rightCircle2);
        this._movingParts.add(rightCircle3);
        this._movingParts.add(this._rightEdge);

        var rightFilling = this._bar.width()+37;
        this._movingParts.x(rightFilling);

        this._fullBarValue = this._rightEdge.x() - this._leftEdge.x(); 
        this._barFillNum = this._barPerc*0.01*this._fullBarValue;
        this._barFilling = svgDraw.rect(this._barFillNum,16);
        this._barFilling.fill('pink');
        this._barFilling.move(63,52);

        this._group = svgDraw.group();
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
            this._incrementEvent({newSetPercentage: this._barPerc});
        if (this._stateChangeEvent != null)
            this._stateChangeEvent({newSetPercentage: this._barPerc});
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
            this._stateChangeEvent({newWidth:this._barWidth});
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
            this._incrementEvent({newIncrementedPercentage: this._barPerc});
        if (this._stateChangeEvent != null)
            this._stateChangeEvent({newIncrementedPercentage: this._barPerc});
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
    constructor(startState, enableColor='#60e356')
    {
        this.switchColor = enableColor
        this._switchArea = svgDraw.rect(60, 40); 
        this._switchArea.radius(20)
        this._switchArea.move(50,50); 
        this._switchArea.fill('gray');
        this._switchArea.stroke({color: 'black', width: 4});

        this._switch = svgDraw.circle(34);
        this._switch.move(53,53)
        this._switch.fill('white');
        this._switch.stroke({color: '#ccd1d9', width: 2});
        
        this._group = svgDraw.group();

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
            this._switchArea.fill(this.switchColor);
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

    getColor()
    {
        return this.switchColor;
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
                self._clickEvent({switchEnabled: this._isOn, switchEvent: event});

            if (self._stateChangeEvent != null)
                self._stateChangeEvent({switchEnabled: this._isOn, switchEvent: event});
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
        this._switchArea.fill(this.switchColor);
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

export{Button}
export{ScrollBar}
export{TextBox}
export{RadioButtons}
export{CheckBoxes}
export{ProgressBar}
export{ToggleSwitch}