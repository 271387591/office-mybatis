/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-6-13
 * Time: 下午4:52
 * To change this template use File | Settings | File Templates.
 */
function mxApplication(config,name,category,mid,source,categories)
{
    //清空容器
//    if(document.getElementById('sideBar').childNodes.length >= 0){
//      removeDiv('sideBar');
//    }
//    if(document.getElementById('graph').childNodes.length >= 0){
//      removeDiv('graph');
//    }
//    if(document.getElementById('task1').childNodes.length >= 0){
//      removeDiv('task1');
//    }
//    if(document.getElementById('task2').childNodes.length >= 0){
//      removeDiv('task2');
//    }
//    //删除div中的元素
//    function removeDiv(divId){
//      var div = document.getElementById(divId)
//      while(div.hasChildNodes()) //当div下还存在子节点时 循环继续
//      {
//        div.removeChild(div.firstChild);
//      }
//    }



    var parent = document.getElementById('task1');
    if(parent.childNodes.length == 0){
      var elt = document.createElement('form');

      elt.setAttribute('id','modelForm');
      createModelProperties(parent,elt,name,category,categories);
    }

    //在连接处理程序中,为了新的连接创建图片。
    mxConnectionHandler.prototype.connectImage = new mxImage('mxgraph/images/connector.gif', 9, 9);

    if(!mxClient.isBrowserSupported())
    {
        mxUtils.error('Browser is not supported!', 200, false);
    }
    else
    {

        var xmlRequest = mxUtils.load(config);
        var node = xmlRequest.getDocumentElement();
        var editor = new mxEditor(node);
        var graph = editor.graph;

        //设置graph各种开关。
        if(graph.isEnabled())
        {
            //设置graph中可以连接。
            graph.setConnectable(true);
            //设置不允许悬空边
            graph.setAllowDanglingEdges(false);
            //设置不可以连接两次
            graph.setMultigraph(false);
            //设置可以拖入其他的cell。
            graph.setDropEnabled(true);
            //在graph中设置向导可用
            graph.graphHandler.guidesEnabled = true;

            //结束的状态不是有效资源
            //覆盖判定是否是有效资源,让结束的顶点变成不能成为连接的顶点。
            graph.isValidSource = function(cell)
            {
                if(cell.isVertex())
                {
                    if(cell.style == 'group')
                    {
                        return false;
                    }
                    else if(cell.value.nodeName == 'End' || cell.value.nodeName == 'ExceptionEnd' ||
                        cell.value.nodeName == 'CancelEnd')
                    {
                        return false;
                    }
                }
                else if(cell.isEdge())
                {
                    return false;
                }

                return true;
            }

            //覆盖判定是否是有效的被连接的顶点方法,让这个有效的被连接点失效。
            graph.isValidTarget = function(cell)
            {
                if(cell.isVertex())
                {
                    if(cell.style == 'group')
                    {
                        return false;
                    }
                    else if(cell.value.nodeName == 'Start')
                    {
                        return false;
                    }
                }
                else if(cell.isEdge())
                {
                    return false;
                }

                return true;
            }

        }

        var style = graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_EDGE] = mxConstants.EDGESTYLE_ELBOW;
        style[mxConstants.STYLE_STROKECOLOR] = 'black';
        style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
        style[mxConstants.STYLE_FONTCOLOR   ] = 'red';
        style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'white';
        style[mxConstants.STYLE_ROUNDED] = true;
        graph.alternateEdgeStyle = 'elbow=vertical';

        var group =new Object();
        group[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
        group[mxConstants.STYLE_ROUNDED] = true;
        group[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        group[mxConstants.STYLE_DASHED] = true;
        group[mxConstants.STYLE_STROKECOLOR] = '#B3BAAC';
        group[mxConstants.STYLE_FILLCOLOR] = 'black';
        group[mxConstants.STYLE_OPACITY] = 50;
        graph.getStylesheet().putCellStyle('group',group);

        //覆盖graph.createGroupCell方法去设置group的样式
        var createGroupCell = mxGraph.prototype.createGroupCell;

        mxGraph.prototype.createGroupCell = function()
        {
            var groupCell = createGroupCell.apply(this,arguments);
            groupCell.setStyle('group');

            return groupCell;
        }


        var xmlDocument = mxUtils.load('mxgraph/config/shapes.xml').getXml();
        var sideBarDiv = document.getElementById('sideBar');
        var sideBarGraph = new mxGraph(sideBarDiv);
        mxStencilRegistry.parseStencilSet(xmlDocument,mxUtils.bind(this,function(stencilName)
        {
            var templates = new Array();
            templates = editor.templates;
            if(templates[stencilName] != null)
            {
//                var elt = document.createElement('div');
//                elt.className = 'items';
////                elt.style.margin = '10px 30px';
//                elt.style.overflow = 'hidden';
////                elt.style.width = '60px';
////                elt.style.height = '60px';
////                elt.style.display = 'inline-block';
                var cell = templates[stencilName];
                var elt = document.createElement('div');
                elt.style.position = 'absolute';
//                elt.visibility = 'hidden';
                elt.style.left = cell.geometry.x + 'px';
                elt.style.top = cell.geometry.y + 'px';
                elt.style.width = cell.geometry.width + 'px';
                elt.style.height = cell.geometry.height + 'px';

                sideBarGraph.setEnabled(false);
                sideBarGraph.addCell(cell);

                sideBarDiv.appendChild(elt);

//                var node = null;

//                //为支持html标签的容器在ie9标准模式下被克隆的代替。
//                if (graph.dialect == mxConstants.DIALECT_SVG)
//                {
//                    node = graph.view.getCanvas().ownerSVGElement.cloneNode(true);
//                }
//                //修复了Vml在ie8标准模式中的渲染。
//                else if (document.documentMode == 8)
//                {
//                    node = graph.container.cloneNode(false);
//                    node.innerHTML = graph.container.innerHTML;
//                }
//                else
//                {
//                    node = graph.container.cloneNode(true);
//                }

//                graph.model.clear();
//
//                node.style.position = 'relative';
//                node.style.overflow = 'visible';
//                node.style.cursor = 'pointer';
//                node.style.width = templates[stencilName].geometry.width;
//                node.style.height = templates[stencilName].geometry.height;

//                elt.appendChild(node);
//                parent.appendChild(elt);
            };
            //添加一个拖拽资源
            var dragSource = createDragSource(editor,templates[stencilName],elt,createDropHandler([templates[stencilName]],true)
                ,createDragPreview(templates[stencilName].geometry.width,templates[stencilName].geometry.height));

            //添加向导
            dragSource.isGuidesEnabled = mxUtils.bind(this,function()
            {
                return true;
            });
        }));

        //添加toolbar
//        var toolbar = document.getElementById('toolBar');
//        addToolbarButton(editor,toolbar,'show','重绘',null);
        editor.addAction('show',function()
        {
            graph.model.clear();
        });
//        addToolbarButton(editor,toolbar,'import','导入',null);
//        editor.addAction('import',function(editor)
//        {
//            showImportWindow(editor);
//        });
//        addToolbarButton(editor,toolbar,'export','导出',null);
        //添加一个新的exportAction。
//        editor.addAction('export',function(editor)
//        {
//            var textarea = document.createElement('textarea');
//            textarea.style.width = '400px';
//            textarea.style.height = '400px';
//            var enc = new mxCodec(mxUtils.createXmlDocument());
//            var node = enc.encode(editor.graph.model);
//            textarea.value = mxUtils.getXml(node);
//            showExportWindow(editor.graph,'XMl',textarea,410,440)
//        });
//        addToolbarButton(editor,toolbar,'print','打印',null);
//
//        addToolbarButton(editor,toolbar,'save','保存',null,false,mid);
//        addToolbarButton(editor,toolbar,'copy','复制',null);
//        addToolbarButton(editor,toolbar,'cut','剪切',null);
//        addToolbarButton(editor,toolbar,'paste','粘贴',null);
//        addToolbarButton(editor,toolbar,'delete','删除',null);
//        addToolbarButton(editor,toolbar,'undo','撤销',null);
//        addToolbarButton(editor,toolbar,'redo','重做',null);
//        addToolbarButton(editor,toolbar,'zoomIn','放大',null);
//        addToolbarButton(editor,toolbar,'zoomOut','缩小',null);
//        addToolbarButton(editor,toolbar,'actualSize','实际大小',null);
//        addToolbarButton(editor,toolbar,'fit','全屏显示',null);
//        addToolbarButton(editor,toolbar,'group','分组',null);
//        addToolbarButton(editor,toolbar,'ungroup','删除组',null);
//        addToolbarButton(editor,toolbar,'toFront','最上层',null);
        editor.addAction('toFront',function(editor)
        {
            editor.graph.orderCells(false);
        });
//        addToolbarButton(editor,toolbar,'toBack','最下层',null);
        editor.addAction('toBack',function(editor){
            editor.graph.orderCells(true);
        });
        editor.addAction('save',function(editor){
          var enc = new mxCodec(mxUtils.createXmlDocument());
          var node = enc.encode(editor.graph.model);
          var source = mxUtils.getXml(node);
          var modelName=document.getElementById('modelName').value;
          var modelCategory=document.getElementById('modelCategory').value;
          if(!modelName){
              Ext.MessageBox.alert('流程名称必填');
            return;
          }
          Ext.Ajax.request({
            url:'edit/save',
            params:{mid:mid,name:modelName,category:modelCategory,source:source},
            method:'POST',
            success:function(response, options){
              var result=Ext.decode(response.responseText);
                Ext.MessageBox.alert(result.message);
              Ext.ComponentQuery.query('#mxGraphWindow')[0].close();
              Ext.ComponentQuery.query('#aModelView')[0].getStore().load();
            },
            failure:function(response, options){
                Ext.MessageBox.alert('请求超时或网络故障,错误编号：' + response.status)
            }
          });
        });
//        addToolbarButton(editor,toolbar,'alignCellsLeft','向左对齐',null);
//        addToolbarButton(editor,toolbar,'alignCellsCenter','水平居中',null);
//        addToolbarButton(editor,toolbar,'alignCellsRight','向右对齐',null);
//        addToolbarButton(editor,toolbar,'alignCellsTop','向上对齐',null);
//        addToolbarButton(editor,toolbar,'alignCellsMiddle','垂直居中',null);
//        addToolbarButton(editor,toolbar,'alignCellsBottom','向下对齐',null);
//        addToolbarButton(editor,toolbar,'showProperties','属性',null);



        //监听extjs的button点击事件去实现graph的功能.
        //重绘
        graph.addListener('redraw',function(sender,evt){
          graph.model.clear();
        });
        graph.addListener('save',function(sender,evt){
          editor.execute('save');
        });
        graph.addListener('delete',function(sender,evt){
          editor.execute('delete');
        });
        graph.addListener('export',function(sender,evt){
          editor.execute('export');
        });
        graph.addListener('import',function(sender,evt){
          editor.execute('import');
        });
        graph.addListener('zoom',function(sender,evt){
          editor.execute('zoom');
        });
        graph.addListener('zoomIn',function(sender,evt){
          editor.execute('zoomIn');
        });
        graph.addListener('zoomOut',function(sender,evt){
          editor.execute('zoomOut');
        });
        graph.addListener('actualSize',function(sender,evt){
          editor.execute('actualSize');
        });
        graph.addListener('fit',function(sender,evt){
          editor.execute('fit');
        });
        graph.addListener('undo',function(sender,evt){
          editor.execute('undo');
        });
        graph.addListener('redo',function(sender,evt){
          editor.execute('redo');
        });


    }


    //监听选中的model.去实现在右边栏显示每个选中的cell的属性。
    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt)
    {
        var cells = evt.getProperty('removed');
        var parent = document.getElementById('task2');
        var elt = document.createElement('form');
        elt.setAttribute('id','graphForm');
        if(cells == null)
        {
            hiddenProperties();
        }else if(cells.length == 1 && cells[0].style != 'group')
        {
//            if(cells[0].isEdge())
//            {
//                var edge = cells[0];
//                var startCell = edge.source;
//                var endCell = edge.target;
//                if(startCell.value.nodeName == 'Start' && endCell.value.nodeName == 'End')
//                {
//                    graph.cellsRemoved([edge]);
//                    mxUtils.alert('开始、结束不能直接连接');
//                }else if(startCell.value.nodeName == 'Start' && endCell.value.nodeName == 'ExceptionEnd')
//                {
//                    graph.cellsRemoved([edge]);
//                    mxUtils.alert('开始、异常 结束不能直接连接');
//                }else if(startCell.value.nodeName == 'Start' && endCell.value.nodeName == 'CancelEnd')
//                {
//                    graph.cellsRemoved([edge]);
//                    mxUtils.alert('开始、取消 结束不能直接连接');
//                }else
//                {
//                    hiddenProperties();
//                    createCommonProperties(parent,elt,cells[0],editor);
//                }
//            }else
//            {
                hiddenProperties();
                createCommonProperties(parent,elt,cells[0],editor,mid);
//            }
        }else
        {
            hiddenProperties();
        }

    });

    //属性栏和graph栏的折叠展开同步。
    graph.addListener(mxEvent.CELLS_FOLDED,function(sender,evt)
    {
        var cell = evt.properties.cells[0]
        if(cell.style != 'group' && cell.value.nodeName == 'SubProcess')
        {
            var radio = document.getElementById('radio');//展开
            var radio1 = document.getElementById('radio1');//折叠
            var collapse = evt.properties.collapse;
            if(collapse)
            {
                radio.disabled = false;
                radio1.disabled = true;
                radio1.checked = true;
            }else
            {
                radio.disabled = true;
                radio1.disabled = false;
                radio.checked = true;
            }
        }
    });

    //去监听连接顶点事件
    graph.addListener(mxEvent.CELL_CONNECTED,function(sender,evt)
    {
        var value = document.createElement('edge');
        value.setAttribute('label','');
        value.setAttribute('description','');
        evt.properties.edge.value = value;
    });

    //覆盖cellLabelChanged()方法。去实现选中的cell的value.label = newValue(即是用户手动输入的值);
    var graphCellLabelChanged = graph.cellLabelChanged;
    graph.cellLabelChanged = function(cell, newValue, autoSize)
    {
        // 复制当前传入的cell的value对象。
        var elt = cell.value.cloneNode(true);
        //用户修改后的newValue字符串。赋值给cell.value的label属性。而不是原来的把value直接赋值成newValue
        elt.setAttribute('label', newValue);

        //把修改后的elt赋值给需要传入给CellLabelChanged的newValue参数。
        newValue = elt;
        //再apply().
        graphCellLabelChanged.apply(this, arguments);
    };

    //快捷键
    var keyHandler = new mxKeyHandler(graph);

    //在mac中修正了command键.变成control键
