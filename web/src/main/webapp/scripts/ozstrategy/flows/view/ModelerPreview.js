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
        mxEvent.disableContextMenu(document.body);
        var xmlRequest = mxUtils.load('mxgraph/config/templates.xml');
        var node = xmlRequest.getDocumentElement();
        var editor = new mxEditor(node);
        me.editor= editor;
        var graph=editor.graph;
        var getTooltipForCell = graph.getTooltipForCell;
        graph.getTooltipForCell = function(cell)
        {
            if (graph.getModel().isEdge(cell))
            {
                var src = this.getLabel(this.getModel().getTerminal(cell, true));
                var trg = this.getLabel(this.getModel().getTerminal(cell, false));

                return src + ' ' + cell.value.nodeName + ' ' +  trg;
            }
            return getTooltipForCell.apply(this, arguments);
        };
        graph.getLabel=function(cell){
            return cell?(mxUtils.isNode(cell.value)?cell.getAttribute('value', ''):(cell.isEdge()?cell.value:'')):'';
        };
        graph.convertValueToString = function(cell){
            return 'sdfsdf';
        };
        graph.init(dom);
        if (mxClient.IS_GC || mxClient.IS_SF){
            graph.container.style.background = '-webkit-gradient(linear, 0% 0%, 100% 0%, from(#FFFFFF), to(#FFFFEE))';
        }
        else if (mxClient.IS_NS){
            graph.container.style.background = '-moz-linear-gradient(left, #FFFFFF, #FFFFEE)';
        }
        else if (mxClient.IS_IE){
            graph.container.style.filter = 'progid:DXImageTransform.Microsoft.Gradient('+
                'StartColorStr=\'#FFFFFF\', EndColorStr=\'#FFFFEE\', GradientType=1)';
        }
        me.tooltip = Ext.create('Ext.tip.ToolTip', {
            target: graph.container,
            html: '',
            listeners: {
                scope: me,
                beforeshow: function () {
                    return (!me.self.isDisableTooltip()) && me.enableShowTip === true;
                },
                hide: function () {
                    me.enableShowTip = false;
                }
            }
        });
        graph.tooltipHandler.show = function (tip, x, y) {
            if (tip != null && tip.length > 0) {
                me.enableShowTip = true;
                me.tooltip.update(tip);
                me.tooltip.showAt([x, y + mxConstants.TOOLTIP_VERTICAL_OFFSET]);
            }
        };

        graph.tooltipHandler.hide = function () {
            me.tooltip.hide();
        };
        graph.setCellsLocked(true);
        me.setGraph(graph);
        me.graRes?me.reloadGraph(me.graRes):'';
    },
    setGraph:function(graph){
        this.graph=graph;
    },
    getGraph:function(){
        return this.graph;
    },
    reloadGraph:function(source){
        var me=this;
        var xmlDocument = mxUtils.parseXml(source);
        var codec = new mxCodec(xmlDocument);
        codec.decode(xmlDocument.documentElement,me.editor.graph.model);
    }
});