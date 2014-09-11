Ext.define('Oz.form.DashboardCriteriaEditor', {
  extend: 'Oz.form.CriteriaEditor',

  alias: ['widget.dashboardcriteriaeditor'],

  statics: {
    storeId: 'DashBoard_Suggest_Variable_Store'
  },

  suggestClass: 'Oz.plugins.form.DashboardSuggest',

  requires: [
    'Oz.plugins.form.DashboardSuggest',
    'Oz.form.CriteriaEditor'
  ]
});