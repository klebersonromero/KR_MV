/*:
*
 * @plugindesc KR_Drag_Window
 * @author Kleberson Romero (GS_TEAM)
 * @version 2.2
 *
 * @param Dragable
 * @desc true/false para Ativar ou Desativar o arrasto da Janela
 * @default true
 *
 * @param Closeable
 * @desc true/false para Ativar ou Desativar o Fechamento da Janela
 * @default true
 *
 * @help
 * Esse plugin adiciona várias funções na Window_Base padrão do RMMV.
 *
 * Log Versão 2.2
 *
 * Adicionado Configurações no PluginManager.
 * Corrigido Bug do Arrasto na Diagonal.
 * Melhorias dos Codigos.
 * Adição de Variavel Global $window que suporta todas as Janelas derivadas da Window_Base.

 * Log Versão 2.0
 *
 * Adicionado função de fechamento de janela.
 * Adicionado Sons de fechamento ou não da janela.
 * Corrigido Bug da Area.
 * Alguns bug's de posicionamento corrigidos.
 * Opacidade ao Arrastar janela.
 *
 * Log Versão 1.0
 *
 * Criado as funções de arrasto da janela. 
 *
 */

// Cria uma Variavel KR
var KR = KR || {};
KR.Window.version = 2.2;
// Verifica se possui o KR_Plugin
if (KR["KR_Plugin"] === undefined) {
  alert("Please add KR_Plugin before KR_Hud!");
  alert("https://github.com/klebersonromero/KR_MV/tree/master/Plugins");
  throw new Error("Please add KR_Plugin before KR_Hud!");
};
// Verifica a versão do KR_Plugin
if (KR["version"] <= 1.4) {
  alert("Please update KR_Plugin!");
  alert("https://github.com/klebersonromero/KR_MV/tree/master/Plugins");
  throw new Error("Please update KR_Plugin!");
}
// Variais do PluginManager
KR.Window.parameters   = PluginManager.parameters('KR_Drag_Window');
KR.Window.Dragable     = JSON.parse(KR.Window.parameters['Dragable']);
KR.Window.Closeable    = JSON.parse(KR.Window.parameters['Closeable']);
// Variavel Global de Janelas derivadas da Window_Base
$window = []
  //=======================================================================//
 //  ** Metodo Alias do Window_Base.initialize                            //
//=======================================================================//
var alias_Window_Base_initialize_drag = Window_Base.prototype.initialize;
Window_Base.prototype.initialize = function(x, y, width, height) {
    alias_Window_Base_initialize_drag.call(this,arguments);
    Window.prototype.initialize.call(this,arguments);
    this.loadWindowskin();
    this.move(x, y, width, height);
    this.createContents();
    this.draggable = KR.Window.Dragable;
    this.closeable = KR.Window.Closeable;
    this.max_X = Graphics.width - this.width;
    this.max_Y = Graphics.height - this.height;
    $window = this;
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
if (TouchInput.isTriggered() && (this.in_area(this.width-16,0,16,16)) && (this.closeable)){
  SoundManager.playOk();
  this.hide();
}else if (TouchInput.isTriggered() && (this.in_area(this.width-16,0,16,16)) && (!this.closeable)){ SoundManager.playBuzzer() }
};
  //=======================================================================//
 //  ** Metodo de atualização drag_move Window_Base                       //
//=======================================================================//
Window_Base.prototype.update_drag_move = function() {
    this.check_dragability();
    if(this.in_draging){ this.update_in_drag() }
};
  //=======================================================================//
 //  ** Metodo de verificação de arrasto na area(grid) Window_Base        //
//=======================================================================//
Window_Base.prototype.check_dragability = function() {
    if(TouchInput.isPressed()){
    if(this.can_drag() && (this.in_area(0,0,this.width-16,16))) { this.in_drag()}} // Verifica se é possivel arrastar a janela e se está na area
    else{ if(this.in_draging){ this.drag_cancel() }}        // Cancela o arrasto
};
  //=======================================================================//
 //  ** Metodo de verificação se janela é arrastevel Window_Base          //
//=======================================================================//
Window_Base.prototype.can_drag = function() {
	if (this.draggable){ return true }else{ return false	}
};
  //=======================================================================//
 //  ** Metodo de verificação se está dentro a área da janela             //
//=======================================================================//
Window_Base.prototype.in_area = function(x,y,width,height) {
    var tx = TouchInput.x;
    var ty = TouchInput.y;   
    if(tx >= this.x+x && tx <= (this.x+this.width) && ty >= this.y+y && ty <= (this.y+height)) { return true} else{ return false }
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
    // Calculo de Maximo X
    if (this.x > this.max_X){ 
    	this.x = this.max_X;
    if (this.x > this.max_X && this.y > this.max_Y){
      this.x = this.max_X;
      this.y = this.max_Y;
    }
    }else if (this.x < 0) {
    	this.x = 0;
    if (this.x && this.y < 0){ this.x = 0; this.y = 0 }
    }
    // Calculo de Maximo Y
    if (this.y > this.max_Y){
    	this.y = this.max_Y;
    }else if (this.y < 0) {
		  this.y = 0;
    if (this.y && this.x < 0){ this.x = 0; this.y = 0 }
    }
};
