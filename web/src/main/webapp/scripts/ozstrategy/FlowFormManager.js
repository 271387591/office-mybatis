/**
 * Created by lihao on 8/8/14.
 */
Ext.define('FlexCenter.FlowFormManager', {
    extend:'Oz.desktop.Module',

    requires:[
        'FlexCenter.forms.view.FlowFormView'
    ],
    id:'flowFormManager',
    moduleName:'flowFormManager',
    init:function () {
        this.launcher = {
            text:'表单管理',
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
                id:'myFlowFormManagerWindow',
                title:'表单管理',
                shim:false,
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
                                xtype:'flowFormView',
                                title:'流程表单管理'
                            }
                        ]
                    }
                ]
            });
        }

        win.show();
    }
});
