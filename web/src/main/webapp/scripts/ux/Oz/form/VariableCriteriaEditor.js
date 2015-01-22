Ext.define('Oz.form.VariableCriteriaEditor', {
  extend: 'Oz.form.CriteriaEditor',

  alias: ['widget.variablecriteriaeditor'],

  statics: {
    storeId: 'VAR_Suggest_Variable_Store'
  },

  suggestClass: 'Oz.plugins.form.VariableSuggest',

  requires: [
    'Oz.plugins.form.VariableSuggest',
    'Oz.form.CriteriaEditor'
  ]
});