//    keyHandler.isControlDown = function(evt)
//    {
//        return mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey);
//    };

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

    editRecentFlow(source,editor);

    return editor;
}

//解析template用到的xml中配置的形状。
(function()
{
    mxStencilRegistry.parseStencilSet = function(xmlDocument,parseStencil)
    {
        var root = xmlDocument.documentElement;
        var shape = root.firstChild;
        var packageName = '';
        var name = root.getAttribute('name');

        if(name != null)
        {
            packageName = name + '.';
        }
        while(shape != null)
        {
            if(shape.nodeType == mxConstants.NODETYPE_ELEMENT)
            {
                name = shape.getAttribute('name');
                if(name != null)
                {
                    var width = shape.getAttribute('w');
                    var height = shape.getAttribute('h');

                    width = (width == null) ? 80 : parseInt(width,10);
                    height = (height == null) ? 80 : parseInt(height,10);

                    packageName = packageName.toLowerCase();
                    var stencilName = name.replace(/ /g,'_');

                    //mxStencilRegistry.addStencil添加新的模版形状.
                    //mxStencil实现了一个通用的形状,它是基于一个xml节点的描述
                    mxStencilRegistry.addStencil(packageName + stencilName.toLowerCase(),new mxStencil(shape));
                    if(parseStencil != null)
                    {
                        var elt = parseStencil(stencilName.toLowerCase());
                    }

                }
            }
            shape = shape.nextSibling;
        }

    }
})();

