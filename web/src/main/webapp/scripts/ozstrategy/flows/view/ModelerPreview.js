/**
 * Created by lihao on 9/17/14.
 */
Ext.define('FlexCenter.flows.view.ModelerPreview', {
    requires: [
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.modelerPreview',
    autoScroll: true,
    graph:null,
    inheritableStatics: {
//      disableTooltip: false,

        setDisableTooltip: function (value) {
            this.disableTooltip = value;
        },
        isDisableTooltip: function () {
            return this.disableTooltip == true;
        }
    },
    initComponent: function () {
        var me = this;
        me.dockedItems= [{
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    iconCls: 'zoomIn',
                    tooltip: '放大',
                    handler: function(button,evt){
                        me.zoomIn();
                    }
                },'-',
                {
                    iconCls: 'zoomOut',
                    tooltip: '缩小',
                    handler: function(button,evt){
                        me.zoomOut();
                    }
                },'-',
                {
                    iconCls: 'zoomActual',
                    tooltip: '实际大小',
                    handler: function(button,evt){
                        me.actualSize();
                    }
                }
            ]
        }];
        me.listeners={
            afterrender:function(panel){
                var dom=panel.body.dom.firstChild.children[0]
                me.initGraph(dom);
            }
        };
        me.callParent(arguments);
    },
    
    zoomIn:function(){
        this.editor.execute('zoomIn');
    },
    zoomOut:function(){
        this.editor.execute('zoomOut');
    },
    actualSize:function(){
        this.editor.execute('actualSize');
    },
    initGraph:function(dom){
        var me=this;
        var modeler=new mxModeler(dom,'mxgraph/config/templates.xml');
        
//        modeler.setConnectImagePath('mxgraph/images/connector.gif');
        me.graph=modeler.getGraph();
        me.editor= modeler.getEditor();
        mxEvent.disableContextMenu(document.body);
//        me.tooltip = Ext.create('Ext.tip.ToolTip', {
//            target: me.graph.container,
//            html: '',
//            listeners: {
//                scope: me,
//                beforeshow: function () {
//                    return (!me.self.isDisableTooltip()) && me.enableShowTip === true;
//                },
//                hide: function () {
//                    me.enableShowTip = false;
//                }
//            }
//        });
//        me.graph.tooltipHandler.show = function (tip, x, y) {
//            if (tip != null && tip.length > 0) {
//                me.enableShowTip = true;
//                me.tooltip.update(tip);
//                me.tooltip.showAt([x, y + mxConstants.TOOLTIP_VERTICAL_OFFSET]);
//            }
//        };
//
//        me.graph.tooltipHandler.hide = function () {
//            me.tooltip.hide();
//        };
        me.graph.setCellsLocked(true);
        me.graph.setConnectable(false);
        me.graRes?modeler.reloadGraph(me.graRes):'';
        if(me.taskType=='Countersign'){
            var overlay = new mxCellOverlay(
                new mxImage('mxgraph/images/overlays/check.png', 16, 16),
                null,mxConstants.ALIGN_CENTER,mxConstants.ALIGN_TOP);
            var cell=me.graph.getModel().getCell(me.taskKey.substr(2));
            if(cell!=null){
                me.graph.addCellOverlay(cell,overlay);
            }
        }
    }
});