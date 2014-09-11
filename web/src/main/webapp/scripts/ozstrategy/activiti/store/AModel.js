/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 8/28/13
 * Time: 10:56 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.store.AModel',{
    extend: 'Ext.data.Store',
    alias: 'store.message',

    requires:[
        'FlexCenter.activiti.model.AModel'
    ],
    model:'FlexCenter.activiti.model.AModel',
    proxy:{
        type: 'ajax',
        url:'modelController/list',
        reader: {
            type: 'json',
            root : 'data',
            totalProperty  : 'total',
            messageProperty: 'message'
        }
    }
});
