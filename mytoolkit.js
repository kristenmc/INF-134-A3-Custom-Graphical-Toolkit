// File name: mytoolkit.js

import {SVG} from './svg.min.js';

var MyToolkit = (function() {
    var Button = function(){
        var draw = SVG().addTo('body').size('50%','50%');
        var rect = draw.rect(100,50).fill('red')
        var clickEvent = null

        rect.mouseover(function(){
            this.fill({ color: 'blue'})
        })
        rect.mouseout(function(){
            this.fill({ color: 'red'})
        })
        rect.mouseup(function(){
            this.fill({ color: 'red'})
        })
        rect.click(function(event){
            this.fill({ color: 'pink'})
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
        var draw = SVG().addTo('body').size('60%','20%');
        this.rect = draw.rect(50,50).fill('blue')
        this.clickEvent = null
        this.checked = false;
        
        this.rect.click(function(event){
            if (!this.checked)
            {
                this.fill({ color: 'pink'})
                this.checked = true;
                this.clickEvent = event;
            } 
            else
            {
                this.fill({color: 'blue'})
                this.checked = false;
                this.clickEvent = event;
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
        var draw = SVG().addTo('body').size('60%','20%');
        this.circle = draw.circle(50).fill('purple')
        this.clickEvent = null

        self = this;

        this.colorChange(buttonNum);
    }

    move(x, y)
    {
        this.circle.move(x, y);
    }

    onclick(eventHandler)
    {
        this.clickEvent = eventHandler;
    }

    colorChange(button)
    {
        this.circle.click(function(event){
            this.fire('buttonChecked', button, SingleRadioButton);
        })
    }
}


class RadioButtons  //FIRE CUSTOM EVEN FROM SINGLE RADIO BUTTON TO TELL OTHER BUTTONS TO TURN PURPLE AGAIN
{
    constructor(numButtons)
    {
        this.radioList = [];
        self = this;

        for(var i = 0; i < numButtons; i++)
        {
            this.radioList.push(new SingleRadioButton(i));
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
        this.radioList[index].circle.on('buttonChecked', function(num) {
            self.currentlyChecked = num.detail;
            console.log(index)
            console.log(num)

            for (var i = 0; i < listLength; i++)
            {
                radioList[i].circle.fill({ color: 'purple'});
            }

            radioList[index].circle.fill({ color: 'pink'})
        })
    }

}


class TextBox //Different sized textboxes in the future?
{
    constructor()
    {
        var draw = SVG().addTo('body').size('100%','20%');
        this.group = draw.group();
        this. polyline = draw.polyline('50,75, 50,50 50,75 400,75 400,50, 50,50') //400s are rectangle width. Change to make longer or shorter
        this.polyline.fill('transparent').move(20, 20)
        this.polyline.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' })
        this.textContents = "";
        this.text = draw.text(this.textContents);
        this.text.move(28,17);
        this.endBox = draw.polyline('363,50 363,17 30,17');
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
    constructor(length)
    {
        if (length < 100)
            this.barLength = 100;
        else
            this.barLength = length;

        var draw = SVG().addTo('body').size('100%','100%');
        this.upButton = draw.polyline('50,50 50,75 75,75 75,50 50,50');
        this.upButton.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this.upButton.fill('transparent');

        this.scrollArea = draw.polyline([[50,75], [50,this.barLength], [75,this.barLength], [75,75], [50,75]]);
        this.scrollArea.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this.scrollArea.fill('gray');
       
        this.downButton = draw.polyline([[50,this.barLength], [50,this.barLength+25], [75,this.barLength+25], [75,this.barLength]]);
        this.downButton.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this.downButton.fill('transparent');

        this.scroller = draw.polyline('54,78 54,96 71,96 71,78 54,78');
        this.scroller.stroke({ color: '#f23f8d', width: 4, linecap: 'round', linejoin: 'round' });
        this.scroller.fill('black');

        this.isHeld = false;


        self=this;

        this.dragScroller();
    }

    dragScroller()
    {
        this.scroller.mousedown(function(event){
            self.isHeld = true;
            console.log('Holding');
        })

        this.scroller.mouseup(function(event){
            self.isHeld = false;
            console.log('Not Holding');
        })
    }
}

export{ScrollBar}
export{TextBox}
export{RadioButtons}
export{CheckBoxes}
export{MyToolkit}