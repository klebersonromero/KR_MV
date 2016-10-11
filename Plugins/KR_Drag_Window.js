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
};
  //=======================================================================//
 //  ** Metodo Alias do Window_Base.update                                //
//=======================================================================//
var alias_Window_Base_update_drag = Window_Base.prototype.update;
Window_Base.prototype.update = function() {
    alias_Window_Base_update_drag.call(this,arguments);
    this.update_drag_move();
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
            if (this.in_area() == true){ // se estiver na area de arrasto
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
 //  ** Metodo de verificação se está dentro a área da janela Window_Base //
//=======================================================================//
Window_Base.prototype.in_area = function(){
	var tx = TouchInput.x;
    var ty = TouchInput.y;
    if(tx >= this.x && tx <= (this.x+this.width) && ty >= this.y && ty <= (this.y+this.height)) {
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
};
  //=======================================================================//
 //  ** Metodo de cancelamento do arrasto                                 //
//=======================================================================//
Window_Base.prototype.drag_cancel = function() {
    this.in_draging = false;
    this.update_pos_grid();
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