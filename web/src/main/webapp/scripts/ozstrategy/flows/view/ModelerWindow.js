/**
 * Created by lihao on 9/12/14.
 */
Ext.define('FlexCenter.flows.view.ModelerWindow',{
    requires:[
        'FlexCenter.flows.view.Modeler'
    ],
    extend:'Ext.Window',
    alias: 'widget.modelerWindow',
    itemId:'modelerWindow',
    title: '流程设计',
    maximized: true,
    maximizable:false,
    iconCls: 'workflow-manager-16',
    animCollapse : true,
//    animateTarget : Ext.getBody(),
    shim:false,
    modal: true,
    layout: 'fit',
    initComponent:function(){
        var me=this;
        me.items = [
            {
                xtype:'modeler',
                processRecord:me.processRecord,
                border:false
            }
        ];
        me.callParent();
    }
});