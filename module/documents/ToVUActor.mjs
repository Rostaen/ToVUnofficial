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

        //Labeling Stats from shorthand
        const statMap = {
            'str': { label: "Strength" },
            'dex': { label: "Dexterity" },
            'con': { label: "Constitution" },
            'int': { label: "Intelligence" },
            'wis': { label: "Wisdom" },
            'cha': { label: "Charisma" }
        };
        // Calculate ability modifiers and save mods
        for (let [key, ability] of Object.entries(systemData.abilities)) {
            const mappedStat = statMap[key];
            ability.mod = Math.floor((ability.value - 10) / 2);
            ability.save = ability.mod + (ability.proficient === 1 ? systemData.proficiency.base : 0);
            Object.assign(ability, mappedStat);
        }

        //Setting base AC
        systemData.ac.value = 10 + systemData.abilities.dex.mod;
        systemData.ac.modifiers.forEach(element => {
            systemData.ac.value += element;
        });

        if(actorData.type !== 'character') return;

        // Map skill keys to labels and core attributes
        const skillMap = {
            'acr': { label: "Acrobatics", core: "dex" },
            'ani': { label: "Animal Handling", core: "wis" },
            'arc': { label: "Arcana", core: "int" },
            'ath': { label: "Athletics", core: "str" },
            'dec': { label: "Deception", core: "cha" },
            'his': { label: "History", core: "int" },
            'ins': { label: "Insight", core: "wis" },
            'int': { label: "Intimidation", core: "cha" },
            'inv': { label: "Investigation", core: "int" },
            'med': { label: "Medicine", core: "wis" },
            'nat': { label: "Nature", core: "int" },
            'per': { label: "Perception", core: "wis" },
            'prf': { label: "Performance", core: "cha" },
            'prs': { label: "Persuasion", core: "cha" },
            'rel': { label: "Religion", core: "int" },
            'soh': { label: "Slight of Hands", core: "dex" },
            'ste': { label: "Stealth", core: "dex" },
            'sur': { label: "Survival", core: "wis" }
        };

        for (let [key, skill] of Object.entries(systemData.skills)) {
            const mappedSkill = skillMap[key];
            if (!mappedSkill) {
                console.error("ToVUActor.mjs ||| Error in Skills Map Statement");
                continue;
            }
            const statMod = systemData.abilities[mappedSkill.core].mod;
            const profBase = systemData.proficiency.base;
            switch (skill.proficiency) {
                case 0:
                    skill.value = statMod;
                    break;
                case 1:
                    skill.value = statMod + profBase;
                    break;
                case 2:
                    skill.value = statMod + (profBase * 2);
                    break;
                case 0.5:
                    skill.value = statMod + Math.floor(profBase / 2);
                    break;
            }
            skill.passive = skill.value + 10;
            Object.assign(skill, mappedSkill);
        }
    }

}