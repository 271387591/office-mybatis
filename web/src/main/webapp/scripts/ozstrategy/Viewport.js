Ext.define('FlexCenter.Viewport',{
    extend: 'Ext.Viewport', 
    layout: 'fit',
    hideBorders: true,
    requires : [ 
        'FlexCenter.UserHeader',
        'FlexCenter.UserMenu',
        'FlexCenter.UserCenterPanel',
        'FlexCenter.UserFooter'
    ],
    initComponent : function(){ 
        var me = this; 
        Ext.apply(me, {
            items: [{ 
                layout: 'border',
                border:false,
                items: [
                  {
                    xtype:'userHeader'
                  },
                  {
                    xtype:'userMenu',
                    margin:'0 0 1 0'
                  },
                  {
                    xtype:'userCenterPanel',
                    margin:'0 0 1 0'
                  },
                  {
                    xtype:'userFooter'
                  }
                ]
            }] 
        }); 
        me.callParent(arguments);
       Ext.QuickTips.init();
    } 
});
