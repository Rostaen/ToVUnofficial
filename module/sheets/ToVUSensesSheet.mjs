import { tovu } from "../config.mjs";

export default class SensesSheet extends FormApplication {
    constructor(actor, options={}){
        super(options);
        this.actor = actor;
    }

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            id: "senses-sheet",
            template: "systems/tovu/templates/sheets/partials/character/character-senses.hbs",
            width: "auto",
            height: "auto",
            resizable: true,
            minimizable: true,
            title: "Senses Sheet",
            closeOnSubmit: false
        });
    }

    getData(){
        const actorSenses = this.actor.system.senses;
        const configSenses = tovu.senses;

        return {
            actorSenses,
            configSenses
        }
    }

    activateListeners(html){
        super.activateListeners(html);
        html.find("input[type='text']").change(this._onChangeInput.bind(this));
    }

    async _onChangeInput(event){
        event.preventDefault();
        const key = event.currentTarget.dataset.key;
        const value = parseInt(event.currentTarget.value);
        const label = event.currentTarget.dataset.label;
        let data = {};
        const systemPath = `system.senses.${key}`;
        data[`${systemPath}.value`] = value;
        data[`${systemPath}.label`] = label;
        await this.actor.update(data);
        console.log(this.actor.system.senses);
    }
}
