import ToolSkillsSheet from "./ToVUToolSheet.mjs";
import SensesSheet from "./ToVUSensesSheet.mjs";
import { tovu } from "../config.mjs";

export default class ToVUActorSheet extends ActorSheet{

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            template: "systems/tovu/templates/sheets/actors/character-sheet.hbs",
            width: 800,
            height: 800,
            classes: ["totv", "sheet", "actor"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
        });
    }

    getData(){
        const data = super.getData();
        data.config = CONFIG.tovu;
        data.tovu = tovu;
        //data.weapons = data.items.filter(item => { return item.type == "weapon" });
        //console.log(data);

        return data;
    }


    activateListeners(html){
        //html.find(cssSelector).event(this._someCallBack.bind(this));
        html.find("button.skillProficiency").click(this._cycleSkillProficiency.bind(this));
        html.find("button.statProficiency").click(this._cycleStatProficiency.bind(this));
        html.find("button.deathSave").click(this._cycleDeathSave.bind(this));
        html.find(".exhaustionMarker").click(this._cycleExhaustion.bind(this));
        html.find(".inline-edit").change(this._onSkillEdit.bind(this));
        html.find("button.updateTools").click(this._updateToolsList.bind(this));
        html.find(".sizeSelect").change(this._onSizeEdit.bind(this));
        //console.log(this.actor);

        // possibly use this later
        // html.find(".item-create").click(this._onItemCreate.bind(this));

        super.activateListeners(html);
    }

    _cycleStatProficiency(event) {
        event.preventDefault();
        const target = $(event.currentTarget);
        const actor = this.actor;
        const stat = target.attr("stats");
        const icon = target.find('i');

        if (icon.hasClass('fa-regular fa-circle')) {
            icon.removeClass('fa-regular fa-circle').addClass('fa-solid fa-circle');
            return actor.update({ [`system.abilities.${stat}.proficient`]: 1 });
        } else if (icon.hasClass('fa-solid fa-circle')) {
            icon.removeClass('fa-solid fa-circle').addClass('fa-regular fa-circle');
            return actor.update({ [`system.abilities.${stat}.proficient`]: 0 });
        } else {
            console.log("Invalid icon class");
        }
        //console.log(this.actor.system.abilities[stat]);
    }

    _cycleSkillProficiency(event) {
        event.preventDefault();
        const target = $(event.currentTarget);
        const actor = this.actor;
        const skill = target.attr("skill");
        const icon = target.find('i');

        switch (icon.attr('class')) {
            case 'fa-regular fa-circle':
                icon.removeClass('fa-regular').addClass('fa-solid');
                actor.update({ [`system.skills.${skill}.proficiency`]: 1 });
                break;
            case 'fa-solid fa-circle':
                icon.removeClass('fa-circle').addClass('fa-circle-check');
                actor.update({ [`system.skills.${skill}.proficiency`]: 2 });
                break;
            case 'fa-solid fa-circle-check':
                icon.removeClass('fa-circle-check').addClass('fa-circle-half-stroke');
                actor.update({ [`system.skills.${skill}.proficiency`]: 0.5 });
                break;
            case 'fa-solid fa-circle-half-stroke':
                icon.removeClass('fa-solid fa-circle-half-stroke').addClass('fa-regular fa-circle');
                actor.update({ [`system.skills.${skill}.proficiency`]: 0 });
                break;
            default:
                console.log("Invalid icon class");
                break;
        }
        //console.log(actor.system.deathSaves);
    }

    _cycleDeathSave(event){
        event.preventDefault();
        const target = $(event.currentTarget);
        const actor = this.actor;
        const systemData = actor.system;
        const type = target.attr('type');
        const index = target.attr('numId');
        const icon = target.find('i');
        let value = 0;
        console.log("numId: ", index, " -- Actor Data Top Call: ", systemData.deathSaves);

        if (icon.hasClass('fa-regular fa-circle')) {
            icon.removeClass('fa-regular fa-circle').addClass('fa-solid fa-circle');
            value = 1;
        } else if (icon.hasClass('fa-solid fa-circle')) {
            icon.removeClass('fa-solid fa-circle').addClass('fa-regular fa-circle');
            value = 0;
        } else {
            console.log("Invalid icon class");
        }

        let deathSavesArray = systemData.deathSaves[type];
        deathSavesArray[index] = value;

        actor.update({ [`system.deathSaves.${type}`]: deathSavesArray });
        //console.log(" -- Actor Data Bottom Call: ", systemData.deathSaves);
    }

    _cycleExhaustion(event){
        event.preventDefault();
        const target = $(event.currentTarget);
        const actor = this.actor;
        const systemData = actor.system;
        const icon = target.find('i');
        let exhaustion = systemData.exhaustion.level;

        if (icon.hasClass('fa-regular fa-circle')) {
            icon.removeClass('fa-regular fa-circle').addClass('fa-solid fa-circle');
            if(exhaustion <= 6)
                exhaustion += 1;
        } else if (icon.hasClass('fa-solid fa-circle')) {
            icon.removeClass('fa-solid fa-circle').addClass('fa-regular fa-circle');
            if(exhaustion >= 0)
                exhaustion -= 1;
        } else {
            console.log("Invalid icon class");
        }
        actor.update({ 'system.exhaustion.level': exhaustion });
    }

    async _onSizeEdit(event){
        event.preventDefault();
        const selectedValue = $(event.currentTarget).val();
        await this.actor.update({'system.details.size.choice': selectedValue});
        console.log("Path to Size >>> ", this.actor.system.details.size);
    }

    async _updateToolsList(event){
        event.preventDefault();
        const trait = event.currentTarget.dataset.trait;
        if(trait === 'tools'){
            const toolSheet = new ToolSkillsSheet(this.actor);
            toolSheet.render(true);
        } else if(trait === 'senses'){
            const toolSheet = new SensesSheet(this.actor);
            toolSheet.render(true);
        }
    }

    _onSkillEdit(event){
        event.preventDefault();
        let element = event.currentTarget;
        //let item = this.actor;
    }

    _onItemCreate(event){
        event.preventDefault();
        let element = event.currentTarget;

        let itemData = {
            name: game.i18n.localize("tovu.sheet.newItem"),
            type: element.dataset.type // Would need to add a 'data-type="skill"' to the anchor to create an item somewhere in the .hbs
        };

        return this.actor.createOwnedItem(itemData);
    }
}
