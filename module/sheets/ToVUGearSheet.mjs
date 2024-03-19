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

        // Simple Melee
        if(!gearSetup.weapons.simple){
            if(!gearSetup.weapons.simple.melee){
                console.log(">>> Inside simple melee check");
                for (const [key, label] of Object.entries(tovu.weaponList.simple.melee)){
                    console.log(">> in for loop");
                    const path = `weapons.simple.melee.${key}`;
                    setProperty(gearSetup, path, {label: game.i18n.localize(label)});
                }
            }
            // Simple Range
            if(!gearSetup.weapons.simple.range){
                for (const [key, label] of Object.entries(tovu.weaponList.simple.range)){
                    const path = `weapons.simple.range.${key}`;
                    setProperty(gearSetup, path, {label: game.i18n.localize(label)});
                }
            }
        }
        if(Object.keys(gearSetup.weapons.martial).length === 0){
            // Martial Melee
            if(Object.keys(gearSetup.weapons.martial.melee).length === 0){
                for (const [key, label] of Object.entries(tovu.weaponList.martial.melee)){
                    const path = `weapons.martial.melee.${key}`;
                    setProperty(gearSetup, path, {label: game.i18n.localize(label)});
                }
            }
            // Martial Range
            if(Object.keys(gearSetup.weapons.martial.range).length === 0){
                for (const [key, label] of Object.entries(tovu.weaponList.martial.range)){
                    const path = `weapons.martial.range.${key}`;
                    setProperty(gearSetup, path, {label: game.i18n.localize(label)});
                }
            }
        }
        // Tools: Artisan
        if(Object.keys(gearSetup.tools.artisan).length === 0){
            for (const [key, label] of Object.entries(tovu.tools.artisan)){
                const path = `tools.artisan.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Tools: Unique
        if(Object.keys(gearSetup.tools).length === 0){
            for (const [key, label] of Object.entries(tovu.tools.unique)){
                const path = `tools.unique.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Tools: Gaming
        if(Object.keys(gearSetup.tools.gaming).length === 0){
            for (const [key, label] of Object.entries(tovu.tools.gaming)){
                const path = `tools.gaming.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Tools: Instruments
        if(Object.keys(gearSetup.tools.instruments).length === 0){
            for (const [key, label] of Object.entries(tovu.tools.instruments)){
                const path = `tools.instruments.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Tools: Vehicle
        if(Object.keys(gearSetup.tools.vehicles).length === 0){
            for (const [key, label] of Object.entries(tovu.tools.vehicles)){
                const path = `tools.vehicles.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        this.actor.update({'system.gear': gearSetup});

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

        let updateData = {};
        let path = '';
        if(this.trait === 'tools')
            path = toolCategory === 'unique' ? `system.gear.${this.trait}.${toolName}` : `system.gear.${this.trait}.${toolCategory}.${toolName}`;
        else{
            path = `system.gear.${this.trait}.${toolCategory}.${toolName}`;
            updateData[`${path}.label`] = label;
        }
        updateData[`${path}.value`] = isChecked;
        await this.actor.update(updateData);
        console.log(this.actor.system.gear);
    }
}
