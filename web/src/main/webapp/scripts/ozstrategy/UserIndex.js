/**
 * Created by lihao on 12/27/14.
 */
Ext.define('FlexCenter.UserIndex', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.userIndex',
    requires: [
        'FlexCenter.UserMenu'
    ],
    layout:'border',
    border:false,
    initComponent:function(){
        var me=this;
        me.items=[
            {
                xtype:'userMenu',
                region:'west'
            },
            {
                xtype:'panel',
                margins: '0 1 0 0',
                border:false,
                region:'center',
                html:'sss'
            },
            {
                xtype:'panel',
                width:400,
                border:false,
                region:'east',
                html:'sss'
            }
            
        ];
        me.callParent(arguments);
    }
});