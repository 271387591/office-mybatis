Ext.define('FlexCenter.UserCenterPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.userCenterPanel',
	requires: [
		'Ext.ux.TabCloseMenu',
		'FlexCenter.UserToolbar',
//        'FlexCenter.activiti.view.ProcessDefinitionView',
//        'FlexCenter.activiti.view.ApplyProcessDetailView',
//        'FlexCenter.activiti.view.ApplyProcessView',
//        'FlexCenter.activiti.view.ClawBackTaskView',
//        'FlexCenter.activiti.view.ATaskView'
//		'FlexCenter.view.home.IndexView'
	],

	initComponent: function () {
		Ext.apply(this, {
			itemId: 'centerPanel',
			region: 'center',
			resizeTabs: true,
			enableTabScroll: true,
			defaults: {
				autoScroll: true
			},
			activeTab: 0,
			items: [
//				{
//					xtype: 'indexView',
//					closable: true
//				}
			],
			plugins: Ext.create('Ext.ux.TabCloseMenu', {
				closeTabText: '关闭当前',
				closeOthersTabsText: '关闭其他',
				closeAllTabsText: '关闭所有'
			})
		});
		this.callParent(arguments);
	},

	addPanel: function (widget, itemId, config) {
		var me = this;
		var panel = Ext.ComponentQuery.query('#' + itemId)[0];
		if (!panel) {
			if (config) {
				panel = Ext.widget(widget, config);
			} else {
				panel = Ext.widget(widget);
			}

			me.add(panel);
		}
		me.setActiveTab(panel);
	},
	addSearchPanel: function (widget, itemId, config, searchKeywordValue) {
		var me = this;
		var panel = Ext.ComponentQuery.query('#' + itemId)[0];
		if (!panel) {
			if (config) {
				panel = Ext.widget(widget, config, {
					indexSearchField: searchKeywordValue
				});
			} else {
				panel = Ext.widget(widget, {
					indexSearchField: searchKeywordValue
				});
			}
			me.add(panel);
		} else {
			panel.activeIndexSearch(searchKeywordValue);
		}
		me.setActiveTab(panel);
	}
});
