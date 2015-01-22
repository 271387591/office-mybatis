Ext.define('FlexCenter.UserToolbar', {
	extend: 'Ext.toolbar.Toolbar',
	alias: 'widget.userToolbar',
	requires: [
//		'OzSOA.jiuzhai.view.home.IndexView',
//		'OzSOA.ChangePassword',
//		'OzSOA.jiuzhai.view.home.CompanyHomeView',
//		'OzSOA.jiuzhai.view.system.ProfileForm',
//		'OzSOA.jiuzhai.view.UserSelector',
//		'OzSOA.jiuzhai.view.OnlineUser',
//		'OzSOA.jiuzhai.view.info.PersonalTipsView',
////  'OzSOA.jiuzhai.view.info.TipPanel',
//		'OzSOA.jiuzhai.view.search.SearchNewsView',
//		'OzSOA.jiuzhai.view.search.SearchNoticeView',
//		'OzSOA.jiuzhai.view.search.SearchDocumentView',
//		'OzSOA.jiuzhai.view.search.SearchDairyView',
//		'OzSOA.jiuzhai.view.search.SearchWorkPlanView',
//		'OzSOA.jiuzhai.view.search.SearchEmailView',
		'FlexCenter.Constants'
	],
	initComponent: function () {
		var me = this;
		Ext.apply(this, {
			border: false,
			items: [
				{
					xtype: 'button',
					text: '协同办公',
					scale: 'small',
					iconCls: 'office_auto',
					iconAlign: 'top',
					margin: '0 8 0 10',
                    itemId:'officeAutoBtn',
					tooltip: '协同办公',
//          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_officeAuto',mode:'hide'}),
					handler: function () {
                        me.changeMenuMode(this.itemId);
						var treeNav = me.ownerCt.ownerCt.down("#treeNav");
						treeNav.loadMenuItem(FlexCenter.Constants.USER_OA_MENU, this.tooltip);
					}
				},
				{
					xtype: 'button',
					text: '我的流程',
					scale: 'small',
					iconCls: 'workflow-manager-16',
                    itemId:'workflowManagerBtn',
					tooltip: '我的流程',
					iconAlign: 'top',
					margin: '0 0 0 10',
//          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_myWorkflow',mode:'hide'}),
					handler: function () {
//                        this.addCls('office_auto');
                        me.changeMenuMode(this.itemId);
//                        this.setText('<font color="red">'+this.getText()+'</font>')
						var treeNav = me.ownerCt.ownerCt.down("#treeNav");
						treeNav.loadMenuItem(FlexCenter.Constants.USER_WORKFLOW_MENU, this.tooltip);
					}
				},
				{
					xtype: 'button',
					text: '我的首页',
					scale: 'small',
					iconCls: 'index-page',
					iconAlign: 'top',
                    itemId:'indexPageBtn',
					margin: '0 0 0 10',
					tooltip: '我的首页',
//          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_myIndex',mode:'disable'}),
					handler: function () {
//						var centerTabPanel = me.ownerCt.ownerCt.down('#centerPanel');
//						centerTabPanel.addPanel('indexView', 'indexPage');
					}
				},
				{
					xtype: 'button',
					text: '公司主页',
					scale: 'small',
					tooltip: '公司主页',
					iconCls: 'company-home',
                    itemId:'companyHomeBtn',
					iconAlign: 'top',
					margin: '0 0 0 10',
//          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_companyHome',mode:'disable'}),
					handler: function () {
//						var centerTabPanel = me.ownerCt.ownerCt.down('#centerPanel');
//						centerTabPanel.addPanel('companyHomeView', 'companyHome');
					}
				},
				{
					xtype: 'button',
					text: '修改个人资料',
					scale: 'small',
					tooltip: '修改个人资料',
					iconCls: 'edit_profile',
                    itemId:'editProfileBtn',
					iconAlign: 'top',
					margin: '0 0 0 10',
//          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_editProfile',mode:'disable'}),
					handler: function () {
//						var centerTabPanel = me.ownerCt.ownerCt.down('#centerPanel');
//						centerTabPanel.addPanel('profileForm', 'profileForm');
					}
				},
				{
					xtype: 'button',
					text: '便 签',
					scale: 'small',
					tooltip: '便 签',
					iconAlign: 'top',
                    itemId:'iconNoteBtn',
					margins: '0 0 0 10',
					iconCls: 'icon-note',
//          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_userNote',mode:'disable'}),
					handler: function () {
//						var centerTabPanel = me.ownerCt.ownerCt.down('#centerPanel');
//						centerTabPanel.addPanel('personalTipsView', 'personalTipsView');
					}
				},
				'-',
                {
                    xtype: 'button',
                    text: '在线人员',
                    scale: 'small',
                    tooltip: '在线人员',
                    iconAlign: 'top',
                    margins: '0 0 0 10',
                    itemId:'onlineBtn',
                    iconCls: 'icon-online',
//          plugins: Ext.create('Oz.access.RoleAccess', {featureName:'_online',mode:'disable'}),
                    handler: function () {
//                        Ext.widget('onlineUser').show();
                    }
                },
//				{
//					xtype: 'textfield',
//					id: 'searchKeyword'
//				},
//				{
//					xtype: 'combo',
//					editable: false,
//					queryMode: 'local',
//					width: 80,
//					id: 'searchBoxCmp',
//					triggerAction: 'all',
//					value: 'News',
//					store: [
//						['News', '新闻'],
//						['Notice', '公告'],
//						['Document', '个人文档'],
//						['Diary', '个人日志'],
//						['WorkPlan', '工作计划'],
//						['Email', '邮件']
//					]
//				},
//				{
//					xtype: 'button',
//					text: '搜索',
//					iconCls: 'search',
//					handler: function () {
//						var boxValue = Ext.getCmp('searchBoxCmp').getValue();
//						if (null === boxValue || '' === boxValue) return;
//						var widgetValue = '';
//						switch (boxValue) {
//							case 'News':
//							{
//								widgetValue = 'searchNewsView';
//								break;
//							}
//							case 'Notice':
//							{
//								widgetValue = 'searchNoticeView';
//								break;
//							}
//							case 'Document':
//							{
//								widgetValue = 'searchDocumentView';
//								break;
//							}
//							case 'Diary':
//							{
//								widgetValue = 'searchDairyView';
//								break;
//							}
//							case 'WorkPlan':
//							{
//								widgetValue = 'searchWorkPlanView';
//								break;
//							}
//							case 'Email':
//							{
//								widgetValue = 'searchEmailView';
//								break;
//							}
//							default :
//							{
//								widgetValue = '';
//							}
//						}
//						if ('' === widgetValue) return;
//						var centerTabPanel = me.ownerCt.ownerCt.down('#centerPanel');
//						var searchKeywordValue = Ext.getCmp('searchKeyword').getValue();
//						centerTabPanel.addSearchPanel(widgetValue, widgetValue, null, searchKeywordValue);
//					}
//				},
				'-'
			]
		});
		this.callParent(arguments);
	},
    changeMenuMode:function(btn){
        var me=this,items=me.items.items;
        if(items){
            for(var i=0;i<items.length;i++){
                var itemId=items[i].itemId;
                if(itemId){
                    var item=me.down('#'+itemId);
                    var text=item.tooltip;
                    var text1=item.text;
                    if(btn==itemId){
                        item.setText('<font color="red">'+text+'</font>');
                    }else{
                        item.setText(text);
                    }
                }
            }
        }
    }
});
