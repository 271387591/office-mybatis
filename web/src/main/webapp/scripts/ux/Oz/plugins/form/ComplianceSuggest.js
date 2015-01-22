Ext.define('Oz.plugins.form.ComplianceSuggest', {
  extend: 'Oz.plugins.form.SuggestField',

  alias: 'plugin.compliancesuggest',
  alternateClassName: 'Oz.ux.ComplianceSuggest',

  statics: {
    storeId: 'Compliance_Suggest_Variable_Store'
  }
});