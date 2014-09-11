Ext.define('Oz.plugins.form.VariableSuggest', {
  extend: 'Oz.plugins.form.SuggestField',

  alias: 'plugin.variablesuggest',
  alternateClassName: 'Oz.ux.VariableSuggest',

  statics: {
    storeId: 'VAR_Suggest_Variable_Store'
  }
});