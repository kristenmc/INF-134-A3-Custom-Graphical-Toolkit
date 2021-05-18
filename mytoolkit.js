// File name: mytoolkit.js
/**
 * @author Kristen Campbell
 */

import {SVG} from './svg.min.js';

var svgDraw = SVG().addTo('body').size('10000','10000'); 
svgDraw.attr({'overflow': 'visible'})

/**Class representing a button.*/
class Button
{
    /**
     * Creates a button.
     * @param  {string} text='Text' - Text on button upon initialization. Defaults to "Text" if no input is given.
     */
    constructor(text='Text')
    {
        this._idleGradient = svgDraw.gradient('linear', function(add) {
            add.stop(0, 'orange')
            add.stop(0.5, 'pink')
            add.stop(1, 'orange')
        })

        this._idleGradient.from(0, 0).to(0, 1)
        this._rect = svgDraw.rect(100,50).fill(this._idleGradient)
        this._rect.stroke({color: 'gray', width: 2, linecap: 'round', linejoin: 'round'});

        this._boxText = svgDraw.text(text);
        this._boxText.move(49,17);
        this._boxText.fill('black');
        this._boxText.font({family: 'Trebuchet MS', anchor: 'middle'})

        this._group = svgDraw.group();
        this._group.add(this._rect);
        this._group.add(this._boxText);

        this._clickEvent = null;
        this._stateChangeEvent = null;

        this._mouseEvents(this)
    }

    /**
     * Moves the button to a given coordinate.
     * @param  {number} x - The x value to which the button will move.
     * @param  {number} y - The y value to which the button will move.
     */
    move(x,y)
    {
        this._group.move(x, y)
    }

    /**
     * Assigns an event handler to respond to button click events.
     * @param  {function} eventHandler - The event handler.
     */
    onClick(eventHandler)
    {
        this._clickEvent = eventHandler
    }

    /**
     * Assigns an event handler to respond to all button events.
     * @param  {function} eventHandler - The event handler.
     */
    onStateChange(eventHandler)
    {
        this._stateChangeEvent = eventHandler
    }

    /**
     * Changes the button's text.
     * @param  {string} newText - The new text to be displayed on the button.
     */
    setText(newText)
    {
        this._boxText.text(newText);
    }

    /**
     *NOT FOR PUBLIC USE. Handles all mouse events.
     * @param  {Button} self - The button calling the function.
     */
     _mouseEvents(self)
     {
         this._group.mouseover(function(event){
             self._rect.fill({ color: 'orange'})
             self._rect.stroke({color: 'gray', width: 3});
             self._boxText.fill('black');
 
             if (self._stateChangeEvent != null)
                 self._stateChangeEvent(event)
         })
         this._group.mouseout(function(event){
             self._rect.fill({ color: self._idleGradient})
             self._rect.stroke({color: 'gray', width: 2})
             self._boxText.fill('black');
 
             if (self._stateChangeEvent != null)
                 self._stateChangeEvent(event)
         })
         this._group.mouseup(function(event){
             self._rect.fill({ color: 'orange'})
             self._rect.stroke({color: 'black', width: 3})
             self._boxText.fill('black');
 
             if (self._stateChangeEvent != null)
                 self._stateChangeEvent(event)
         })
         this._group.mousedown(function(event){
             self._rect.fill({ color: 'pink'})
             self._rect.stroke({color: 'black', width: 4})
             self._boxText.fill('gray');
             
             if(self._clickEvent != null)
                 self._clickEvent(event)
             if (self._stateChangeEvent != null)
                 self._stateChangeEvent(event)
         })
     }
}
   