//创建拖拽预览
createDragPreview = function(width, height)
{
    var elt = document.createElement('div');
    elt.style.border = '1px dashed black';
    elt.style.width = width + 'px';
    elt.style.height = height + 'px';

    return elt;
};
//为插入获得的cells创建一个拖拽处理程序。
createDropHandler = function(cells, allowSplit)
{
    return function(graph, evt, target, x, y)
    {
        //mxGraph.getImportableCells(cells);
        //注意：这个方法中的cells必须是一个数组,不能传入单个对象。就算只有一个cell。也必须要造型成[object];才能出效果。
        cells = graph.getImportableCells(cells);

            if (cells.length > 0)
        {
            // graph.isValidDropTarget(cell,cells,evt)
            // 在指定的cells中,如果这个获得的cell是cells的一个有效拖拽目标。返回true。
            //cell,代表可能的拖拽target.cells,应该被拖拽进target的mxCells。evt,引发调用的鼠标事件。
            var validDropTarget = (target != null) ?
                graph.isValidDropTarget(target, cells, evt) : false;
            var select = null;

            if (target != null && !validDropTarget)
            {
                target = null;
            }

            // Splits the target edge or inserts into target group
            //分裂目标边或者插入目标群。
            if (allowSplit && graph.isSplitEnabled() && graph.isSplitTarget(target, cells, evt))
            {
                graph.splitEdge(target, cells, null, x, y);
                select = cells;
            }
            else if (cells.length > 0)
            {
                if(cells[0].value.nodeName == 'SubProcess')
                    {
                        cells[0].setConnectable(false);
                    }else
                    {
                        cells[0].setConnectable(true);
                    }
                //importCells插入cells到target的x,y坐标。里面内置了克隆这个cells。
                var cells1 = graph.getChildCells(graph.getDefaultParent(),true);
                if(cells[0].value.nodeName == 'Start')
                {
                    select = checkRepeat('Start',cells,cells1,x,y,target,graph,select);
                }else if(cells[0].value.nodeName == 'End')
                {
                    select = checkRepeat('End',cells,cells1,x,y,target,graph,select);
                }else if(cells[0].value.nodeName == 'ExceptionEnd')
                {
                    select = checkRepeat('ExceptionEnd',cells,cells1,x,y,target,graph,select);
                }else if(cells[0].value.nodeName == 'CancelEnd')
                {
                    select = checkRepeat('CancelEnd',cells,cells1,x,y,target,graph,select);
                }else
                {
                    cells[0].geometry.x = 0;
                    cells[0].geometry.y = 0;
                    select = graph.importCells(cells, x, y, target);
                }

            }
            if (select != null && select.length > 0)
            {
                graph.scrollCellToVisible(select[0]);
                graph.setSelectionCells(select);
            }
        }
    };
};
createDragSource = function(editor,template,elt,dropHandler, preview)
{
    //mxUtils.makeDraggable(element,graphF,funct,dragElement,dx,dy,autoscroll,scalePreview,highlightDropTargets,getDropTarget).
    // 为指定的graph配置获得的DOM节点作为一个拖拽资源。
    //element:可以拖动的DOM元素。graphF:作为一个拖拽的目标graph，or一个作为鼠标事件的function。并且返回当前的graph。
    //funnct:在拖拽成功之后执行的function
    //dragElement:可选的DOM节点用于拖拽预览
    //dx,dy,dx表示的在光标和拖拽预览之间的位移.dy表示的是在光标和拖拽预览之间的位移.
    //autoscroll:自动卷曲.可选的boolean类型。去指定自动卷曲是否被用到.默认的是mxGraph.autoscroll.
    //scalePreview:可选的boolean.指定预览图形应该根据相应的graph的比例.如果为true.那么位移也讲按比例缩小.默认是false.
    //highlightDropTargets:可选的boolean.指定置放目标应该是高亮显示的。默认是true.
    //getDropTarget:可选的function去为获得的location(x,y)返回置放目标.默认的是mxGraph.getCellAt.
    var dragSource = mxUtils.makeDraggable(elt,editor.graph,dropHandler,
        preview,0,0,editor.graph.autoscroll,true);

    //当目标为一个有效的跟,允许插入
    dragSource.getDropTarget = function(graph, x, y)
    {
        var target = mxDragSource.prototype.getDropTarget.apply(this, arguments);
        if(target != null && target.isVertex() && target.style != 'group'){
            if(target.value.nodeName == 'SubProcess' || graph.isValidRoot(target))
            {
                     if(target.children != null){
                         if(template.value.nodeName == 'Start'){
                             return checkDataSource(target,'Start');
                         }else if(template.value.nodeName == 'End'){
                             return checkDataSource(target,'End');
                         }else if(template.value.nodeName == 'ExceptionEnd'){
                             return checkDataSource(target,'ExceptionEnd');
                         }else if(template.value.nodeName == 'CancelEnd'){
                             return checkDataSource(target,'CancelEnd');
                         }

                     }
                return target;
            }
            else
            {
                return null;
            }
        }
        return null;
    };

    mxGraph.prototype.isValidRoot = function(cell)
    {
        return this.isSwimlane(cell);
    };

    return dragSource;

}

