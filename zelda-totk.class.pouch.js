/*
	The legend of Zelda: Tears of the Kingdom savegame editor - Pouch class (last update 2023-09-02)

	by Marc Robledo 2023
item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
filterable item dropdown by xiyuesaves
*/

(function(global){
'use strict';

function Pouch(catId){
	this.category=catId;
	this.read();
}
Pouch.prototype.read=function(){
	var categoryItemStructId=Pouch.getCategoryItemStructId(this.category);
	
	this.struct=(new Struct(Pouch.getCategoryStructId(this.category), [{
		structArray:categoryItemStructId,
		variablesInfo:Pouch.getCategoryStruct(this.category)
	}]));
	
	var structExported=this.struct.export();
	this.items=[];
	this.maxSize=structExported[categoryItemStructId].length;

	for(var i=0; i<this.maxSize; i++){
		if(structExported[categoryItemStructId][i].id)
			this.add(structExported[categoryItemStructId][i]);
		else
			break;
	}

	return this.items;
}
Pouch.prototype.isEmpty=function(){
	return !this.items.length;
}
Pouch.prototype.isFull=function(){
	return this.items.length===this.maxSize;
}
Pouch.prototype.getLast=function(){
	if(this.isEmpty())
		return null;
	return this.items[this.items.length-1];
}
Pouch.prototype.findItemById=function(itemId){
	for(var i=0; i<this.items.length; i++){
		if(this.items[i].id===itemId)
			return this.items[i];
	}
	return null;
}
Pouch.prototype.add=function(pouchItemData){
	if(this.isFull())
		return null;

	var newItem;
	if(this.category==='weapons' || this.category==='bows' || this.category==='shields')
		newItem=new Equipment(this.category, pouchItemData);
	else if(this.category==='armors')
		newItem=new Armor(pouchItemData);
	else if(this.category==='arrows' || this.category==='materials' || this.category==='food' || this.category==='devices' || this.category==='key')
		newItem=new Item(this.category, pouchItemData);
	else if(this.category==='horses')
		newItem=new Horse(pouchItemData);
	else
		throw new Error('Invalid pouch item category');

	this.items.push(newItem);
	return newItem;
}
Pouch.prototype.remove=function(index){
	if(typeof index==='object'){
		index=this.items.indexOf(index);
		if(index===-1)
			throw new Error('Item not found in pouch '+this.category);
	}
	if(this.items.length<2 || index>=this.items.length)
		return false;

	var removedItem=this.items[index];
	this.items.splice(index,1);

	return removedItem;
}
Pouch.prototype.save=function(){
	for(var i=0; i<this.items.length; i++){
		for(var j=0; j<this.struct._originalStructData[0].variablesInfo.length; j++){
			var propertyName=this.struct._originalStructData[0].variablesInfo[j].propertyName;
			if(this.struct._originalStructData[0].variablesInfo[j].arrayPartitionSize){
				var arrayPartitionSize=this.struct._originalStructData[0].variablesInfo[j].arrayPartitionSize;
				for(var k=0; k<arrayPartitionSize; k++){
					this.struct.variables[0].variables[j].value[i * arrayPartitionSize + k]=this.items[i][propertyName][k];
				}
			}else{
				this.struct.variables[0].variables[j].value[i]=this.items[i][propertyName];
			}
		}
	}
	for(; i<this.maxSize; i++){
		this.struct.variables[0].variables[0].value[i]=''; //remove empty items
	}

	this.struct.saveAll();
}
Pouch.getCategoryStruct=function(catId){
	if(catId==='weapons'){
		return Pouch.Structs.WEAPONS;
	}else if(catId==='bows'){
		return Pouch.Structs.BOWS;
	}else if(catId==='shields'){
		return Pouch.Structs.SHIELDS;
	}else if(catId==='armors'){
		return Pouch.Structs.ARMORS;
	}else if(catId==='arrows'){
		return Pouch.Structs.ARROWS;
	}else if(catId==='materials'){
		return Pouch.Structs.MATERIALS;
	}else if(catId==='food'){
		return Pouch.Structs.FOOD;
	}else if(catId==='devices'){
		return Pouch.Structs.DEVICES;
	}else if(catId==='key'){
		return Pouch.Structs.KEY;
	}else if(catId==='horses'){
		return Pouch.Structs.HORSES;
	}else{
		throw new Error('Invalid pouch category: '+catId);
	}
}
Pouch.getCategoryStructId=function(catId){
	return 'pouch'+(catId.charAt(0).toUpperCase() +catId.slice(1));
}
Pouch.getCategoryItemStructId=function(catId){
	return 'item'+(catId.charAt(0).toUpperCase() +catId.slice(1));
}















	
Pouch.Structs=Object.freeze({
	WEAPONS:[
		{hash:'Pouch.Weapon.Content.Name', type:'String64Array', propertyName:'id'},
		{hash:'Pouch.Weapon.Content.Life', type:'IntArray', propertyName:'durability'},
		{hash:'Pouch.Weapon.Content.Effect.Type', type:'EnumArray', propertyName:'modifier', enumValues:['None','AttackUp','AttackUpPlus','DurabilityUp','DurabilityUpPlus','FinishBlow','LongThrow']},
		{hash:'Pouch.Weapon.Content.Effect.Value', type:'IntArray', propertyName:'modifierValue'},
		{hash:'Pouch.Weapon.Content.Combined.Name', type:'String64Array', propertyName:'fuseId'},
		{hash:'Pouch.Weapon.Content.Combined.Life', type:'IntArray', propertyName:'fuseDurability'},
		{hash:'Pouch.Weapon.Content.ExtraLife', type:'IntArray', propertyName:'extraDurability'},
		{hash:'Pouch.Weapon.Content.RecordExtraLife', type:'IntArray', propertyName:'recordExtraDurability'}
	],

	BOWS:[
		{hash:'Pouch.Bow.Content.Name', type:'String64Array', propertyName:'id'},
		{hash:'Pouch.Bow.Content.Life', type:'IntArray', propertyName:'durability'},
		{hash:'Pouch.Bow.Content.Effect.Type', type:'EnumArray', propertyName:'modifier', enumValues:['None','AttackUp','AttackUpPlus','DurabilityUp','DurabilityUpPlus','RapidFire','FiveWay']},
		{hash:'Pouch.Bow.Content.Effect.Value', type:'IntArray', propertyName:'modifierValue'}
	],

	SHIELDS:[
		{hash:'Pouch.Shield.Content.Name', type:'String64Array', propertyName:'id'},
		{hash:'Pouch.Shield.Content.Life', type:'IntArray', propertyName:'durability'},
		{hash:'Pouch.Shield.Content.Effect.Type', type:'EnumArray', propertyName:'modifier', enumValues:['None','DurabilityUp','DurabilityUpPlus','GuardUp','GuardUpPlus']},
		{hash:'Pouch.Shield.Content.Effect.Value', type:'IntArray', propertyName:'modifierValue'},
		{hash:'Pouch.Shield.Content.Combined.Name', type:'String64Array', propertyName:'fuseId'},
		{hash:'Pouch.Shield.Content.Combined.Life', type:'IntArray', propertyName:'fuseDurability'},
		{hash:'Pouch.Shield.Content.ExtraLife', type:'IntArray', propertyName:'extraDurability'}
	],

	ARMORS:[
		{hash:'Pouch.Armor.Content.Name', type:'String64Array', propertyName:'id'},
		{hash:'Pouch.Armor.Content.ColorVariation', type:'EnumArray', propertyName:'dyeColor', enumValues:['None','Blue','Red','Yellow','White','Black','Purple','Green','LightBlue','Navy','Orange','Pink','Crimson','LightYellow','Brown','Gray']}
	],

	ARROWS:[
		{hash:'Pouch.Arrow.Content.Name', type:'String64Array', propertyName:'id'},
		{hash:'Pouch.Arrow.Content.StockNum', type:'IntArray', propertyName:'quantity'}
	],

	MATERIALS:[
		{hash:'Pouch.Material.Content.Name', type:'String64Array', propertyName:'id'},
		{hash:'Pouch.Material.Content.StockNum', type:'IntArray', propertyName:'quantity'},
		{hash:'Pouch.Material.Content.GetOrder', type:'IntArray', propertyName:'getOrder'},
		{hash:'Pouch.Material.Content.UseOrder', type:'IntArray', propertyName:'useOrder'}
	],

	FOOD:[
		{hash:'Pouch.Food.Content.Name', type:'String64Array', propertyName:'id'},
		{hash:'Pouch.Food.Content.StockNum', type:'IntArray', propertyName:'quantity'},
		{hash:'Pouch.Food.Content.LifeRecover', type:'IntArray', propertyName:'heartsHeal'},
		{hash:'Pouch.Food.Content.Effect.Type', type:'EnumArray', propertyName:'effect', enumValues:['None','ResistHot','ResistBurn','ResistCold','ResistElectric','ResitLightning','ResistFreeze','SwimSpeedUp','DecreaseSwimStamina','ClimbSpeedUp','AttackUp','AttackUpCold','AttackUpHot','AttackUpThunderstorm','QuietnessUp','SandMoveUp','SnowMoveUp','DefenseUp','AllSpeed','MiasmaGuard','LifeMaxUp','StaminaRecover','ExStaminaMaxUp','LifeRepair','DivingMobilityUp','NotSlippy','LightEmission','RupeeGuard','SwordBeamUp','NightMoveSpeedUp','DecreaseWallJumpStamina','DecreaseChargeAttackStamina','NoBurning','NoFallDamage','NoSlip','DecreaseZonauEnergy','ZonauEnergyHealUp','MiasmaDefenseUp','ChargePowerUpCold','ChargePowerUpHot','ChargePowerUpThunderstorm','LightFootprint']},
		{hash:'Pouch.Food.Content.Effect.Level', type:'IntArray', propertyName:'effectMultiplier'},
		{hash:'Pouch.Food.Content.Effect.Time', type:'IntArray', propertyName:'effectTime'}, // in seconds
		{hash:'Pouch.Food.Content.Price', type:'IntArray', propertyName:'price'},
		{hash:'Pouch.Food.Content.MaterialName', type:'String64Array', propertyName:'recipe', arrayPartitionSize:5}
	],

	DEVICES:[
		{hash:'Pouch.SpecialParts.Content.Name', type:'String64Array', propertyName:'id'},
		{hash:'Pouch.SpecialParts.Content.StockNum', type:'IntArray', propertyName:'quantity'},
		{hash:'Pouch.SpecialParts.Content.UseOrder', type:'IntArray', propertyName:'useOrder'}
	],

	KEY:[
		{hash:'Pouch.KeyItem.Content.Name', type:'String64Array', propertyName:'id'},
		{hash:'Pouch.KeyItem.Content.StockNum', type:'IntArray', propertyName:'quantity'}
	],

	HORSES:[
		{hash:'OwnedHorseList.ActorName', type:'String64Array', propertyName:'id'},
		{hash:'OwnedHorseList.Name', type:'WString16Array', propertyName:'name'},
		{hash:'OwnedHorseList.Mane', type:'EnumArray', propertyName:'mane', enumValues:['None','Horse_Link_Mane','Horse_Link_Mane_01','Horse_Link_Mane_02','Horse_Link_Mane_03','Horse_Link_Mane_04','Horse_Link_Mane_05','Horse_Link_Mane_06','Horse_Link_Mane_07','Horse_Link_Mane_08','Horse_Link_Mane_09','Horse_Link_Mane_10','Horse_Link_Mane_11','Horse_Link_Mane_12','Horse_Link_Mane_00L','Horse_Link_Mane_01L','Horse_Link_Mane_00S']},
		{hash:'OwnedHorseList.Saddle', type:'EnumArray', propertyName:'saddles', enumValues:['None','GameRomHorseSaddle_00','GameRomHorseSaddle_01','GameRomHorseSaddle_02','GameRomHorseSaddle_03','GameRomHorseSaddle_04','GameRomHorseSaddle_05','GameRomHorseSaddle_06','GameRomHorseSaddle_07','GameRomHorseSaddle_00L','GameRomHorseSaddle_00S']},
		{hash:'OwnedHorseList.Rein', type:'EnumArray', propertyName:'reins', enumValues:['None','GameRomHorseReins_00','GameRomHorseReins_01','GameRomHorseReins_02','GameRomHorseReins_03','GameRomHorseReins_04','GameRomHorseReins_05','GameRomHorseReins_06','GameRomHorseReins_00L','GameRomHorseReins_00S']},
		{hash:'OwnedHorseList.Familiarity', type:'FloatArray', propertyName:'bond'},
		{hash:'OwnedHorseList.IsFamiliarityChecked', type:'BoolArray', propertyName:'bondChecked'},
		{hash:'OwnedHorseList.Toughness', type:'IntArray', propertyName:'statsStrength'},
		{hash:'OwnedHorseList.Speed', type:'IntArray', propertyName:'statsSpeed'},
		{hash:'OwnedHorseList.ChargeNum', type:'IntArray', propertyName:'statsStamina'},
		{hash:'OwnedHorseList.HorsePower', type:'IntArray', propertyName:'statsPull'},
		{hash:'OwnedHorseList.HorseType', type:'IntArray', propertyName:'horseType'},
		{hash:'OwnedHorseList.ColorType', type:'IntArray', propertyName:'colorType'}, // cannot be zero!
		{hash:'OwnedHorseList.FootType', type:'IntArray', propertyName:'footType'},
		{hash:'OwnedHorseList.UidHash', type:'UInt64Array', propertyName:'amiiboUidHash'},
		{hash:'OwnedHorseList.RoomID', type:'IntArray', propertyName:'roomId'},

		{hash:'OwnedHorseList.Body.Pattern', type:'EnumArray', propertyName:'iconPattern', enumValues:['00','01','02','03','04','05','06']},
		{hash:'OwnedHorseList.Body.EyeColor', type:'EnumArray', propertyName:'iconEyeColor', enumValues:['Black','Blue']},
		{hash:'OwnedHorseList.Body.PrimaryColor.Red', type:'UIntArray', propertyName:'iconPrimaryColorRed'},
		{hash:'OwnedHorseList.Body.PrimaryColor.Green', type:'UIntArray', propertyName:'iconPrimaryColorGreen'},
		{hash:'OwnedHorseList.Body.PrimaryColor.Blue', type:'UIntArray', propertyName:'iconPrimaryColorBlue'},
		{hash:'OwnedHorseList.Body.SecondaryColor.Red', type:'UIntArray', propertyName:'iconSecondaryColorRed'},
		{hash:'OwnedHorseList.Body.SecondaryColor.Green', type:'UIntArray', propertyName:'iconSecondaryColorGreen'},
		{hash:'OwnedHorseList.Body.SecondaryColor.Blue', type:'UIntArray', propertyName:'iconSecondaryColorBlue'},
		{hash:'OwnedHorseList.Body.NoseColor.Red', type:'UIntArray', propertyName:'iconNoseColorRed'},
		{hash:'OwnedHorseList.Body.NoseColor.Green', type:'UIntArray', propertyName:'iconNoseColorGreen'},
		{hash:'OwnedHorseList.Body.NoseColor.Blue', type:'UIntArray', propertyName:'iconNoseColorBlue'},
		{hash:'OwnedHorseList.Hair.PrimaryColor.Red', type:'UIntArray', propertyName:'iconHairPrimaryColorRed'},
		{hash:'OwnedHorseList.Hair.PrimaryColor.Green', type:'UIntArray', propertyName:'iconHairPrimaryColorGreen'},
		{hash:'OwnedHorseList.Hair.PrimaryColor.Blue', type:'UIntArray', propertyName:'iconHairPrimaryColorBlue'},
	{hash:'OwnedHorseList.Hair.SecondaryColor.Red', type:'UIntArray', propertyName:'iconHairSecondaryColorRed'},
	{hash:'OwnedHorseList.Hair.SecondaryColor.Green', type:'UIntArray', propertyName:'iconHairSecondaryColorGreen'},
	{hash:'OwnedHorseList.Hair.SecondaryColor.Blue', type:'UIntArray', propertyName:'iconHairSecondaryColorBlue'}
	]
});

global.Pouch=Pouch;
})(this);