/**Class representing one checkbox.*/
class SingleCheckBox
{
    /**
     * NOT FOR PUBLIC USE. Creates a single checkbox.
     * @param  {integer} buttonNum - The number assigned to a checkbox. Begins at 0.
     */
    constructor(buttonNum)
    {
        this._group = svgDraw.group();

        this._rect = svgDraw.rect(25,25).fill('white')
        this._rect.stroke({color: 'black', width: 4, linecap: 'round', linejoin: 'round'});

        this._checkmark = svgDraw.polyline('8,14, 12,19 18,6');
        this._checkmark.fill('transparent');
        this._checkmark.stroke({color: 'transparent', width: 2, linecap: 'round', linejoin: 'round'});

        this._text = svgDraw.text("Test " + buttonNum);
        this._text.move(35,3);
        this._text.font({family: 'Trebuchet MS'});

        this._group.add(this._rect);
        this._group.add(this._checkmark);
        this._group.add(this._text)

        this._buttonNum = buttonNum;
        this._clickEvent = null;
        this._stateChangeEvent = null;
        this._checked = false;
        this._previouslyChecked = false;


        this._rect.y((buttonNum+1)*35);
        this._checkmark.y((buttonNum+1)*35 + 5);
        this._text.y((buttonNum+1)*36);

        
        this._clickBox(this);
        this._otherStateChanges(this);
    }

    /**
     * NOT FOR PUBLIC USE. Moves the checkbox to a given coordinate.
     * @param  {number} x - The x value to which the checkbox will move.
     * @param  {number} y - The y value to which the checkbox will move.
     */
     _move(x, y)
     {
         this._rect.move(x,(this._buttonNum+1)*35+y);
         this._checkmark.move(x + 7, ((this._buttonNum+1)*35 + 6) + y);
         this._text.move(x + 35, ((this._buttonNum+1)*36) + y)
     }
 
     /**
      * NOT FOR PUBLIC USE. Changes the checkbox's text.
      * @param  {string} newText - The new text to be displayed next to the checkbox.
      */
     _setText(newText)
     {
         this._text.text(newText);
         if (self._stateChangeEvent != null)
             self._stateChangeEvent({Button: this._buttonNum, text: newText});
     }
 
     /**
      * NOT FOR PUBLIC USE. Assigns an event handler to respond to the checkbox's click events.
      * @param  {function} eventHandler - The event handler.
      */
     _onClick(eventHandler)
     {
         this._clickEvent = eventHandler;
     }
 
     
     /**
      * NOT FOR PUBLIC USE. Assigns an event handler to respond to all of the checkbox's events.
      * @param  {function} eventHandler - The event handler.
      */
     _onStateChange(eventHandler)
     {
         this._stateChangeEvent = eventHandler
     }


    /**
     * NOT FOR PUBLIC USE. Handles checkbox click events.
     * @param  {SingleCheckBox} self - The checkbox being clicked.
     */
    _clickBox(self)
    {
        this._group.click(function(event){
            if (!self._checked)
            {
                self._checkmark.stroke({color: 'white'});
                self._rect.fill('orange');
                self._checked = true;
            } 
            else
            {
                self._checkmark.stroke({color: 'transparent'});
                self._rect.fill('white');
                self._checked = false;
            }
            this.fire('checkboxClicked', self._buttonNum); 
            if (self._clickEvent != null)
                self._clickEvent({Button: self._buttonNum, clickEvent: event});
            if (self._stateChangeEvent != null)
                self._stateChangeEvent({Button: self._buttonNum, clickEvent: event});    
        })
    }

    /** NOT FOR PUBLIC USE. Handles the checkbox's mouse events that are not click events.
    * @param  {SingleCheckBox} self - The checkbox.
    */
    _otherStateChanges(self)
    {
        this._group.mouseover(function(event){
            if (self._stateChangeEvent != null)
                self._stateChangeEvent({Button: self._buttonNum, stateEvent: event});
        })
        this._group.mouseout(function(event){
            if (self._stateChangeEvent != null)
                self._stateChangeEvent({Button: self._buttonNum, stateEvent: event});
        })
    }
    

}

/**Class representing a group of checkboxes.*/
class CheckBoxes
{
    /**
     * Creates a group of checkboxes. Assigned checkbox numbers begin at 0.
     * @param  {number} numButtons - The number of checkboxes to be created.
     */
    constructor(numButtons)
    {
        this._checkboxList = [];

        for(var i = 0; i < numButtons; i++)
            this._checkboxList.push(new SingleCheckBox(i, svgDraw));
    }
    