function checkDataSource(target,nodeName){
    for(var i = 0;i < target.children.length;i++){
        if(target.children[i].value.nodeName == nodeName){
            return null;
        }
    }
    return target;
}

mxGraph.prototype.isValidDropTarget = function(cell,cells,evt)
{
    if(cell.style == 'group')
    {
        return true;
    }
    else if((cell.value != null && cell.isVertex() && cell.value.nodeName == 'SubProcess') || this.isSwimlane(cell))
    {
        if(cell.value.nodeName == 'SubProcess'){
           if(cell.children != null){
               if(cells[0].value.nodeName == 'Start'){
                   return checkSubProcess(cell,'Start');
               }else if(cells[0].value.nodeName == 'End'){
                   return checkSubProcess(cell,'End');
               }else if(cells[0].value.nodeName == 'ExceptionEnd'){
                   return checkSubProcess(cell,'ExceptionEnd');
               }else if(cells[0].value.nodeName == 'CancelEnd'){
                   return checkSubProcess(cell,'CancelEnd');
               }
           }else{
               return true;
           }
        }
        return true;
    }
    return false;
}

function checkSubProcess(cell,nodeName){
    for(var i = 0;i < cell.children.length;i++){
        if(cell.children[i].value.nodeName == nodeName){
            return false;
        }
    }
    return true;
}

