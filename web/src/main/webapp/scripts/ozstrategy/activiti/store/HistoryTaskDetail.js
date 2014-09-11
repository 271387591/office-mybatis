/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/28/13
 * Time: 7:13 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.store.HistoryTaskDetail',{
    extend: 'Ext.data.Store',

    requires:[
        'FlexCenter.activiti.model.HistoryTaskDetail'
    ],
    model:'FlexCenter.activiti.model.HistoryTaskDetail',
    proxy:{
        type: 'ajax',
        url:'processesController/getHistoryTaskDetailByInsId',
        reader: {
            type: 'json',
            root : 'data',
            totalProperty  : 'total',
            messageProperty: 'message'
        }
    }
});
