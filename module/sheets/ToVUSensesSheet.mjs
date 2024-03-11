export default class SensesSheet extends FormApplication {
    constructor(actor, options={}){
        super(options);
        this.actor = actor;
    }

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            id: "senses-sheet",
            template: "systems/tovu/templates/sheets/partials/character/character-senses.hbs",
            width: 400,
            height: "auto",
            resizable: true,
            minimizable: true,
            title: "Senses Sheet",
            closeOnSubmit: false
        });
    }

    getData(){
        return {
            senseList: this.actor.system.senses
        }
    }

    activateListeners(html){
        super.activateListeners(html);
        html.find("input[type='text']").change(this._onChangeInput.bind(this));
    }

    async _onChangeInput(event){
        event.preventDefault();
        const senseName = event.target.dataset.key;
        const senseValue = event.target.value;
        const senseData = this.actor.system.senses;
        senseData[senseName].value = senseValue;
        await this.actor.update(senseData);
        console.log(this.actor.system.senses);
    }
}
