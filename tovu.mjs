import { tovu } from "./module/config.mjs";
import ToVUItemSheet from "./module/sheets/ToVUItemSheet.mjs";
import ToVUCharacterSheet from "./module/sheets/ToVUActorSheet.mjs";
import { ToVUActor } from "./module/documents/ToVUActor.mjs";
import { preloadHandlebarsTemplates } from "./module/helpers/templates.mjs";

Hooks.once("init", () => {
  game.tovu = {
    ToVUActor
  }

  console.log("ToVU | Initializing Tales of the Valiant: Unofficial");

  CONFIG.tovu = tovu;

  CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2
  };

  CONFIG.Actor.documentClass = ToVUActor;

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("tovu", ToVUItemSheet, { makeDefault: true });

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("tovu", ToVUCharacterSheet, { makeDefault: true });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();

  // Where and how to create custom handlebar helpers
  // Handlebars.registerHelper("times", (n, content) => {
  //   let result = "";
  //   for (let i = 0; i < n; ++i){
  //     result += content.fn(i);
  //   }
  //   return result;
  // });
});

// Define Handlebars here ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Define Handlebars helper function
// Handlebars.registerHelper('isChecked', function(array, index) {
//   console.log(this.actor.system);
//   return array[index];
//   //return array[index] ? 'checked' : '';
// });

Handlebars.registerHelper('times', (n, actor, block) => {
  let accum = '';
  for (let i = 0; i < n; ++i)
    accum += block.fn({ index: i, actor: actor });
  return accum;
});

// Define Extra Classes here ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~