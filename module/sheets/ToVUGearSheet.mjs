import { tovu } from "../config.mjs";

export default class GearSkillsSheet extends FormApplication {
    constructor(actor, trait, options={}){
        super(options);
        this.actor = actor;
        this.trait = trait;
    }

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            id: "tool-skills-sheet",
            template: "systems/tovu/templates/sheets/partials/character/character-gear.hbs",
            width: 400,
            height: "auto",
            resizable: true,
            minimizable: true,
            title: "Tool Skills Sheet",
            closeOnSubmit: false
        });
    }

    getData(){
        // Initializing labels for all gear
        let gearSetup = this.actor.system.gear;

        // Setting up weapons
        ['simple', 'martial'].forEach(type => {
            if(!gearSetup.weapons?.[type]?.all){
                const path = `weapons.${type}.all`;
                setProperty(gearSetup, path, false);
            }

            ['melee', 'range'].forEach(weaponType =>{
                if (!gearSetup.weapons?.[type]?.[weaponType]){
                    const weaponList = tovu.weaponList[type][weaponType];
                    for (const [key, label] of Object.entries(weaponList)){
                        const path = `weapons.${type}.${weaponType}.${key}`;
                        setProperty(gearSetup, path, {label: game.i18n.localize(label)});
                    }
                }
            });
        });

        // Setting up armor
        ['all', 'type'].forEach(type =>{
            if(!Object.keys(gearSetup.armor?.[type] ?? {}).length){
                const path = `armor.${type}`;
                if(type === 'all'){
                    setProperty(gearSetup, path, false);
                }else{
                    const armorList = tovu.armor;
                    for (const [key, label] of Object.entries(armorList)){
                        const armorPath = `${path}.${key}`;
                        setProperty(gearSetup, armorPath, {label: game.i18n.localize(label)});
                    }
                }
            }
        });

        // Setting up tools
        const toolsData = {
            artisan: tovu.tools.artisan,
            unique: tovu.tools.unique,
            gaming: tovu.tools.gaming,
            instruments: tovu.tools.instruments,
            vehicles: tovu.tools.vehicles
        };

        Object.entries(toolsData).forEach(([toolType, toolList]) => {
            if (!Object.keys(gearSetup.tools[toolType]).length){
                for (const [key, label] of Object.entries(toolList)){
                    const path = `tools.${toolType}.${key}`;
                    setProperty(gearSetup, path, {label: game.i18n.localize(label)});
                }
            }
        });

        this.actor.update({ 'system.gear': gearSetup });

        console.log("GetData call: ", this.actor.system.gear);
        return {
            trait: this.trait,
            gear: this.actor.system.gear,
            configObj: tovu
        }
    }

    activateListeners(html){
        super.activateListeners(html);
        html.find("input[type='checkbox']").change(this._onChangeCheckbox.bind(this));
    }

    async _onChangeCheckbox(event){
        event.preventDefault();
        const toolCategory = event.currentTarget.dataset.category;
        const toolName = event.currentTarget.dataset.key;
        const isChecked = event.currentTarget.checked;
        const label = event.currentTarget.dataset.label;
        const systemData = this.actor.system;
        console.log("Trait:",this.trait);
        console.log("Category:",toolCategory);
        console.log("Name:",toolName);
        console.log("Label:",label);

        let updateData = {};
        let path = '';

        if(toolName === 'simple.all' || toolName === 'martial.all' || toolName === 'armor.all'){
            // TODO: Update code for armor functionality like weapons

            const weaponPath = `system.gear.weapons.${toolName}`;
            updateData[weaponPath] = isChecked;
            const weaponType = toolName === 'simple.all' ? 'simple' : 'martial';

            // Toggle/disable all weapons of a given type
            const weapons = systemData.gear.weapons[weaponType];
            const allChecked = !weapons.all;
            updateData[`system.gear.weapons.${weaponType}.all`] = allChecked;

            // Update each weapon type
            ['melee', 'range'].forEach(attackType => {
                const weaponList = weapons[attackType];
                for (const [key, _] of Object.entries(weaponList)){
                    updateData[`system.gear.weapons.${weaponType}.${attackType}.${key}.value`] = allChecked;
                    updateData[`system.gear.weapons.${weaponType}.${attackType}.${key}.disabled`] = allChecked;
                }
            });

            // Disable or enable all weapons based on 'allChecked'
            $(`.${weaponType}Weapon`).prop({ disabled: allChecked, checked: allChecked });
        }else{
            path = `system.gear.${this.trait}`;
            this.trait === 'armor' ? path += `.type.${toolName}` : path += `.${toolCategory}.${toolName}`;
            updateData[`${path}.label`] = label;
            updateData[`${path}.value`] = isChecked;
        }
        await this.actor.update(updateData);
        console.log("End of Logic >>>",systemData.gear);
    }
}
