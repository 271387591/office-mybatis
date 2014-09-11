<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<html>
<%
    String language = response.getLocale().toString();
    if ("en_US".equalsIgnoreCase(language)) {
        language = "en";
    }
%>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <c:set var="language"><%=language %></c:set>
    <%--<title>Flex Center Desktop</title>--%>
    <%--<link href="<c:url value='/favicon.ico'/>" rel="icon" type="image/x-icon" />--%>
    <%--<link href="<c:url value='/favicon.ico'/>" rel="shortcut icon" type="image/x-icon" />--%>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/desktop/css/desktop.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ext/resources/css/ext-all.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/flexcenter.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/ozstrategy/css/BoxSelect.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/editor.css'/>"/>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/common.css'/>"/>--%>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/mxgraph/css/explorer.css'/>"/>--%>
    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/icons.css'/>"/>
    <%--<link rel="stylesheet" type="text/css" href="<c:url value='/ux/Ext/ux/growl/css/ext-growl.css'/>"/>--%>

    <link rel="stylesheet" type="text/css" href="<c:url value='/scripts/shared/growl/css/ext-growl.css'/>"/>

    <c:url var="defaultExtTheme" value="/scripts/ext/resources/css/ext-all.css"/>
    <%--<c:url var="grayExtTheme" value="/scripts/ext/resources/css/ext-all-gray.css"/>--%>
    <%--<c:url var="accessExtTheme" value="/scripts/ext/resources/css/ext-all-access.css"/>--%>
    <%--<script type="text/javascript" src="<c:url value='/ext/ext-core.js'/>"></script>--%>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ext/ext-all.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value='/scripts/ext/ext-all.js'/>"></script>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ext/locale/ext-lang-zh_CN.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value='/scripts/json2.js'/>"></script>
    <%--<script type="text/javascript" src="<c:url value='/scripts/ux/Ext/ux/growl/ext-growl.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value="/jscripts/desktopRes.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/jscripts/jscriptRes.js"/>"></script>
    <%--<script type="text/javascript" src="<c:url value='/desktop/classes.js'/>"></script>--%>
    <script type="text/javascript" src="<c:url value='/scripts/ext/locale/ext-lang-${language}.js'/>"></script>
    <script type="text/javascript" src="<c:url value="/scripts/ckeditor/ckeditor.js"/>"></script>

    <script type="text/javascript" src="<c:url value='/scripts/lib/jquery-1.7.1.min.js'/>"></script>

    <script type="text/javascript">
        extTheme = '<c:url value="/scripts/ext/resources/css/ext-all"/>';
        basePath = '<c:url value="/"/>';
        mxBasePath = basePath+'mxgraph/src';
        <%--defaultExtTheme=${defaultExtTheme};--%>
