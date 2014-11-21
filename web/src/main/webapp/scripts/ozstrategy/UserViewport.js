/**
 * Created by lihao on 10/16/14.
 */
Ext.define('FlexCenter.UserViewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Ext.ux.grid.feature.Search',
        'FlexCenter.UserHeader',
        'FlexCenter.WelcomeIndex',
        'FlexCenter.FlowIndex',
        'Oz.app.Tabs'
    ],
    layout: 'border',
    initComponent: function() {
        var me=this;
        me.items = [
            {
                region: 'north',
                height: 65,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                xtype: 'container',
                items: [
                    {
                        height: 37,
                        xtype: 'userHeader'
                    },
                    {
                        border:false,
                        xtype: 'apptabs',
                        itemId:'apptabs',
                        cardPanel:'card-panel',
                        centerPanel:'center-panel',
                        staticTabs:[
                            {cls: 'classes', href: '#welcomeindex', tooltip: globalRes.title.homePage,display:'active'},
                            {cls: 'flows', href: '#flowIndex', tooltip: globalRes.title.workflow},
                        ]
                    }
                ]
            },
            {
                region: 'center',
                layout: 'border',
                itemId: 'card-panel',
                xtype:'panel',
                layout: {
                    type: 'card'
                },
                border:false,
                items: [
                    {
                        xtype:'welcomeindex'
                    },
                    {
                        xtype:'flowIndex'
                    },
                    {
                        xtype:'tabpanel',
                        itemId:'center-panel',
                        resizeTabs: true,
                        enableTabScroll: true,
                        hideCollapseTool:true,
                            defaults: {
                            autoScroll: true
                        },
                        items:[
                        ],
                        tabBar:{
                            baseCls:'x-hide-display'
                        }
                    }
                ]
            },
            {
                xtype: 'panel',
                region: 'south',
                border:false,
                
                items:[
                    {
                        xtype:'toolbar',
                        height: 25,
                        border:false,
                        items:[
                            messageTip
                        ]
                        
                    }
                    
            
                    
                    
                ]
            }
        ];

        this.callParent(arguments);
    }
});