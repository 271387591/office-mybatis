/**
 * Created by lihao on 10/16/14.
 */
Ext.define('FlexCenter.UserViewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'FlexCenter.UserCenterPanel',
        'FlexCenter.UserHeader'
        
    ],
    layout: 'border',
    initComponent: function() {
        var me=this;
        me.items = [
            {
                region: 'north',
                xtype: 'userHeader'
            },
            {
                region: 'center',
                xtype:'userCenterPanel'
            }
        ];
        this.callParent(arguments);
    }
});