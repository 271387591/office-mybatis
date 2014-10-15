Ext.define('FlexCenter.UserMenu', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.userMenu',
	requires: [
        'FlexCenter.flows.view.ProcessDefinitionView',
        'FlexCenter.flows.view.ProcessDefInstanceDraftView',
        'FlexCenter.flows.view.TaskView',
        'FlexCenter.flows.view.TaskAssigneeView'
	],

	initComponent: function () {
		var me = this;
        var store = Ext.create('Ext.data.TreeStore', {
            fields:['widget','text','id','iconCls','widgetItemId','leaf','config','children'],
            root: {
                text: '.',
				id: 'src',
                expanded: true,
                children:[]
            },
            proxy:{
                type:'memory',
                reader:{
                    type:'json'
                }
            }
        });
		Ext.apply(this, {
			title: '导航菜单',
			itemId: 'treeNav',
			iconCls: 'view_tree',
//      margins: '0 0 1 0',
			region: 'west',
//      enableDD: false,
			split: true,
			width: 212,
			minSize: 130,
			maxSize: 300,
			rootVisible: false,
			containerScroll: true,
			collapsible: true,
			autoScroll: false,
			store: store,
			listeners: {
				itemclick: function (view, record, item, index) {
                    var widget = record.data.widget, itemId = record.data.widgetItemId, config = record.data.config;
					if (!widget || !itemId) return;
					var centerTabPanel = me.ownerCt.ownerCt.down('#centerPanel');
					centerTabPanel.addPanel(widget, itemId, config);
				},
				itemcontextmenu: function (view, record, item, index, e, eOpts) {
					e.preventDefault();
					e.stopEvent();
				}
			}
		});
		this.callParent(arguments);
		this.loadMenuItem(FlexCenter.Constants.USER_OA_MENU, '协同办公');
	},
	loadMenuItem: function (item, title) {
		var me = this;
		me.setTitle(title);
		var root = me.getRootNode();
		if (root) {
			root.removeAll();
			root.appendChild(item);
		}
	}
});
