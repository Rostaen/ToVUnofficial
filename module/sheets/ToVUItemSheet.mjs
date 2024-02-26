export default class ToVUItemSheet extends ItemSheet {

    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            width: 530,
            height: 530,
            classes: ["tovu", "sheet", "item"]
        });
    }

    get template(){
        const path = "systems/tovu/templates/sheets/items";
        return `${path}/${this.item.type}-sheet.hbs`;
    }

    getData(){
        const data = super.getData();
        data.config = CONFIG.tovu;
        //console.log(data);

        return data;
    }
}