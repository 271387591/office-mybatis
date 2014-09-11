Ext.define('Oz.form.ComplianceCriteriaEditor', {
  extend: 'Oz.form.CriteriaEditor',

  alias: ['widget.compliancecriteriaeditor'],

  statics: {
    storeId: 'Compliance_Suggest_Variable_Store'
  },

  suggestClass: 'Oz.plugins.form.ComplianceSuggest',

  requires: [
    'Oz.plugins.form.ComplianceSuggest',
    'Oz.form.CriteriaEditor'
  ]
});