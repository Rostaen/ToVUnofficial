/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([

      // Actor partials.
      "systems/tovu/templates/sheets/partials/character-important-info.hbs",
      "systems/tovu/templates/sheets/partials/character-effects.hbs",
      "systems/tovu/templates/sheets/partials/character-features.hbs",
      "systems/tovu/templates/sheets/partials/character-items.hbs",
      "systems/tovu/templates/sheets/partials/character-spells.hbs",
      "systems/tovu/templates/sheets/partials/character-stats.hbs",
      // "systems/tovu/templates/sheets/partials/character-.hbs",
      // "systems/tovu/templates/sheets/partials/character-.hbs",
    ]);
};