function addToolbarButton(editor,toolbar,action,label,image,isTransparent,mid)
{

    var button = document.createElement('input');
    button.setAttribute('type','button');
    button.fontSize ='10';
    if(image != null)
    {
        var img = document.createElement('image');
        img.setAttribute('src',image);
        img.style.width = '16px';
        img.style.height = '16px';
        img.style.verticalAlign = 'middle';
        img.style.marginRight = '2px';
        button.appendChild(img);
    }
    if(isTransparent)
    {
        button.style.background = 'transparent';
        button.style.color = '#FFFFFF';
        button.style.border = 'none';
    }
    mxEvent.addListener(button,'click',function(evt)
    {
        if(action == 'showProperties')
        {
            var cell = editor.graph.getSelectionCell();
            editor.execute(action);
        }
        else if(action == 'save'){
            var enc = new mxCodec(mxUtils.createXmlDocument());
            var node = enc.encode(editor.graph.model);
            var source = mxUtils.getXml(node);
            var modelName=document.getElementById('modelName').value;
            var modelCategory=document.getElementById('modelCategory').value;
            if(!modelName){
                Ext.MessageBox.alert('添加流程','流程名称必填');
                return;
            }
            Ext.Ajax.request({
                url:'save',
                params:{mid:mid,name:modelName,category:modelCategory,source:source},
                method:'POST',
                success:function(response, options){
                    var result=Ext.decode(response.responseText);
                    Ext.MessageBox.alert(result.message);
                },
                failure:function(response, options){
                    Ext.MessageBox.alert('请求超时或网络故障,错误编号：' + response.status)
                }
            });

//            $.post('save',{mid:mid,name:$('#modelName').val(),category:$('#modelCategory').val(),source:source},function(data){
//                window.close();
//            })
        }
        else
        {
            editor.execute(action);
        }
    });
    //mxGraph中有mxUtils有实现在node节点中创建text追加到patent中。
    mxUtils.write(button,label);
    toolbar.appendChild(button);
}
//导出窗口
function showExportWindow(graph,title,content,width,height)
{
    var background = document.createElement('div');
    background.style.position = 'absolute';
    background.style.left = '0px';
    background.style.top = '0px';
    background.style.right = '0px';
    background.style.bottom = '0px';
    background.style.background = 'black';
    //设置节点不透明度。
    mxUtils.setOpacity(background,50);
    document.body.appendChild(background);

        if(mxClient.Is_IE)
    {
        //维护一个div元素在ie浏览器中的大小,这个解决方案为了在ie中开始时忽略了顶部和右部的style。
        new mxDivResizer(background);
    }
    var x = 440;
    var y = 90;

    var wnd = new mxWindow(title,content,x,y,width,height,false,true);
    wnd.setClosable(true);

    //当窗口关闭时,背景色逐渐消失
    wnd.addListener(mxEvent.DESTROY,function(evt)
    {
        graph.setEnabled(true);
        //异步淡出操作。
        mxEffects.fadeOut(background,50,true,10,30,true);
    });

    graph.setEnabled(false);
    wnd.setVisible(true);

}