//        mxDefaultLanguage='zh_CN';
    </script>
    <script type="text/javascript" src="<c:url value="/mxgraph/src/js/mxClient.js"/>"></script>
    <%--<script type="text/javascript" src="<c:url value="/mxgraph/js/mxApplication.js"/>"></script>--%>

    <!-- Loads and initiaizes the library -->
    <%--<script type="text/javascript" src='<c:url value="/mxgraph/js/mxClient.js"/>'></script>--%>
    <%--<script type="text/javascript" src='<c:url value="/scripts/mxgraph/js/mxClient_debug.js"/>'></script>--%>

  <%--<script type="text/javascript">--%>
    <%--mxBasePath = '<c:url value="/scripts/mxgraph"/>';--%>
    <%--mxImageBasePath = '<c:url value="/scripts/mxgraph/images"/>';--%>
  <%--</script>--%>


    <script type="text/javascript" src='<c:url value="/scripts/ozstrategy/global.js"/>'></script>

  <%--<jwr:script src="/scripts/mxgraph/js/mxClient_debug.js"/>--%>
  <%--<jwr:script src="/bundles/desktop.js" />--%>

  <%--<c:choose>--%>
    <%--<c:when test="${fn:contains(header['User-Agent'],'MSIE 6') or fn:contains(header['User-Agent'],'MSIE 7')}">--%>
      <%--<jwr:style src="/bundles/IE67_desktop.css" />--%>
      <%--<jwr:style src="/bundles/IE67_lib${cookie.FlexCenter_Ext_Theme.value}.css" />--%>
      <%--<script type="text/javascript">--%>
        <%--function getExtThemePath(themeValue){--%>
          <%--return JAWR.loader.getCSSPath('/bundles/IE67_lib'+themeValue+".css")--%>
        <%--}--%>
      <%--</script>--%>
    <%--</c:when>--%>
    <%--<c:otherwise>--%>
      <%--<jwr:style src="/bundles/desktop.css" />--%>
      <%--<jwr:style src="/bundles/lib${cookie.FlexCenter_Ext_Theme.value}.css" />--%>
      <%--<script type="text/javascript">--%>
        <%--function getExtThemePath(themeValue){--%>
          <%--return JAWR.loader.getCSSPath('/bundles/lib'+themeValue+".css")--%>
        <%--}--%>
      <%--</script>--%>
    <%--</c:otherwise>--%>
  <%--</c:choose>--%>
  <style type="text/css" >
      .x-message-box .ext-mb-loading {
          background: url("<c:url value="/scripts/ext/resources/themes/images/default/grid/loading.gif"/>") no-repeat scroll 6px 0 transparent;
          height: 52px !important;
      }
  </style>

  <script type="text/javascript">
  function main()
  {
      // Defines an icon for creating new connections in the connection handler.
      // This will automatically disable the highlighting of the source vertex.


      // Checks if browser is supported
      if (!mxClient.isBrowserSupported())
      {
          // Displays an error message if the browser is
          // not supported.
          mxUtils.error('Browser is not supported!', 200, false);
      }
      else
      {
          mxConnectionHandler.prototype.connectImage = new mxImage('mxgraph/images/connector.gif', 16, 16);
          mxRectangleShape.prototype.crisp = true;

          // Enables guides
          mxGraphHandler.prototype.guidesEnabled = true;
          mxGuide.prototype.isEnabledForEvent = function(evt)
          {
              return !mxEvent.isAltDown(evt);
          };
          // Creates the div for the toolbar
          var tbContainer = document.createElement('div');
          tbContainer.style.position = 'absolute';
          tbContainer.style.overflow = 'auto';
          tbContainer.style.padding = '2px';
          tbContainer.style.left = '0px';
          tbContainer.style.top = '26px';
          tbContainer.style.width = '120px';
          tbContainer.style.bottom = '0px';
          tbContainer.style.border = '1px solid blue';

          document.body.appendChild(tbContainer);


          // Creates new toolbar without event processing
          var toolbar = new mxGraph(tbContainer);
//            toolbar.enabled = false

          // Creates the div for the graph
          var container =document.createElement('div');
          container.style.position = 'absolute';
          container.style.overflow = 'auto';
          container.style.left = '140px';
          container.style.top = '26px';
          container.style.right = '0px';
          container.style.bottom = '0px';
          container.style.background = 'url("mxgraph/images/grid.gif")';
          container.style.border = '1px solid blue';
          document.body.appendChild(container);


          var outlineContainer = document.createElement('div');
          outlineContainer.style.position = 'absolute';
          outlineContainer.style.overflow = 'auto';
          outlineContainer.style.top = '52px';
          outlineContainer.style.right = '5px';
          outlineContainer.style.width = '200px';
          outlineContainer.style.height = '100px';
          outlineContainer.style.background = 'transparent';
          outlineContainer.style.border = '1px solid blue';
          document.body.appendChild(outlineContainer);
          var button = mxUtils.button('View XML', function()
          {
              var encoder = new mxCodec();
              var node = encoder.encode(graph.getModel());
              var xml=mxUtils.getPrettyXml(node);
//                mxUtils.popup(mxUtils.getPrettyXml(node), true);
          });

          document.body.insertBefore(button, container.nextSibling);


          var outline = document.getElementById('outlineContainer');

          // Workaround for Internet Explorer ignoring certain styles
          if (mxClient.IS_QUIRKS)
          {
              document.body.style.overflow = 'auto';
              new mxDivResizer(tbContainer);
              new mxDivResizer(container);
              new mxDivResizer(outline);
          }

          // Creates the model and the graph inside the container
          // using the fastest rendering available on the browser
          var model = new mxGraphModel();
          var graph = new mxGraph(container, model);

          // Enables new connections in the graph
          graph.setConnectable(true);
          graph.setMultigraph(false);

          // Stops editing on enter or escape keypress
          var keyHandler = new mxKeyHandler(graph);
          var rubberband = new mxRubberband(graph);


          var setStyle=function(style){
              style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
              style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
              style[mxConstants.STYLE_STROKECOLOR] = 'gray';
              style[mxConstants.STYLE_ROUNDED] = true;
//            style[mxConstants.STYLE_FILLCOLOR] = '#EEEEEE';
              style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
//            style[mxConstants.STYLE_FONTCOLOR] = '#774400';
              style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
              style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
              style[mxConstants.STYLE_FONTSIZE] = '12';
              style[mxConstants.STYLE_FONTSTYLE] = 1;
              style[mxConstants.STYLE_SHADOW] = true;
              style[mxConstants.STYLE_SPACING] = 8;
          }

          var style = graph.getStylesheet().getDefaultVertexStyle();
          setStyle(style);
          var style=toolbar.getStylesheet().getDefaultVertexStyle();
          setStyle(style);
          style = graph.getStylesheet().getDefaultEdgeStyle();
          style[mxConstants.STYLE_ROUNDED] = true;
          style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;
          new mxRubberband(graph);



          var addVertex = function(w, h,x,y,value)
          {
              var prototype = new mxCell(value, new mxGeometry(x, y, w, h),style);
              prototype.setVertex(true);
              toolbar.addCell(prototype);
              var funct = function(graph, evt, cell)
              {
                  graph.stopEditing(false);

                  var pt = graph.getPointForEvent(evt);
                  var vertex = graph.getModel().cloneCell(prototype);
                  vertex.geometry.x = pt.x;
                  vertex.geometry.y = pt.y;

                  graph.addCell(vertex);
                  graph.setSelectionCell(vertex);
                  graph.scrollCellToVisible(vertex);
              }


              var div = document.createElement('div');
              div.style.position = 'absolute';
              div.style.overflow = 'hidden';
              div.style.left = x+'px';
              div.style.top = y+'px';
//                div.style.border = '1px solid blue';
              div.style.width=prototype.geometry.width+'px';
              div.style.height=prototype.geometry.height+'px';
              tbContainer.appendChild(div);

              if (mxClient.IS_IE)
              {
                  mxEvent.addListener(div, 'dragstart', function(evt)
                  {
                      evt.returnValue = false;
                  });
              }

              var sprite=function(width, height){
                  var elt = document.createElement('div');
                  elt.style.border = '1px dashed black';
                  elt.style.width = width + 'px';
                  elt.style.height = height + 'px';

                  return elt;
              };
              var ds = mxUtils.makeDraggable(div, graph, funct,sprite(prototype.geometry.width,prototype.geometry.height),null, null, graph.autoscroll, true);
              ds.isGuidesEnabled = function()
              {
                  return graph.graphHandler.guidesEnabled;
              };

              // Restores original drag icon while outside of graph
              ds.createDragElement = mxDragSource.prototype.createDragElement;
          };

          mxGraph.prototype.cellsResizable=false;

          addVertex(100, 40,5,20,'1');
          addVertex(100, 40,5,80,'2');
          addVertex(100, 40,5,140,'3');
          addVertex(100, 40,5,200,'4');
          addVertex(100, 40,5,260,'5');
          addVertex(100, 40,5,320,'6');
          addVertex(100, 40,5,380,'7');
          mxOutline.prototype.graphRenderHint = mxConstants.RENDERING_HINT_EXACT;
          var outln = new mxOutline(graph, outlineContainer);
          var scale = graph.view.scale;
          var bounds = graph.getGraphBounds();
          graph.view.setTranslate(-bounds.x / scale, -bounds.y / scale);
          // To show the images in the outline, uncomment the following code
          outln.outline.labelsVisible = true;
          outln.outline.setHtmlLabels(true);

      }
  }


  function addToolbarItem(graph, toolbar, prototype, image,tbContainer,x,y,value)
  {
      // Function that is executed when the image is dropped on
      // the graph. The cell argument points to the cell under
      // the mousepointer if there is one.
      var funct = function(graph, evt, cell)
      {
          graph.stopEditing(false);

          var pt = graph.getPointForEvent(evt);
          var vertex = graph.getModel().cloneCell(prototype);
          vertex.geometry.x = pt.x;
          vertex.geometry.y = pt.y;
          console.log(cell);

          graph.addCell(vertex);
          graph.setSelectionCell(vertex);
      }

      var div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.overflow = 'hidden';
      div.style.left = x+'px';
      div.style.top = y+'px';
      div.style.border = '1px solid blue';
      div.style.width=100;
      div.style.height=40;
      div.innerHTML=value;
      tbContainer.appendChild(div);
      mxUtils.makeDraggable(div, graph, funct);
  }
  function Permission(locked, createEdges, editEdges, editVertices, cloneCells)
  {
      this.locked = (locked != null) ? locked : false;
      this.createEdges = (createEdges != null) ? createEdges : true;
      this.editEdges = (editEdges != null) ? editEdges : true;;
      this.editVertices = (editVertices != null) ? editVertices : true;;
      this.cloneCells = (cloneCells != null) ? cloneCells : true;;
  };

  Permission.prototype.apply = function(graph)
  {
      graph.setConnectable(this.createEdges);
      graph.setCellsLocked(this.locked);
  };
    
  </script>

