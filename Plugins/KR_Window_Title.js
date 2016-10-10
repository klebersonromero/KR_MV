/*:
*
 * @plugindesc KR_Window_Title
 * @author Kleberson Romero (GS_TEAM)
 * @version 1.0
 * @help
 * Esse plugin adiciona um Título a sua Janela é só chamar a função
 * no Metodo Initilize da própria janela.
 * Exemplo add Título a Janela de comando inicial Window_TitleCommand:
  //=============================================//
 //              Exemplo de USO!                // 
//=============================================//
Window_TitleCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
    this.openness = 0;
    this.selectLast();
    // Esse é o Cod. que Dá Título a sua Janela.
    this.create_title_sprite("Bem vindo ao KR_Engine!");
};
*/
// Cria uma Variavel KR
var KR = KR || {};
KR.Title.version = 1.0

if (KR["KR_Plugin"] === undefined) {      // Verifica se possui o KR_Plugin
  alert("Please add KR_Plugin before KR_Hud!");
  alert("https://github.com/klebersonromero/KR_MV/tree/master/Plugins");
  throw new Error("Please add KR_Plugin before KR_Window_Title!");
};

if (KR["version"] <= 1.2) {            // Verifica a versão do KR_Plugin
  alert("Please update KR_Plugin!");
  alert("https://github.com/klebersonromero/KR_MV/tree/master/Plugins");
  throw new Error("Please update KR_Plugin!");
}

KR.Title.parameters   = PluginManager.parameters('KR_Window_Title');
  //=======================================================================//
 //  ** Metodo Alias do Window_Base.initialize                            //
//=======================================================================//
var alias_Window_Base_initialize = Window_Base.prototype.initialize;
Window_Base.prototype.initialize = function(x, y, width, height) {
    alias_Window_Base_initialize.call(this);
    Window.prototype.initialize.call(this);
    this.loadWindowskin();
    this.move(x, y, width, height);
    this.createContents();
    this.create_title_sprite();
};
  //=======================================================================//
 //  ** Metodo de Criação do Sprite de Título                             //
//=======================================================================//
Window_Base.prototype.create_title_sprite = function(text){
   this.text = text
   this.title_sprite = new Sprite();
   this.title_sprite.bitmap = new Bitmap(this.width, this.height);
   this.title_sprite.x = 0;
   this.title_sprite.y = 0;
   this.addChild(this.title_sprite);
};
  //=======================================================================//
 //  ** Metodo Alias do Window_Base.update                                //
//=======================================================================//
var alias_Window_Base_update = Window_Base.prototype.update;
Window_Base.prototype.update = function(){
    alias_Window_Base_update.call(this);
    this.update_title_sprite();
};
  //=======================================================================//
 //  ** Metodo de Atualização do Sprite de Título                         //
//=======================================================================//
Window_Base.prototype.update_title_sprite = function(){
    //-----------------------------------------------------------------------------------------------------//
    if (this.text === undefined){                          // Se o Texto não for definido
      this.text = "";                                     //  Define o texto para Vazio
    }else{                                               // Caso possuia texto definido
      this.title_sprite.bitmap._drawTextOutline(this.text,0,15,this.width); // Escreve a sobra do texto
      this.title_sprite.bitmap._drawTextBody(this.text,0,15,this.width);   //  Escrebe o texto
    }
    //-----------------------------------------------------------------------------------------------------//
    if (this.title_sprite === undefined){             // Se o Sprite for indefinido
       this.title_sprite.bitmap.clear();            // Limpa o Bitmap
    }else{                                          // Se o Sprite não for indefinido
       this.title_sprite.x = (this.width/4);      // Centraliza o eixo X
       this.title_sprite.visible = this.visible; // Deixa visivel de acordo com a Janela
    }
    //-----------------------------------------------------------------------------------------------------//
};

  //=============================================//
 //              Exemplo de USO!                // 
//=============================================//
Window_TitleCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
    this.openness = 0;
    this.selectLast();
    this.create_title_sprite("Bem vindo ao KR_Engine!");
};