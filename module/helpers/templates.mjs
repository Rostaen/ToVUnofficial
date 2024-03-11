/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([

      // Actor partials.
      "systems/tovu/templates/sheets/partials/character/character-important-info.hbs",
      "systems/tovu/templates/sheets/partials/character/character-effects.hbs",
      "systems/tovu/templates/sheets/partials/character/character-features.hbs",
      "systems/tovu/templates/sheets/partials/character/character-items.hbs",
      "systems/tovu/templates/sheets/partials/character/character-spells.hbs",
      "systems/tovu/templates/sheets/partials/character/character-stats.hbs",
      "systems/tovu/templates/sheets/partials/character/character-tools.hbs",
      "systems/tovu/templates/sheets/partials/character/character-senses.hbs",
      // "systems/tovu/templates/sheets/partials/character/character-.hbs",
    ]);
};
