/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-9-24
 * Time: 上午11:27
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.store.AModelForm',{
    extend: 'Ext.data.Store',
    alias: 'store.message',

    requires:[
        'FlexCenter.activiti.model.AModelForm'
    ],
    model:'FlexCenter.activiti.model.AModelForm',
    proxy:{
        type: 'ajax',
        url:'flowFormDataController/getFlowFormDatas',
        reader: {
            type: 'json',
            root : 'data',
            totalProperty  : 'total',
            messageProperty: 'message'
        }
    }
});