//导入窗口
function showImportWindow(editor)
{
    var background = document.createElement('div');
    background.id = 'importBackground';
    background.style.position = 'absolute';
    background.style.left = '0px';
    background.style.top = '0px';
    background.style.right = '0px';
    background.style.bottom = '0px';
    background.style.background = 'white';

    mxUtils.setOpacity(background,60);

    if(mxClient.IS_IE)
    {
        new mxDivResizer(background);
    }

    document.body.appendChild(background);

    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.zIndex = 200000;
    div.className = 'importDiv';
    div.id = 'importDiv';
    div.style.width = '300px';
    div.style.height = '180px';
    div.style.left = '440px';
    div.style.top = '180px';
    div.style.padding = '20px';
    div.style.border = '10px solid pink';
    div.style.boxShadow = '0px 0px 0px 2px red';//水平阴影的位置,垂直阴影的位置,模糊的距离,模糊的尺寸。
    div.style.borderRadius = '8px';

    createDialog(div,editor);
};

function createDialog(parent,editor)
{
    window.editor = editor;
    var iframe = document.createElement('iframe');
    iframe.style.backgroundColor = 'transparent';
    iframe.allowTransparency = 'true';
    iframe.style.borderStyle = 'none';
    iframe.style.borderWidth = '0px';
    iframe.style.overflow = 'hidden';
    iframe.style.zIndex = 200000;
    iframe.frameBorder = '0';
    iframe.setAttribute('width', '320px');
    iframe.setAttribute('height', '190px');
    iframe.setAttribute('src','mxgraph/open.html');

    parent.appendChild(iframe);
    document.body.appendChild(parent);
};

File = function()
{
    this.fileName = null;
};

File.prototype.setFileName = function(fileName)
{
    this.fileName = fileName;
};
File.prototype.getFileName = function()
{
    return this.fileName;
};

//显示model属性
function createModelProperties(parent,elt,name,category,categories){
    var form = new mxForm(name);
    var i_name=document.createElement('input');
    i_name.setAttribute('id','modelName');
    if(i_name){
        i_name.value=name;
    }
    var i_category = document.createElement('select');
    i_category.setAttribute('id','modelCategory');
    i_category.setAttribute('style','width:120px;');
    var optionAll=document.createElement('option');
    optionAll.text='所有';
    optionAll.value='';
    i_category.add(optionAll);
    if(categories){
        Ext.Array.each(Ext.decode(categories),function(item){
            var option=document.createElement('option');
            option.text=item.text;
            option.value=item.value;
            i_category.add(option);
        });
    }
    if(category){
        i_category.value=category;
    }
    form.addField('流程名称:',i_name);
    form.addField('流程分类:',i_category);
    elt.appendChild(form.body);
    parent.appendChild(elt);
};

