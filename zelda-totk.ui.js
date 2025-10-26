var SavegameUI=(function(core){
'use strict';

function getParasailPatternId(){
 if(!core || !core.parasailPattern)
  return null;
 var value=core.parasailPattern.value;
 if(typeof value==='string')
  return value;
 try{
  return hashReverse(value);
 }catch(err){
  return null;
 }
}

function getParasailPatternSelector(){
 return core? core._htmlSelectParasailPattern : null;
}

function editItem(item){
 if(core && typeof core.editItem==='function')
  core.editItem(item);
}

function openItemDropdown(item, anchor){
 if(!item)
  return;

 if(typeof currentEditingItem!=='undefined')
  currentEditingItem=item;

 var showDivider=false;
 if(item.category==='weapons'){
  $('#dropdown-item-button-pristine').show().prop('disabled', !item.canBeUndecayed());
  showDivider=true;
 }else{
  $('#dropdown-item-button-pristine').hide();
 }

 if(item.category==='weapons' || item.category==='bows' || item.category==='shields'){
  $('#dropdown-item-button-durability').show().prop('disabled', !item.canBeRestored());
  $('#dropdown-item-button-infinite').show().prop('disabled', !item.canBeSetToInfiniteDurability());
  showDivider=true;
 }else{
  $('#dropdown-item-button-durability').hide();
  $('#dropdown-item-button-infinite').hide();
 }

 if(item.category==='armors' && item.canBeUpgraded()){
  $('#dropdown-item-button-upgrade').show();
  showDivider=true;
 }else{
  $('#dropdown-item-button-upgrade').hide();
 }

 if(item.category==='weapons' || item.category==='bows' || item.category==='shields' || item.category==='food' || item.category==='horses'){
  $('#dropdown-item-button-duplicate').show();
  $('#dropdown-item-button-export').show();
  $('#dropdown-item-button-import').show();
  showDivider=true;
 }else{
  $('#dropdown-item-button-duplicate').hide();
  $('#dropdown-item-button-export').hide();
  $('#dropdown-item-button-import').hide();
 }

 if(showDivider)
  $('#dropdown-item .dropdown-divider').show();
 else
  $('#dropdown-item .dropdown-divider').hide();

 UI.dropdown('item', anchor || item._htmlRow);
}

function createItemInput(item, propertyName, type, options, onCommit){
 var elementTag=(typeof options.enumValues==='object')? 'select':'input';
 var className='full-width';
 if(type==='Int' || type==='UInt' || type==='Float')
  className+=' text-right';

 var input=document.createElement(elementTag);
 input.item=item;
 input.propertyName=propertyName;
 input.className=className;
 input._commitCallback=typeof onCommit==='function'? onCommit : function(){};

 if(typeof options.label==='string')
  input.title=options.label;

 if(elementTag==='select'){
  var unknownValue=true;
  var intValue=typeof item[propertyName]==='string'? hash(item[propertyName]) : item[propertyName];
  for(var i=0; i<options.enumValues.length; i++){
   if(typeof options.enumValues[i]==='number'){
    var optionNumber=document.createElement('option');
    optionNumber.value=options.enumValues[i];
    optionNumber.innerHTML=options.enumValues[i];
    input.appendChild(optionNumber);
   }else if(typeof options.enumValues[i]==='string'){
    var optionString=document.createElement('option');
    optionString.value=i;
    optionString.innerHTML=options.enumValues[i];
    input.appendChild(optionString);
   }else if(typeof options.enumValues[i]==='object' && typeof options.enumValues[i].value!=='undefined' && typeof options.enumValues[i].name!=='undefined'){
    var optionObject=document.createElement('option');
    optionObject.value=options.enumValues[i].value;
    optionObject.innerHTML=options.enumValues[i].name;
    input.appendChild(optionObject);
   }else if(typeof options.enumValues[i]==='object'){
    input.appendChild(options.enumValues[i]);
   }

   if(unknownValue && options.enumValues[i].value===item[propertyName]){
    unknownValue=false;
   }
  }

  if(unknownValue){
   var optionUnknown=document.createElement('option');
   optionUnknown.value=intValue;
   optionUnknown.innerHTML=Variable.toHexString(intValue);
   input.appendChild(optionUnknown);
  }

  input.isEnum=(type==='Enum');
  input.addEventListener('change', onInputSelectChange, false);
 }else{
  input.type=type==='Bool'? 'checkbox':'text';

  if(type==='Int' || type==='UInt' || type==='Float'){
   if(type==='UInt'){
    input.minValue=0;
    input.maxValue=4294967295;
   }else{
    input.minValue=-2147483648;
    input.maxValue=2147483647;
   }

   if(typeof options.min==='number')
    input.minValue=options.min;
   if(typeof options.max==='number')
    input.maxValue=options.max;
   if(type==='Float' && options.min===0 && options.max===100)
    input.percentage=true;

   input.floatValue=(type==='Float');
   input.addEventListener('change', onInputNumberChange, false);
  }else if(type==='String64' || type==='WString16'){
   if(typeof options.maxLength==='number')
    input.maxLength=options.maxLength;
   else if(type==='WString16')
    input.maxLength=16;
   else
    input.maxLength=64;
   input.addEventListener('change', onInputTextChange, false);
  }else{
   throw new Error('Invalid input value');
  }

  if(type==='Bool')
   input.checked=!!item[propertyName];
  else if(input.percentage)
   input.value=item[propertyName]*100;
  else
   input.value=item[propertyName];
 }

 return input;
}

function onInputSelectChange(){
 var newVal=this.isEnum? parseInt(this.value, 10) : this.value;
 this.item.lastInputChanged=this.propertyName;
 this.item[this.propertyName]=newVal;
 this._commitCallback(this.item);
}

function onInputNumberChange(){
 var newVal=this.value.replace(/[^0-9\-\.]/g, '');
 if(this.floatValue)
  newVal=parseFloat(newVal);
 else
  newVal=parseInt(newVal, 10);

 if(isNaN(newVal) || newVal<this.minValue)
  newVal=this.minValue;
 else if(newVal>this.maxValue)
  newVal=this.maxValue;

 if(newVal===-0)
  newVal=0;

 this.item.lastInputChanged=this.propertyName;
 if(this.percentage)
  this.item[this.propertyName]=newVal/100;
 else
  this.item[this.propertyName]=newVal;

 if(this.percentage)
  this.value=this.item[this.propertyName]*100;
 else
  this.value=this.item[this.propertyName];

 this._commitCallback(this.item);
}

function onInputTextChange(){
 var newVal=this.value.substr(0, this.maxLength);
 if(!newVal)
  newVal='a';

 this.item.lastInputChanged=this.propertyName;
 this.item[this.propertyName]=newVal;
 this.value=newVal;
 this._commitCallback(this.item);
}

return{
 editItem:editItem,
 openItemDropdown:openItemDropdown,
 createItemInput:createItemInput,
 getParasailPatternId:getParasailPatternId,
 getParasailPatternSelector:getParasailPatternSelector
};

})(SavegameEditor);
