/**
 * Created by lihao on 9/17/14.
 */
Ext.define('FlexCenter.flows.view.ModelerPreviewWindow',{
    requires:[
        'FlexCenter.flows.view.ModelerPreview'
    ],
    extend:'Ext.Window',
    alias: 'widget.modelerPreviewWindow',
    title: workFlowRes.modeler.processPreview,
//    maximized: true,
    maximizable:true,
    animCollapse : true,
    layout: 'fit',
    width:1000,
    height:600,
    modal:true,
    initComponent:function(){
        var me=this;
        me.items = [
            {
                xtype:'modelerPreview',
                processRecord:me.processRecord,
                border:false,
                taskType:me.taskType,
                taskKey:me.taskKey,
                graRes:me.graRes
            }
        ];
        me.buttons=[
            {
                text: globalRes.buttons.close,
                handler: function () {
                    me.close();
                }
            }
        ]
        me.callParent();
    }
});