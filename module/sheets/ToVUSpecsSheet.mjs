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
        // Initializing labels for all gear
        let itemSetup = this.actor.system;

        // Setting Up: Senses
        if(Object.keys(itemSetup.senses).length == 0){
            for (const [key, label] of Object.entries(tovu.senses)){
                const path = `senses.${key}`;
                setProperty(itemSetup, path, {label: game.i18n.localize(label)});
            }
        }
        // Setting Up: Vulnerable, Resist, Immune
        if(Object.keys(itemSetup.vulnerable).length == 0 || Object.keys(itemSetup.resist).length == 0 || Object.keys(itemSetup.immune).length == 0){
            for (const [key, label] of Object.entries(tovu.damageType)){
                const path1 = `vulnerable.${key}`;
                const path2 = `resist.${key}`;
                const path3 = `immune.${key}`;
                setProperty(itemSetup, path1, {label: game.i18n.localize(label)});
                setProperty(itemSetup, path2, {label: game.i18n.localize(label)});
                setProperty(itemSetup, path3, {label: game.i18n.localize(label)});
            }
        }
        // Setting Up: Conditions
        if(Object.keys(itemSetup.condition).length == 0){
            for (const [key, label] of Object.entries(tovu.condition)){
                const path = `condition.${key}`;
                setProperty(itemSetup, path, {label: game.i18n.localize(label)});
            }
        }
        this.actor.update({'system': itemSetup});

        console.log(this.actor.system);

        return {
            actorObj: this.actor.system,
            trait: this.trait
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
        console.log("On Change >>> ", this.actor);
    }
}
