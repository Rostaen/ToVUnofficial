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
});

// Define Handlebars here ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Handlebars.registerHelper('times', (n, actor, block) => {
  let accum = '';
  for (let i = 0; i < n; ++i)
    accum += block.fn({ index: i, actor: actor });
  return accum;
});

Handlebars.registerHelper('log', (item) => console.log("Helper Logging >>> ", item));
