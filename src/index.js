import { SavegameEditor, getInternalCategoryId } from './totk.js';
import { Struct, Variable, hash, hashReverse } from './core/variables.js';
import { Locale, _ } from './core/locale.js';
import { Pouch } from './inventory/pouch.js';
import { Item } from './inventory/item.js';
import { Equipment } from './inventory/equipment.js';
import { Armor } from './inventory/armor.js';
import { Horse } from './inventory/horse.js';
import { AutoBuilder } from './features/autobuilder.js';
import { Completism, CompletismHashes } from './features/completism.js';
import { MapPin, Coordinates } from './features/coordinates.js';
import { ExperienceCalculator } from './features/exp-calculator.js';
import { TOTKMasterEditor } from './features/master.js';
import uiState from './ui-state.js';

Object.assign(window, {
	SavegameEditor,
	getInternalCategoryId,
	Struct,
	Variable,
	hash,
	hashReverse,
	Locale,
	_,
	Pouch,
	Item,
	Equipment,
	Armor,
	Horse,
	AutoBuilder,
	Completism,
	CompletismHashes,
	MapPin,
	Coordinates,
	ExperienceCalculator,
	TOTKMasterEditor,
	uiState
});

const existingCoreScript=document.querySelector('script[data-savegame-core]');
if(!existingCoreScript){
	const coreScript=document.createElement('script');
	coreScript.src=new URL('../lib/savegame-editor.js?version=1', import.meta.url).href;
	coreScript.defer=true;
	coreScript.dataset.savegameCore='true';
	document.head.appendChild(coreScript);
}

export {
	SavegameEditor,
	getInternalCategoryId,
	Struct,
	Variable,
	hash,
	hashReverse,
	Locale,
	_,
	Pouch,
	Item,
	Equipment,
	Armor,
	Horse,
	AutoBuilder,
	Completism,
	CompletismHashes,
	MapPin,
	Coordinates,
	ExperienceCalculator,
	TOTKMasterEditor,
	uiState
};
