Ext.define('FlexCenter.UserCenterPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.userCenterPanel',
	requires: [
		'FlexCenter.UserIndex',
		'Ext.ux.TabCloseMenu'
	],
	initComponent: function () {
		Ext.apply(this, {
			itemId: 'centerPanel',
			resizeTabs: true,
			enableTabScroll: true,
			defaults: {
				autoScroll: true
			},
			activeTab: 0,
			plain: true,
			border:false,
			items: [
				{
					xtype:'userIndex',
					iconCls: 'view_tree',
					tabConfig:{
						title: '导航',
						tooltip: '导航'
					}
				}
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
	}
});