</head>
<body>
<div id="graph-container"></div>
<script>
//var setStyle=function(style){
//    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
//    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
//    style[mxConstants.STYLE_STROKECOLOR] = 'gray';
//    style[mxConstants.STYLE_ROUNDED] = true;
////            style[mxConstants.STYLE_FILLCOLOR] = '#EEEEEE';
//    style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
////            style[mxConstants.STYLE_FONTCOLOR] = '#774400';
//    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
//    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
//    style[mxConstants.STYLE_FONTSIZE] = '12';
//    style[mxConstants.STYLE_FONTSTYLE] = 1;
//    style[mxConstants.STYLE_SHADOW] = true;
//    style[mxConstants.STYLE_SPACING] = 8;
//}
//    mxGraph.prototype.cellsResizable=false;
//    mxConnectionHandler.prototype.connectImage = new mxImage('mxgraph/images/connector.gif', 16, 16);
//    mxRectangleShape.prototype.crisp = true;
//    
//    // Enables guides
//    mxGraphHandler.prototype.guidesEnabled = true;
//    mxGuide.prototype.isEnabledForEvent = function(evt)
//    {
//        return !mxEvent.isAltDown(evt);
//    };
//    var navCellWidth=240,navCellHeight=35,graphContainer='graph-container',container=document.getElementById(graphContainer);
//    var model = new mxGraphModel();
//    var graph = new mxGraph(container, model);
//    graph.setConnectable(true);
//    graph.setMultigraph(false);


