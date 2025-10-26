(function(global){
'use strict';

const ICON_PATH='./assets/item_icons/';

function getItemIcon(item){
	if(item.id==='Parasail'){
		var parasailPattern=SavegameUI.getParasailPatternId();
		if(parasailPattern && parasailPattern!=='Default'){
			return ICON_PATH + item.category + '/' + item.id + '_' + parasailPattern + '.png';
		}
		return ICON_PATH + item.category + '/' + item.id + '.png';
	}

	if(item.category==='armors'){
		if(item.dyeColor===hash('None')){
			return ICON_PATH + item.category + '/' + item.getBaseId() + '.png';
		}
		return ICON_PATH + item.category + '/dye/' + item.getBaseId() + '_' + hashReverse(item.dyeColor) + '.png';
	}

	if(item.category==='food' && item.id==='Item_Cook_C_17' && Item.VALID_ELIXIR_EFFECTS.indexOf(hashReverse(item.effect))!==-1){
		return ICON_PATH + item.category + '/Item_Cook_C_17_' + hashReverse(item.effect) + '.png';
	}

	return ICON_PATH + item.category + '/' + item.id + '.png';
}

function updateItemIcon(item){
	if(item._htmlIcon){
		item._htmlIcon.src=getItemIcon(item);
	}
}

function buildItemControls(item){
	var commit=function(){
		updateItemRow(item);
	};

	if(item.category==='weapons' || item.category==='shields' || item.category==='bows'){
		EquipmentUI.buildHtmlElements(item, commit);
	}else if(item.category==='armors'){
		ArmorUI.buildHtmlElements(item, commit);
	}else if(item.category==='horses'){
		HorseUI.buildHtmlElements(item, commit);
	}else{
		ItemUI.buildHtmlElements(item, commit);
	}
}

function updateItemRow(item){
	if(!item._htmlRow){
		item._htmlIcon=new Image();
		item._htmlIcon.className='item-icon';
		item._htmlIcon.loading='lazy';
		item._htmlIcon.onerror=function(){
			this.src=ICON_PATH+'unknown.png';
		};

		item._htmlItemId=document.createElement('span');
		item._htmlItemId.className='item-name clickable';
		item._htmlItemId.innerHTML=item.getItemTranslation();
		if(item.getItemTranslation()===item.id)
			item._htmlItemId.style.color='red';
		item._htmlItemId.addEventListener('click', function(){
			SavegameUI.editItem(item);
		}, false);

		var lastColumn=document.createElement('div');
		buildItemControls(item);
		$(lastColumn).append(Object.values(item._htmlInputs));
		if(item.category==='key' && item.id==='Parasail'){
			var selector=SavegameUI.getParasailPatternSelector();
			if(selector)
				$(lastColumn).append(selector);
		}

		item._htmlRow=document.createElement('div');
		item._htmlRow.className='row row-item';
		var columnLeft=document.createElement('div');
		var columnRight=document.createElement('div');
		item._htmlRow.appendChild(columnLeft);
		item._htmlRow.appendChild(columnRight);
		columnLeft.appendChild(item._htmlIcon);
		columnLeft.appendChild(item._htmlItemId);
		columnRight.appendChild(lastColumn);
		columnLeft.className='row-item-left';
		columnRight.className='row-item-right row-item-right-'+item.category;

		item._htmlMenuButton=document.createElement('button');
		item._htmlMenuButton.appendChild(UI.octicon('kebab_vertical'));
		item._htmlMenuButton.className='btn-menu-floating';
		item._htmlMenuButton.addEventListener('click', function(evt){
			evt.stopPropagation();
			SavegameUI.openItemDropdown(item, item._htmlRow);
		});
		item._htmlRow.appendChild(item._htmlMenuButton);

		refreshItemInputs(item, false);
		updateItemIcon(item);
	}else{
		refreshItemInputs(item, true);
	}

	item._htmlItemId.innerHTML=item.getItemTranslation();

	for(var prop in item._htmlInputs){
		if(item._htmlInputs[prop].percentage){
			if(item._htmlInputs[prop].value!==item[prop]*100)
				item._htmlInputs[prop].value=item[prop]*100;
		}else if(item._htmlInputs[prop].value!==item[prop]){
			item._htmlInputs[prop].value=item[prop];
		}
	}

	item.lastInputChanged=null;

	return item._htmlRow;
}

function refreshItemInputs(item, fixValues){
	if(item.category==='weapons' || item.category==='shields' || item.category==='bows'){
		EquipmentUI.refreshInputs(item, fixValues);
	}else if(item.category==='armors'){
		ArmorUI.refreshInputs(item, fixValues);
	}else if(item.category==='horses'){
		HorseUI.refreshInputs(item, fixValues);
	}else{
		ItemUI.refreshInputs(item, fixValues);
	}
}

function scrollToItem(item){
	if(item && item._htmlRow && item._htmlRow.scrollIntoView)
		item._htmlRow.scrollIntoView({behavior:'smooth', block:'start'});
}

global.PouchUI={
	getItemIcon:getItemIcon,
	updateItemIcon:updateItemIcon,
	updateItemRow:updateItemRow,

	scrollToItem:scrollToItem
};

})(this);
