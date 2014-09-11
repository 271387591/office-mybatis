Ext.define('Oz.plugins.form.DashboardSuggest', {
  extend: 'Oz.plugins.form.SuggestField',

  alias: 'plugin.dashboardsuggest',
  alternateClassName: 'Oz.ux.DashboardSuggest',

  statics: {
    storeId: 'DashBoard_Suggest_Variable_Store'
  }
});