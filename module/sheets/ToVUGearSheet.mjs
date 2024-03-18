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
        //console.log("GetData call: ", this.actor.system);
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
        console.log("Cat: ", toolCategory, " tName: ", toolName, " isCheck: ", isChecked, " label: ", label, " trait: ", this.trait);

        let updateData = {};
        let path = '';
        if(this.trait === 'tools')
            path = toolCategory === 'unique' ? `system.gear.${this.trait}.${toolName}` : `system.gear.${this.trait}.${toolCategory}.${toolName}`;
        else{
            path = `system.gear.${this.trait}.${toolName}`;
            updateData[`${path}.label`] = label;
        }
        updateData[`${path}.value`] = isChecked;
        await this.actor.update(updateData);
        console.log(this.actor.system.gear.weapons);
    }
}
