Ext.define('Oz.plugins.form.WorkflowSuggest', {
  extend: 'Oz.plugins.form.SuggestField',

  alias: 'plugin.workflowsuggest',
  alternateClassName: 'Oz.ux.WorkflowSuggest',

  statics: {
    storeId: 'WF_Suggest_Variable_Store'
  }
});