    /**
     * Moves the group of checkboxes to a given coordinate.
     * @param  {number} x - The x value to which the checkboxes will move.
     * @param  {number} y - The y value to which the checkboxes will move.
     */
    move(x, y)
    {
        for(var i = 0; i < this._checkboxList.length; i++)
            this._checkboxList[i]._move(x,y);
    }

    
    /**
     * Changes the text of one checkbox in the group.
     * @param  {string} newText - The new text to be displayed next to the checkbox.
     * @param  {number} buttonNum=0 - The checkbox in the group to have its text change. Defaults to the first checbox in the group.
     */
    setText(newText, buttonNum=0)
    {
        if (buttonNum >= 0 & buttonNum < this._checkboxList.length)
            this._checkboxList[buttonNum]._setText(newText);
    }


     /**
      * Assigns an event handler to respond to the click events for every checkbox in the group.
      * @param  {function} eventHandler - The event handler.
      */
    onClick(eventHandler)
    {
        var self = this;
        for(var i = 0; i < this._checkboxList.length; i++)
        {
            this._checkboxList[i]._group.on('checkboxClicked', function(event){
                self._checkboxList[event.detail]._clickEvent = eventHandler;
            })
        }
    }

     /**
      * Assigns an event handler to respond to all the events for every checkbox in the group.
      * @param  {function} eventHandler - The event handler.
      */
    onStateChange(eventHandler)
    {
        for(var i = 0; i < this._checkboxList.length; i++)
            this._checkboxList[i]._stateChangeEvent = eventHandler;
    }
}

/**Class representing one radio button.*/
class SingleRadioButton
{
    
    /**
     * NOT FOR PUBLIC USE. Creates a single radio button.
     * @param  {integer} buttonNum - The number assigned to a checkbox. Begins at 0.
     */
    constructor(buttonNum)
    {
        this._buttonNum = buttonNum;
        this._group = svgDraw.group();
        this._circle = svgDraw.circle(25).fill('white');
        this._circle.stroke({color: 'black', width: 4});

        this._filling = svgDraw.circle(15).fill('transparent');
        this._filling.move(5,5);

        this._text = svgDraw.text("Test " + buttonNum);
        this._text.move(35,3);
        this._text.font({family: 'Trebuchet MS'});

        this._group.add(this._circle);
        this._group.add(this._filling);
        this._group.add(this._text);

        this._isChecked = false;
        this._previouslyChecked = false;
        this._clickEvent = null
        
        this._circle.y((buttonNum+1)*35);
        this._filling.y((buttonNum+1)*35 + 5);
        this._text.y((buttonNum+1)*36);

        self = this;

        this._buttonFill(buttonNum);

        this._otherStateChanges(this)
    }

    /**
     * NOT FOR PUBLIC USE. Moves the radio button to a given coordinate.
     * @param  {number} x - The x value to which the radio button will move.
     * @param  {number} y - The y value to which the radio button will move.
     */
    _move(x, y)
    {
        this._circle.move(x,(this._buttonNum+1)*35+y);
        this._filling.move(x + 5, ((this._buttonNum+1)*35 + 5) + y);
        this._text.move(x + 35, ((this._buttonNum+1)*36) + y)
    }

     /**
      * NOT FOR PUBLIC USE. Changes the radio button's text.
      * @param  {string} newText - The new text to be displayed on the radio button.
      */
    _setText(newText)
    {
        this._text.text(newText);
        if (self.stateChangeEvent != null)
            self.stateChangeEvent({Button: this._buttonNum, text: newText});
    }

     /**
      * NOT FOR PUBLIC USE. Assigns an event handler to respond to the radio button's click events.
      * @param  {function} eventHandler - The event handler.
      */
    _onClick(eventHandler)
    {
        this._clickEvent = eventHandler;
    }

     /**
      * NOT FOR PUBLIC USE. Assigns an event handler to respond to all of the radio button's events.
      * @param  {function} eventHandler - The event handler.
      */
    _onStateChange(eventHandler)
    {
        this.stateChangeEvent = eventHandler;
    }

    /**
     * NOT FOR PUBLIC USE. Fires an event whenever the radio button is clicked.
     * @param  {integer} button - The current radio button's number.
     */
    _buttonFill(button)
    {
        this._group.click(function(event){
            this.fire('buttonChecked', {buttonNum: button,Event: event});
        })
    }

