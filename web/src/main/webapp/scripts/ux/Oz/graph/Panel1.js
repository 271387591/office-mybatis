/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-28
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.graph.Panel', {
    extend: 'Ext.panel.Panel',
//    requires: ['Ext.grid.View'],
    alias: ['widget.graphpanel', 'widget.graph'],
    alternateClassName: ['Oz.graph.GraphPanel'],

    /**
     * @cfg {Boolean} columnLines Adds column line styling
     */

    initComponent: function() {
      var me = this;

      if (!mxClient.isBrowserSupported()) {
        // Displays an error message if the browser is not supported.
        Ext.Msg.show({
            title: me.getTitle(),
            width: messageBoxRes.width,
            msg: graphRes.notSupportError,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
          }
        );

        return;
      }

      me.supported = true;

      me.callParent();
    },

    onRender: function(ct, position){
      var me = this;

      // Call to super after adding the header, to prevent an unnecessary re-layout
      me.callParent(arguments);

      if(me.supported){
        me.initGraph();
      }
    },

    beforeDestroy: function() {
      var me = this;
      delete me.graph;
      delete me.highlight;
      delete me.tooltipHanlder;
      delete me.keyHandler;

      Ext.destroy(me.orgCreateShape, me.orgRedraw, me.orgDestroy);

      this.callParent();
    },

    createPopupMenu: function(graph, cell, evt) {
      return;
    },

    getTooltipForCell: function(cell){
      return mxGraph.prototype.getTooltipForCell.apply(this, arguments); // "supercall"
    },

    convertValueToString: function(cell){
      return cell.getValue();
    },

    getLabel: function(cell){
      var me = this,
        model = me.graph.getModel(),
        geometry = model.getGeometry(cell),
        label = me.convertValueToString(cell);

      label = (me.labelsVisible) ? label : '';

      if (!model.isCollapsed(cell) &&
        geometry != null &&
        (geometry.offset == null ||
          (geometry.offset.x == 0 &&
            geometry.offset.y == 0)) &&
        model.isVertex(cell) &&
        geometry.width >= 2) {
        var style = this.getCellStyle(cell);
        var fontSize = style[mxConstants.STYLE_FONTSIZE] ||
          mxConstants.DEFAULT_FONTSIZE;
        var max = geometry.width / (fontSize * 0.625);

        if (max < label.length) {
          return label.substring(0, max) + '...';
        }
      }

      return label;
    },

    getSecondLabel: function(cell){
      return '';
    },

    createShape: function(state) {
      var me = this,
        graph = me.graph;
      if (me.secondLabelVisible && !state.cell.geometry.relative) {
        var secondLabel = graph.getSecondLabel(state.cell);

        if (secondLabel != null && state.shape != null && state.secondLabel == null) {
          state.secondLabel = new mxText(secondLabel, new mxRectangle(), mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM);

          state.secondLabel.dialect = state.shape.dialect;
          state.secondLabel.init(state.view.getDrawPane());
        }
      }
    },

    // Redraws the shape number after the cell has been moved/resized
    redraw: function(state) {
      var me = this,
        graph = me.graph;

      if (state.shape != null && state.secondLabel != null) {
        var scale = graph.getView().getScale();
        var bounds = new mxRectangle(state.x, state.y + 8 * scale, 0, 0);
        state.secondLabel.value = graph.getSecondLabel(state.cell);
        state.secondLabel.scale = scale;
        state.secondLabel.bounds = bounds;
        state.secondLabel.redraw();
      }
    },

    // Destroys the shape number
    destroy: function(state) {
      if (state.secondLabel != null) {
        state.secondLabel.destroy();
        state.secondLabel = null;
      }
    },

    isCellVisible: function(cell) {
      var me = this;
      return !me.model.isVertex(cell) || cell.geometry == null ||
        !cell.geometry.relative ||
        cell.geometry.relative == me.relativeChildVerticesVisible;
    },

    initGraph: function(){
      var me = this,
        // Creates the graph inside the given container
        graph = me.graph = new mxGraph(me.body.dom),
        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        parent = me.parent = graph.getDefaultParent();

      // Set some stylesheet options for the visual appearance
      var style = graph.getStylesheet().getDefaultVertexStyle();
      style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
      style[mxConstants.STYLE_ROUNDED] = true;
      style[mxConstants.STYLE_SHADOW] = true;
      style[mxConstants.STYLE_SPACING] = 8;

      //      style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'white';
      //      style[mxConstants.STYLE_LABEL_BORDERCOLOR] = 'white';

      style = graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_ROUNDED] = true;
      style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;

      // Enables automatic sizing for vertices after editing and
      // panning by using the left mouse button.
      graph.setCellsMovable(false);
      graph.setAutoSizeCells(true);
      graph.setPanning(true);
      graph.panningHandler.useLeftButtonForPanning = true;

      // Disables basic selection and cell handling
      graph.setEnabled(false);

      // Highlights the vertices when the mouse enters
      me.highlight = new mxCellTracker(graph, '#00FF00');

      // Enables tooltips for the overlays
      graph.setTooltips(true);

      me.tooltipHanlder = new mxTooltipHandler(graph);
      me.tooltipHanlder.setHideOnHover(true);
      me.tooltipHanlder.mouseDown = function(sender, me) {
        me.tooltipHanlder.hide();
      }
      me.tooltipHanlder.mouseMove = function(sender, me) {
        me.tooltipHanlder.hide();
      }
      me.tooltipHanlder.mouseUp = function(sender, me) {
        me.tooltipHanlder.hide();
      }

      // Displays a popupmenu when the user clicks
      // on a cell (using the left mouse button) but
      // do not select the cell when the popup menu
      // is displayed
      graph.panningHandler.useLeftButtonForPopup = false;
      graph.panningHandler.selectOnPopup = true;

      // Stops editing on enter or escape keypress
      me.keyHandler = new mxKeyHandler(graph);

      graph.addMouseListener({
          mouseDown: function(sender, evt) {
            var cell = evt.getCell();
            if ((cell != null) && (graph.getModel().isVertex(cell))) {
              // clear current working cell
              if (curCell) {
                graph.setCellStyles(mxConstants.STYLE_GRADIENTCOLOR, 'white', [curCell]);
              }

              curCell = cell;
              graph.setCellStyles(mxConstants.STYLE_GRADIENTCOLOR, '#2DFF2C', [curCell]);
            }
          },
          mouseMove: function(sender, evt) {
          },
          mouseUp: function(sender, evt) {
          }
        });

      //      // Enables automatic layout on the graph and installs
      //      // a tree layout for all groups who's children are
      //      // being changed, added or removed.
      //      var layout = new mxCompactTreeLayout(graph, false);
      //      layout.useBoundingBox = false;
      //      layout.levelDistance = 30;
      //      layout.nodeDistance = 10;
      //
      //      // Allows the layout to move cells even though cells
      //      // aren't movable in the graph
      //      layout.isVertexMovable = function(cell)
      //      {
      //        return true;
      //      };
      //
      //      var layoutMgr = new mxLayoutManager(graph);
      //
      //      layoutMgr.getLayout = function(cell)
      //      {
      //        if (cell.getChildCount() > 0)
      //        {
      //          return layout;
      //        }
      //      };

      // Installs a popupmenu handler using local function (see below).
      graph.panningHandler.factoryMethod = function(menu, cell, evt) {
        tooltipHanlder.hide();

        return me.createPopupMenu(graph, cell, evt);
      };

      graph.getTooltipForCell = function(cell) {
        return me.getTooltipForCell();
      }

      // Disables the folding icon
      graph.isCellFoldable = function(cell) {
        return false;
      }

      // Truncates the label to the size of the vertex
      graph.getLabel = function(cell) {
        return me.getLabel(cell);
      };

      // Hook for returning shape number for a given cell
      graph.getSecondLabel = function(cell) {
        return me.getSecondLabel(cell);
      };

      // Overrides method to hide relative child vertices
      graph.isCellVisible = function(cell) {
        return me.isCellVisible(cell);
      };

      // Creates the shape for the shape number and puts it into the draw pane
      me.orgCreateShape = graph.cellRenderer.createShape;
      graph.cellRenderer.createShape = function(state) {
        me.orgCreateShape.apply(this, arguments);
        me.createShape(state);
      };

      // Redraws the shape number after the cell has been moved/resized
      me.orgRedraw = graph.cellRenderer.redraw;
      graph.cellRenderer.redraw = function(state) {
        me.orgRedraw.apply(this, arguments);
        me.redraw(state);
      };

      // Destroys the shape number
      me.orgDestroy = graph.cellRenderer.destroy;
      graph.cellRenderer.destroy = function(state) {
        me.orgDestroy.apply(this, arguments);
        me.destroy(state);
      };
    }
  }
);