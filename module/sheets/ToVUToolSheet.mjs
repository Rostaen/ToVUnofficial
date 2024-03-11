export default class ToolSkillsSheet extends FormApplication {
    constructor(actor, trait, options={}){
        super(options);
        this.actor = actor;
        this.trait = trait;
    }

    static get defaultOptions(){
        const defaultOptions = {
            width: 400,
            height: "auto",
            resizable: true,
            minimizable: true,
            closeOnSubmit: false
        }

        if(this.trait = "tools"){
            defaultOptions.id = "tool-skills-sheet";
            defaultOptions.template = "systems/tovu/templates/sheets/partials/character/character-tools.hbs";
            defaultOptions.title = "Tool Skills Sheet";
        }

        return mergeObject(super.defaultOptions, defaultOptions);
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

        // Prepare the data to update
        let updateData = {};

        // Determine the correct path to the tool based on its category
        let toolPath = toolCategory === 'unique' ? `system.gear.tools.${toolName}` : `system.gear.tools.${toolCategory}.${toolName}`;

        // Set the value of the tool
        updateData[`${toolPath}.value`] = isChecked;

        // Update the actor's data
        await this.actor.update(updateData);
    }
}
