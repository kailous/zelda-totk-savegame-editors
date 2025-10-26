(function(global){
'use strict';

function refreshInputs(item, fixValues){
	var isCountable=item.category!=='key' || Item.KEY_COUNTABLE.indexOf(item.id)!==-1;
	if(fixValues){
		if(item.category==='food'){
			if(item.lastInputChanged==='effect'){
				if(item.id==='Item_Cook_C_17' && Item.VALID_ELIXIR_EFFECTS.indexOf(hashReverse(item.effect))!==-1){
					PouchUI.updateItemIcon(item);
				}
				if(item.effect===hash('None')){
					item.effectMultiplier=0;
					item.effectTime=0;
				}
			}
		}else if(item.category==='key'){
			if(isCountable && item.quantity<1){
				item.quantity=1;
			}else if(!isCountable && item.lastInputChanged==='id'){
				item.quantity=-1;
			}
		}
	}

	if(item._htmlInputs && item._htmlInputs.quantity){
		item._htmlInputs.quantity.disabled=!isCountable;
	}

	if(item.category==='key' && item._htmlInputs && item._htmlInputs.quantity){
		var maxValue=Item.getMaximumQuantity(item.id);
		item._htmlInputs.quantity.maxValue=maxValue;
		if(fixValues && item.quantity>maxValue){
			item.quantity=maxValue;
		}
	}

	if(item.category==='food' && item._htmlInputs && (!fixValues || item.lastInputChanged==='effect')){
		var effectText;
		try{
			effectText=hashReverse(item.effect);
		}catch(err){
			effectText='None';
		}

		if(effectText && effectText!=='None')
			item._htmlInputs.effectMultiplier.style.backgroundImage='url(assets/tokt_ui_icons/bonus_'+effectText+'.svg)';
		else
			item._htmlInputs.effectMultiplier.style.backgroundImage='none';

		item._htmlInputs.effectMultiplier.disabled=item._htmlInputs.effectTime.disabled=(!effectText || effectText==='None');
	}
}

function buildHtmlElements(item, onCommit){
	var maxQuantity=Item.getMaximumQuantity(item.id);

	if(item.category==='food'){
		item._htmlInputs={
			quantity:SavegameUI.createItemInput(item, 'quantity', 'Int', {min:1, max:maxQuantity, label:_('Quantity')}, onCommit),
			heartsHeal:SavegameUI.createItemInput(item, 'heartsHeal', 'Int', {min:-1, max:40*4, label:_('Heart quarters heal')}, onCommit),
			effect:SavegameUI.createItemInput(item, 'effect', 'Enum', {enumValues:Item.FOOD_EFFECTS, label:_('Food effect')}, onCommit),
			effectMultiplier:SavegameUI.createItemInput(item, 'effectMultiplier', 'Int', {min:-1, max:250, label:_('Multiplier')}, onCommit),
			effectTime:SavegameUI.createItemInput(item, 'effectTime', 'Int', {min:-1, max:59999, label:_('Duration (in seconds)')}, onCommit),
			price:SavegameUI.createItemInput(item, 'price', 'Int', {min:1, max:999999, label:_('Price')}, onCommit)
		};
		item._htmlInputs.effectMultiplier.className+=' with-icon';
	}else{
		item._htmlInputs={
			quantity:SavegameUI.createItemInput(item, 'quantity', 'Int', {min:-1, max:maxQuantity, label:_('Quantity')}, onCommit)
		};
	}
}

global.ItemUI={
	refreshInputs:refreshInputs,
	buildHtmlElements:buildHtmlElements
};

})(this);
