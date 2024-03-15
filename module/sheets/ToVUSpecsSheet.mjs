import { tovu } from "../config.mjs";

export default class SpecsSheet extends FormApplication {
    constructor(actor, trait, options={}){
        super(options);
        this.actor = actor;
        this.trait = trait;
    }

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            id: "specs-sheet",
            template: "systems/tovu/templates/sheets/partials/character/character-specs.hbs",
            width: "auto",
            height: "auto",
            resizable: true,
            minimizable: true,
            title: "Specs Sheet",
            closeOnSubmit: false
        });
    }

    getData(){
        const actorObject = this.actor.system;
        const configObject = tovu;
        const trait = this.trait;

        return {
            actorObject,
            configObject,
            trait
        }
    }

    activateListeners(html){
        super.activateListeners(html);
        html.find("input[type='text']").change(this._onChangeInput.bind(this));
        html.find("input[type='checkbox]").change(this._onChangeInput.bind(this));
    }

    async _onChangeInput(event){
        event.preventDefault();
        const dataSet = event.currentTarget.dataset;
        const key = dataSet.key;
        const label = dataSet.label;
        let value = null;
        let data = {};
        const systemPath = `system.${this.trait}.${key}`;
        switch(this.trait){
            case 'senses':
                value = parseInt(event.currentTarget.value);
                break;
            case 'immune':
            case 'resist':
            case 'vulnerable':
            case 'condition':
                value = event.target.checked;
                break;
            default:
                console.error("Error in _onChangeInput switch statement", this.trait);
        }
        data[`${systemPath}.value`] = value;
        data[`${systemPath}.label`] = label;

        await this.actor.update(data);
        console.log("On Change >>> ", this.actor.system);
    }
}
