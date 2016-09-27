/*:
 *
 *@plugindesc Kleberson Romero HUD
 *@author Kleberson Romero (GS_TEAM)
 *
 * @param Default Actor
 * @desc Personagem  padrão de leitura de dados
 * @default 1
 *
 *@param BackSprite_Hud
 *@desc Imagem de Base para a Hud
 *@default HUD_Background
 *
 *@param Back_X
 *@desc Posição X da Imagem de Base para a Hud
 *@default 40
 *
 *@param Back_Y
 *@desc Posição Y da Imagem de Base para a Hud
 *@default 20
 *
 *@param HP_Image
 *@desc Imagem de HP para a Hud
 *@default HP
 *
 *@param HP_Image_X
 *@desc Posição X da Imagem de HP para a Hud
 *@default 88
 *
 *@param HP_Image_Y
 *@desc Posição Y da Imagem de HP para a Hud
 *@default 26
 *
 *@help
 *Texto para ajudar o usuário a usar o plugin
 *
*/

// Criando um objeto e colocando ele como Hud para chamar funções
var KR = KR || {};
KR.Hud = {};
//-------------------------------------------------------------
// Alias do Objeto Game_System.initialize
//-------------------------------------------------------------
KR.Hud.xinitialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    KR.Hud.xinitialize.call(this);
    this._defaultActor = KR.Hud.DefaultActor;
}
//-------------------------------------------------------------
KR.Hud.DefaultActor = Number(PluginManager.parameters('KR_Hud')['Default Actor'] || 1);
// Parametros customizaveis do PluginManager para Imagem de Fundo ou Base da Hud
KR.Hud.Back_Sprite = PluginManager.parameters('KR_Hud')['HUD_Background'] || "HUD_Background";
KR.Hud.Back_X      = Number(PluginManager.parameters('KR_Hud')['HUD Back_X'] || 40);
KR.Hud.Back_Y 	   = Number(PluginManager.parameters('KR_Hud')['HUD Back_Y'] || 20);
// Parametrso customizaveis do PluginManager para Imagem de HP
KR.Hud.HP_Sprite    = PluginManager.parameters('KR_Hud')['HP_Image'] || "HP";
KR.Hud.HP_Image_X   = Number(PluginManager.parameters('KR_Hud')['HP_Image_X'] || 88);
KR.Hud.HP_Image_Y   = Number(PluginManager.parameters('KR_Hud')['HP_Image_Y'] || 26);
//---------------------------------------------------------------------------------------
// Criação da Função Sprite_HudBase
//---------------------------------------------------------------------------------------
function Sprite_HudBase(){
	this.initialize.apply(this, arguments);
};
//---------------------------------------------------------------------------------------
// Defique que Sprite_HudBase é filha de Sprite
Sprite_HudBase.prototype = Object.create(Sprite.prototype);
// Constroi essa filhiação
Sprite_HudBase.prototype.constructor = Sprite_HudBase;
//---------------------------------------------------------------------------------------
// Metodo Initialize
//---------------------------------------------------------------------------------------
Sprite_HudBase.prototype.initialize = function (bitmap) {
    Sprite.prototype.initialize.apply(this, arguments);
    this._back_sprite = new Sprite(ImageManager.loadPicture(KR.Hud.Back_Sprite));
    this._hp_sprite = new Sprite(ImageManager.loadPicture(KR.Hud.HP_Sprite));
};
//---------------------------------------------------------------------------------------
// Método Update
//---------------------------------------------------------------------------------------
Sprite_HudBase.prototype.update = function () {
  Sprite.prototype.update.apply(this, arguments);
  this.updateBack_Sprite();
  this.updateHPBar();
}
//---------------------------------------------------------------------------------------
//  Atualização da Sprite_Base da HUD
//---------------------------------------------------------------------------------------
Sprite_HudBase.prototype.updateBack_Sprite = function () {
  this._back_sprite.x = KR.Hud.Back_X;
  this._back_sprite.y = KR.Hud.Back_Y;
  this._back_sprite.opacity = this.opacity;
  this.addChild(this._back_sprite);
}
//---------------------------------------------------------------------------------------
//  Atualização da Sprite de HP da HUD
//---------------------------------------------------------------------------------------
Sprite_HudBase.prototype.updateHPBar= function () {
  this._hp_sprite.x = this.x + KR.Hud.HP_Image_X;
  this._hp_sprite.y = this.y + KR.Hud.HP_Image_Y;
  this._hp_sprite.opacity = this.opacity; 
  this.addChild(this._hp_sprite);
}
//---------------------------------------------------------------------------------------
//  Atualização da taxa de Sprite de HP na HUD
//---------------------------------------------------------------------------------------
Sprite_HudBase.prototype.setRate = function (rate) {
  this._hp_sprite.setFrame(0, 0, this._hp_sprite.bitmap.width * rate, this._hp_sprite.bitmap.height);
}
//---------------------------------------------------------------------------------------
//  Criar a função da Sprite de HP
//---------------------------------------------------------------------------------------
function Sprite_HpBar() {
  this.initialize.apply(this, arguments);
}
// Defique que Sprite_HPBar é filha de Sprite_HudBase
Sprite_HpBar.prototype = Object.create(Sprite_HudBase.prototype)
// Constroi essa filhiação
Sprite_HpBar.prototype.constructor = Sprite_HpBar;
//---------------------------------------------------------------------------------------
//  Criar o Metodo de Inicialização do HPBar
//---------------------------------------------------------------------------------------
Sprite_HpBar.prototype.initialize = function (bitmap) {
  this._actor = null;
  Sprite_HudBase.prototype.initialize.apply(this, arguments);
}
//---------------------------------------------------------------------------------------
// Seta qual Heroi será
//---------------------------------------------------------------------------------------
Sprite_HpBar.prototype.setActor = function (actor) {
  this._actor = actor;
}
//---------------------------------------------------------------------------------------
//  Atualização da Sprite de HP
//---------------------------------------------------------------------------------------
Sprite_HpBar.prototype.update = function () {
  Sprite_HudBase.prototype.update .apply(this, arguments);
  if (this._actor) {
     this.setRate(this._actor.hpRate());
  }
}
//---------------------------------------------------------------------------------------
//  Criar a Hud da Spriteset_Map
//---------------------------------------------------------------------------------------
Spriteset_Map.prototype.createHud = function() {
    this._sprite = new Sprite_HpBar();
    this._sprite.setActor($gameActors.actor($gameSystem._defaultActor));
    this._baseSprite.addChild(this._sprite);
}
//---------------------------------------------------------------------------------------
//  Alias do Método Spriteset_Map.update e add a Criação da HUD
//---------------------------------------------------------------------------------------
KR.Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
   KR.Spriteset_Map_update.call(this);
    this.createHud();
};