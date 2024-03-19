import { tovu } from "../config.mjs";

export class ToVUActor extends Actor {

    prepareData(){
        super.prepareData();
    }

    prepareBaseData(){

    }

    prepareDerivedData(){
        const actorData = this;
        const systemData = actorData.system;
        const flags = actorData.flags.tovu || {};

        this._prepareCharacterData(actorData);
        //this._prepareNpcData(actorData);
    }

    _prepareCharacterData(actorData) {
        const systemData = actorData.system;

        // Setting base AC
        systemData.ac.value = 10 + systemData.abilities.dex.mod;
        systemData.ac.modifiers.forEach(element => {
            systemData.ac.value += element;
        });

        // Function for mapping items into the database
        const mapItems = (type, mappedObjects, jsonLocation) => {
            for (let [key, item] of Object.entries(jsonLocation)){
                const mappedItem = mappedObjects[key];
                if(type === 'skill'){
                    const statMod = systemData.abilities[mappedItem.core].mod;
                    const profBase = systemData.proficiency.base;
                    switch (item.proficiency) {
                        case 0:
                            item.value = statMod;
                            break;
                        case 1:
                            item.value = statMod + profBase;
                            break;
                        case 2:
                            item.value = statMod + (profBase * 2);
                            break;
                        case 0.5:
                            item.value = statMod + Math.floor(profBase / 2);
                            break;
                    }
                    item.passive = item.value + 10;
                }else if(type === 'ability'){
                    item.mod = Math.floor((item.value - 10) / 2);
                    item.save = item.mod + (item.proficient === 1 ? systemData.proficiency.base : 0);
                }
                Object.assign(item, mappedItem);
            }
        }

        //Labeling Stats from shorthand
        const statMap = {
            'str': { label: game.i18n.localize("tovu.abilityShortHand.str") },
            'dex': { label: game.i18n.localize("tovu.abilityShortHand.dex") },
            'con': { label: game.i18n.localize("tovu.abilityShortHand.con") },
            'int': { label: game.i18n.localize("tovu.abilityShortHand.int") },
            'wis': { label: game.i18n.localize("tovu.abilityShortHand.wis") },
            'cha': { label: game.i18n.localize("tovu.abilityShortHand.cha") }
        };
        mapItems('ability', statMap, systemData.abilities);

        if(actorData.type !== 'character') return;

        // Map skill keys to labels and core attributes
        const skillMap = {
            'acr': { label: game.i18n.localize("tovu.skills.acr"), core: "dex" },
            'ani': { label: game.i18n.localize("tovu.skills.ani"), core: "wis" },
            'arc': { label: game.i18n.localize("tovu.skills.arc"), core: "int" },
            'ath': { label: game.i18n.localize("tovu.skills.ath"), core: "str" },
            'dec': { label: game.i18n.localize("tovu.skills.dec"), core: "cha" },
            'his': { label: game.i18n.localize("tovu.skills.his"), core: "int" },
            'ins': { label: game.i18n.localize("tovu.skills.ins"), core: "wis" },
            'int': { label: game.i18n.localize("tovu.skills.int"), core: "cha" },
            'inv': { label: game.i18n.localize("tovu.skills.inv"), core: "int" },
            'med': { label: game.i18n.localize("tovu.skills.med"), core: "wis" },
            'nat': { label: game.i18n.localize("tovu.skills.nat"), core: "int" },
            'per': { label: game.i18n.localize("tovu.skills.per"), core: "wis" },
            'prf': { label: game.i18n.localize("tovu.skills.prf"), core: "cha" },
            'prs': { label: game.i18n.localize("tovu.skills.prs"), core: "cha" },
            'rel': { label: game.i18n.localize("tovu.skills.rel"), core: "int" },
            'soh': { label: game.i18n.localize("tovu.skills.soh"), core: "dex" },
            'ste': { label: game.i18n.localize("tovu.skills.ste"), core: "dex" },
            'sur': { label: game.i18n.localize("tovu.skills.sur"), core: "wis" }
        };
        mapItems('skill', skillMap, systemData.skills);
    }
}
