Ext.define('Oz.plugins.form.TestManagerSuggest', {
  extend: 'Oz.plugins.form.SuggestField',

  alias: 'plugin.testmanagersuggest',
  alternateClassName: 'Oz.ux.TestManagerSuggest',

  statics: {
    storeId: 'TM_Suggest_Variable_Store'
  }
});