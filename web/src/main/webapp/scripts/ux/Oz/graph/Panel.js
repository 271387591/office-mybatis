/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-28
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.graph.Panel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.graphpanel', 'widget.graph'],
    alternateClassName: ['Oz.graph.GraphPanel'],

    requires: ['Ext.menu.Menu', 'Ext.tip.ToolTip'],

    inheritableStatics: {
//      disableTooltip: false,

      setDisableTooltip: function(value){
        this.disableTooltip = value;
      },

      isDisableTooltip: function(){
        return this.disableTooltip == true;
      }
    },

    enableEdgeMenu: false,

    actions: [],

    selectedCellColor: '#338020',

    secondLabelVisible: globalRes.showNodeId,
    thirdLabelVisible: globalRes.showNodeId,

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

      // Disables browser context menu
      mxEvent.disableContextMenu(document.body);

      // Makes the connection hotspot smaller
      mxConstants.DEFAULT_HOTSPOT = 0.3;

      // Makes the shadow brighter
      mxConstants.SHADOWCOLOR = '#C0C0C0';

      // Creates the graph and loads the default stylesheet
      me.graph = new mxGraph();

      // Inverts the elbow edge style without removing existing styles
      me.graph.flipEdge = function(edge){
        if (edge != null){
          var state = this.view.getState(edge);
          var style = (state != null) ? state.style : this.getCellStyle(edge);

          if (style != null){
            var elbow = mxUtils.getValue(style, mxConstants.STYLE_ELBOW,
              mxConstants.ELBOW_HORIZONTAL);
            var value = (elbow == mxConstants.ELBOW_HORIZONTAL) ?
              mxConstants.ELBOW_VERTICAL : mxConstants.ELBOW_HORIZONTAL;
            this.setCellStyles(mxConstants.STYLE_ELBOW, value, [edge]);
          }
        }
      };

      // Creates the command history (undo/redo)
      me.history = new mxUndoManager();

      // Sets the style to be used when an elbow edge is double clicked
      me.graph.alternateEdgeStyle = 'vertical';

      me.callParent();

      me.initActions();
    },

    initActions: function() {
      var me = this;

      me.actionMap = {};
      Ext.each(this.actions, function(action) {
        action.setGraphPanel(me);
        action.setGraph(me.graph);
        if (action.key) {
          me.actionMap[action.key] = action;
        }
      });
    },

    destroyActions: function() {
      var me = this;
      delete this.actionMap;
      Ext.each(this.actions, function(action, index) {
        action.destroy();
      });
      delete me.actions
    },


    onContextMenu : function(node, e){
      var me = this,
        menu = me.menu = Ext.create('Ext.menu.Menu', me.menuCfg),
        selected = !me.graph.isSelectionEmpty();

      menu.mon(menu, 'hide', me.onContextHide, me);

      // Adds a small offset to make sure the mouse released event
      // is routed via the shape which was initially clicked. This
      // is required to avoid a reset of the selection in Safari.
      me.menu.showAt([e.clientX + 1, e.clientY + 1]);
    },

    onContextHide : function(){
      if(this.ctxNode){
        this.ctxNode.ui.removeClass('x-node-ctx');
        this.ctxNode = null;
      }
    },

    afterRender: function(){
      var me = this,
        graph = me.graph;

      // Call to super after adding the header, to prevent an unnecessary re-layout
      me.callParent(arguments);

      if(me.supported){
        me.initGraph();
      }

      graph.addListener(mxEvent.CLICK, function(sender,evt)
      {
        var cell = evt.getProperty('cell');
        var event = evt.getProperty('event');
        if (cell != null){
          if(cell.isVertex()){
            if(mxEvent.isLeftMouseButton(event)){
               me.cellLeftClickHandler(cell,event);
            }
          }
        }
      });

//      graph.addListener(mxEvent.DOUBLE_CLICK, function(mxgraph,evt)
//      {
//        var cell = evt.getProperty('cell');
//        var event = evt.getProperty('event');
//        if (cell != null){
//          me.cellDoubleClickHandler(cell,event);
//        }
//      });
    },



    beforeDestroy: function() {
      var me = this;

      if(me.graph){
        me.graph.destroy();
      }
      delete me.graph;
      delete me.history;
      delete me.rubberband;
      delete me.highlight;
      delete me.keyHandler;

      Ext.destroy(me.tooltip);
      this.destroyActions();

      this.callParent();
    },

    initGraph: function(){
      var me = this,
        graph = me.graph,
        history = me.history,
        container = me.body.dom;

      // Creates the graph inside the given container

      // Enables scrollbars for the graph container to make it more
      // native looking, this will affect the panning to use the
      // scrollbars rather than moving the container contents inline
      container.style.overflow = 'auto';

      // Installs the command history after the initial graph
      // has been created
      var listener = function(sender, evt){
        history.undoableEditHappened(evt.getProperty('edit'));
      };

      graph.getModel().addListener(mxEvent.UNDO, listener);
      graph.getView().addListener(mxEvent.UNDO, listener);

      // Keeps the selection in sync with the history
      var undoHandler = function(sender, evt){
        var changes = evt.getProperty('edit').changes;
        graph.setSelectionCells(graph.getSelectionCellsForChanges(changes));
      };

      history.addListener(mxEvent.UNDO, undoHandler);
      history.addListener(mxEvent.REDO, undoHandler);

      // Initializes the graph as the DOM for the panel has now been created
      graph.init(container);

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

      // Redirects tooltips to ExtJs tooltips. First a tooltip object
      // is created that will act as the tooltip for all cells.
      me.tooltip = Ext.create('Ext.tip.ToolTip', {
        target: graph.container,
        html: '',
        listeners: {
          scope: me,
          // enable to show tooltip for graph's cell , not for graph container, and not show tooltip
          // when graph window is hidden.
          beforeshow: function(){
            return (!me.self.isDisableTooltip()) && me.enableShowTip === true;
          },
          hide: function(){
            me.enableShowTip = false;
          }
        }
      });

      // Installs the tooltip by overriding the hooks in mxGraph to
      // show and hide the tooltip.
      graph.tooltipHandler.show = function(tip, x, y) {
        if (tip != null && tip.length > 0) {
//          // Changes the DOM of the tooltip in-place if
//          // it has already been rendered
//          if (me.tooltip.body != null){
//            // TODO: Use mxUtils.isNode(tip) and handle as markup,
//            // problem is dom contains some other markup so the
//            // innerHTML is not a good place to put the markup
//            // and this method can also not be applied in
//            // pre-rendered state (see below)
//            //tooltip.body.dom.innerHTML = tip.replace(/\n/g, '<br>');
//            me.tooltip.body.dom.firstChild.nodeValue = tip;
//          }
//
//          // Changes the html config value if the tooltip
//          // has not yet been rendered, in which case it
//          // has no DOM nodes associated
//          else{
//          }
          me.enableShowTip = true;
          me.tooltip.update(tip);
          me.tooltip.showAt([x, y + mxConstants.TOOLTIP_VERTICAL_OFFSET]);
        }
      };

      graph.tooltipHandler.hide = function(){
        me.tooltip.hide();
      };

      // Stops editing on enter or escape keypress
      me.keyHandler = new mxKeyHandler(graph);

      // Enables automatic sizing for vertices after editing and
      // panning by using the left mouse button.
      graph.setCellsMovable(false);
      graph.setAutoSizeCells(true);
      graph.setPanning(true);
      graph.panningHandler.useLeftButtonForPanning = true;

      graph.foldingEnabled = false;

      // Disables basic selection and cell handling
      graph.setEnabled(false);

      // Sets the cursor
      graph.container.style.cursor = 'default';

      graph._updateCellStyles = function(cells, styles){
        var model = this.model;
        if (cells != null && cells.length > 0)
        {
          model.beginUpdate();
          try
          {
            for (var i = 0; i < cells.length; i++)
            {
              if (cells[i] != null)
              {
                for (var v in styles) {
                  var style = mxUtils.setStyle(
                    model.getStyle(cells[i]),
                    v, styles[v]);
                  model.setStyle(cells[i], style);
                }
              }
            }
          }
          finally
          {
            model.endUpdate();
          }
        }
      }

      var mxGraphDblClick = graph.dblClick;
      graph.dblClick = function(evt, cell)
      {
        if (cell == null)
        {
          var pt = mxUtils.convertPoint(this.container,
            mxEvent.getClientX(evt), mxEvent.getClientY(evt));
          cell = this.getCellAt(pt.x, pt.y);
        }
        if(cell&& cell.isVertex()){
          me.dblClick(cell);
        }

        mxGraphDblClick.call(this, evt, cell);
      };

      graph.addMouseListener({
        mouseDown: function(sender, evt) {

          var cell = evt.getCell();
          if (cell != null && cell.isVertex() && me.isNotInExceptStyle(cell.style)){
            if(me.selectedCell == cell){return;}
            if(me.selectedCell){
              var styles = {};
              styles[mxConstants.STYLE_STROKECOLOR]= me.selectedCellStyle;
              styles[mxConstants.STYLE_STROKEWIDTH]= me.selectedCellWidth;
              styles[mxConstants.STYLE_DASHED]= me.STYLE_DASHED;
              graph._updateCellStyles([me.selectedCell],styles);
            }

            if(me.disableSelection)
              return;
            me.selectedCell = cell;
            me.selectedCellStyle = graph.getCellStyle(cell)[mxConstants.STYLE_STROKECOLOR];
            me.selectedCellWidth = graph.getCellStyle(cell)[mxConstants.STYLE_STROKEWIDTH];
            me.selectedCellDashed = graph.getCellStyle(cell)[mxConstants.STYLE_DASHED];

            var styles = {};
            styles[mxConstants.STYLE_STROKECOLOR]= me.selectedCellColor;
            styles[mxConstants.STYLE_STROKEWIDTH]= 5;
            styles[mxConstants.STYLE_DASHED]= 0;
            graph._updateCellStyles([cell],styles);
          }
          return false;
        },
        mouseMove: function(sender, evt) {
        },
        mouseUp: function(sender, evt) {
        }
      });

      // Highlights the vertices when the mouse enters
      me.highlight = new mxCellTracker(graph, '#00FF00');

      // Enables tooltips for the overlays
      graph.setTooltips(true);

      var tooltipHandler = new mxTooltipHandler(graph);
      tooltipHandler.setHideOnHover(true);
      tooltipHandler.mouseDown = function(sender, me){
        tooltipHandler.hide();
      }
      tooltipHandler.mouseMove = function(sender, me){
        tooltipHandler.hide();
      }
      tooltipHandler.mouseUp = function(sender, me){
        tooltipHandler.hide();
      }

      // Displays a popupmenu when the user clicks
      // on a cell (using the left mouse button) but
      // do not select the cell when the popup menu
      // is displayed
      graph.panningHandler.useLeftButtonForPopup = false;
      graph.panningHandler.selectOnPopup = true;

      // Returns the type as the tooltip for node/action cells
      //      var actionTipTpl = new Ext.Template(scheduleRes.actionTipTpl);

      graph.getTooltipForCell = function(cell){
        return me.getTooltipForCell(me, this, cell);
      };

      // Truncates the label to the size of the vertex
      graph.getLabel = function(cell){
        var label = this.convertValueToString(cell);
        if (this.model.isVertex(cell)) {
          var xml = cell.getValue();
          if (mxUtils.isNode(xml)) {
            label = xml.getAttribute('name');
          }
        }

        var label = (this.labelsVisible) ? label : '';
        //        var geometry = this.model.getGeometry(cell);
        //
        //        if (!this.model.isCollapsed(cell) &&
        //          geometry != null &&
        //          (geometry.offset == null ||
        //            (geometry.offset.x == 0 &&
        //              geometry.offset.y == 0)) &&
        //          this.model.isVertex(cell) &&
        //          geometry.width >= 2) {
        //          var style = this.getCellStyle(cell);
        //          var fontSize = style[mxConstants.STYLE_FONTSIZE] ||
        //            mxConstants.DEFAULT_FONTSIZE;
        //          var max = geometry.width / (fontSize * 0.625);
        //          if(geometry.width>= 150){
        //            max = geometry.width / (fontSize * 0.725)
        //          }
        //          if (max < label.length) {
        //            return label.substring(0, max) + '...';
        //          }
        //        }

        return label;
      };

      // Hook for returning shape number for a given cell
      graph.getSecondLabel = me.getSecondLabel;
      graph.getThirdLabel = me.getThirdLabel;

      var relativeChildVerticesVisible = globalRes.showNodeCriteria;

      // Overrides method to hide relative child vertices
      graph.isCellVisible = function(cell){
        return !this.model.isVertex(cell) || cell.geometry == null ||
          !cell.geometry.relative ||
          cell.geometry.relative == relativeChildVerticesVisible;
      };

      // Creates the shape for the shape number and puts it into the draw pane
      var createShape = graph.cellRenderer.createShape;
      graph.cellRenderer.createShape = function(state){
        createShape.apply(this, arguments);
        if (me.secondLabelVisible && !state.cell.geometry.relative) {
          var secondLabel = graph.getSecondLabel(state.cell);

          if (secondLabel != null && state.shape != null && state.secondLabel == null) {
            state.secondLabel = new mxText(secondLabel, new mxRectangle(), mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM);

            state.secondLabel.dialect = state.shape.dialect;
            state.secondLabel.init(state.view.getDrawPane());
          }
        }

        // the third label
        if(me.thirdLabelVisible && !state.cell.geometry.relative){
          var thirdLabel = graph.getThirdLabel(state.cell);

          if(thirdLabel != null && state.shape != null && state.thirdLabel == null){
            state.thirdLabel = new mxText(thirdLabel, new mxRectangle(), mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP);

            state.thirdLabel.dialect = state.shape.dialect;
            state.thirdLabel.init(state.view.getDrawPane());
          }
        }

      };

      // Redraws the shape number after the cell has been moved/resized
      var redraw = graph.cellRenderer.redraw;
      graph.cellRenderer.redraw = function(state){
        redraw.apply(this, arguments);
        if (state.shape != null && state.secondLabel != null) {
          var scale = graph.getView().getScale();
          var bounds = new mxRectangle(state.x, state.y + 8 * scale, 0, 0);
          state.secondLabel.value = graph.getSecondLabel(state.cell);
          state.secondLabel.scale = scale;
          state.secondLabel.bounds = bounds;
          state.secondLabel.redraw();
        }

        if(state.shape != null && state.thirdLabel != null){
          var scale = graph.getView().getScale();
          var offsetY = Ext.isIE ? 40 : 25;
          var bounds = new mxRectangle(state.x, state.y + offsetY * scale, 0, 0);
          state.thirdLabel.value = graph.getThirdLabel(state.cell);
          state.thirdLabel.scale = scale;
          state.thirdLabel.bounds = bounds;
          state.thirdLabel.redraw();
        }
      };
      var oldRenderPage = mxPrintPreview.prototype.renderPage;
      mxPrintPreview.prototype.renderPage = function(w, h, dx, dy, scale, pageNumber)
      {
        var tempW = w;
        var tempH = h;
        if(dx >= -100){
          var tempDx = Math.abs(dx);
          dx = 1;
          if(tempDx){
            w = w - tempDx;
            scale = scale*(w/tempW);
          }
        }

        if(dy >= -100){
          var tempDy = Math.abs(dy);
          dy = 1;
          if(tempDy){
            h = h - tempDy;
          }
        }

        var div = oldRenderPage.apply(this, [w, h, dx, dy, scale, pageNumber]);
//        console.log(div,arguments);
//        var div = oldRenderPage.apply(this, arguments);
//        if(document.getElementById("headerDiv")){
//          div.firstChild.removeChild(document.getElementById("headerDiv"));
//        }
        if(div.firstChild.id=='headerDiv'){
          div.removeChild(div.firstChild);
        }
//        console.log(div);
        var header = document.createElement('div');
        header.id = 'headerDiv';
        header.style.padding = '3';
//        header.style.position = 'absolute';
//        header.style.top = '0px';
//        header.style.width = '100%';
        header.style.textAlign = 'center';
//        mxUtils.write(header, me.getPrintHeader() + '  Page ' + pageNumber + ' / ' + this.pageCount);
        mxUtils.writeln(header, 'Page ' + pageNumber + ' / ' + this.pageCount);
        mxUtils.br(header,1);
        var headers = [].concat(me.getPrintHeader());
        Ext.Array.each(headers, function(name, index, countriesItSelf) {
          mxUtils.writeln(header, name);
        });
//        mxUtils.writeln(header, 'Page ' + pageNumber + ' / ' + this.pageCount);
//        div.firstChild.appendChild(header);
        div.insertBefore(header,  div.firstChild);
        div.style.padding = '5';
        div.style.width = tempW;
        div.style.height = tempH;
//        div.style.margin = 'auto';
        return div;
      };

      // Destroys the shape number
      var destroy = graph.cellRenderer.destroy;
      graph.cellRenderer.destroy = function(state){
        destroy.apply(this, arguments);

        if (state.secondLabel != null) {
          state.secondLabel.destroy();
          state.secondLabel = null;
        }
        if(state.thirdLabel != null){
          state.thirdLabel.destroy();
          state.thirdLabel = null;
        }
      };

      me.initGraphStyles();
    },

    isNotInExceptStyle: function(style){
      return style != 'EmptyNode';
    },

    getPrintHeader : function(){
       return '';
    },

    dblClick: function(cell){

    },

    syncPreviousSelection: function() {
      if (this.selectedCell) {
        var model = this.graph.getModel(),
          cell = model.getCell(this.selectedCell.id);
        if (cell) {
          this.selectedCell = cell;
          this.selectedCellStyle = this.graph.getCellStyle(cell)[mxConstants.STYLE_STROKECOLOR];

          this.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, this.selectedCellColor, [cell]);
          this.graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, 5, [cell]);
          this.graph.setCellStyles(mxConstants.STYLE_DASHED, 0, [cell]);
          this.graph.scrollCellToVisible(cell, true);
        }
      }
    },

    loadGraph: function(xml){
      var me = this,
        graph = me.graph,
        model = graph.getModel();

      model.beginUpdate();
      try {
        // initialize template node/action
        // var doc = mxUtils.createXmlDocument();

        if (xml != null && xml.length > 0) {
          var doc = mxUtils.parseXml(xml);
          var dec = new mxCodec(doc);
          dec.decode(doc.documentElement, model);
        }
        else {
          model.clear();
        }
      }
      finally {
        // Updates the display
        model.endUpdate();
      }
    },

    clearGraph: function(){
      var me = this,
        graph = me.graph,
        model = graph.getModel();

      model.beginUpdate();
      try {
        model.clear();
      }
      finally {
        // Updates the display
        model.endUpdate();
      }
    },

    preview: function(){
      mxUtils.show(this.graph, null, 10, 10);
    },

    print: function(){
      var preview = new mxPrintPreview(this.graph);
      preview.getDoctype = function(){
        return '<!--[if lte IE 8]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->';
       };
      preview.autoOrigin = true;
      preview.printOverlays = true;
      preview.open();
    },

    posterPrint: function(pageCount){
      if (pageCount != null)
      {
        var scale = mxUtils.getScaleForPageCount(pageCount, this.graph);
        var preview = new mxPrintPreview(this.graph, scale);
        preview.getDoctype = function(){
          return '<!--[if lte IE 8]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->';
        };
        preview.open();
      }
    },

    cut: function(){
      mxClipboard.cut(this.graph);
    },

    copy: function(){
      mxClipboard.copy(this.graph);
    },

    paste: function(){
      mxClipboard.paste(this.graph);
    },

    undo: function(){
      this.history.undo();
    },

    redo: function(){
      this.history.redo();
    },

    boldText: function(){
      this.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_BOLD);
    },

    italicText: function(){
      this.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_ITALIC);
    },

    underlineText: function(){
      this.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_UNDERLINE);
    },

    alignLeft: function(){
      this.graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT);
    },

    alignCenter: function(){
      this.graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
    },

    alignRight: function(){
      this.graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_RIGHT);
    },

    alignTop: function(){
      this.graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP);
    },

    alignMiddle: function(){
      this.graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
    },

    alignBottom: function(){
      this.graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_BOTTOM);
    },

    setScale: function(scale){
      this.graph.getView().setScale(scale);
    },

    zoomIn: function(){
      this.graph.zoomIn();
    },

    zoomOut: function(){
      this.graph.zoomOut();
    },

    zoomActual: function(){
      this.graph.zoomActual();
    },

    fit: function(){
      this.graph.fit();
    },

    getDiagram: function(){
      var me = this;
      var graph = me.graph;
      var enc = new mxCodec(mxUtils.createXmlDocument())
      var node = enc.encode(graph.getModel());
      var xml = mxUtils.getXml(node);

      return (xml)? xml: '';
    },

    loadDiagram: function(xml){
      var me = this,
        graph = me.graph;
      if(xml){
        var doc = mxUtils.parseXml(xml);
        var dec = new mxCodec(doc);
        dec.decode(doc.documentElement, graph.getModel());
      }
      else{
        var cell = new mxCell();
        cell.insert(new mxCell());
        graph.getModel().setRoot(cell);
      }

      history.clear();
    },

    initGraphStyles: function(){
      var me = this,
        graph = me.graph;

      // Set some stylesheet options for the visual appearance
      var style = graph.getStylesheet().getDefaultVertexStyle();
      style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
      style[mxConstants.STYLE_ROUNDED] = true;
      style[mxConstants.STYLE_SHADOW] = true;
      style[mxConstants.STYLE_SPACING] = 8;

      style = graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_ROUNDED] = true;
      style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;
    },

    getGraphStyle: function(){
      return this.graphStyle || {};
    },

    initMenu: function(){
      var me = this,
        graph = me.graph;

      // After the component has been rendered, disable the default browser context menu
//            Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
      me.getEl().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});

      // Installs a popupmenu handler using local function (see below).
      graph.panningHandler.factoryMethod = function(menu, cell, evt) {
//              tooltipHandler.hide();

        return me.createPopupMenu(graph, cell, evt);
      };
    },

    createPopupMenu: function(graph, cell, evt) {
      var me = this,
        menu,
        menuItems = [],
        tempItems = me.populateMenuItems(graph, cell);

      if (tempItems.length > 0) {
        var l = tempItems.length;
        for (var i = 0; i < tempItems.length; i++) {
          var items = tempItems[i];
          if (items && items.length > 0) {
            if (i != 0 && i < l) {
              menuItems.push({xtype: 'menuseparator'});
            }
            Ext.each(items, function(item) {
              menuItems.push(item);
            });
          }
        }
      }

      Ext.destroy(Ext.getCmp('graphMenu'));
      menu = Ext.create('Ext.menu.Menu',{
        id: 'graphMenu',
        items: menuItems,
        listeners: {
          'beforeshow' : function(){
            me.self.setDisableTooltip(true)
            graph.setTooltips(false);
          },
          'beforehide' : function(){
            graph.setTooltips(true);
            me.self.setDisableTooltip(false);
          }
        }
      });
      menu.showAt([evt.clientX, evt.clientY]);

      graph.panningHandler.hideMenu = function() {
        me.curCell = null;
        menu.hide();
      };
    },

    updateGraphZoom: function(zoom){
      var graph = this.graph;
      if (zoom && zoom != null && zoom != '') {
        if (zoom == 'fit') {
          graph.fit(10);
        }
        else if (zoom == 'actual') {
          graph.zoomActual();
        }
        else {
          zoom = parseFloat(zoom)
          if (zoom) {
            graph.getView().setScale(zoom);
          }
        }
      }
    },

    updateGraphLayout: function(layoutType, container) {
      var graph = this.graph,
        parent = container || graph.getDefaultParent(),
        layout = this.getGraphLayoutType(graph, layoutType);

      // Allows the layout to move cells even though cells
      // aren't movable in the graph
      layout.isVertexMovable = function(cell) {
        return true;
      };

//      var layoutMgr = new mxLayoutManager(graph);
//
//      layoutMgr.getLayout = function(cell) {
//        if (cell.getChildCount() > 0) {
//          return layout;
//        }
//      };

      this.executeLayout(graph, layout, parent)

//      this.updateGraphZoom();
    },

    getGraphLayoutType: function(graph, layoutType){
      switch (layoutType) {

        default:
        case 'COMPACT_TREE': {
          layout = new mxCompactTreeLayout(graph, false);
          layout.useBoundingBox = false;
          layout.levelDistance = 30;
          layout.nodeDistance = 20;
          layout.edgeRouting = false;
          layout.resetEdges = true;
          layout.moveTree = true;

          break;
        }

        case 'COMPACT_TREE_HORIZONTAL': {
          var layout = new mxCompactTreeLayout(graph, true);
          layout.useBoundingBox = false;
          layout.levelDistance = 30;
          layout.nodeDistance = 20;
          layout.edgeRouting = false;
          layout.resetEdges = false;
          layout.moveTree = true;

          break;
        }

        case 'CIRCLE': {
          var layout = new mxCircleLayout(graph);
          layout.useBoundingBox = false;
          layout.resetEdges = false;
          layout.edgeRouting = false;
          layout.disableEdgeStyle = false;
          layout.moveCircle = true;

          break;
        }

        case 'EDGE_LABEL': {
          var layout = new mxEdgeLabelLayout(graph);
          layout.useBoundingBox = false;

          break;
        }

        case 'FAST_ORGANIC': {
          var layout = new mxFastOrganicLayout(graph);
          layout.useBoundingBox = false;

          break;
        }

        case 'ORGANIC': {
          var layout = new mxOrganicLayout(graph);
          layout.useBoundingBox = false;

          break;
        }

        case 'PARALLEL_EDGE': {
          var layout = new mxParallelEdgeLayout(graph);
          layout.useBoundingBox = false;

          break;
        }

        case 'PARTITION': {
          var layout = new mxPartitionLayout(graph);
          layout.useBoundingBox = false;

          break;
        }

        case 'PARTITION_HORIZONTAL': {
          var layout = new mxPartitionLayout(graph, true);
          layout.useBoundingBox = false;

          break;
        }

        case 'STACK': {
          var layout = new mxStackLayout(graph);
          layout.useBoundingBox = false;

          break;
        }

        case 'STACK_HORIZONTAL': {
          var layout = new mxStackLayout(graph, true);
          layout.useBoundingBox = false;

          break;
        }

        case 'HIERARCHICAL': {
          var layout = new mxHierarchicalLayout(graph);
          layout.useBoundingBox = false;
          layout.intraCellSpacing = 60;

          break;
        }

        case 'HIERARCHICAL_HORIZONTAL': {
          var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
          layout.useBoundingBox = false;
          layout.intraCellSpacing = 60;

          break;
        }
      }

      return layout
    },

    executeLayout: function(graph, layout, cell) {
      graph.getModel().beginUpdate();
      try {
        layout.execute(cell);
      }
//      catch (e) {
//        throw e;
//      }
      finally {
        graph.getModel().endUpdate();
      }
    },

    removeChild:function (childOnly) {
      var me = this,
        graph = me.graph,
        model = graph.getModel(),
        cell = me.curCell;

      // Gets the subtree from cell downwards
      var cells = [];

      if (!childOnly) {
        // traverse back to find leftover node
        var edge = graph.getIncomingEdges(cell);
        if (edge && edge[0]) {
          // should be only one incoming edge
          edge = edge[0];
          // get check the cell with connected to the edge
          var pCell = edge.source;
          // Remove leftover node.
          if (model.getDirectedEdgeCount(pCell, true) == 2) {
            var leftover;
            var edges = pCell.edges;

            for (var i = 0; i < edges.length; i++) {
              var e = edges[i];
              if (e && e != edge && e.source == pCell) {
                leftover = e.target;
                break;
              }
            }
            cells.push(leftover);
            this.mapSubVertices(leftover, cells);
          }
        }
        // remove selected cell
        cells.push(cell);
      }

      this.mapSubVertices(cell, cells);
      graph.removeCells(cells);
    },

    mapSubVertices:function (parent, array) {
      var edges = parent.edges;

      for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];
        if (edge && edge.source == parent) {
          array.push(edge.target);
          this.mapSubVertices(edge.target, array);
        }
      }
    },

    eachArray: function(menuItems, cellMenus) {
      if (cellMenus) {
        if (Ext.isArray(cellMenus)) {
          Ext.each(cellMenus, function(menuItem) {
            this.eachArray(menuItems, menuItem)
          }, this);
        } else {
          var group = cellMenus.group || 0;
          var groupItems = menuItems[group];
          if (!groupItems) {
            groupItems = [];
            menuItems[group] = groupItems;
          }
          groupItems.push(cellMenus);
        }
      }
    },

    getGraphContainer: function(){
      if(!this.graphContainer){
        return this.graph.getDefaultParent();
      }
      return this.graphContainer;
    },

    initCells: function(graph) {
      var root = graph.getDefaultParent();
      for (var i = 0; i < root.getChildCount(); i ++) {
        var cell = root.getChildAt(i);
        this.renderCell(graph, cell);
      }
    },

    renderCell: function(graph, cell) {
      if (cell.isVertex()) {
        var value = cell.getValue(),
          nodeId = value.getAttribute('nodeId'),
          node = this.nodeMap[nodeId];
        for (var i = 0; i < this.actions.length; i++) {
          var action = this.actions[i];
          action.appendCellIcons(cell, node);
        }
      }
    },

    renderCellActions: function(graph, cell, node, ignoreStatusBar) {
      if (cell.isVertex()){
        for (var i = 0; i < this.actions.length; i++){
          var action = this.actions[i];
          action.appendCellIcons(cell, node, ignoreStatusBar);
        }
      }
    },

    populateMenuItems: function(graph, cell){
      var me = this,
        model = graph.getModel(),
        tempItems = [],
        readOnly = me.getReadonlyStatus();

      if (this.actions.length > 0) {
        Ext.each(this.actions, function(action) {
          if (action.ifShowGraphMenus && action.ifShowGraphMenus(me.record) === true) {
            me.eachArray(tempItems, action.getGraphMenus(readOnly));
          }
        });
      }

      if (cell != null) {
        if ((model.isVertex(cell)) && me.isNotInExceptStyle(cell.style)) {
          me.curCell = cell;
          var values = cell.getValue();
          var nodeId = values.getAttribute('nodeId');
          var node = this.nodeMap[nodeId];

          if (this.actions.length > 0) {
            Ext.each(this.actions, function (action) {
              if (action.ifShowVertexMenus && action.ifShowVertexMenus(me.record) === true) {
                action.setCell(cell);
                action.setNode(node);
                me.eachArray(tempItems, action.getVertexMenus(readOnly));
              }
            });
          }
        }
        else if (me.enableEdgeMenu && (model.isEdge(cell)) && me.isNotInExceptStyle(cell.style)) {
          me.curCell = cell;
          var cellId = cell.getId();
          var nodeId = cellId.split('-')[1];
          var node = this.edgeMap[nodeId];

          if (this.actions.length > 0) {
            Ext.each(this.actions, function (action) {
              if (action.ifShowEdgeMenus && action.ifShowEdgeMenus(me.record) === true) {
                action.setCell(cell);
                action.setNode(node);
                me.eachArray(tempItems, action.getEdgeMenus(readOnly));
              }
            });
          }
        }
      }

//      if (this.actions.length > 0) {
//        Ext.each(this.actions, function(action) {
//          if (action.ifShowGraphMenus && action.ifShowGraphMenus(me.record) === true) {
//            me.eachArray(tempItems, action.getGraphMenus(readOnly));
//          }
//        });
//      }

      return tempItems;
    },

    getSecondLabel: function(cell) {
      if (!this.model.isEdge(cell)) {
        var nodeId = cell.getValue().getAttribute('nodeId');

        // Possible to return any string here
        return nodeId;
      }

      return null;
    },

    getThirdLabel: function(cell) {
      if (!this.model.isEdge(cell)) {
        var nodeId = cell.getValue().getAttribute('instanceId');

        // Possible to return any string here
        return nodeId;
      }

      return null;
    },

    getTooltipForCell: function(panel, graph, cell) {
      return mxGraph.prototype.getTooltipForCell.apply(graph, arguments); // "supercall"
    },

    getDefaultCellFillColor: function() {
      return null;
    },

    getReadonlyStatus: function(){
      return false;
    },

    getCellStyles: function(value){
      return '';
    },

    getEdgeStyles: function(value){
      return '';
    },

    cellLeftClickHandler : function (cell,evt){
      return;
    },

    cellDoubleClickHandler : function (cell,evt){
      return;
    },

    onResize: function(){
      this.callParent(arguments);
      if(this.graph){
        this.graph.sizeDidChange();
      }
    }
  }
);