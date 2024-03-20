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

        // Setting up All Simple/Martial variables
        if(!gearSetup.weapons?.simple?.all){
            const pathS = 'weapons.simple.all';
            setProperty(gearSetup, pathS, false);
            const pathM = 'weapons.martial.all';
            setProperty(gearSetup, pathM, false);
        }
        // Simple Melee
        if(!gearSetup.weapons?.simple?.melee){
            for (const [key, label] of Object.entries(tovu.weaponList.simple.melee)){
                const path = `weapons.simple.melee.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Simple Range
        if(!gearSetup.weapons?.simple?.range){
            for (const [key, label] of Object.entries(tovu.weaponList.simple.range)){
                const path = `weapons.simple.range.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Martial Melee
        if(!gearSetup.weapons?.martial?.melee){
            for (const [key, label] of Object.entries(tovu.weaponList.martial.melee)){
                const path = `weapons.martial.melee.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Martial Range
        if(!gearSetup.weapons?.martial?.range){
            for (const [key, label] of Object.entries(tovu.weaponList.martial.range)){
                const path = `weapons.martial.range.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Tools: Artisan
        if(!Object.keys(gearSetup.tools.artisan).length){
            console.log(">>> In if statement");
            for (const [key, label] of Object.entries(tovu.tools.artisan)){
                console.log(">> in for loop, key:", key, "label:", game.i18n.localize(label));
                const path = `tools.artisan.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Tools: Unique
        if(!Object.keys(gearSetup.tools.unique).length){
            for (const [key, label] of Object.entries(tovu.tools.unique)){
                const path = `tools.unique.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Tools: Gaming
        if(!Object.keys(gearSetup.tools.gaming).length){
            for (const [key, label] of Object.entries(tovu.tools.gaming)){
                const path = `tools.gaming.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Tools: Instruments
        if(!Object.keys(gearSetup.tools.instruments).length){
            for (const [key, label] of Object.entries(tovu.tools.instruments)){
                const path = `tools.instruments.${key}`;
                setProperty(gearSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Tools: Vehicle
        if(!Object.keys(gearSetup.tools.vehicles).length){
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
        console.log("Trait:",this.trait);
        console.log("Category:",toolCategory);
        console.log("Name:",toolName);
        console.log("Label:",label);

        let updateData = {};
        let path = '';
        if(toolName === 'simple.all' || toolName === 'martial.all'){
            path = `system.gear.weapons.${toolName}`
            updateData[`${path}`] = isChecked;
            if(toolName === 'simple.all'){
                // Make all simple weapons `checked disabled`
            }else{
                // Make all martial weapons `checked disabled`
            }
        }else{
            path = `system.gear.${this.trait}.${toolCategory}.${toolName}`;
            updateData[`${path}.label`] = label;
            updateData[`${path}.value`] = isChecked;
        }
        await this.actor.update(updateData);
        console.log(this.actor.system.gear);
    }
}
