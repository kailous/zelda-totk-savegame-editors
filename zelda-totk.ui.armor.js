(function(global){
'use strict';

function refreshInputs(item){
	if(item._htmlInputs && item._htmlInputs.dyeColor){
		item._htmlInputs.dyeColor.disabled=!item.canBeDyed();
	}
	PouchUI.updateItemIcon(item);
}

function buildHtmlElements(item, onCommit){
 item._htmlInputs={
  dyeColor:SavegameUI.createItemInput(item, 'dyeColor', 'Enum', {enumValues:Armor.OPTIONS_DYE_COLORS, label:_('Dye color')}, onCommit)
 };
}

global.ArmorUI={
	refreshInputs:refreshInputs,
	buildHtmlElements:buildHtmlElements
};

})(this);