    /** NOT FOR PUBLIC USE. Handles the radio button's mouse events that are not click events.
    * @param  {SingleRadioButton} self - The radio button.
    */
    _otherStateChanges(self)
    {
        this._group.mouseover(function(event){
            if (self._stateChangeEvent != null)
                self._stateChangeEvent({Button: self._buttonNum, stateEvent: event});
        })
        this._group.mouseout(function(event){
            if (self._stateChangeEvent != null)
                self._stateChangeEvent({Button: self._buttonNum, stateEvent: event});
        })
    }
    /**
     * NOT FOR PUBLIC USE. Unchecks the radio button.
     */
    _uncheckButton()
    {
        this._isChecked = false;
        this._filling.fill('transparent');
    }

    /**
     * NOT FOR PUBLIC USE. Marks the radio button as checked.
     */
    _checkButton()
    {
        this._isChecked = true;
        this._filling.fill('orange');
    }
}

/**Class representing a group of radio buttons.*/
class RadioButtons  
{

    /**
     * Creates a group of radio buttons. Assigned radio button numbers begin at 0.
     * @param  {integer} numButtons - The number of radio buttons to be created.
     */
    constructor(numButtons)
    {
        this._radioList = [];
        self = this;

        for(var i = 0; i < numButtons; i++)
        {
            var newButton = new SingleRadioButton(i, svgDraw);
            this._radioList.push(newButton);
            newButton._move(5,5);
        }

        for(var i = 0; i < this._radioList.length; i++)
        {
            this._checkColorChange(i, this._radioList.length, this._radioList);
        }   
    }

    /**
     * Moves the group of radio buttons to a given coordinate.
     * @param  {number} x - The x value to which the radio butons will move.
     * @param  {number} y - The y value to which the radio buttons will move.
     */
    move(x, y)
    {
        for(var i = 0; i < this._radioList.length; i++)
            this._radioList[i]._move(x,y);  
    }


    /**
     * Changes the text of one radio buttons in the group.
     * @param  {string} newText - The new text to be displayed next to the radio button.
     * @param  {number} buttonNum - The checkbox in the group to have its text change. Defaults to the first radio button in the group.
     */
    setText(newText, buttonNum=0)
    {
        if (buttonNum >= 0 & buttonNum < this._radioList.length)
            this._radioList[buttonNum]._setText(newText);
    }

     /**
      * Assigns an event handler to respond to the click events for every radio button in the group.
      * @param  {function} eventHandler - The event handler.
      */
    onClick(eventHandler)
    {
        var self = this;
        for(var i = 0; i < this._radioList.length; i++)
        {
            this._radioList[i]._group.on('buttonChecked', function(data){
                self._radioList[data.detail.buttonNum]._clickEvent = eventHandler;
                if (!self._radioList[data.detail.buttonNum]._previouslyChecked)
                {
                    self._radioList[data.detail.buttonNum]._clickEvent({Button: data.detail.buttonNum, clickEvent: data.detail.Event});
                    self._radioList[data.detail.buttonNum]._previouslyChecked = true;
                }
            })
        }
    }

     /**
      * Assigns an event handler to respond to all the events for every radio button in the group.
      * @param  {function} eventHandler - The event handler.
      */
    onStateChange(eventHandler)
    {
        for(var i = 0; i < this._radioList.length; i++)
            this._radioList[i]._stateChangeEvent = eventHandler;
    }
    
    /**
     * NOT FOR PUBLIC USE. Handles the checking and unchecking of the group's radio buttons.
     * @param  {number} index
     * @param  {number} listLength
     * @param  {RadioButtons[]} radioList
     */
    _checkColorChange(index, listLength, radioList)
    {
        this._radioList[index]._group.on('buttonChecked', function(data) {
            self._currentlyChecked = data.detail.buttonNum;
            for (var i = 0; i < listLength; i++)
            {
                radioList[i]._uncheckButton();
            }

            radioList[index]._checkButton();
            if (radioList[index]._clickEvent != null)
                radioList[index]._clickEvent({Button: data.detail.buttonNum, clickEvent: data.detail.Event})  
        })
    }
}

/**Class representing a text box.*/
class TextBox
{
    
