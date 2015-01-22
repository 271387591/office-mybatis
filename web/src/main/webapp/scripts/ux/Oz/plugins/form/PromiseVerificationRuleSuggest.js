/**
 * Created with IntelliJ IDEA.
 * User: daiwei
 * Date: 14-1-22
 * Time: PM5:53
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.plugins.form.PromiseVerificationRuleSuggest', {
    extend: 'Oz.plugins.form.SuggestField',

    alias: 'plugin.promiseverificationrulesuggest',
    alternateClassName: 'Oz.ux.PromiseVerificationRuleSuggest',

    statics: {
        storeId: 'PMVR_Suggest_Variable_Store',
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
                                store.insert(0,[{value:'ptpAmount', label:'BigDecimal', expression:'ptpAmount'}]);
                                store.insert(1,[{value:'ptpSendDate', label:'Date', expression:'ptpSendDate'}]);
                                store.insert(2,[{value:'ptpArrivalDate', label:'Date', expression:'ptpArrivalDate'}]);
                                store.insert(3,[{value:'ptpMethod', label:'String', expression:'ptpMethod'}]);
                            }
                        }
                    });
                store.load(newVariableStore);
            }
        }
    }
});