/**
 * Created by lihao on 10/16/14.
 */
Ext.define('FlexCenter.UserViewport', {
    extend: 'Ext.container.Viewport',
    requires: [
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
                        xtype: 'container',
                        layout: 'hbox',
//                        items: [
//                            {
//                                xtype: 'docheader'
//                            }
//                        ]
                    },
                    {
                        xtype: 'apptabs',
                        itemId:'apptabs',
                        cardPanel:'card-panel',
                        centerPanel:'center-panel',
                        staticTabs:[
                            {cls: 'classes', href: '#welcomeindex', tooltip: 'Home1',display:'active'},
                            {cls: 'flows', href: '#flowIndex', tooltip: '我的流程'},
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
//                        border:false,
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
                xtype: 'container',
                region: 'south',
                id: 'footer',
                height: 20
//                contentEl: 'footer-content'
            }
        ];

        this.callParent(arguments);
    }
});