//属性任务栏
function createCommonProperties(parent,elt,cell,editor,mid)
{
    var form = new mxForm(cell.value.nodeName);
    var nameInput=document.createElement('input');
    nameInput.value= cell.value.getAttribute('label');
//    var assignee = document.createElement('select');
//    var a_yes=document.createElement('option');
//    a_yes.text='是';
//    a_yes.value=1;
//    var a_no=document.createElement('option');
//    a_no.text='否';
//    a_no.value=0;
//    assignee.add(a_no);
//    assignee.add(a_yes);
//    assignee.value=cell.value.getAttribute('assignee');
//    assignee.onchange=function(){
//        if(assignee.value=='1'){
//           // document.getElementById('candidateUsers').parentNode.parentNode.style.display="none";
//            cell.setAttribute('assignee','1');
//        } else{
////            document.getElementById('candidateUsers').parentNode.parentNode.style.display="";
//            cell.setAttribute('assignee','');
//        }
//    };
    var expression=document.createElement('input');
    expression.value= cell.value.getAttribute('expression');
    expression.onchange = function(){
        var expression1 = expression.value;
        cell.setAttribute('expression',expression1);
    };
    var description=document.createElement('textArea');
    description.setAttribute('style','width:125px;');
    description.value= cell.value.getAttribute('description');
    description.onchange = function(){
        var description1 = description.value;
        cell.setAttribute('description',description1);
    };
    var extraField=document.createElement('input');
    extraField.setAttribute('style','width:125px;');
    extraField.value= cell.value.getAttribute('extraField');
    extraField.onchange = function(){
        var extraField1 = extraField.value;
        cell.setAttribute('extraField',extraField1);
    };
    var type=cell.value.nodeName;
    if('Start' == type){

    }else if('Task' == type){
//        form.addField('发起人执行:',assignee);
        form.addField('任务名称:',nameInput);

        form.addField('描述:',description);
        cell.setAttribute('type',1);
    } else if('EDGE' == type){
        form.addField('名称:',nameInput);
        form.addField('执行条件:',expression);
    }
    elt.appendChild(form.body);
    parent.appendChild(elt);
//
//
//        var label = document.createElement('label');
//        label.innerHTML = '标签:';
//        label.setAttribute('style','font-size:13px')
//        var input = document.createElement('input');
//        input.value = cell.value.getAttribute('label');
//        var label1 = document.createElement('label');
//        label1.innerHTML = '描述:';
//        label1.setAttribute('style','font-size:13px');
//        var input1 = document.createElement('input');
//        input1.value = cell.value.getAttribute('description');
//        elt.appendChild(label);
//        elt.appendChild(input);
//        elt.appendChild(document.createElement('br'))
//        elt.appendChild(label1);
//        elt.appendChild(input1);
//
//        //监听
//        input.onchange = function()
//        {
//            var label = input.value;
//            cell.setAttribute('label',label);
//            editor.graph.refresh();
//        };
//        input.onclick=function(){
//            Ext.MessageBox.alert('dddd')
//
//        };
//    console.log('cell.value.nodeName==',cell.value.nodeName)
//
//        input1.onchange = function()
//        {
//            var description = input1.value;
//            cell.setAttribute('description',description);
//        };
//        if(cell.value.nodeName == 'EDGE'){
//            var form = new mxForm('ddd');
//            console.log(form);
//
//            var flowCondition = document.createElement('label')
//            flowCondition.innerHTML='条件表达式:'
//            var input = document.createElement('input');
//            input.value = cell.value.getAttribute('expression');
//            var td = form.addField('d大调',input);
//
////            elt.appendChild(document.createElement('br'))
////            elt.appendChild(flowCondition);
////            parent.appendChild(td);
//        }else if(cell.value.nodeName == 'Decision'){
//            var form = new mxForm('dd');
//            var flowCondition = document.createElement('label')
//            flowCondition.innerHTML='条件表达式:'
//            var input = document.createElement('input');
//            input.value = cell.value.getAttribute('expression');
//            var input2 = document.createElement('input');
//            input2.value = cell.value.getAttribute('expression');
//            form.addField('d大调',input);
//            form.addField('d大调adsfdsf',input2);
//            elt.appendChild(form.body);
////            var wnd = new mxWindow('22','eee',20,30,200,200,false,true);
////            wnd.setClosable(true);
////
////            wnd.setVisible(true);
//            parent.appendChild(elt);
//
////            var label2 = document.createElement('label');
////            label2.innerHTML = '表达式:'
////            label2.setAttribute('style','font-size:13px');
////            var input2 = document.createElement('input');
////            input2.value = cell.value.getAttribute('expression');
////            elt.appendChild(document.createElement('br'))
////            elt.appendChild(label2);
////            elt.appendChild(input2);
////            //监听
////            input2.onchange = function()
////            {
////                var expression = input2.value;
////                cell.setAttribute('expression',expression);
////            };
//
//        }else if(cell.value.nodeName == 'Task')
//        {
//            var label3 = document.createElement('label');
//            label3.innerHTML = '执行角色';
//            label3.setAttribute('style','font-size:13px');
//            var select = document.createElement('select');
//            var y=document.createElement('option');
//            y.text='管理员';
//            var y1=document.createElement('option');
//            y1.text='用户';
//            try
//            {
//                // 标准兼容
//                select.add(y,null);
//                select.add(y1,null);
//            }
//            catch(ex)
//            {
//                //ie浏览器
//                select.add(y);
//                select.add(y1);
//            }
//            for(var i = 0;i < select.length;i++)
//            {
//                if(cell.value.getAttribute('role') == select.options[i].text)
//                {
//                    select.options[i].selected = true;
//                }
//            }
//            elt.appendChild(document.createElement('br'));
//            elt.appendChild(label3);
//            elt.appendChild(select);
//            //监听
//            select.onchange = function()
//            {
//                cell.value.setAttribute('role',select.value);
//            };
//
//        }else if(cell.value.nodeName == 'SubProcess')
//        {
//            var radio = document.createElement('input');
//            radio.setAttribute('id','radio');
//            radio.setAttribute('type','radio');
//            radio.setAttribute('name','state');
//            radio.setAttribute('value','expand');
//
//            var radio1 = document.createElement('input');
//            radio1.setAttribute('id','radio1');
//            radio1.setAttribute('type','radio');
//            radio1.setAttribute('name','state');
//            radio1.setAttribute('value','collapse');
//
//            elt.appendChild(document.createElement('br'));
//            elt.appendChild(radio);
//            var text = document.createElement('span');
//            text.innerHTML = '展开';
//            text.setAttribute('style','font-size:13px');
//            elt.appendChild(text);
//            elt.appendChild(document.createElement('br'));
//            var text1 = document.createElement('span');
//            text1.innerHTML = '折叠';
//            text1.setAttribute('style','font-size:13px');
//            elt.appendChild(radio1);
//            elt.appendChild(text1);
//
//            if(cell.children == null)
//            {
//                radio.disabled = true;
//                radio1.disabled = true;
//            }else
//            {
//                if(cell.isCollapsed())
//                {
//                    radio.disabled = false;
//                    radio1.disabled = true;
//                    radio1.checked = true;
//                }else
//                {
//                    radio.disabled = true;
//                    radio.checked = true;
//                    radio1.disabled = false;
//                }
//            }
//            mxEvent.addListener(radio,'click',function(evt){
//                editor.execute('expand');
//                radio.disabled = true;
//                radio1.disabled = false;
//            });
//            mxEvent.addListener(radio1,'click',function(evt){
//                editor.execute('collapse');
//                radio1.disabled = true;
//                radio.disabled = false;
//            });
//        }
//        parent.appendChild(elt);

};

