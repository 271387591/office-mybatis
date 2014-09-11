Ext.define('FlexCenter.FlowManagerView', {
    extend:'Oz.desktop.Module',

    requires:[
        'FlexCenter.activiti.view.AModelView',
        'FlexCenter.activiti.view.AModelFormManager',
        'FlexCenter.activiti.view.ProcessInstanceView',
        'FlexCenter.activiti.view.ProcessHistoryView',
        'FlexCenter.flows.view.ProcessListView'
    ],

    id:'flowManagerView',
    moduleName:'flowManagerView',

    init:function () {
        this.launcher = {
            text:workFlowRes.flowManagerTitle,
            iconCls:'icon-tsm',
            handler:this.createWindow,
            scope:this
        };
    },

    createWindow:function () {
        var desktop = this.app.getDesktop(), win;
//    console.log(globalRes);

        win = desktop.getWindow('myFlowManagerWindow');
        if (!win) {
            win = desktop.createWindow({
                id:'myFlowManagerWindow',
                title:workFlowRes.flowManagerTitle,
                shim:false,
                modal:true,
                border:false,
//                resizable: false,
                maximized: true,
                maximizable:false,
                layout:'fit',
                items:[
                    {
                        xtype:'tabpanel',
                        itemId:'myActivitiFlowManagerViewTab',
                        items:[
                            {
                                xtype:'processListView',
                                title:'流程设计'
                            },{
                                xtype:'aModelView',
                                title:workFlowRes.flowDefineManagerTitle
                            },{
                                xtype:'processInstanceView',
                                title:'运行中流程实例'

                            },{
                                xtype:'processHistoryView',
                                title:'已结束流程'

                            }
                        ]
                    }
                ]
            });
        }

        win.show();
    }


});