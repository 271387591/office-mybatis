Ext.define('Oz.plugins.form.ScoreCardSuggest', {
  extend: 'Oz.plugins.form.SuggestField',

  alias: 'plugin.scorecardsuggest',
  alternateClassName: 'Oz.ux.ScoreCardSuggest',

  statics: {
    storeId: 'SC_Suggest_Variable_Store'
  }
});