//    var createNavCell=function(id,icon,text,graphcallback){
//        var div=document.getElementById(id);
//        div.style.width=navCellWidth+'px';
//        div.style.height=navCellHeight+'px';
//        var toolbar = new mxGraph(div);
//        var style=toolbar.getStylesheet().getDefaultVertexStyle();
//        delete style[mxConstants.STYLE_STROKECOLOR]; 
//        delete style[mxConstants.STYLE_FILLCOLOR]; 
//        var prototype = toolbar.insertVertex(toolbar.getDefaultParent(), null, text, 0, 0, navCellWidth, navCellHeight,
//                'shape=label;image='+icon+';imageWidth=16;imageHeight=16;spacingBottom=0;fillColor=#ffffff;indicatorColor=#00FFFF;');
//        prototype.setVertex(true);
//        toolbar.addCell(prototype);
//        var funct = function(graph, evt, cell){
//            graph.stopEditing(false);
//
//            var pt = graph.getPointForEvent(evt);
//            var vertex = graph.getModel().cloneCell(prototype);
//            vertex.geometry.x = pt.x;
//            vertex.geometry.y = pt.y;
//
//            graph.addCell(vertex);
//            graph.setSelectionCell(vertex);
//            graph.scrollCellToVisible(vertex);
//            if(graphcallback){
//                graphcallback(vertex);
//            }
//        }
//
//        if (mxClient.IS_IE){
//            mxEvent.addListener(div, 'dragstart', function(evt)
//            {
//                evt.returnValue = false;
//            });
//        }
//
//        var sprite=function(width, height){
//            var elt = document.createElement('div');
//            elt.style.border = '1px dashed black';
//            elt.style.width = width + 'px';
//            elt.style.height = height + 'px';
//
//            return elt;
//        };
////        var model = new mxGraphModel(),container=document.getElementById(graphContainer);
////        var graph = new mxGraph(container, model);
////        graph.setConnectable(true);
////        graph.setMultigraph(false);
//        var ds = mxUtils.makeDraggable(div, graph, funct,sprite(prototype.geometry.width,prototype.geometry.height),null, null, graph.autoscroll, true);
//        ds.isGuidesEnabled = function()
//        {
//            return graph.graphHandler.guidesEnabled;
//        };
//
//        // Restores original drag icon while outside of graph
//        ds.createDragElement = mxDragSource.prototype.createDragElement;
//    }
//    var getPreviewWin=function(el){
//        if (!this.previewWin) {
//            this.previewWin = Ext.widget('panel', {
//                renderTo: el,
//                bodyCls: 'graph-body-cls',
//                height: 150,
//                width:150,
//                html:'<div id="graph-preview"></div>',
//                alignTo:function (element, position, offsets) {
//                    if (element && element != null && element.isComponent) {
//                        element = element.getEl();
//                    }
//                    if (this.el) {
//                        var xy = this.el.getAlignToXY(element, position, offsets);
//                        this.setPagePosition(xy);
//                    }
//                    return this;
//                },
//                listeners: {
//                    scope: this,
//                    afterrender: function(p){
//                        var outline = new mxOutline(graph, document.getElementById('graph-preview'));
//                        p.body.dom.style.cursor = 'move';
//                        p.body.dom.style.position = 'absolute';
//                    }
//                }
//            });
//        }
//        return this.previewWin;
//    }
//    Ext.onReady(function () {
//        Ext.create('Ext.container.Viewport', {
//            layout: 'border',
//            items:[
//                {
//                    xtype: 'box',
//                    region: 'north',
//                    html: 'Ext.Layout.Browser',
//                    height: 30
//                },{
//                    region: 'center',
//                    layout:'border',
//                    
//                    tbar:[
//                            '-'
//                    ],
//                    items:[
//                        {
//                            region: 'west',
//                            title: 'West',
//                            split: true,
//                            width: navCellWidth+20,
////                            minWidth: 175,
////                            maxWidth: 400,
//                            collapsible: true,
//                            animCollapse: true,
////                            margins: '0 0 0 5',
//                            layout: 'accordion',
//                            items: [
//                                {
//                                    title: 'Start Events',
//                                    autoScroll:true,
//                                    items:[
//                                        {
//                                            xtype:'panel',
//                                            html: '<div id="start-container" class="navItem"></div>' +
//                                                    '<div id="start-timer" class="navItem"></div>' +
//                                                    '<div id="start-message" class="navItem"></div>'+
//                                                    '<div id="start-error" class="navItem"></div>',
//                                            border:false,
//                                            listeners:{
//                                                afterrender:function(p){
//                                                    createNavCell('start-container','mxgraph/images/startevent/none.png','Start',function(vertex){
//                                                        
//                                                        console.log('sdf')
//                                                    })
//                                                    createNavCell('start-timer','mxgraph/images/startevent/timer.png','Start timer event')
//                                                    createNavCell('start-message','mxgraph/images/startevent/message.png','Start message event')
//                                                    createNavCell('start-error','mxgraph/images/startevent/error.png','Start error event')
//
//                                                }
//
//                                            }
//                                        }
//                                    ]
//                            } ,{
//                                    title: 'Activities',
//                                    autoScroll:true,
//                                    items:[
//                                        {
//                                            xtype:'panel',
//                                            html: '<div id="user-task" class="navItem"></div>' +
//                                                    '<div id="service-task" class="navItem"></div>' +
//                                                    '<div id="script-task" class="navItem"></div>'+
//                                                    '<div id="business-rule-task" class="navItem"></div>'+
//                                                    '<div id="receive-task" class="navItem"></div>'+
//                                                    '<div id="manual-task" class="navItem"></div>'+
//                                                    '<div id="mail-task" class="navItem"></div>',
//                                            border:false,
//                                            listeners:{
//                                                afterrender:function(p){
//                                                    createNavCell('user-task','mxgraph/images/activity/list/type.user.png','User task')
//                                                    createNavCell('service-task','mxgraph/images/activity/list/type.service.png','Service task')
//                                                    createNavCell('script-task','mxgraph/images/activity/list/type.script.png','Script task')
//                                                    createNavCell('business-rule-task','mxgraph/images/activity/list/type.business.rule.png','Business rule task')
//                                                    createNavCell('receive-task','mxgraph/images/activity/list/type.receive.png','Receive task')
//                                                    createNavCell('manual-task','mxgraph/images/activity/list/type.manual.png','Manual task')
//                                                    createNavCell('mail-task','mxgraph/images/activity/list/type.send.png','Mail task')
//
//                                                }
//
//                                            }
//                                        } 
//                                    ]
//                                    
//                                },{
//                                    title: 'Structural',
//                                    autoScroll:true,
//                                    items:[
//                                        {
//                                            xtype:'panel',
//                                            html: '<div id="sub-process" class="navItem"></div>' +
//                                                    '<div id="event-sub-process" class="navItem"></div>' +
//                                                    '<div id="call-activity" class="navItem"></div>',
//                                            border:false,
//                                            listeners:{
//                                                afterrender:function(p){
//                                                    createNavCell('sub-process','mxgraph/images/activity/expanded.subprocess.png','Sub process');
//                                                    createNavCell('event-sub-process','mxgraph/images/activity/event.subprocess.png','Event sub process');
//                                                    createNavCell('call-activity','mxgraph/images/activity/task.png','Call activity');
//                                                }
//
//                                            }
//                                        } 
//                                    ]
//                                },{
//                                    title: 'Gateways',
//                                    autoScroll:true,
//                                    items:[
//                                        {
//                                            xtype:'panel',
//                                            html: '<div id="exclusive-gateway" class="navItem"></div>' +
//                                                    '<div id="parallel-gateway" class="navItem"></div>' +
//                                                    '<div id="inclusive-gateway" class="navItem"></div>'+
//                                                    '<div id="event-gateway" class="navItem"></div>',
//                                            border:false,
//                                            listeners:{
//                                                afterrender:function(p){
//                                                    createNavCell('exclusive-gateway','mxgraph/images/gateway/exclusive.databased.png','Exclusive gateway');
//                                                    createNavCell('parallel-gateway','mxgraph/images/gateway/parallel.png','Parallel gateway');
//                                                    createNavCell('inclusive-gateway','mxgraph/images/gateway/inclusive.png','Inclusive gateway');
//                                                    createNavCell('event-gateway','mxgraph/images/gateway/eventbased.png','Event gateway');
//                                                }
//
//                                            }
//                                        } 
//                                    ]
//                                },{
//                                    title: 'Boundary Events',
//                                    autoScroll:true,
//                                    items:[
//                                        {
//                                            xtype:'panel',
//                                            html: '<div id="boundary-error-event" class="navItem"></div>' +
//                                                    '<div id="boundary-timer-event" class="navItem"></div>' +
//                                                    '<div id="boundary-signal-event" class="navItem"></div>',
//                                            border:false,
//                                            listeners:{
//                                                afterrender:function(p){
//                                                    createNavCell('boundary-error-event','mxgraph/images/catching/error.png','Boundary error event');
//                                                    createNavCell('boundary-timer-event','mxgraph/images/catching/timer.png','Boundary timer event');
//                                                    createNavCell('boundary-signal-event','mxgraph/images/catching/signal.png','Boundary signal event');
//                                                }
//
//                                            }
//                                        } 
//                                    ]
//                                },{
//                                    title: 'Intermediate Catching Events',
//                                    autoScroll:true,
//                                    items:[
//                                        {
//                                            xtype:'panel',
//                                            html: '<div id="intermediate-timer-catching-event" class="navItem"></div>' +
//                                                    '<div id="intermediate-signal-catching-event" class="navItem"></div>' +
//                                                    '<div id="intermediate-message-catching-event" class="navItem"></div>',
//                                            border:false,
//                                            listeners:{
//                                                afterrender:function(p){
//                                                    createNavCell('intermediate-timer-catching-event','mxgraph/images/catching/timer.png','Intermediate timer catching event');
//                                                    createNavCell('intermediate-signal-catching-event','mxgraph/images/catching/signal.png','Intermediate signal catching event');
//                                                    createNavCell('intermediate-message-catching-event','mxgraph/images/catching/message.png','Intermediate message catching event');
//                                                }
//
//                                            }
//                                        } 
//                                    ]
//                                },{
//                                    title: 'Intermediate Throwing Events',
//                                    autoScroll:true,
//                                    items:[
//                                        {
//                                            xtype:'panel',
//                                            html: '<div id="intermediate-none-throwing-event" class="navItem"></div>' +
//                                                    '<div id="intermediate-signal-throwing-event" class="navItem"></div>',
//                                            
//                                            border:false,
//                                            listeners:{
//                                                afterrender:function(p){
//                                                    createNavCell('intermediate-none-throwing-event','mxgraph/images/throwing/none.png','Intermediate none throwing event');
//                                                    createNavCell('intermediate-signal-throwing-event','mxgraph/images/throwing/signal.png','Intermediate signal throwing event');
//                                                }
//
//                                            }
//                                        } 
//                                    ]
//                                },{
//                                    title: 'End Events',
//                                    autoScroll:true,
//                                    items:[
//                                        {
//                                            xtype:'panel',
//                                            html: '<div id="end-event" class="navItem"></div>' +
//                                                    '<div id="end-error-event" class="navItem"></div>',
//                                            border:false,
//                                            listeners:{
//                                                afterrender:function(p){
//                                                    createNavCell('end-event','mxgraph/images/endevent/none.png','End event');
//                                                    createNavCell('end-error-event','mxgraph/images/endevent/error.png','End error event');
//                                                }
//
//                                            }
//                                        } 
//                                    ]
//                                }
//                            ]
//                        },{
//                            region: 'east',
//                            title: '飞',
//                            collapsible: true,
//                            split: true,
//                            width: 150
//                        },{
//                            region: 'center',
////                            html:'<div id="'+graphContainer+'"></div>',
//                            contentEl:'graph-container',
//                            id:'graph-container1',
//                            autoScroll:true,
//                            dockedItems: [{
//                                xtype: 'toolbar',
//                                dock: 'bottom',
//                                items: ['->',
//                                    {
//                                        xtype:'button',
//                                        text: 'preview',
//                                        handler:function(){
//                                            var win=getPreviewWin(Ext.get('graph-container1'));
////                                            win=Ext.widget('panel',{
////                                                renderTo:'graph-container',
////                                                title:'sdf',
////                                                width:200,
////                                                height:300
////                                            });
//                                                    win.show();
//                                            win.alignTo(Ext.get('graph-container1'), 'br-br?', [-2, -30]);
//                                            
//                                        }
//                                    }
//                                ]
//                            }]
//                        }    
//                    ]
//                    
//                }
//            ]
//        });
//    });
Ext.onReady(function () {
    Ext.require([
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.form.field.Number',
        'Ext.form.field.Date',
        'Ext.tip.QuickTipManager'
    ]);
    var treestore = Ext.create('Ext.data.TreeStore', {
        root: {
            expanded: true,
            children: [
                { text: "detention", leaf: true },
                { text: "homework", expanded: true, children: [
                    { text: "book report", leaf: true },
                    { text: "alegrbra", leaf: true}
                ] },
                { text: "buy lottery tickets", leaf: true }
            ]
        }
    });
    var store = Ext.create('Ext.data.Store', {
        fields:['text','expanded','children','leaf','stencil','itype'],
        data: [
            { text: "Start", leaf: true,iconCls:'startevent-none',stencil:'StartNoneEvent',itype:'start' },
            { text: "Start timer event", leaf: true,iconCls:'startevent-timer',stencil:'StartTimerEvent',itype:'start' },
            { text: "Start message event", leaf: true,iconCls:'startevent-message',stencil:'StartMessageEvent',itype:'start' },
            { text: "Start error event", leaf: true,iconCls:'startevent-error',stencil:'StartErrorEvent',itype:'start' },
            { text: "User task", leaf: true,iconCls:'activity-type-user',stencil:'UserTask',itype:'task' },
            { text: "Service task", leaf: true,iconCls:'activity-type-service',stencil:'ServiceTask',itype:'task' },
            { text: "Script task", leaf: true,iconCls:'activity-type-script',stencil:'ScriptTask',itype:'task' },
            { text: "Business rule task", leaf: true,iconCls:'activity-type-business-rule',stencil:'BusinessRule',itype:'task' },
            { text: "Receive task", leaf: true,iconCls:'activity-type-receive',stencil:'ReceiveTask',itype:'task' },
            { text: "Manual task", leaf: true,iconCls:'activity-type-manual',stencil:'ManualTask',itype:'task' },
            { text: "Mail task", leaf: true,iconCls:'activity-type-send',stencil:'MailTask',itype:'task' }
        ],
        groupField: 'itype'
    });
    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items:[
            {
                xtype: 'panel',
                region: 'center',
                itemId:'panel-1-1',
                draggable: {
                    delegate: 'firstGridDDGroup'
                },
//                plugins: [ 
//                    {
//                        ptype: 'gridviewdragdrop',
//                        dragGroup: 'firstGridDDGroup',
//                        dropGroup: 'secondGridDDGroup',
//                        listeners:{
//                            beforedrop:function( node, data, overModel, dropPosition, eOpts ){
//                                console.log('sfds')
//                            }
//                        }
//                    }
//                ],
                title:'1111'
            },
//            {
//                region: 'west',
//                title: 'Westsdf水电费',
//                split: true,
//                itemId:'panel-1-2',
//                layout: 'accordion',
//                width:250,
//                items:[
//                    {
//                        
//                        title: 'Start Events',
//                        autoScroll:true,
//                        items:[
//                            {
//                                xtype:'container',
////                                border:false
//                                cls:'blue-grid-row',
//                                html:'sdsd'
//                            }
//                        ]
//                    }
//                        
//                ]
//                
//            }
                
            {
                region: 'west',
                title: 'Westsdf水电费',
                split: true,
                width: 300,
                itemId:'panel-1-2',
                xtype:'treepanel',
                rootVisible: false,
                collapsible: true,
                titleCollapse:true,
                viewConfig: {
//                    getRowClass: function(record, rowIndex, rowParams, store){
//                        return (record.get('leaf')==false) ? "blue-grid-row" : "";
//                    }
                },
                store:treestore
            }
//            {
//                xtype:'treepanel',
//                store:store,
//                itemId:'panel-1-2',
//                region: 'west',
//                rootVisible: false
//            }
//            {
//                xtype: 'grid',
//                region: 'west',
//                itemId:'panel-1-2',
//                width:200,
////                plugins: [cellEditing],
//                selModel: {
//                    selType: 'cellmodel'
//                },
//                features: [{
//                    id: 'group',
//                    ftype: 'groupingsummary',
//                    groupHeaderTpl: '{name}',
//                    hideGroupedHeader: true,
//                    enableGroupingMenu: false
//                }],
//                rootVisible: false,
//                title:'22222',
//                store:store,
//                selType:'treemodel',
////                viewConfig: {
////                    getRowClass: function(record, rowIndex, rowParams, store){
////                        return record.get("itype")=='start' ? "x-grid-cell-inner1" : "row-error";
////                    }
////                },
//                
//                viewConfig: {
//                    plugins: {
//                        ptype: 'gridviewdragdrop',
////                        dragGroup: 'secondGridDDGroup',
////                        dropGroup: 'firstGridDDGroup',
//                        listeners:{
//                            beforedrop:function( node, data, overModel, dropPosition, eOpts ){
//                                console.log('sfds')
//                            }
//                        }
//                    }
//                },
//                draggable:true,
//                columns: [{
//                    flex:1,
//                    dataIndex: 'text',
//                    renderer:function(v,metaData){
//                        return v;
//                        
//                    },
//                    summaryRenderer: function(value, summaryData, dataIndex) {
//                        return value;
//                        return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
//                    }
//                }]
//            }
        ]
    });
    
    var dom = Ext.ComponentQuery.query('#panel-1-1')[0].body.dom;
    
    
    var graph=new mxGraph();
    
    
    var node = mxUtils.load('mxgraph/default-style.xml').getDocumentElement();
    var dec = new mxCodec(node.ownerDocument);
    dec.decode(node, graph.getStylesheet());


