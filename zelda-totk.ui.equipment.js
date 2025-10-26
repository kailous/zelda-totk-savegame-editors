(function(global){
'use strict';

function refreshInputs(item, fixValues){
	if(!item._htmlInputs)
		return;

	if(fixValues){
		item._htmlInputs.durability.maxValue=item.getMaximumDurability();
		if(item.durability>item._htmlInputs.durability.maxValue)
			item.durability=item._htmlInputs.durability.maxValue;

		if(item.lastInputChanged==='modifier'){
			if(item.modifier===hash('None')){
				item.modifierValue=0;
				item.restoreDurability();
			}else if(item.modifierValue<1){
				item.modifierValue=1;
			}
		}
		if(item.gainsFuseDurability()){
			var maximumRecord=item.getMaximumRecordDurability();
			item._htmlInputs.extraDurability.maxValue=maximumRecord;
			item._htmlInputs.recordExtraDurability.maxValue=maximumRecord;
			if(item.extraDurability>maximumRecord)
				item.extraDurability=maximumRecord;
			if(item.recordExtraDurability>maximumRecord)
				item.recordExtraDurability=maximumRecord;
		}
		if(item.lastInputChanged==='fuseId'){
			if(item.recordExtraDurability===-1){
				item.recordExtraDurability=item.getMaximumRecordDurability();
				item.extraDurability=item.recordExtraDurability;
			}else if(!item.fuseId){
				item.extraDurability=0;
			}else{
				item.extraDurability=item.recordExtraDurability;
			}
		}
		if(item.lastInputChanged==='extraDurability'){
			if(item.fuseId){
				item.recordExtraDurability=item.extraDurability;
			}else{
				item.extraDurability=0;
			}
		}
		if(item.lastInputChanged==='recordExtraDurability' && item.fuseId){
			if(item.recordExtraDurability===-1)
				item.recordExtraDurability=item.getMaximumRecordDurability();
			item.extraDurability=item.recordExtraDurability;
		}
	}

	item._htmlInputs.modifierValue.disabled=item.modifier===hash('None');
	if(item.gainsFuseDurability() && item._htmlInputs.extraDurability)
		item._htmlInputs.extraDurability.disabled=!item.fuseId;

	var modifierText;
	try{
		modifierText=hashReverse(item.modifier);
	}catch(err){
		modifierText='None';
	}
	if(/AttackUp/.test(modifierText))
		modifierText=item.category+'_'+modifierText;

	if(modifierText && modifierText!=='None')
		item._htmlInputs.modifierValue.style.backgroundImage='url(assets/tokt_ui_icons/bonus_'+modifierText+'.svg)';
	else
		item._htmlInputs.modifierValue.style.backgroundImage='none';
}

function buildHtmlElements(item, onCommit){
 item._htmlInputs={
  durability:SavegameUI.createItemInput(item, 'durability', 'Int', {min:1, max:item.getMaximumDurability(), label:_('Durability')}, onCommit),
  modifier:SavegameUI.createItemInput(item, 'modifier', 'Enum', {enumValues:Equipment.OPTIONS_MODIFIERS[item.category], label:_('Modifier')}, onCommit),
  modifierValue:SavegameUI.createItemInput(item, 'modifierValue', 'Int', {min:-1, max:2100000000, label:_('Modifier value')}, onCommit)
 };

 if(item.isFusable()){
  item._htmlInputs.fuseId=SavegameUI.createItemInput(item, 'fuseId', 'String64', {enumValues:Equipment.FUSABLE_ITEMS, label:_('Fusion')}, onCommit);
 }

 if(item.gainsFuseDurability()){
  item._htmlInputs.extraDurability=SavegameUI.createItemInput(
   item,
   'extraDurability',
   'Int',
   {min:0, max:item.getMaximumRecordDurability(), label:_('Current Fuse Durability')},
   onCommit
  );
  item._htmlInputs.recordExtraDurability=SavegameUI.createItemInput(
   item,
   'recordExtraDurability',
   'Int',
   {min:-1, max:item.getMaximumRecordDurability(), label:_('Max Fuse Durability')},
   onCommit
  );
 }

	item._htmlInputs.modifierValue.className+=' with-icon';
	item._htmlInputs.modifierValue.backgroundImage='none';
}

global.EquipmentUI={
	refreshInputs:refreshInputs,
	buildHtmlElements:buildHtmlElements
};

})(this);
