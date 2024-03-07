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
                // if(!mappedItem){
                //     console.log("key: ", key, " | item: ", item);
                //     console.error("ToVUActor.mjs ||| Error in Map Functoin");
                //     console.log("type: ", type, " | object: ", mappedObjects, " | Location: ", jsonLocation, mappedItem);
                //     continue;
                // }
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

        // Setting up tools section
        const artisanToolMap = {
            "alch": {label: game.i18n.localize("tovu.tools.artisan.alch"), value: false},
            "brew": {label: game.i18n.localize("tovu.tools.artisan.brew"), value: false},
            "call": {label: game.i18n.localize("tovu.tools.artisan.call"), value: false},
            "carp": {label: game.i18n.localize("tovu.tools.artisan.carp"), value: false},
            "cart": {label: game.i18n.localize("tovu.tools.artisan.cart"), value: false},
            "cobb": {label: game.i18n.localize("tovu.tools.artisan.cobb"), value: false},
            "cook": {label: game.i18n.localize("tovu.tools.artisan.cook"), value: false},
            "glas": {label: game.i18n.localize("tovu.tools.artisan.glas"), value: false},
            "jewe": {label: game.i18n.localize("tovu.tools.artisan.jewe"), value: false},
            "leat": {label: game.i18n.localize("tovu.tools.artisan.leat"), value: false},
            "maso": {label: game.i18n.localize("tovu.tools.artisan.maso"), value: false},
            "pain": {label: game.i18n.localize("tovu.tools.artisan.pain"), value: false},
            "pott": {label: game.i18n.localize("tovu.tools.artisan.pott"), value: false},
            "smit": {label: game.i18n.localize("tovu.tools.artisan.smit"), value: false},
            "tink": {label: game.i18n.localize("tovu.tools.artisan.tink"), value: false},
            "weav": {label: game.i18n.localize("tovu.tools.artisan.weav"), value: false},
            "wood": {label: game.i18n.localize("tovu.tools.artisan.wood"), value: false}
        }
        const uniqueToolMap = {
            "disg": {label: game.i18n.localize("tovu.tools.disg"), value: false},
            "forg": {label: game.i18n.localize("tovu.tools.forg"), value: false},
            "herb": {label: game.i18n.localize("tovu.tools.herb"), value: false},
            "navi": {label: game.i18n.localize("tovu.tools.navi"), value: false},
            "pois": {label: game.i18n.localize("tovu.tools.pois"), value: false},
            "thie": {label: game.i18n.localize("tovu.tools.thie"), value: false}
        }
        const gamingMap = {
            "dice": {label: game.i18n.localize("tovu.tools.gaming.dice"), value: false},
            "drag": {label: game.i18n.localize("tovu.tools.gaming.drag"), value: false},
            "play": {label: game.i18n.localize("tovu.tools.gaming.play"), value: false},
            "3dra": {label: game.i18n.localize("tovu.tools.gaming.3dra"), value: false}
        }
        const instrumentMap = {
            "bagp": {label: game.i18n.localize("tovu.tools.instruments.bagp"), value: false},
            "drum": {label: game.i18n.localize("tovu.tools.instruments.drum"), value: false},
            "dulc": {label: game.i18n.localize("tovu.tools.instruments.dulc"), value: false},
            "flut": {label: game.i18n.localize("tovu.tools.instruments.flut"), value: false},
            "lute": {label: game.i18n.localize("tovu.tools.instruments.lute"), value: false},
            "lyre": {label: game.i18n.localize("tovu.tools.instruments.lyre"), value: false},
            "horn": {label: game.i18n.localize("tovu.tools.instruments.horn"), value: false},
            "panF": {label: game.i18n.localize("tovu.tools.instruments.panF"), value: false},
            "shaw": {label: game.i18n.localize("tovu.tools.instruments.shaw"), value: false},
            "viol": {label: game.i18n.localize("tovu.tools.instruments.viol"), value: false}
        }
        const vehicleMap = {
            "land": {label: game.i18n.localize("tovu.tools.vehicle.land"), value: false},
            "wate": {label: game.i18n.localize("tovu.tools.vehicle.wate"), value: false}
        }
        mapItems('tools', artisanToolMap, systemData.gear.tools.artisan);
        mapItems('tools', uniqueToolMap, systemData.gear.tools);
        mapItems('tools', gamingMap, systemData.gear.tools.gaming);
        mapItems('tools', instrumentMap, systemData.gear.tools.instruments);
        mapItems('tools', vehicleMap, systemData.gear.tools.vehicles);
        // console.log(systemData);
    }
}