function hiddenProperties()
{
    var form = document.getElementById('graphForm');
    if(form != null)
    {
       form.parentNode.removeChild(form);
    }
};

//覆盖graph.convertValueToString()方法去实现创建mxCell获取的是value对象的label属性值。
mxGraph.prototype.convertValueToString = function(cell)
{
    var value = this.model.getValue(cell);

    if (value != null)
    {
        if (mxUtils.isNode(value))
        {
            return value.getAttribute('label');
        }
        else if (typeof(value.toString) == 'function')
        {
            return value.toString();
        }
    }

    return '';
};

//判断是否还可以插入开始,结束,异常结束,取消结束.
function checkRepeat(nodeName,cells,cells1,x,y,target,graph,select)
{
    var sum = 0;
    if(target != null){
        if(target.value.nodeName == 'SubProcess'){
            cells1 = graph.getChildCells(target,true);
            sum = checkSum(cells1,nodeName,sum);
        }
    }else{
        sum = checkSum(cells1,nodeName,sum);
    }
    if(sum == 0)
    {
        cells[0].geometry.x = 0;
        cells[0].geometry.y = 0;
        select = graph.importCells(cells, x, y, target);
    }
    return select;
}

function checkSum(cells1,nodeName,sum){
    for(var i = 0; i < cells1.length; i++)
    {
        if(cells1[i].value.nodeName == nodeName)
        {
            sum += 1;
        }
    }
    return sum;
}

//覆盖这个方法验证哪些是无效的连接
mxGraph.prototype.validateEdge = function(edge, source, target)
{
    if(source.value.nodeName == 'Start' && (target.value.nodeName == 'End'
         || target.value.nodeName == 'ExceptionEnd' || target.value.nodeName == 'CancelEnd')){
        return '开始节点和结束类型的节点不能直接相连!'
    }
    //子流程或者泳道验证
    if(source.getParent().getId() != 1){
        if(source.getParent().value.nodeName == 'SubProcess'){
            if(target == source.getParent()){
                return '子流程的孩子节点不能连接子流程!'
            }else if(target.getParent() != source.getParent()){
                return '子流程的孩子节点只能内部相连!'
            }
        }
        //默认父节点的子节点验证
    }else{
        if(source.value.nodeName == 'SubProcess' && target.getParent() == source){
            return '子流程不能连接其孩子流程!'
        }else if(target.getParent().getId() != 1){
            if(target.getParent().value.nodeName == 'SubProcess'){
                return '主流程不能连接子流程的孩子流程!'
            }
        }
    }
    return null;
};

//编辑model时在graph初始化未完成的流程图
function editRecentFlow(source,editor){
    var xmlDocument = mxUtils.parseXml(source);
    var codec = new mxCodec(xmlDocument);
    codec.decode(xmlDocument.documentElement,editor.graph.model);
}