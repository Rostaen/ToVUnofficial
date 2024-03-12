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

        //Mapping Sizes
        systemData.details.size = {
            'tiny': {label: game.i18n.localize("tovu.size.values.tiny")},
            'smal': {label: game.i18n.localize("tovu.size.values.smal")},
            'medi': {label: game.i18n.localize("tovu.size.values.medi")},
            'larg': {label: game.i18n.localize("tovu.size.values.larg")},
            'huge': {label: game.i18n.localize("tovu.size.values.huge")},
            'garg': {label: game.i18n.localize("tovu.size.values.garg")}
        };

        //Mapping Senses
        console.log("Checking Actor >>> ", actorData.system);
        const senseMap = {
            "values": {
                "blin": {label: game.i18n.localize("tovu.senses.values.blin")},
                "dark": {label: game.i18n.localize("tovu.senses.values.dark")},
                "supe": {label: game.i18n.localize("tovu.senses.values.supe")},
                "trem": {label: game.i18n.localize("tovu.senses.values.trem")},
                "true": {label: game.i18n.localize("tovu.senses.values.true")}
            }
        }
        mapItems('senses', senseMap, systemData.senses);

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
            "alch": {label: game.i18n.localize("tovu.tools.artisan.alch")},
            "brew": {label: game.i18n.localize("tovu.tools.artisan.brew")},
            "call": {label: game.i18n.localize("tovu.tools.artisan.call")},
            "carp": {label: game.i18n.localize("tovu.tools.artisan.carp")},
            "cart": {label: game.i18n.localize("tovu.tools.artisan.cart")},
            "cobb": {label: game.i18n.localize("tovu.tools.artisan.cobb")},
            "cook": {label: game.i18n.localize("tovu.tools.artisan.cook")},
            "glas": {label: game.i18n.localize("tovu.tools.artisan.glas")},
            "jewe": {label: game.i18n.localize("tovu.tools.artisan.jewe")},
            "leat": {label: game.i18n.localize("tovu.tools.artisan.leat")},
            "maso": {label: game.i18n.localize("tovu.tools.artisan.maso")},
            "pain": {label: game.i18n.localize("tovu.tools.artisan.pain")},
            "pott": {label: game.i18n.localize("tovu.tools.artisan.pott")},
            "smit": {label: game.i18n.localize("tovu.tools.artisan.smit")},
            "tink": {label: game.i18n.localize("tovu.tools.artisan.tink")},
            "weav": {label: game.i18n.localize("tovu.tools.artisan.weav")},
            "wood": {label: game.i18n.localize("tovu.tools.artisan.wood")}
        }
        const uniqueToolMap = {
            "disg": {label: game.i18n.localize("tovu.tools.disg")},
            "forg": {label: game.i18n.localize("tovu.tools.forg")},
            "herb": {label: game.i18n.localize("tovu.tools.herb")},
            "navi": {label: game.i18n.localize("tovu.tools.navi")},
            "pois": {label: game.i18n.localize("tovu.tools.pois")},
            "thie": {label: game.i18n.localize("tovu.tools.thie")}
        }
        const gamingMap = {
            "dice": {label: game.i18n.localize("tovu.tools.gaming.dice")},
            "drag": {label: game.i18n.localize("tovu.tools.gaming.drag")},
            "play": {label: game.i18n.localize("tovu.tools.gaming.play")},
            "3dra": {label: game.i18n.localize("tovu.tools.gaming.3dra")}
        }
        const instrumentMap = {
            "bagp": {label: game.i18n.localize("tovu.tools.instruments.bagp")},
            "drum": {label: game.i18n.localize("tovu.tools.instruments.drum")},
            "dulc": {label: game.i18n.localize("tovu.tools.instruments.dulc")},
            "flut": {label: game.i18n.localize("tovu.tools.instruments.flut")},
            "lute": {label: game.i18n.localize("tovu.tools.instruments.lute")},
            "lyre": {label: game.i18n.localize("tovu.tools.instruments.lyre")},
            "horn": {label: game.i18n.localize("tovu.tools.instruments.horn")},
            "panF": {label: game.i18n.localize("tovu.tools.instruments.panF")},
            "shaw": {label: game.i18n.localize("tovu.tools.instruments.shaw")},
            "viol": {label: game.i18n.localize("tovu.tools.instruments.viol")}
        }
        const vehicleMap = {
            "land": {label: game.i18n.localize("tovu.tools.vehicle.land")},
            "wate": {label: game.i18n.localize("tovu.tools.vehicle.wate")}
        }
        mapItems('tools', artisanToolMap, systemData.gear.tools.artisan);
        mapItems('tools', uniqueToolMap, systemData.gear.tools);
        mapItems('tools', gamingMap, systemData.gear.tools.gaming);
        mapItems('tools', instrumentMap, systemData.gear.tools.instruments);
        mapItems('tools', vehicleMap, systemData.gear.tools.vehicles);
        // console.log(systemData);
    }
}
