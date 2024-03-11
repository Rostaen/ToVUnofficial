export default class ToolSkillsSheet extends FormApplication {
    constructor(actor, options={}){
        super(options);
        this.actor = actor;
    }

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            id: "tool-skills-sheet",
            template: "systems/tovu/templates/sheets/partials/character/character-tools.hbs",
            width: 400,
            height: "auto",
            resizable: true,
            minimizable: true,
            title: "Tool Skills Sheet",
            closeOnSubmit: false
        });
    }

    getData(){
        console.log("GetData call: ", this.actor.system);
        return {
            artisanTools: this.actor.system.gear.tools.artisan,
            uniqueTools: this.actor.system.gear.tools,
            gamingTools: this.actor.system.gear.tools.gaming,
            instruments: this.actor.system.gear.tools.instruments,
            vehicles: this.actor.system.gear.tools.vehicles
        }
    }

    activateListeners(html){
        super.activateListeners(html);
        html.find("input[type='checkbox']").change(this._onChangeCheckbox.bind(this));
    }

    async _onChangeCheckbox(event){
        event.preventDefault();
        const toolCategory = event.target.dataset.category;
        const toolName = event.target.dataset.key;
        const isChecked = event.target.checked;

        let updateData = {};
        let toolPath = toolCategory === 'unique' ? `system.gear.tools.${toolName}` : `system.gear.tools.${toolCategory}.${toolName}`;
        updateData[`${toolPath}.value`] = isChecked;
        await this.actor.update(updateData);
    }
}