    /**
     * Creates a text box.
     */
    constructor()
    {
        this._group = svgDraw.group();
        this. _polyline = svgDraw.polyline('50,75, 50,50 50,75 400,75 400,50, 50,50') 
        this._polyline.fill('white').move(20, 20)
        this._polyline.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' })
        
        this._textContents = "";
        this._text = svgDraw.text(this._textContents);
        this._text.font({family: 'Trebuchet MS'});
        this._text.move(28,17);
        
        this._endBox = svgDraw.polyline('360,50 360,17 30,17');
        this._endBox.stroke({ color: 'transparent', width: 4, linecap: 'round', linejoin: 'round', fill: 'transparent'})
        this._endBox.fill('transparent');
        
        this._group.add(this._polyline);
        this._group.add(this._text);
        this._group.add(this._endBox);
        this._canType = false;

        this._typeEvent = null;
        this._stateChangeEvent = null;
        self = this;

        this._enableTyping(self, svgDraw);
        this._readUserInput(self);
    }

    /**
     * Moves the text box to a given coordinate.
     * @param  {number} x - The x value to which the text box will move.
     * @param  {number} y - The y value to which the text box will move.
     */
    move(x,y)
    {
        this._group.move(x,y)
    }

    /**
     * Gets the text box's entered text.
     * @return {string} The text entered into the text box. 
     */
    getText()
    {
        return this._textContents;
    }

     /**
      * Assigns an event handler to respond to the text box's keyboard typing events.
      * @param  {function} eventHandler - The event handler.
      */
    onType(eventHandler)
    {
        this._typeEvent = eventHandler
    }

     /**
      * Assigns an event handler to respond to all the events for the text box.
      * @param  {function} eventHandler - The event handler.
      */
    onStateChange(eventHandler)
    {
        this._stateChangeEvent = eventHandler
    }

    /**
     * NOT FOR PUBLIC USE. Handles the text box's mouseover and mouseout events.
     * @param  {TextBox} self - The text box.
     * @param  {SVG} draw - The SVG element in which the text box is containted.
     */
    _enableTyping(self, draw)
    {
        self._group.mouseover(function(event){
            self._text.text(self._textContents + '|');
            self._canType = true;
            
            if(self._stateChangeEventt != null)
                self._stateChangeEvent(event)
        })

        self._group.mouseout(function(event){
            self._text.text(self._textContents);
            self._canType = false;

            if(self._stateChangeEvent != null)
                self._stateChangeEvent(event)
        })

        self._text.mouseout(function(){
            self._text.text(self._textContents);
            self._canType = false;
        })

        self._polyline.mouseout(function(){
            self._text.text(self._textContents);
            self._canType = false;
        })
        draw.mouseout(function(event){
            self._text.text(self._textContents);
            self._canType = false;

            if(self._stateChangeEvent != null)
                self._stateChangeEvent(event)
        })
    }

    
    /**
     * NOT FOR PUBLIC USE. Handles the text box's keyboard key events.
     * @param  {TextBox} self - The textbox.
     */
    _readUserInput(self)
    {
        window.addEventListener('keydown', function(event){
            if(self._canType)
            {
                if (event.key == "Backspace")
                {
                    self._textContents = self._textContents.slice(0, self._textContents.length-1)

                    if(self._typeEvent != null)
                        self._typeEvent(event)
                    
                    if(self._stateChangeEvent != null)
                        self._stateChangeEvent(event)
                }    
                else if(self._checkEndOfTextBox())
                {
                   if (!(event.key.length > 1))
                   {
                        self._textContents = self._textContents+ event.key;

                        if(self._typeEvent != null)
                            self._typeEvent(event)
                
                        if(self._stateChangeEvent != null)
                            self._stateChangeEvent(event)
                   }           
                }
                else
                {
                    if(self._stateChangeEvent != null)
                        self._stateChangeEvent({boxStatus: "Full", typeEvent: event})
                }
                
                self._text.text(self._textContents + '|');
            }
            else
                self._text.text(self._textContents);
        })
    }

    
    /**
     * NOT FOR PUBLIC USE. Checks if the entered text reaches the end of the text box.
     * @return {boolean} Whether or not the entered text has reached the end of the text box.
     */
    _checkEndOfTextBox()
    {
        var textEdge = this._text.bbox();
        var endTexBox = this._endBox.bbox();

        return textEdge.width <= endTexBox.width;
    }
}

