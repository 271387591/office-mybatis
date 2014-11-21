/**
 * Created by lihao on 9/12/14.
 */
Ext.define('FlexCenter.flows.view.ModelerWindow',{
    requires:[
        'FlexCenter.flows.view.Modeler'
    ],
    extend:'Ext.Window',
    alias: 'widget.modelerWindow',
    title: workFlowRes.modeler.processDesign,
    maximized: true,
    maximizable:false,
    animCollapse : true,
    layout: 'fit',
    initComponent:function(){
        var me=this;
        me.items = [
            {
                xtype:'modeler',
                processRecord:me.processRecord,
                border:false,
                graRes:me.graRes,
                
                developer:me.developer
            }
        ];
        me.callParent();
    }
});