//    var xmlRequest = mxUtils.load('mxgraph/config/templates.xml');
//    var node1 = xmlRequest.getDocumentElement();
//    var editor = new mxEditor(node1);
//    console.log(editor.templates[0])
    

    graph.init(dom.firstChild.children[0]);
    
    if (mxClient.IS_GC || mxClient.IS_SF)
    {
        graph.container.style.background = '-webkit-gradient(linear, 0% 0%, 100% 0%, from(#FFFFFF), to(#FFFFEE))';
    }
    else if (mxClient.IS_NS)
    {
        graph.container.style.background = '-moz-linear-gradient(left, #FFFFFF, #FFFFEE)';
    }
    else if (mxClient.IS_IE)
    {
        graph.container.style.filter = 'progid:DXImageTransform.Microsoft.Gradient('+
                'StartColorStr=\'#FFFFFF\', EndColorStr=\'#FFFFEE\', GradientType=1)';
    }

    graph.setConnectable(true);
    graph.setDropEnabled(true);
    graph.setPanning(true);
    graph.setTooltips(true);
    graph.connectionHandler.setCreateTarget(true);

    // Sets the cursor
    graph.container.style.cursor = 'default';

    mxConnectionHandler.prototype.connectImage = new mxImage('mxgraph/images/connector.gif', 16, 16);

    graph.flipEdge = function(edge)
    {
        if (edge != null)
        {
            var state = this.view.getState(edge);
            var style = (state != null) ? state.style : this.getCellStyle(edge);

            if (style != null)
            {
                var elbow = mxUtils.getValue(style, mxConstants.STYLE_ELBOW,
                        mxConstants.ELBOW_HORIZONTAL);
                var value = (elbow == mxConstants.ELBOW_HORIZONTAL) ?
                        mxConstants.ELBOW_VERTICAL : mxConstants.ELBOW_HORIZONTAL;
                this.setCellStyles(mxConstants.STYLE_ELBOW, value, [edge]);
            }
        }
    };

    var parent = graph.getDefaultParent();
    graph.getModel().beginUpdate();
    var graphHandlerMouseDown = mxGraphHandler.prototype.mouseDown;
    mxGraphHandler.prototype.mouseDown = function(sender, me)
    {
        graphHandlerMouseDown.apply(this, arguments);
        console.log(me.getCell())
        console.log(this.graph.getSelectionCount())
        console.log(sender)

        if (this.graph.isCellSelected(me.getCell()) && this.graph.getSelectionCount() > 1)
        {
            this.delayedSelection = true;
        }
    };

    // Selects descendants before children selection mode
    var graphHandlerGetInitialCellForEvent = mxGraphHandler.prototype.getInitialCellForEvent;
    mxGraphHandler.prototype.getInitialCellForEvent = function(me)
    {
        var model = this.graph.getModel();
        var psel = model.getParent(this.graph.getSelectionCell());
        var cell = graphHandlerGetInitialCellForEvent.apply(this, arguments);
        var parent = model.getParent(cell);

        if (psel == null || (psel != cell && psel != parent))
        {
            while (!this.graph.isCellSelected(cell) && !this.graph.isCellSelected(parent) &&
                    model.isVertex(parent) && !this.graph.isValidRoot(parent))
            {
                cell = parent;
                parent = this.graph.getModel().getParent(cell);
            }
        }

        return cell;
    };

    // Selection is delayed to mouseup if child selected
    var graphHandlerIsDelayedSelection = mxGraphHandler.prototype.isDelayedSelection;
    mxGraphHandler.prototype.isDelayedSelection = function(cell)
    {
        var result = graphHandlerIsDelayedSelection.apply(this, arguments);
        var model = this.graph.getModel();
        var psel = model.getParent(this.graph.getSelectionCell());
        var parent = model.getParent(cell);

        if (psel == null || (psel != cell && psel != parent))
        {
            if (!this.graph.isCellSelected(cell) && model.isVertex(parent) && !this.graph.isValidRoot(parent))
            {
                result = true;
            }
        }

        return result;
    };

    // Delayed selection of parent group
    mxGraphHandler.prototype.selectDelayed = function(me)
    {
        var cell = me.getCell();

        if (cell == null)
        {
            cell = this.cell;
        }

        var model = this.graph.getModel();
        var parent = model.getParent(cell);

        while (this.graph.isCellSelected(cell) && model.isVertex(parent) && !this.graph.isValidRoot(parent))
        {
            cell = parent;
            parent = model.getParent(cell);
        }

        this.graph.selectCellForEvent(cell, me.getEvent());
    };

    // Returns last selected ancestor
    mxPanningHandler.prototype.getCellForPopupEvent = function(me)
    {
        var cell = me.getCell();
        var model = this.graph.getModel();
        var parent = model.getParent(cell);

        while (model.isVertex(parent) && !this.graph.isValidRoot(parent))
        {
            if (this.graph.isCellSelected(parent))
            {
                cell = parent;
            }

            parent = model.getParent(parent);
        }

        return cell;
    };
    graph.constrainChildren = false;
    graph.extendParents = false;
    graph.extendParentsOnAdd = true;
    try
    {
        var v1 = graph.insertVertex(parent, null, 'Hello,', 50, 20, 80, 40, 'rounded=1');
        var v2 = graph.insertVertex(v1, null, 'World!', 60, 20, 50, 30, 'rounded=1');
//        var e1 = graph.insertEdge(parent, null, 'Hello, World!', v1, v2);
    }
    finally
    {
        // Updates the display
        graph.getModel().endUpdate();
    }

    
