/**
 * Created by lihao on 9/21/14.
 */
function mxModeler(dom,templates)
{
    
    var xmlRequest = mxUtils.load(templates);
    var node = xmlRequest.getDocumentElement();
    var editor = new mxEditor(node);
    this.editor= editor;
    var graph=editor.graph;
    this.initGraph(graph,dom);
    this.keyHandler(graph);
//    this.addMenu(graph,editor);
    this.addGraphListeners(graph,this.showProperties);
    this.overrideGraph(graph,editor);
    this.graph=graph;
    this.templates=templates;
    
};
mxModeler.prototype.setConnectImagePath=function(connect){
    mxConnectionHandler.prototype.connectImage = new mxImage(connect, 16, 16);
    this.connectImagePath=connect;
};
mxModeler.prototype.getEditor=function(){
    return this.editor?this.editor:null;
};

mxModeler.prototype.getGraph=function(){
    return this.graph?this.graph:null;
};
mxModeler.prototype.initGraph = function(graph,dom)
{
    
    mxCellEditor.prototype.modified=false;
    mxGraph.prototype.cellsResizable=false;
    
    mxRectangleShape.prototype.crisp = true;

    mxGraphHandler.prototype.guidesEnabled = true;
    graph.panningHandler.autoExpand = true;
    graph.constrainChildren = false;
    graph.extendParents = false;
    graph.extendParentsOnAdd = true;
    mxEvent.disableContextMenu(document.body);
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
    graph.setConnectable(true);
    graph.setDropEnabled(true);
    graph.setPanning(true);
    graph.setTooltips(false);
    graph.setMultigraph(false);
    graph.setCellsResizable(true);
    graph.connectionHandler.setCreateTarget(false);
    graph.container.style.cursor = 'default';
};
mxModeler.prototype.keyHandler=function(graph){
    var keyHandler = new mxKeyHandler(graph),editor=this.editor;
    //command+z
    keyHandler.bindKey(90, function(evt)
    {
        editor.execute('undo');
    });
    //command+y
    keyHandler.bindKey(89, function(evt)
    {
        editor.execute('redo');
    });
    //fn+lelete
    keyHandler.bindKey(46, function(evt)
    {
        editor.execute('delete');
    });
    //command+c
    keyHandler.bindKey(67, function(evt)
    {
        editor.execute('copy');
    });
    //command+v
    keyHandler.bindKey(86, function(evt)
    {
        editor.execute('paste');
    });
    //command+x
    keyHandler.bindKey(88, function(evt)
    {
        editor.execute('cut');
    });
    
};
mxModeler.prototype.addMenu=function(graph,editor){
    graph.panningHandler.factoryMethod = function(menu, cell, evt)
    {
        var selected = !graph.isSelectionEmpty();
        menu.addItem('撤销', null, function(){
            editor.execute('undo');
        },null,'undo');
        menu.addSeparator();
        menu.addItem('剪切', null, function(){
            editor.execute('cut');
        },null,'cut',selected);
        menu.addItem('复制', null, function(){
            editor.execute('copy');
        },null,'copy',selected);
        menu.addItem('粘贴', null, function(){
            editor.execute('paste');
        },null,'paste');
        menu.addSeparator();
        menu.addItem('删除', null, function(){
            editor.execute('delete');
        },null,'delete',selected);
        menu.addSeparator();
        menu.addItem('编辑', null, function(){
            graph.startEditing();
        },null,'edit',selected);
    };
};
mxModeler.prototype.makeDraggable=function(treepanel,cells,graphcallback){
    var me=this;
    var cells = [cells];
    cells[0].vertex = true;
    var funct = function(graph, evt, target, x, y){
        cells = graph.getImportableCells(cells);
        if (cells.length > 0){
            var select = null,cell=cells[0],value=cell.value;
            var boundary=(value.getAttribute('type')=='boundaryEvent');
            var tar=target && (target.value.getAttribute('type')=='subProcess' || target.value.getAttribute('type')=='task');
            if(target==null && boundary){
                return;
            }
            if(target && boundary && (target.value.getAttribute('type')=='edge')){
                return;
            }
            if(target && boundary &&(target.value.getAttribute('type')=='task' || target.value.getAttribute('type')=='subProcess')){
                var xMin=target.geometry.x-cells[0].geometry.width/2;
                var xMax=target.geometry.x+target.geometry.width-cells[0].geometry.width/2;
                x=Math.max(x,xMin);
                x=Math.min(x,xMax);
                var ymin=target.geometry.y+target.geometry.height-cells[0].geometry.height/2;
                var ymax=ymin;
                y=ymax
                select = graph.importCells(cells, x, y, target);
                if(select && select.length>0){
                    select[0].setParent(target)
                    graph.scrollCellToVisible(select[0]);
                    graph.setSelectionCells(select);
                }
                return;
            }
            var validDropTarget = (target != null) ?
                graph.isValidDropTarget(target, cells, evt) : false;
            if (target != null &&
                !validDropTarget &&
                graph.getModel().getChildCount(target) == 0 &&
                graph.getModel().isVertex(target) == cells[0].vertex){
//                    graph.getModel().setStyle(target, cells[0].style);
//                    select = [target];
                select=null;
            }else{
                if (target != null &&
                    !validDropTarget){
                    target = null;
                }

                // Splits the target edge or inserts into target group
                if (graph.isSplitEnabled() && graph.isSplitTarget(target, cells, evt)){
                    graph.splitEdge(target, cells, null, x, y);
                    select = cells;
                }else{
                    cells = graph.getImportableCells(cells);

                    if (cells.length > 0){
                        select = graph.importCells(cells, x, y, target);
                    }
                }
            }

            if (select != null && select.length > 0){
                graph.scrollCellToVisible(select[0]);
                graph.setSelectionCells(select);
            }
        }
    };

    if (mxClient.IS_IE){
        mxEvent.addListener(treepanel, 'dragstart', function(evt)
        {
            evt.returnValue = false;
        });
    }
    var sprite=function(width, height){
        var elt = document.createElement('div');
        elt.style.border = '1px double black';
        elt.style.width = width + 'px';
        elt.style.height = height + 'px';
//            elt.style.backgroundColor = '#ffffff';
//            elt.className = 'mxPopupMenu';
        return elt;
    };

    var ds = mxUtils.makeDraggable(treepanel, me.graph, funct,sprite(cells[0].geometry.width,cells[0].geometry.height),null, null, me.graph.autoscroll, true);
    ds.isGuidesEnabled = function(){
        return me.graph.graphHandler.guidesEnabled;
    };
    ds.createDragElement = mxDragSource.prototype.createDragElement;
    
};
mxModeler.prototype.reloadGraph=function(source){
    var xmlDocument = mxUtils.parseXml(source);
    var codec = new mxCodec(xmlDocument);
    codec.decode(xmlDocument.documentElement,this.editor.graph.model);
};
mxModeler.prototype.showProperties=function(cell){
};

