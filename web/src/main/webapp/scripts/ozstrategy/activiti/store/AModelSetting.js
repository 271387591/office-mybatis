/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/16/13
 * Time: 1:17 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.store.AModelSetting',{
    extend: 'Ext.data.Store',
    alias: 'store.message',

    requires:[
        'FlexCenter.activiti.model.AModelSetting'
    ],
    model:'FlexCenter.activiti.model.AModelSetting',
    proxy:{
        type: 'ajax',
        url:'service/modelController/modelSetting',
        reader: {
            type: 'json',
            root : 'data',
            totalProperty  : 'total',
            messageProperty: 'message'
        }
    }
});
