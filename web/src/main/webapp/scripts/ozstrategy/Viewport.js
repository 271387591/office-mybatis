Ext.define('FlexCenter.Viewport',{
    extend: 'Ext.Viewport', 
    layout: 'fit',
    hideBorders: true,
    requires : [ 
        'FlexCenter.UserHeader',
        'FlexCenter.UserMenu',
        'FlexCenter.UserCenterPanel',
        'FlexCenter.UserToolbar',
        'FlexCenter.UserFooter'
    ],
    initComponent : function(){ 
        var me = this; 
        Ext.apply(me, {
            items: [
                {
                    xtype:'panel',
                    layout:'border',
                    region:'center',
                    bodyPadding:1,
                    tbar:[
                        {
                            text: '协同办公',
                            scale: 'medium',
                            iconCls: 'office_auto',
                            iconAlign: 'bottom',
//					margin: '0 8 0 10',
                            itemId:'officeAutoBtn',
                            tooltip: '协同办公',
//          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_officeAuto',mode:'hide'}),
                            handler: function () {
//                                        me.changeMenuMode(this.itemId);
                                var treeNav = me.down("#treeNav");
                                treeNav.loadMenuItem(FlexCenter.Constants.USER_OA_MENU, this.tooltip);
                            }
                        },
                        {
                            text: '我的流程',
                            scale: 'medium',
                            iconCls: 'workflow-manager-16',
                            itemId:'workflowManagerBtn',
                            tooltip: '我的流程',
                            iconAlign: 'top',
//					margin: '0 0 0 10',
//          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_myWorkflow',mode:'hide'}),
                            handler: function () {
//                        this.addCls('office_auto');
//                                        me.changeMenuMode(this.itemId);
//                        this.setText('<font color="red">'+this.getText()+'</font>')
//                                        var treeNav = Ext.ComponentQuery.query('#treeNav')[0];
                                var treeNav=me.down("#treeNav");
                                treeNav.loadMenuItem(FlexCenter.Constants.USER_WORKFLOW_MENU, this.tooltip);
                            }
                        },
//                        {
//                            text: '我的首页',
//                            scale: 'small',
//                            iconCls: 'index-page',
//                            iconAlign: 'top',
//                            itemId:'indexPageBtn',
////					margin: '0 0 0 10',
//                            tooltip: '我的首页',
////          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_myIndex',mode:'disable'}),
//                            handler: function () {
////						var centerTabPanel = me.ownerCt.ownerCt.down('#centerPanel');
////						centerTabPanel.addPanel('indexView', 'indexPage');
//                            }
//                        },
//                        {
//                            text: '公司主页',
//                            scale: 'small',
//                            tooltip: '公司主页',
//                            iconCls: 'company-home',
//                            itemId:'companyHomeBtn',
//                            iconAlign: 'top',
////					margin: '0 0 0 10',
////          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_companyHome',mode:'disable'}),
//                            handler: function () {
////						var centerTabPanel = me.ownerCt.ownerCt.down('#centerPanel');
////						centerTabPanel.addPanel('companyHomeView', 'companyHome');
//                            }
//                        },
//                        {
//                            text: '修改个人资料',
//                            scale: 'small',
//                            tooltip: '修改个人资料',
//                            iconCls: 'edit_profile',
//                            itemId:'editProfileBtn',
//                            iconAlign: 'top',
////					margin: '0 0 0 10',
////          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_editProfile',mode:'disable'}),
//                            handler: function () {
////						var centerTabPanel = me.ownerCt.ownerCt.down('#centerPanel');
////						centerTabPanel.addPanel('profileForm', 'profileForm');
//                            }
//                        },
//                        {
//                            text: '便 签',
//                            scale: 'small',
//                            tooltip: '便 签',
//                            iconAlign: 'top',
//                            itemId:'iconNoteBtn',
////					margins: '0 0 0 10',
//                            iconCls: 'icon-note',
////          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_userNote',mode:'disable'}),
//                            handler: function () {
////						var centerTabPanel = me.ownerCt.ownerCt.down('#centerPanel');
////						centerTabPanel.addPanel('personalTipsView', 'personalTipsView');
//                            }
//                        },
//                        {
//                            text: '在线人员',
//                            scale: 'small',
//                            tooltip: '在线人员',
//                            iconAlign: 'top',
////                    margins: '0 0 0 10',
//                            itemId:'onlineBtn',
//                            iconCls: 'icon-online',
////          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_online',mode:'disable'}),
//                            handler: function () {
////                        Ext.widget('onlineUser').show();
//                            }
//                        },
                        { xtype: 'tbfill'},
                        {
                            xtype: 'label',
                            iconCls: 'grid-add',
                            id: 'head-lb-1',
                            cls: 'welcome',
                            style: 'font-size:12px',
                            text: '欢迎您, '+globalRes.userFullName
                        },
                        '-',
                        {
                            xtype: 'label',
                            id: 'head-lb-3',
                            cls: 'welcome',
                            style: 'font-size:12px',
                            text: '今天是：' +this.getToday()
                        }
                    ],
                    items:[
                        {
                            xtype:'userMenu',
                        },
                        {
                            xtype:'userCenterPanel'
                        },
                        {
                            xtype:'userFooter'
                        }
                    ]
                }
            ] 
        }); 
        me.callParent(arguments);
       Ext.QuickTips.init();
    },
    getToday:function(){
        var today = new Date();
        var date = Ext.Date.format(today, 'Y年m月d日');
        var week = Ext.Date.format(today, 'w');
        var weekArray = new Array("日","一","二","三","四","五","六");
        return date +' 星期'+weekArray[week];
    }
});
