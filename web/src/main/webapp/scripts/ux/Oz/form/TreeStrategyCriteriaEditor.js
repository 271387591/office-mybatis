Ext.define('Oz.form.TreeStrategyCriteriaEditor', {
  extend: 'Oz.form.CriteriaEditor',

  alias: ['widget.treestrategycriteriaeditor'],

  statics: {
    storeId: 'TREE_Suggest_Variable_Store'
  },

  suggestClass: 'Oz.plugins.form.TreeStrategySuggest',

  requires: [
    'Oz.plugins.form.TreeStrategySuggest',
    'Oz.form.CriteriaEditor'
  ]
});