/**Class representing a scroll bar.*/
class ScrollBar
{
    
    /**
     * Creates a scroll bar of the specified height.
     * @param  {number} height - The initial height of the scroll bar. Has a minimum value of 50.
     */
    constructor(height)
    {
        if (height < 50)
            this._barHeight = 50;
        else
            this._barHeight = height;

        this._upButton = svgDraw.rect(25,25);
        this._upButton.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this._upButton.fill('white');

        this._scrollArea = svgDraw.rect(25,this._barHeight);
        this._scrollArea.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this._scrollArea.fill('gray');
        this._scrollArea.move(0,25)
       
        this._downButton = svgDraw.rect(25,25);
        this._downButton.stroke({ color: 'black', width: 4, linecap: 'round', linejoin: 'round' });
        this._downButton.fill('white');
        this._downButton.move(0,this._barHeight+25);

        this._scroller = svgDraw.rect(17, 30);
        this._scroller.stroke({ color: 'pink', width: 4, linecap: 'round', linejoin: 'round' });
        this._scroller.fill('orange');
        this._scroller.move(4,28);

        this._scrollBorderUpper = svgDraw.line(0,30,25,30);
        this._scrollBorderUpper.stroke({ color: 'transparent', width: 4, linecap: 'round'});

        this._scrollBorderLower = svgDraw.line(0,this._barHeight+20, 25,this._barHeight+20);
        this._scrollBorderLower.stroke({ color: 'transparent', width: 4, linecap: 'round'});

        this._upArrow = svgDraw.polyline('4,20 10,10 16,20');
        this._upArrow.fill('none');
        this._upArrow.stroke({ color: 'black', width: 2, linecap: 'round'})
        this._upArrow.move(6.5,8)


        this._downArrow = svgDraw.polyline('4,10 10,20  16,10');
        this._downArrow.fill('none');
        this._downArrow.stroke({ color: 'black', width: 2, linecap: 'round'})
        this._downArrow.move(6,this._barHeight+32)


        this._group = svgDraw.group();
        this._group.add(this._scrollArea)
        this._group.add(this._scroller)
        this._group.add(this._scrollBorderUpper)
        this._group.add(this._scrollBorderLower)

        this._upGroup = svgDraw.group()
        this._upGroup.add(this._upButton)
        this._upGroup.add(this._upArrow)


        this._downGroup = svgDraw.group();
        this._downGroup.add(this._downButton)
        this._downGroup.add(this._downArrow)

        this._isHeld = false;
        
        this._dragEvent = null
        this._stateChangeEvent = null

        this._enableDrag();
        this._dragScroller(this._scroller, this);
        this._clickButtons(this._scroller, this);
    }

    
    /**
     * Moves the scroll bar to a given coordinate.
     * @param  {number} x - The x value to which the scroll bar will move.
     * @param  {number} y - The y value to which the scroll bar will move.
     */
    move(x,y)
    {
        this._group.move(x,y)
        this._upGroup.move(x,y-25)
        this._downGroup.move(x,y+this._barHeight)
    }

    
    /**
     * Changes the scroll bar to the specified height. Has a minimum value of 50.
     * @param  {number} newHeight - The new height of the scroll bar.
     */
    setHeight(newHeight)
    {
        if (newHeight >= 50)
            this._barHeight = newHeight;
        else
            this._barHeight = 50;
        this._scrollArea.height(this._barHeight);

        this._downGroup.y(this._scrollArea.y()+this._barHeight)
        this._scrollBorderLower.y(this._scrollArea.y()+this._barHeight-5)
    }

    
    /**
     * Gets the position of the scroll thumb on the SVG canvas.
     * @return {Object} The {x,y} values of the scroll thumb.
     */
    getThumbPosition()
    {
        return {x: this._scroller.x(), y: this._scroller.y()}
    }

    
    /**
     * Assigns an event handler to respond to the scroll thumb being dragged.
     * @param  {function} eventHandler - The event handler.
     */
    onDrag(eventHandler)
    {
        this._dragEvent = eventHandler
    }