mxModeler.prototype.addGraphListeners = function(graph,showProperties)
{
    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(model, evt){
        graph.container.focus();
        var cell = graph.getSelectionCell();
        
        if(cell && cell.isEdge()){
            var source=cell.source;
            var target=cell.target;
            if(source && target && (source.value.getAttribute('type')=='startEvent')){
                var targetParent=target.getParent();
                if(!mxUtils.isNode(targetParent.value)){
                    target.value.setAttribute('tasktype','Starter');
                }
            }
        }
        if(showProperties){
            showProperties(cell);
        }
    });
};

mxModeler.prototype.overrideGraph = function(graph,editor)
{
    mxGuide.prototype.isEnabledForEvent = function(evt)
    {
        return !mxEvent.isAltDown(evt);
    };
    var createEdge=mxConnectionHandler.prototype.createEdge;

    mxConnectionHandler.prototype.createEdge = function(value, source, target, style){
        var cell=editor.templates['SequenceFlow'];
        value=cell.value;
        var edge=createEdge.apply(this, arguments);
        edge.setValue(value);
        return edge;
    }
    var mxConnectionHandlerInsertEdge = mxConnectionHandler.prototype.insertEdge;
    mxConnectionHandler.prototype.insertEdge = function(parent, id, value, source, target, style){
        if(!target) return source;
        return mxConnectionHandlerInsertEdge.apply(this, arguments);
    };
    var  validateConnection=mxConnectionHandler.prototype.validateConnection;
    mxConnectionHandler.prototype.validateConnection=function(source, target){
        if(parent && !parent.value && source && (source.value.getAttribute('type')=='startEvent') && (source.edges!=null) && source.edges.length>0){
            Ext.Msg.alert('验证','主流程开始节点后只能存在一个任务节点。');
            return source;
        }
        if(parent && !parent.value && source && (source.value.getAttribute('type')=='startEvent') && (target && target.value.getAttribute('tasktype')=='Countersign')){
            Ext.Msg.alert('验证','主流程第一个任务点不能设置为会签任务。');
            return source;
        }
        if(parent && !parent.value && source && (source.value.getAttribute('type')=='startEvent') && (target && target.value.getAttribute('usertaskassignment'))){
            target.value.setAttribute('usertaskassignment','');
        }
        
        if(source && target && target.edges){
            var sid=source.id;
            for(var i=0;i<target.edges.length;i++){
                var ttarget=target.edges[i].target;
                if(!ttarget || sid==ttarget.id){
                    return source;
                }
            }
        }
        if(source && source.edges && target){
            var tid=target.id;
            for(var i=0;i<source.edges.length;i++){
                var ttarget=source.edges[i].target;
                if(!ttarget || tid==ttarget.id){
                    return source;
                }
            }
        }
        if(!target) return source;
        return (source && target && (mxUtils.isNode(source.value) && mxUtils.isNode(target.value)) && (source.value.getAttribute('type') == 'startEvent') && (target.value.getAttribute('type') == 'startEvent'))?source:validateConnection.apply(this, arguments);
    };
    graph.convertValueToString = function(cell){
        return mxUtils.isNode(cell.value)?cell.getAttribute('name', ''):'';
    };
    graph.getLabel=function(cell){
        return cell?(mxUtils.isNode(cell.value)?cell.getAttribute('name', ''):(cell.isEdge()?cell.value:'')):'';
    };
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
    var cellLabelChanged = graph.cellLabelChanged;
    graph.cellLabelChanged = function(cell, newValue, autoSize){
        if (mxUtils.isNode(cell.value)){
            var pos = newValue.indexOf(' ');
            var value = (pos > 0) ? newValue.substring(0,
                pos) : newValue;
            var elt = cell.value.cloneNode(true);
            elt.setAttribute('name', value);
            newValue = elt;
            autoSize = false;
        }

        cellLabelChanged.apply(this, arguments);
    };

    graph.getEditingValue = function(cell) {
        return mxUtils.isNode(cell.value)?cell.getAttribute('name', ''):'';
    };
    graph.flipEdge = function(edge){
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
    var moveCells= mxGraph.prototype.moveCells;
    mxGraph.prototype.moveCells = function(cells, dx, dy, clone, target1, evt){
        if(cells && cells.length>0){
            var cell=cells[0];
            if(cell && cell.value && mxUtils.isNode(cell.value) && cell.value.getAttribute('type')=='boundaryEvent') {
                var target = cell.getParent();
                if (target && target.value && mxUtils.isNode(target.value)) {
                    cells = [cell];
                    return cells;
                }
            }
        }
        return moveCells.apply(this,arguments);
    };
    var oldResizable = graph.isCellResizable;
    graph.isCellResizable = function(cell)
    {
        if(cell && cell.value && mxUtils.isNode(cell.value) && cell.value.getAttribute('type')=='boundaryEvent'){
            return false;
        }
        return oldResizable.apply(this, arguments);
    };
    
};


