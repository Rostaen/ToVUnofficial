export default class ToolSkillsSheet extends FormApplication {
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
        console.log("Senses Sheet GetData: ", this.actor.system.senses);
        return {
            senses: this.actor.system.senses
        }
    }

    activateListeners(html){
        super.activateListeners(html);
        html.find("input[type='checkbox'").change(this._onChangeCheckbox.bind(this));
    }

    async _onChangeCheckbox(event){
        event.preventDefault();
        const toolCategory = event.target.dataset.category;
        const toolName = event.target.dataset.key;
        const isChecked = event.target.checked;

        /// TODO: Update data for sense and values of senses being implemented, eg: Darkvision 120
        let updateData = {};
        let toolPath = `system.gear.tools.${toolName}`
        updateData[`${toolPath}.value`] = isChecked;
        await this.actor.update(updateData);
    }
}