     /**
      * Assigns an event handler to respond to all the events for the scroll bar.
      * @param  {function} eventHandler - The event handler.
      */
    onStateChange(eventHandler)
    {
        this._stateChangeEvent = eventHandler
    }

    
    /**
     * NOT FOR PUBLIC USE. Handles the scroll bar's mouse down and mouse up events.
     */
    _enableDrag()
    {
        var self=this;
        this._scroller.mousedown(function(event){
            self._isHeld = true;
            if  (self._stateChangeEvent != null)
                self._stateChangeEvent(event)
        })

        this._scroller.mouseup(function(event){
            self._isHeld = false;
            if (self._stateChangeEvent != null)
                self._stateChangeEvent(event)
        })

        window.addEventListener('mouseup', function(event){
            self._isHeld = false;
            if (self._stateChangeEvent != null)
                self._stateChangeEvent(event)
          })
    }


    /**
     * NOT FOR PUBLIC USE. Handles the moving of the scroll thumb.
     */
    _dragScroller(scroll, self)
    {
        window.addEventListener('mousemove', function(event){
            if (self._isHeld)
            {
                var CTM = event.target.getScreenCTM();
                var newY = (event.clientY - CTM.f)/CTM.d;

                if (self._atUpperBorder())
                {
                    if(newY > scroll.y())
                        scroll.y(newY);
                }
                else if (self._atLowerBorder())
                {
                    if(newY < scroll.y())
                        scroll.y(newY);
                }
                else
                {
                    if(self._dragEvent != null)
                    {
                        if(scroll.y() > newY)
                            self._dragEvent({dragDirection: 'Up', dragEvent: event})
                        else if(scroll.y() < newY)
                            self._dragEvent({dragDirection: 'Down', dragEvent: event})
                    }
                    if (newY >= self._scrollArea.y() & newY < self._scrollArea.y()+self._barHeight)
                        scroll.y(newY);
                }
                if (self._stateChangeEvent != null)
                    self._stateChangeEvent(event)     
            }     
        })
    }
            
    
    /**
     * NOT FOR PUBLIC USE. Handles the scroll thumb movements when the scroll bar's Up and Down buttons are clicked.
     * @param  {Object} scroll - The scroll thumb.
     * @param  {ScrollBar} self - The scroll bar.
     */
    _clickButtons(scroll, self)
    {
        this._upGroup.mousedown(function(event){
            self._upButton.fill('pink');
            self._upArrow.stroke({color:'gray'})

            if (!self._atUpperBorder())
            {
                if (self._dragEvent != null)
                    self._dragEvent({dragDirection: 'Up', dragEvent: event})
                scroll.y(scroll.y()-5);   
            }    
        })

        this._downGroup.mousedown(function(event){
            self._downButton.fill('pink');
            self._downArrow.stroke({color:'gray'})

            if (!self._atLowerBorder())
            {
                if (self._dragEvent != null)
                    self._dragEvent({dragDirection: 'Down', dragEvent: event})
                scroll.y(scroll.y()+5);   
            }    
        })

        this._upButton.mouseup(function(event){
            this.fill('white');
            self._upArrow.stroke({color:'black'})
        })

        this._downButton.mouseup(function(event){
            this.fill('white');
            self._downArrow.stroke({color:'black'})
        })

        window.addEventListener('mouseup', function(event){
            self._upButton.fill('white')
            self._downButton.fill('white')
            self._upArrow.stroke({color:'black'})
            self._downArrow.stroke({color:'black'})
          })
          if (self._stateChangeEvent != null)
            self._stateChangeEvent(event)
    }

    
    /**
     * NOT FOR PUBLIC USE. Determines if the scroll thumb is at the top of the scroll bar.
     * @return {boolean} Whether or not the scrol thumb is at the top of the scroll bar.
     */
    _atUpperBorder()
    {
        return this._scroller.y() <= this._scrollBorderUpper.y();
    }

    /**
     * NOT FOR PUBLIC USE. Determines if the scroll thumb is at the bottom of the scroll bar.
     * @return {boolean} Whether or not the scrol thumb is at the bottom of the scroll bar.
     */
    _atLowerBorder()
    {
        return (this._scroller.y() + 2*(this._scroller.cy() -this._scroller.y()))>= this._scrollBorderLower.y();
    }
}

