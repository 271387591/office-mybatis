Ext.define('Oz.form.WorkflowCriteriaEditor', {
  extend: 'Oz.form.CriteriaEditor',

  alias: ['widget.workflowcriteriaeditor'],

  statics: {
    storeId: 'WF_Suggest_Variable_Store'
  },

  suggestClass: 'Oz.plugins.form.WorkflowSuggest',

  requires: [
    'Oz.plugins.form.WorkflowSuggest',
    'Oz.form.CriteriaEditor'
  ]
});