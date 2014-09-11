Ext.define('Oz.form.ConfigurationCriteriaEditor', {
  extend: 'Oz.form.CriteriaEditor',

  alias: ['widget.configurationcriteriaeditor'],

  statics: {
    storeId: 'CFGS_Suggest_Variable_Store'
  },

  suggestClass: 'Oz.plugins.form.ConfigurationSuggest',

  requires: [
    'Oz.plugins.form.ConfigurationSuggest',
    'Oz.form.CriteriaEditor'
  ]
});