/**Class representing a progress bar.*/
class ProgressBar
{
    /**
     * Creates a progress bar.
     * @param  {number} barWidth - The width of the progress bar.
     * @param  {number} barPercentage - The percentage of the proress bar to be filled when initialized.
     */
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

    
    /**
     * Sets the fill percentage of the progress bar to a new value.
     * @param  {number} newValue - The new percentage for the progress bar to be filled.
     */
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

    
    /**
     * Adjusts the progress bar's width to make it longer or shorter.
     * @param  {number} newWidth - The new width of the progress bar.
     */
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

    
    /**
     * Adds a specified percentage to the total percentage of the progress bar.
     * @param  {number} inc - The amount by which the progress bar will be incremented.
     */
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
    
    /**
     * Gets the percentage of the progress bar that is filled.
     * @return {number} The progress bar's fill percentage.
     */
    getValue()
    {
        return this._barPerc;
    }

    
    /**
     * Moves the progress bar to a given coordinate.
     * @param  {number} x - The x value to which the progress bar will move.
     * @param  {number} y - The y value to which the progress bar will move.
     */
    move(x,y) 
    {
        this._bar.move(x,y);
        this._barFilling.move(x+13,y+2);
        this._staticParts.move(x,y);
        this._movingParts.move(x+ this._barWidth-15,y)  
    }


     /**
      * Assigns an event handler to respond to the progress bar's fill percentage changing.
      * @param  {function} eventHandler - The event handler.
      */
    onIncrement(eventHandler)
    {
        this._incrementEvent = eventHandler;
    }

     /**
      * Assigns an event handler to respond to all state changes for the progress bar.
      * @param  {function} eventHandler - The event handler.
      */
    onStateChange(eventHandler)
    {
        this._stateChangeEvent = eventHandler;
    }
}

/**Class representing a toggle switch.*/
class ToggleSwitch
{
    
    /**
     * Creates a toggle switch.
     * @param  {boolean} startState - The state in which the switch will be initialized. Enabled = true, Disabled = false
     * @param  {string} enableColor - The color the switch will have when it is enabled.
     */
    constructor(startState=false, enableColor='#60e356')
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

    /**
     * Moves the toggle switch to a given coordinate.
     * @param {number} x - The x value to which the toggle switch will move.
     * @param {number} y - The y value to which the toggle switch will move.
     */
    move(x,y)
    {
        this._group.move(x,y);
        this._onX = x+23;
        this._offX = x+3;
    }

    
    /**
     * Gets if the toggle switch is enabled or disabled. Enabled = true, Disabled = false
     * @return {boolean} Whether or not the toggle switch is enabled.
     */
    isEnabled()
    {
        return this._isOn;
    }

    
    /**
     * Changes the color of the toggle switch when Enabled.
     * @param  {string} newColor - The new color for the toggle switch when enabled.
     */
    setColor(newColor)
    {
        this.switchColor = newColor;
    }

    
    /**
     * Gets the color of the toggle switch when it is enabled.
     * @return {string} The toggle switch's color when enabled.
     */
    getColor()
    {
        return this.switchColor;
    }

     /**
      * Assigns an event handler to respond to the click events for the toggle switch.
      * @param  {function} eventHandler - The event handler.
      */
    onClick(eventHandler)
    {
        this._clickEvent = eventHandler;
    }

     /**
      * Assigns an event handler to respond to all the events for the toggle switch.
      * @param  {function} eventHandler - The event handler.
      */
    onStateChange(eventHandler)
    {
        this._stateChangeEvent = eventHandler;
    }

    /**
     * NOT FOR PUBLIC USE. Handles the click events for the toggle switch.
     */
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

    /**
     * NOT FOR PUBLIC USE. Turns the toggle switch off.
     */
    _switchOff()
    {
        this._isOn = false;
        this._switch.animate({duration: 100}).move(this._offX, this._switch.y());
        this._switchArea.fill('gray');
    }

    /**
     * NOT FOR PUBLIC USE. Turns the toggle switch on.
     */
    _switchOn()
    {
        this._isOn = true;
        this._switch.animate({duration: 100}).move(this._onX, this._switch.y());
        this._switchArea.fill(this.switchColor);
    }

    /** NOT FOR PUBLIC USE. Handles the toggle switch's mouse events that are not click events.
    * @param  {ToggleSwitch} self - The toggle switch.
    */
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