//    var prototype = new mxCell('12', new mxGeometry(320, 20, 100, 100),'shape=label;image=mxgraph/images/catching/signal.png;imageWidth=16;imageHeight=16;spacingBottom=0;fillColor=#ffffff;indicatorColor=#00FFFF;');
    var prototype = new mxCell('12', new mxGeometry(320, 20, 200, 200),'swimlane');
    prototype.setVertex(true);
    graph.addCell(prototype);
    var prototype = new mxCell('12', new mxGeometry(520, 20, 200, 200),'swimlane');
    prototype.setVertex(true);
    graph.addCell(prototype);
//    editor.templates['start'].value.setAttribute('we','wer');
//    graph.addCell(editor.templates['start']);
//    console.log(editor.templates['start'])
    
    
    var cells = [new mxCell('sd', new mxGeometry(0, 0, 100, 50), 'label')];
    cells[0].vertex = true;
    var funct = function(graph, evt, target, x, y){
        cells = graph.getImportableCells(cells);

        if (cells.length > 0)
        {
            var validDropTarget = (target != null) ?
                    graph.isValidDropTarget(target, cells, evt) : false;
            var select = null;

            if (target != null &&
                    !validDropTarget &&
                    graph.getModel().getChildCount(target) == 0 &&
                    graph.getModel().isVertex(target) == cells[0].vertex)
            {
                graph.getModel().setStyle(target, 'label');
                select = [target];
            }
            else
            {
                if (target != null &&
                        !validDropTarget)
                {
                    target = null;
                }

                // Splits the target edge or inserts into target group
                if (graph.isSplitEnabled() && graph.isSplitTarget(target, cells, evt))
                {
                    graph.splitEdge(target, cells, null, x, y);
                    select = cells;
                }
                else
                {
                    cells = graph.getImportableCells(cells);

                    if (cells.length > 0)
                    {
                        select = graph.importCells(cells, x, y, target);
                    }
                }
            }

            if (select != null && select.length > 0)
            {
                graph.scrollCellToVisible(select[0]);
                graph.setSelectionCells(select);
            }
        }
    };
    
    var treepanel= Ext.ComponentQuery.query('#panel-1-2')[0];
    
