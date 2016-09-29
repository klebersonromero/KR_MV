/*:
 *
 *@plugindesc KR_HUD
 *@author Kleberson Romero (GS_TEAM)
 *
 *
 *@help
 * Sistema Baseado nos cod Soulpour777
 * Otimizado para funções unicas sem atualização desnecessárias.
 * Totalmente customizado, Plugin sob licença MIT, caso use 
 * em seu projeto deverá dar os devidos créditos.
 *
 * Todos os meus Plugins dependem do KR_Plugin por favor
 * Baixe a sua versão em:
 * https://github.com/klebersonromero/KR_MV/tree/master/Plugins
 *
*/

// Cria uma Variavel KR
var KR = KR || {};
// Verifica se possui o KR_Plugin
if (KR["KR_Plugin"] === undefined) {
  alert("Please add KR_Plugin before KR_Hud!");
  alert("https://github.com/klebersonromero/KR_MV/tree/master/Plugins");
  throw new Error("Please add KR_Plugin before KR_Hud!");
};
// Verifica a versão do KR_Plugin
if (KR["version"] < 0.9) {
  alert("Please update KR_Plugin!");
  alert("https://github.com/klebersonromero/KR_MV/tree/master/Plugins");
  throw new Error("Please update KR_Plugin!");
}
//-------------------------------------------------------------
// Alias do Objeto Game_System.initialize
//-------------------------------------------------------------
KR.Hud.xinitialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    KR.Hud.xinitialize.call(this);
    this._defaultActor = KR.Hud.DefaultActor;
};
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
    this._hp_sprite   = new Sprite(ImageManager.loadPicture(KR.Hud.HP_Sprite));
    this._mp_sprite   = new Sprite(ImageManager.loadPicture(KR.Hud.MP_Sprite));
    this._xp_sprite   = new Sprite(ImageManager.loadPicture(KR.Hud.XP_Sprite));
};
//---------------------------------------------------------------------------------------
// Método Update
//---------------------------------------------------------------------------------------
Sprite_HudBase.prototype.update = function () {
  Sprite.prototype.update.apply(this, arguments);
  this.updateBack_Sprite();
  this.updateBar();
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
Sprite_HudBase.prototype.updateBar = function () {
  // Atualização de Barra de HP
  this._hp_sprite.x = this.x + KR.Hud.HP_Image_X;
  this._hp_sprite.y = this.y + KR.Hud.HP_Image_Y;
  this._hp_sprite.opacity = this.opacity; 
  this.addChild(this._hp_sprite);
  // Atualização de Barra de MP
  this._mp_sprite.x = this.x + KR.Hud.MP_Image_X;
  this._mp_sprite.y = this.y + KR.Hud.MP_Image_Y;
  this._mp_sprite.opacity = this.opacity;
  this.addChild(this._mp_sprite);
  // Atualização de Barra de XP
  this._xp_sprite.x = this.x + KR.Hud.XP_Image_X;
  this._xp_sprite.y = this.y + KR.Hud.XP_Image_Y;
  this._xp_sprite.opacity = this.opacity;
  this.addChild(this._xp_sprite);
};
//---------------------------------------------------------------------------------------
//  Atualização da taxa de Sprite de HP na HUD
//---------------------------------------------------------------------------------------
Sprite_HudBase.prototype.setHpRate = function (rate) {
    this._hp_sprite.setFrame(0, 0, this._hp_sprite.bitmap.width * rate, this._hp_sprite.bitmap.height);
};
//---------------------------------------------------------------------------------------
//  Atualização da taxa de Sprite de MP na HUD
//---------------------------------------------------------------------------------------
Sprite_HudBase.prototype.setMpRate = function (rate) {
    this._mp_sprite.setFrame(0, 0, this._mp_sprite.bitmap.width * rate, this._mp_sprite.bitmap.height);
};
//---------------------------------------------------------------------------------------
//  Atualização da taxa de Sprite de MP na HUD
//---------------------------------------------------------------------------------------
Sprite_HudBase.prototype.setXpRate = function (rate) {
    this._xp_sprite.setFrame(0, 0, this._xp_sprite.bitmap.width * rate, this._xp_sprite.bitmap.height);
};
//---------------------------------------------------------------------------------------
//  Criar a função da Sprite de HP
//---------------------------------------------------------------------------------------
function Sprite_StatusBar() {
  this.initialize.apply(this, arguments);
};
// Defique que Sprite_StatusBar é filha de Sprite_HudBase
Sprite_StatusBar.prototype = Object.create(Sprite_HudBase.prototype);
// Constroi essa filhiação
Sprite_StatusBar.prototype.constructor = Sprite_StatusBar;
//---------------------------------------------------------------------------------------
//  Criar o Metodo de Inicialização do HPBar
//---------------------------------------------------------------------------------------
Sprite_StatusBar.prototype.initialize = function (bitmap) {
  this._actor = null;
  Sprite_HudBase.prototype.initialize.apply(this, arguments);
};
//---------------------------------------------------------------------------------------
// Seta qual Heroi será
//---------------------------------------------------------------------------------------
Sprite_StatusBar.prototype.setActor = function (actor) {
  this._actor = actor;
};
//---------------------------------------------------------------------------------------
//  Atualização da Sprite de HP
//---------------------------------------------------------------------------------------
Sprite_StatusBar.prototype.update = function () {
  Sprite_HudBase.prototype.update .apply(this, arguments);
  if (this._actor) {
     this.setHpRate(this._actor.hpRate());
     this.setMpRate(this._actor.mpRate());
     this.setXpRate(this._actor.currentExp() / this._actor.nextLevelExp());
  };
};
//---------------------------------------------------------------------------------------
//  Criar a Hud da Spriteset_Map
//---------------------------------------------------------------------------------------
Spriteset_Map.prototype.createHud = function() {
    this._sprite = new Sprite_StatusBar();
    this._sprite.setActor($gameActors.actor($gameSystem._defaultActor));
    this._baseSprite.addChild(this._sprite);
};
//---------------------------------------------------------------------------------------
//  Alias do Método Spriteset_Map.createLowerLayer e add a Criação da HUD
//---------------------------------------------------------------------------------------
KR.Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
   KR.Spriteset_Map_createLowerLayer.call(this);
    this.createHud();
};
