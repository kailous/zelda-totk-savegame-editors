(function(global){
'use strict';

function refreshInputs(item, fixValues){
 if(!item._htmlInputs)
  return;

 if(fixValues){
  var defaultValues=Horse.DEFAULT_VALUES[item.id] || Horse.DEFAULT_VALUES['GameRomHorse'];
  if(defaultValues.horseType)
   item.horseType=defaultValues.horseType;
  if(defaultValues.mane)
   item.mane=defaultValues.mane;
  if(defaultValues.saddles)
   item.saddles=defaultValues.saddles;
  if(defaultValues.reins)
   item.reins=defaultValues.reins;
 }

 item._htmlInputs.colorType.disabled=(item.horseType!==Horse.TYPE_NORMAL);
 item._htmlInputs.footType.disabled=(item.horseType!==Horse.TYPE_NORMAL);
}

function buildHtmlElements(item, onCommit){
 item._htmlInputs={
  name:SavegameUI.createItemInput(item, 'name', 'WString16', {maxLength:9, label:_('Horse name')}, onCommit),
  mane:SavegameUI.createItemInput(item, 'mane', 'Enum', {enumValues:Horse.MANES, label:_('Mane')}, onCommit),
  saddles:SavegameUI.createItemInput(item, 'saddles', 'Enum', {enumValues:Horse.SADDLES, label:_('Saddle')}, onCommit),
  reins:SavegameUI.createItemInput(item, 'reins', 'Enum', {enumValues:Horse.REINS, label:_('Reins')}, onCommit),
  bond:SavegameUI.createItemInput(item, 'bond', 'Float', {min:0, max:100, label:_('Bond')}, onCommit),
  statsStrength:SavegameUI.createItemInput(item, 'statsStrength', 'Int', {min:100, max:350, label:_('Stats: Strength')}, onCommit),
  statsSpeed:SavegameUI.createItemInput(item, 'statsSpeed', 'Int', {enumValues:Horse.OPTIONS_STATS, label:_('Stats: Speed')}, onCommit),
  statsStamina:SavegameUI.createItemInput(item, 'statsStamina', 'Int', {enumValues:Horse.OPTIONS_STATS_STAMINA, label:_('Stats: Stamina')}, onCommit),
  statsPull:SavegameUI.createItemInput(item, 'statsPull', 'Int', {enumValues:Horse.OPTIONS_STATS, label:_('Stats: Pull')}, onCommit),
  colorType:SavegameUI.createItemInput(item, 'colorType', 'Int', {min:0, max:40, label:_('Horse color')}, onCommit),
  footType:SavegameUI.createItemInput(item, 'footType', 'Int', {min:0, max:1, label:_('Foot type')}, onCommit)
 };
}

global.HorseUI={
 refreshInputs:refreshInputs,
 buildHtmlElements:buildHtmlElements
};

})(this);
