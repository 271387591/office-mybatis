Ext.define('Oz.plugins.form.ConfigurationSuggest', {
  extend: 'Oz.plugins.form.SuggestField',

  alias: 'plugin.configurationsuggest',
  alternateClassName: 'Oz.ux.ConfigurationSuggest',

  statics: {
    storeId: 'CFGS_Suggest_Variable_Store'
  }
});