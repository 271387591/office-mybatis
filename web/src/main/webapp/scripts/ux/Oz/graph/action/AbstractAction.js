/**
 * Created by IntelliJ IDEA.
 * User: wangy
 * Date: 11/4/11
 * Time: 10:13 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.graph.action.AbstractAction', {
  alternateClassName: ['Oz.graph.AbstractAction'],

  requires: [],

  config: {
    /**
     *  <pre>
     actionStyles: {
     property: 'hasQueueAction',
     image: 'program-icon.png',
     vAlign: mxConstants.ALIGN_RIGHT,
     hAlign: mxConstants.ALIGN_MIDDLE
     fn: function(sender, evt)
     {
     	var cell = evt.getProperty('cell');
     	graph.setSelectionCell(cell);
     }
     }
     *  </pre>
     */
    actionStyles: undefined
  },

  constructor: function(config) {
    config = config || {};

    Ext.apply(this, config);

    this.init();
  },

  init: function() {

  },

  destroy: function() {
    delete this.graphPanel;
    delete this.graph;
    delete this.node;
    delete this.cell;
  },

  onAppendAction: Ext.emptyFn,
  onDetachAction: Ext.emptyFn,

  getVertexMenus: function(readOnly, status) {
    return [];
  },

  getEdgeMenus: function(readOnly, status) {
    return [];
  },

  getGraphMenus: function(readOnly, status) {
    return [];
  },

  ifShowVertexMenus: function(strategyRecord) {
    return true;
  },

  ifShowEdgeMenus: function(strategyRecord) {
    return true;
  },

  ifShowGraphMenus: function(strategyRecord) {
    return true;
  },

  setGraphPanel: function(graphPanel) {
    this.graphPanel = graphPanel;
  },

  getGraphPanel: function(graphPanel) {
    return this.graphPanel;
  },

  setGraph: function(graph) {
    return this.graph = graph;
  },

  getGraph: function() {
    return this.graph;
  },

  setCell: function(cell) {
    this.cell = cell;
  },

  setCellValue: function(name, value) {
    this.node.set(name, value);
  },

  getCell: function() {
    return this.cell;
  },

  setNode: function(node) {
    this.node = node;
  },

  getNode: function() {
    return this.node
  },

  appendCellIcons: function(cell, node, ignoreStatusBar) {
    var me = this;

    var actionStyles = this.actionStyles;
    if (actionStyles) {
      if (Ext.isArray(actionStyles)) {
        Ext.each(actionStyles, function(style) {
          me.addCellIcon(cell, node, style);
        });
      } else {
        me.addCellIcon(cell, node, actionStyles);
      }
    }
    if(!ignoreStatusBar)
      me.graphPanel.updateGraphDetails();
  },

  updateCellIcons: function(cell, node) {
    this.detachCellIcons(cell, node)
    this.appendCellIcons(cell, node)
  },

  addCellIcon: function(cell, node, style) {
    if (node.get(style.property)) {
      var overlay = new mxCellOverlay(new mxImage(mxClient.imageBasePath + '/../../../../images/actions/' + style.image, style.width || 16, style.height || 16), style.text, style.vAlign, style.hAlign);
      this.graph.addCellOverlay(cell, overlay);
      if (style.fn){
        overlay.addListener(mxEvent.CLICK, style.fn);
        this.onAppendAction();
      }
    }
  },

  detachCellIcons: function(cell, value) {
    var me = this;

    var actionStyles = this.actionStyles;
    if (actionStyles) {
      if (Ext.isArray(actionStyles)) {
        Ext.each(actionStyles, function(style) {
          me.removeCellIcon(cell, value, style);
        });
      } else {
        me.removeCellIcon(cell, value, actionStyles);
      }
    }
    me.graphPanel.updateGraphDetails();
  },

  removeCellIcon: function(cell, value, style) {
    var me = this,
      overlays = this.graph.getCellOverlays(cell);

    try{
      Ext.each(overlays, function(overlay) {
        if (style.image && overlay.image.src == (mxClient.imageBasePath + '/../../../../images/actions/' + style.image)) {
          Ext.Function.defer(function(){
            me.graph.removeCellOverlay(cell, overlay);
            me.onDetachAction()
          },300);
        }
      });
    }catch(e){
    }

  }
});


