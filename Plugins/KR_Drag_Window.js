/*:
*
 * @plugindesc KR_Drag_Window
 * @author Kleberson Romero (GS_TEAM)
 * @version 2.0
 * @help
 * Esse plugin adiciona um metodo de arrasto de janela drag and move.
 */

  //=======================================================================//
 //  ** Metodo Alias do Window_Base.initialize                            //
//=======================================================================//
var alias_Window_Base_initialize_drag = Window_Base.prototype.initialize;
Window_Base.prototype.initialize = function(x, y, width, height) {
    alias_Window_Base_initialize_drag.call(this);
    Window.prototype.initialize.call(this);
    this.loadWindowskin();
    this.move(x, y, width, height);
    this.createContents();
    this.draggable = true;
    this.closeable = true;
    this.widgets = [];
};
  //=======================================================================//
 //  ** Metodo Alias do Window_Base.update                                //
//=======================================================================//
var alias_Window_Base_update_drag = Window_Base.prototype.update;
Window_Base.prototype.update = function() {
    alias_Window_Base_update_drag.call(this,arguments);
    this.update_drag_move();
    this.on_close();
};
  //=======================================================================//
 //  ** Metodo Alias do Window_Base.on_close                              //
//=======================================================================//
Window_Base.prototype.on_close = function(){
if (TouchInput.isTriggered()){
      if (this.in_area(this.width-16,0,16,16)){
       if (this.closeable){
       	SoundManager.playOk();
       	this.hide();
       }else{
       	SoundManager.playBuzzer();
       }
      }
    }
};
  //=======================================================================//
 //  ** Metodo de atualização drag_move Window_Base                       //
//=======================================================================//
Window_Base.prototype.update_drag_move = function() {
    this.check_dragability();
    if(this.in_draging)
        this.update_in_drag();
};
  //=======================================================================//
 //  ** Metodo de verificação de arrasto na area(grid) Window_Base        //
//=======================================================================//
Window_Base.prototype.check_dragability = function() {
    if(TouchInput.isPressed()){
        if(this.can_drag()) {  // Verifica se é possivel arrastar a janela
            if (this.in_area(0,0,this.width-16,16) == true){ // se estiver na area de arrasto
            	this.in_drag();          // arrasta a janela
            }
        }
    } else {
        if(this.in_draging)  
            this.drag_cancel();         // Cancela o arrasto
    }
};
  //=======================================================================//
 //  ** Metodo de verificação se janela é arrastevel Window_Base          //
//=======================================================================//
Window_Base.prototype.can_drag = function() {
	if (this.draggable){
    	return true
	}else{
   		return false
   	}
};
  //=======================================================================//
 //  ** Metodo de verificação se está dentro a área da janela             //
//=======================================================================//
Window_Base.prototype.in_area = function(x,y,width,height) {
    var tx = TouchInput.x;
    var ty = TouchInput.y;   
    if(tx >= this.x+x && tx <= (this.x+this.width) && ty >= this.y+y && ty <= (this.y+height)) {
      console.log("na area")
    	return true
    }else{
    	return false
    }
};

  //=======================================================================//
 //  ** Metodo de verificação está arrastando?                            //
//=======================================================================//
Window_Base.prototype.in_drag = function() {
    this.in_draging = true;
    this.ini_pos_drag = [this.x,this.y];
    this.ini_pos_touch_drag = [TouchInput.x,TouchInput.y];
    this.backOpacity = 120;
};
  //=======================================================================//
 //  ** Metodo de cancelamento do arrasto                                 //
//=======================================================================//
Window_Base.prototype.drag_cancel = function() {
    this.in_draging = false;
    this.update_pos_grid();
    this.backOpacity = 200;
};
  //=======================================================================//
 //  ** Metodo de Atualização da posição do arrasto                       //
//=======================================================================//
Window_Base.prototype.update_in_drag = function() {
    var difX = TouchInput.x - this.ini_pos_touch_drag[0];
    var difY = TouchInput.y - this.ini_pos_touch_drag[1];
    this.x = this.ini_pos_drag[0] + difX;
    this.y = this.ini_pos_drag[1] + difY;
};
  //==========================================================================//
 //  ** Metodo de Atualização da posição do arrasto dentro da area do grafico //
//===========================================================================//
Window_Base.prototype.update_pos_grid = function() {
    var size = 12;
    var maxX = Graphics.width - this.width;
    var maxY = Graphics.height - this.height;
    for (var i = 0; i < Graphics.width; i += size) {
        if ( i > this.x ) {
            this.x = (i-size).clamp(0,maxX);
            break;
        }
    }
    for (var i = 0; i < Graphics.height; i += size) {
        if ( i > this.y ) {
            this.y = (i-size).clamp(0,maxY);
            break;
        }
    }
};
