Ext.define('FlexCenter.UserMenu', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.userMenu',
	requires: [
		'FlexCenter.user.view.UserView',
		'FlexCenter.user.view.RoleView',
		'FlexCenter.user.view.FeatureView',
		'FlexCenter.forms.view.FlowFormView',
		'FlexCenter.flows.view.ProcessListView',
		'FlexCenter.flows.view.ProcessDefinitionView',
		'FlexCenter.flows.view.TaskView',
		'FlexCenter.flows.view.ProcessDefInstanceDraftView',
		'FlexCenter.flows.view.ReplevyTaskView',
		'FlexCenter.flows.view.ApplyProcessHistoryView'
	],
	initComponent: function () {
		var me = this;
		var shortcutDataArray=[
		];
		if((globalRes.isAdmin || accessRes.showUserManager)){
			shortcutDataArray.push({
				id: '1',
				text: userRoleRes.title,
				iconCls: 'down-diary-icon',
				expanded: true,
				leaf: false,
				children:[
					{ text: userRoleRes.manageUser, leaf: true,widget:'userView'},
					{ text: userRoleRes.manageRole, leaf: true,widget:'roleView'},
					{ text: '权限管理', leaf: true,widget:'featureView'}
				]
			});
		}
		shortcutDataArray.push({
			id: '2',
			text: '表单模块',
			iconCls: 'down-diary-icon',
			expanded: true,
			leaf: false,
			children:[
				{ text: '表单设计', leaf: true,widget:'flowFormView'}
			]
		});
		shortcutDataArray.push({
			id: '3',
			text: '流程模块',
			iconCls: 'down-diary-icon',
			expanded: true,
			leaf: false,
			children:[
				{ text: '流程设计', leaf: true,widget:'processListView'},
				{ text: workFlowRes.flowIndex.processDefinitionViewTitle, leaf: true,widget:'processDefinitionView'},
				{ text: workFlowRes.flowIndex.taskViewTitle, leaf: true,widget:'taskView'},
				{ text: workFlowRes.flowIndex.processDefInstanceDraftViewTitle, leaf: true,widget:'processDefInstanceDraftView'},
				{ text: workFlowRes.flowIndex.replevyTaskViewTitle, leaf: true,widget:'replevyTaskView'},
				{ text: workFlowRes.flowIndex.applyProcessHistoryViewTitle, leaf: true,widget:'applyProcessHistoryView'},
			]
		});
		
        var store = Ext.create('Ext.data.TreeStore', {
            fields:['widget','text','id','iconCls','widgetItemId','leaf','config','children'],
			root: {
				expanded: true,
				children: shortcutDataArray
			}
        });
		
		Ext.apply(this, {
			itemId: 'treeNav',
			region: 'west',
			split: true,
			width: 212,
			minSize: 130,
			maxSize: 300,
			rootVisible: false,
			containerScroll: true,
			autoScroll: false,
			store: store,
			listeners: {
				itemclick: function (view, record, item, index) {
                    var widget = record.data.widget, itemId = widget+'_index', config = record.data.config || {};
					Ext.apply(config,{
						title:record.data.text,
						itemId:itemId,
						closable:true
					});
					if (!widget) return;
					var centerTabPanel = Ext.ComponentQuery.query('#centerPanel')[0];
					centerTabPanel.addPanel(widget, itemId, config);
				},
				itemcontextmenu: function (view, record, item, index, e, eOpts) {
					e.preventDefault();
					e.stopEvent();
				}
			}
		});
		this.callParent(arguments);
		
	}
});
