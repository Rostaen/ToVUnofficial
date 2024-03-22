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
        if(gearSetup.weapons.martial.all){
            console.log("Martial all is true");
            $('input.martialWeapon').prop({ disabled: true });
        }
        if(gearSetup.weapons.simple.all)
            $('input.simpleWeapon').prop({ disabled: true });

        // Setting up All SimpleMartial variables
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

        if(toolName === 'simple.all' || toolName === 'martial.all'){
            const weaponPath = `system.gear.weapons.${toolName}`;
            updateData[weaponPath] = isChecked;
            const weaponTypes = ['melee', 'range'];

            if(toolName === 'simple.all'){
                // Toggle/diable all simple weapons
                const simpleWeapons = systemData.gear.weapons.simple;
                const allChecked = !simpleWeapons.all;
                updateData['system.gear.weapons.simple.all'] = allChecked;

                weaponTypes.forEach(weaponType => {
                    const weapons = simpleWeapons[weaponType];
                    for (const [key, _] of Object.entries(weapons)) {
                        updateData[`system.gear.weapons.simple.${weaponType}.${key}.value`] = allChecked;
                    }
                });

                // Disable or enable all simple weapons based on 'allChecked'
                $('.simpleWeapon').prop({ disabled: allChecked, checked: allChecked });
            }else{
                // Toggle/disable all martial weapons
                const martialWeapons = systemData.gear.weapons.martial;
                const allChecked = !martialWeapons.all;
                updateData['system.gear.weapons.martial.all'] = allChecked;

                weaponTypes.forEach(weaponType => {
                    const weapons = martialWeapons[weaponType];
                    for (const [key, _] of Object.entries(weapons)) {
                        updateData[`system.gear.weapons.martial.${weaponType}.${key}.value`] = allChecked;
                    }
                });

                // Disable or enable all martial weapons based on 'allChecked'
                $('.martialWeapon').prop({ disabled: allChecked, checked: allChecked });
            }
        }else{
            path = `system.gear.${this.trait}.${toolCategory}.${toolName}`;
            updateData[`${path}.label`] = label;
            updateData[`${path}.value`] = isChecked;
        }
        await this.actor.update(updateData);
        console.log("End of Logic >>>",systemData.gear);
    }
}
