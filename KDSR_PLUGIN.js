/*:
 *
 *@plugindesc Kleberson Romero Wather Mark
 *@author Kleberson Romero	
 *
 *@param Image
 *@desc Imagem a ser utilizada como marca d'agua
 *@default Logo
 *
 *@param Opacity Wathermark
 *@desc Opacidade da Imagem de Marca D'agua
 *@default 150
 *
 *@help
 *Esse plugin adiciona uma marca d'agua no seu projeto
 *seu uso é mais constante em vídeo aulas ou tutoriais
 *
*/

var parameters = PluginManager.parameters('KDSR_PLUGIN'); // Nome do Arquivo de Plugins sem o .JS
var KR_LogoImage = String(parameters['Image'] || 'Logo');    // Imagem do Logo definido pelo PluginManager Img deve ficar em System
var KR_Opacity = Number(parameters['Opacity Wathermark'] || 150);

var _Scene_Base_createWindowLayer = Scene_Base.prototype.createWindowLayer;
Scene_Base.prototype.createWindowLayer = function(){
	_Scene_Base_createWindowLayer.call(this);
	this.createWathermark();	
};

Scene_Base.prototype.createWathermark = function() {
    this._krSprite1 = new Sprite(ImageManager.loadSystem(KR_LogoImage));
    this.addChild(this._krSprite1);
    this._krSprite1.opacity = KR_Opacity
};

