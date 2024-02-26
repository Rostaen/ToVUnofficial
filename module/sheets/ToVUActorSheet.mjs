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
        //data.weapons = data.items.filter(item => { return item.type == "weapon" });
        console.log(data);

        return data;
    }


    activateListeners(html){
        //html.find(cssSelector).event(this._someCallBack.bind(this));
        html.find("button.skillProficiency").click(this._cycleSkillProficiency.bind(this));
        html.find("button.statProficiency").click(this._cycleStatProficiency.bind(this));
        html.find(".inline-edit").change(this._onSkillEdit.bind(this));
        console.log(this.actor);

        // possibly use this later
        // html.find(".item-create").click(this._onItemCreate.bind(this));

        super.activateListeners(html);
    }

    _cycleStatProficiency(event) {
        event.preventDefault();
        const $target = $(event.currentTarget);
        const stat = $target.attr("stats");
        const icon = $target.find('i');

        if (icon.hasClass('fa-regular fa-circle')) {
            icon.removeClass('fa-regular fa-circle').addClass('fa-solid fa-circle');
            console.log(icon);
            return this.actor.update({ [`system.abilities.${stat}.proficient`]: 1 });
        } else if (icon.hasClass('fa-solid fa-circle')) {
            icon.removeClass('fa-solid fa-circle').addClass('fa-regular fa-circle');
            console.log(icon);
            return this.actor.update({ [`system.abilities.${stat}.proficient`]: 0 });
        } else {
            console.log(icon);
            console.log("Invalid icon class");
        }

        console.log(this.actor.system.abilities[stat]);
    }

    _cycleSkillProficiency(event) {
        event.preventDefault();
        const $target = $(event.currentTarget);
        const skill = $target.attr("skill");
        const icon = $target.find('i');

        switch (icon.attr('class')) {
            case 'fa-regular fa-circle':
                icon.removeClass('fa-regular').addClass('fa-solid');
                this.actor.update({ [`system.skills.${skill}.proficiency`]: 1 });
                break;
            case 'fa-solid fa-circle':
                icon.removeClass('fa-circle').addClass('fa-circle-check');
                this.actor.update({ [`system.skills.${skill}.proficiency`]: 2 });
                break;
            case 'fa-solid fa-circle-check':
                icon.removeClass('fa-circle-check').addClass('fa-circle-half-stroke');
                this.actor.update({ [`system.skills.${skill}.proficiency`]: 0.5 });
                break;
            case 'fa-solid fa-circle-half-stroke':
                icon.removeClass('fa-solid fa-circle-half-stroke').addClass('fa-regular fa-circle');
                this.actor.update({ [`system.skills.${skill}.proficiency`]: 0 });
                break;
            default:
                console.log("Invalid icon class");
                break;
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