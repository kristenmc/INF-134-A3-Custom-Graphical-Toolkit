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


class TextBox
{
    constructor()
    {
        var draw = SVG().addTo('body').size('100%','100%');
        this. polyline = draw.polyline('50,75, 50,50 50,75 400,75 400,50, 50,50') //400s are rectangle width. Change to make longer or shorter
        this.polyline.fill('none').move(20, 20)
        this.polyline.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' })
        this.clickEvent = null
    }
}


export{TextBox}
export{RadioButtons}
export{CheckBoxes}
export{MyToolkit}