//    treepanel.on('itemmousedown',function(p, record, item, index, e, eOpts){
//        console.log(item)
//        var sprite=function(width, height){
//            var elt = document.createElement('div');
//            elt.style.border = '1px double black';
//            elt.style.width = width + 'px';
//            elt.style.height = height + 'px';
//            elt.style.backgroundColor = '#ffffff';
//            return elt;
//        };
//        var ds = mxUtils.makeDraggable(item, graph, funct,sprite(cells[0].geometry.width,cells[0].geometry.height),null, null, graph.autoscroll, true);
//        ds.isGuidesEnabled = function()
//        {
//            return graph.graphHandler.guidesEnabled;
//        };
//        ds.createDragElement = mxDragSource.prototype.createDragElement;
//    });
    var tree= treepanel.getView().getNodes();
    for(var i=0;i<tree.length;i++){
        var rec=treepanel.getView().getRecord(tree[i]);
        if(rec.get('leaf')==false)continue;
        var sprite=function(width, height){
            var elt = document.createElement('div');
            elt.style.border = '1px double black';
            elt.style.width = width + 'px';
            elt.style.height = height + 'px';
            elt.style.backgroundColor = '#ffffff';
            return elt;
        };
        var ds = mxUtils.makeDraggable(tree[i], graph, funct,sprite(cells[0].geometry.width,cells[0].geometry.height),null, null, graph.autoscroll, true);
        ds.isGuidesEnabled = function()
        {
            return graph.graphHandler.guidesEnabled;
        };
        ds.createDragElement = mxDragSource.prototype.createDragElement;
    }
    
});

</script>

<script>
//    var tbContainer=document.getElementById('tbContainer');
//    tbContainer.style.position = 'absolute';
//    tbContainer.style.overflow = 'auto';
//    tbContainer.style.padding = '2px';
//    tbContainer.style.left = '0px';
//    tbContainer.style.top = '5px';
//    tbContainer.style.width = '120px';
//    tbContainer.style.bottom = '0px';
//    tbContainer.style.border = '1px solid blue';
//    var toolbar = new mxGraph(tbContainer);
//    var style=toolbar.getStylesheet().getDefaultVertexStyle();
//    //setStyle(style);
//    var prototype = new mxCell('122', new mxGeometry(20, 20, 100, 50),style);
//    prototype.setVertex(true);
//    toolbar.addCell(prototype);
</script>
</body>
</html>