Ext.define('Oz.form.ScoreCardCriteriaEditor', {
  extend: 'Oz.form.CriteriaEditor',

  alias: ['widget.scorecardcriteriaeditor'],

  statics: {
    storeId: 'SC_Suggest_Variable_Store'
  },

  suggestClass: 'Oz.plugins.form.ScoreCardSuggest',

  requires: [
    'Oz.plugins.form.ScoreCardSuggest',
    'Oz.form.CriteriaEditor'
  ]
});