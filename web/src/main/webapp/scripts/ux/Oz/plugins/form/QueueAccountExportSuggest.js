Ext.define('Oz.plugins.form.QueueAccountExportSuggest', {
  extend: 'Oz.plugins.form.SuggestField',

  alias: 'plugin.queueaccountexportsuggest',
  alternateClassName: 'Oz.ux.QueueAccountExportSuggest',

  statics: {
    storeId: 'Queue_Account_Export_Suggest_Variable_Store'
  }
});