/**
 * Created with IntelliJ IDEA.
 * User: daiwei
 * Date: 14-1-22
 * Time: PM2:28
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.plugins.form.PaymentVerificationRuleSuggest', {
    extend: 'Oz.plugins.form.SuggestField',

    alias: 'plugin.paymentverificationrulesuggest',
    alternateClassName: 'Oz.ux.PaymentVerificationRuleSuggest',

    statics: {
        storeId: 'VRS_Suggest_Variable_Store',
        loadSuggest: function(config, operation) {
            var me = this,
                store = me.getStore(),
                key;

            if (store && Ext.isObject(config)) {
                for (key in config) {
                    store.getProxy().setExtraParam(key, config[key]);
                }
                operation = operation || {}
                var newVariableStore = Ext.apply(operation,
                  {
                    callback:function(r, options, success){
                       if (success){
                        store.insert(0,[{value:'paymentAmount', label:'BigDecimal', expression:'paymentAmount'}]);        
                        store.insert(1,[{value:'paymentDate', label:'Date', expression:'paymentDate'}]);        
                        store.insert(2,[{value:'paymentMethod', label:'String', expression:'paymentMethod'}]);        
                        store.insert(3,[{value:'paymentCardBrand', label:'String', expression:'paymentCardBrand'}]);        
                       }    
                    }
                  });
                store.load(newVariableStore);
            }
        }
    }
});