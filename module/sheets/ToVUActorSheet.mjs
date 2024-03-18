import GearSkillsSheet from "./ToVUGearSheet.mjs";
import SpecsSheet from "./ToVUSpecsSheet.mjs";
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
        html.find("button.updateTools").click(this._updateToolsList.bind(this));
        html.find(".sizeSelect").change(this._onSizeEdit.bind(this));
        //console.log(this.actor);

        // possibly use this later
        // html.find(".item-create").click(this._onItemCreate.bind(this));

        super.activateListeners(html);
    }

    // Helper methods for button icons
    removeReg(icon){
        icon.removeClass('fa-regular').addClass('fa-solid');
    }
    removeSolid1(icon){
        icon.removeClass('fa-solid').addClass('fa-regular');
    }
    removeSolid2(icon){
        icon.removeClass('fa-circle').addClass('fa-circle-check');
    }
    removeCheck(icon){
        icon.removeClass('fa-circle-check').addClass('fa-circle-half-stroke');
    }
    removeHalf(icon){
        icon.removeClass('fa-solid fa-circle-half-stroke').addClass('fa-regular fa-circle');
    }

    // Cycling proficiency buttons for Attributes and Skills
    _cycleProficiency(event, dataPath, type){
        event.preventDefault();
        const target = $(event.currentTarget);
        const actor = this.actor;
        const icon = target.find('i');

        switch(icon.attr('class')){
            case 'fa-regular fa-circle':
            this.removeReg(icon);
            actor.update({ [dataPath]: 1 });
            break;
        case 'fa-solid fa-circle':
            if(type === 'stats'){
                this.removeSolid1(icon);
                actor.update({ [dataPath]: 0 });
            }
            else{
                this.removeSolid2(icon);
                actor.update({ [dataPath]: 2 });
            }
            break;
        case 'fa-solid fa-circle-check':
            this.removeCheck(icon);
            actor.update({ [dataPath]: 0.5 });
            break;
        case 'fa-solid fa-circle-half-stroke':
            this.removeHalf(icon);
            actor.update({ [dataPath]: 0 });
            break;
        default:
            console.log("Invalid icon class");
            break;
        }
    }

    _cycleStatProficiency(event) {
        const stat = $(event.currentTarget).attr("stats");
        this._cycleProficiency(event, `system.abilities.${stat}.proficient`, 'stats');
    }

    _cycleSkillProficiency(event) {
        const skill = $(event.currentTarget).attr("skill");
        this._cycleProficiency(event, `system.skills.${skill}.proficiency`, 'skills');
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
        //console.log("numId: ", index, " -- Actor Data Top Call: ", systemData.deathSaves);

        if (icon.hasClass('fa-regular fa-circle')) {
            this.removeReg(icon);
            value = 1;
        } else if (icon.hasClass('fa-solid fa-circle')) {
            this.removeSolid1(icon);
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
            this.removeReg(icon);
            if(exhaustion <= 6)
                exhaustion += 1;
        } else if (icon.hasClass('fa-solid fa-circle')) {
            this.removeSolid1(icon);
            if(exhaustion >= 0)
                exhaustion -= 1;
        } else {
            console.log("Invalid icon class");
        }
        actor.update({ 'system.exhaustion.level': exhaustion });
    }

    async _updateToolsList(event){
        event.preventDefault();
        const trait = event.currentTarget.dataset.trait;
        let toolSheet = null;
        switch(trait){
            case 'tools':
            case 'weapons':
            case 'armor':
                toolSheet = new GearSkillsSheet(this.actor, trait);
                toolSheet.render(true);
                break;
            case 'senses':
            case 'immune':
            case 'resist':
            case 'vulnerable':
            case 'condition':
                toolSheet = new SpecsSheet(this.actor, trait);
                toolSheet.render(true);
                break;
            default:
                console.error("Error in _updateToolsList switch statement");
        }
    }

    async _onSizeEdit(event){
        event.preventDefault();
        const selectedValue = $(event.currentTarget).val();
        await this.actor.update({'system.details.size.choice': selectedValue});
        //console.log("Path to Size >>> ", this.actor.system.details.size);
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
