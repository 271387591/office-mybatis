Ext.define('Oz.form.ElTestMgrCriteriaEditor', {
  extend: 'Oz.form.CriteriaEditor',

  alias: ['widget.eltestmgrcriteriaeditor'],

  statics: {
    storeId: 'ETM_Suggest_Variable_Store'
  },

  suggestClass: 'Oz.plugins.form.ElTestMgrSuggest',

  requires: [
    'Oz.plugins.form.ElTestMgrSuggest',
    'Oz.form.CriteriaEditor'
  ]
});