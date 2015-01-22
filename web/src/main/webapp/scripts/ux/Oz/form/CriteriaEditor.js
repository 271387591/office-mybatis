/**
 * Created with IntelliJ IDEA.
 * User: Wang Yang
 * Date: 12-12-21
 * Time: PM1:55
 */

var _criteriaConfig = {
};
if (!Ext.isIE || (Ext.isIE9)){
  Ext.define('Oz.form.CriteriaEditor', {
    extend: 'Oz.form.AceEditor',

    requires:      [
      'Oz.form.AceEditor'
    ],

    // private
    initComponent: function (){
      this.varStoreId = this.self.storeId,
      this.callParent(arguments);
    }
  });
}
else{
  Ext.define('Oz.form.CriteriaEditor', Ext.apply({}, _criteriaConfig, {
    extend:        'Ext.form.TextArea',
    suggestClass:  'Oz.plugins.form.SuggestField',
    suggestConfig: {},

    // private
    initComponent: function (){
      var plugins = this.plugins || [];
      plugins.push(Ext.create(this.suggestClass, this.suggestConfig));
      this.plugins = plugins;

      this.callParent(arguments);
    }
  }));
}