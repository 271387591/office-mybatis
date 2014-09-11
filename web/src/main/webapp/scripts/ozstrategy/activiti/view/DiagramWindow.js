/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 10/8/13
 * Time: 10:09 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.DiagramWindow',{
    extend:'Ext.Window',
    alias: 'widget.diagramWindow',
    requires: [
    ],
//    resizable: false,
    width: 800,
    height:600,
    title: '流程示意图',
    border:true,
    modal: true,
    autoScroll:true,
    layout:'fit',
    initComponent:function(){
        var me=this;
        me.items=[
            {
                xtype:'panel',
                autoScroll:true,
                html:'<div style="padding: 20px 0 0 10px;"><img src="'+me.diagramHtml+'" /></div>'
            }
        ];
        me.buttons=[
            {
                text: '关闭',
                handler: function(){
                    me.close();
                }
            }
        ];
        me.callParent();
    }
});
