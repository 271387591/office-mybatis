/**
 * Created by lihao on 9/17/14.
 */
Ext.define('FlexCenter.flows.view.ModelerPreviewWindow',{
    requires:[
        'FlexCenter.flows.view.ModelerPreview'
    ],
    extend:'Ext.Window',
    alias: 'widget.modelerPreviewWindow',
    title: '流程预览',
//    maximized: true,
    maximizable:true,
    iconCls: 'workflow-manager-16',
    animCollapse : true,
    layout: 'fit',
    width:1000,
    height:600,
    initComponent:function(){
        var me=this;
        me.items = [
            {
                xtype:'modelerPreview',
                processRecord:me.processRecord,
                border:false,
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