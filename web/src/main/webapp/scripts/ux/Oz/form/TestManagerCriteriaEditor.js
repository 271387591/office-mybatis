Ext.define('Oz.form.TestManagerCriteriaEditor', {
  extend: 'Oz.form.CriteriaEditor',

  alias: ['widget.testmanagercriteriaeditor'],

  statics: {
    storeId: 'TM_Suggest_Variable_Store'
  },

  suggestClass: 'Oz.plugins.form.TestManagerSuggest',

  requires: [
    'Oz.plugins.form.TestManagerSuggest',
    'Oz.form.CriteriaEditor'
  ]
});