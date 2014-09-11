/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-12-27
 * Time: 上午10:10
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.MxGraphWindow',{
    requires: [
      'FlexCenter.activiti.view.MxGraphExportView',
      'FlexCenter.activiti.view.MxGraphImportView'
    ],
    extend: 'Ext.Window',
    alias: 'widget.mxGraphWindow',
    id: 'mxGraphWindow',
    resizable: false,
    modal: true,
    autoScroll:true,
    width: 1024,
    height: 580,
    layout: 'border',
    border: false,
    contentEl:'mainView',
    maximizable:true,
//    closeAction:'hide',

    initComponent: function(){
        var me = this;
        me.items = [
//            {
//                xtype: 'panel',
//                contentEl: 'toolBar',
//                height: 50,
//                region: 'north'
//
//            },
            {
                xtype: 'panel',
                contentEl: 'sideBar',
                title: '绘制样图',
                width: 150,
                overflowY: 'auto',
                collapsible: true,
                margin: '0 2 0 0',
//                split: true,
                region: 'west'
            },
            {
                xtype: 'panel',
                contentEl: 'graph',
                autoScroll:true,
                region: 'center',
                tbar: [
                  {
                    xtype: 'button',
                    text: '重绘',
                    iconCls: 'mxGraphRefresh',
                    itemId: 'redrawActionId',
                    handler:function(button,evt){
                      me.fireEvent('redraw',button,evt);
                    }
                  },'-',
                  {
                    xtype: 'button',
                    text: '保存',
                    iconCls: 'save',
                    handler: function(button,evt){
                      me.fireEvent('save',button,evt);
                    }
                  },'-',
                  {
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'mxGraphRemove',
                    handler: function(button,evt){
                      me.fireEvent('delete',button,evt);
                    }
                  },'-',
//                  {
//                    xtype: 'button',
//                    text: '导入',
//                    iconCls: 'import',
//                    handler: function(button,evt){
//                      me.fireEvent('import',button,evt);
//                    }
//                  },'-',
//                  {
//                    xtype: 'button',
//                    text: '导出',
//                    iconCls: 'export',
//                    handler: function(button,evt){
//                      me.fireEvent('export',button,evt);
//                    }
//                  },'-',
                  {
                    xtype: 'button',
                    text: '撤销',
                    iconCls: 'undo',
                    handler: function(button,evt){
                      me.fireEvent('undo',button,evt);
                    }
                  },'-',
                  {
                    xtype: 'button',
                    text: '重做',
                    iconCls: 'redo',
                    handler: function(button,evt){
                      me.fireEvent('redo',button,evt);
                    }
                  }
                ],
                dockedItems: [
                  {
                    xtype: 'toolbar',
//                    iconCls: 'add',
                    dock: 'bottom',
                    items: [
                      {
                        iconCls: 'zoom',
                        tooltip: '缩放比例',
                        handler: function(button,evt){
                          me.fireEvent('zoom',button,evt);
                        }
                      },'-',
                      {
                        iconCls: 'zoomIn',
                        tooltip: '放大',
                        handler: function(button,evt){
                          me.fireEvent('zoomIn',button,evt);
                        }
                      },'-',
                      {
                        iconCls: 'zoomOut',
                        tooltip: '缩小',
                        handler: function(button,evt){
                          me.fireEvent('zoomOut',button,evt);
                        }
                      },'-',
                      {
                        iconCls: 'zoomActual',
                        tooltip: '实际大小',
                        handler: function(button,evt){
                          me.fireEvent('actualSize',button,evt);
                        }
                      }
//                      ,'-',
//                      {
//                        iconCls: 'fit',
//                        tooltip: '全屏显示',
//                        handler: function(button,evt){
//                          me.fireEvent('fit',button,evt);
//                        }
//                      }
                    ]

                  }
//                  {
//                    xtype: 'button',
//                    text: '缩小',
//                    iconCls: 'zoomout'
//                  },
//                  {
//                    xtype: 'button',
//                    text: '实际大小',
//                    iconCls: 'zoom'
//                  }
                ]
            },
            {
              xtype: 'panel',
              width: 200,
              region: 'east',
              layout: 'border',
              collapsible: true,
              margin: '0 0 0 2',
//              split: true,
              items: [
                  {
                      xtype: 'panel',
                      contentEl: 'task1',
                      title: '流程属性',
                      border: false,
                      height: 275,
                      region: 'north'
                  },
                  {
                      xtype: 'panel',
                      contentEl: 'task2',
                      border: false,
                      title: '任务属性',
                      height: 275,
                      region: 'center'
                  }
              ]
            }
//            {
//              xtype: 'panel',
//              height: 10,
//              region: 'south'
//            }
        ];
        me.listeners = {
          afterrender: function () {
            if(me.modelId != null){
              Ext.Ajax.request({
                url:'edit/editor',
                params:{mid:me.modelId},
                method: 'get',
                scope:me,
                success: function (response, options){
                  var result=Ext.decode(response.responseText);
                  var editor = new mxApplication(basePath+'mxgraph/config/editor.xml',result.name,result.category,result.mid,result.source,result.categories);
                  me.addMxGraphEventFromExtJs(editor);
                },
                failure: function (response, options) {
                  Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                }
              });
            }else{
              Ext.Ajax.request({
                url:'edit/editor',
                params:{mid:me.modelId},
                method: 'get',
                scope:me,
                success: function (response, options){
                  var result=Ext.decode(response.responseText);
                  var editor = new mxApplication(basePath+'mxgraph/config/editor.xml',null,null,null,null,result.categories);
                  me.addMxGraphEventFromExtJs(editor);
                },
                failure: function (response, options) {
                  Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                }
              });
            }
          },
          close: function(){
            if(me.modelId != null){
              Ext.ComponentQuery.query('#aModelView')[0].remove(Ext.ComponentQuery.query('#editDiv')[0]);
            }else{
              Ext.ComponentQuery.query('#aModelView')[0].remove(Ext.ComponentQuery.query('#addedDiv')[0]);
            }
          }
        }
        me.callParent(arguments);
    },


//    传递extjs的事件到mxGraph
    addMxGraphEventFromExtJs: function(editor){
      var me = this;
      me.mon(me, 'redraw', function (button,evt) {
        editor.graph.fireEvent(new mxEventObject('redraw','event',evt));
      });
      me.mon(me, 'save', function (button,evt) {
        editor.graph.fireEvent(new mxEventObject('save','event',evt));
      });
      me.mon(me, 'delete', function (button,evt) {
        editor.graph.fireEvent(new mxEventObject('delete','event',evt));
      });
      me.mon(me, 'export', function (button,evt) {
        editor.addAction('export',function(editor){
          var modelName = document.getElementById('modelName').value;
          if(modelName == ''){
            alert('流程名称必填!');
            return;
          }
          var downForm = document.createElement('form');
          downForm .id = 'downForm';
          downForm .name = 'downForm';
          downForm .className = 'x-hidden';
          downForm .action = 'edit/download';
          downForm .method = 'post';
          downForm .target = '_blank';
          var data = document.createElement('input');
          data.type = 'hidden';//隐藏域
          data.name = 'fileName';// form表单参数
          data.value = modelName;//form表单值
          downForm.appendChild(data);
          var data1 = document.createElement('input');
          data1.type = 'hidden';//隐藏域
          data1.name = 'mxGraphXml';// form表单参数
          data1.value = me.getMxGraphXml(editor);//form表单值
          downForm.appendChild(data1);
          document.body.appendChild(downForm);
          downForm.submit();
          document.body.removeChild(downForm);
//          Ext.widget('exportView',{
//            graphEditor: editor,
//            modelName: modelName
//          }).show();
        });
        editor.graph.fireEvent(new mxEventObject('export','event',evt));
      });
      me.mon(me, 'import', function (button,evt) {
        editor.addAction('import',function(editor){
          Ext.widget('importView',{
            graphEditor: editor
          }).show();
        });
        editor.graph.fireEvent(new mxEventObject('import','event',evt));
      });
      me.mon(me, 'zoom', function (button,evt) {
        editor.graph.fireEvent(new mxEventObject('zoom','event',evt));
      });
      me.mon(me, 'zoomIn', function (button,evt) {
        editor.graph.fireEvent(new mxEventObject('zoomIn','event',evt));
      });
      me.mon(me, 'zoomOut', function (button,evt) {
        editor.graph.fireEvent(new mxEventObject('zoomOut','event',evt));
      });
      me.mon(me, 'actualSize', function (button,evt) {
        editor.graph.fireEvent(new mxEventObject('actualSize','event',evt));
      });
      me.mon(me, 'fit', function (button,evt) {
        editor.graph.fireEvent(new mxEventObject('fit','event',evt));
      });
      me.mon(me, 'undo', function (button,evt) {
        editor.graph.fireEvent(new mxEventObject('undo','event',evt));
      });
      me.mon(me, 'redo', function (button,evt) {
        editor.graph.fireEvent(new mxEventObject('redo','event',evt));
      });
      me.addEvents(['redraw','save','delete','export','import','zoom','zoomIn','zoomOut','actualSize','fit','undo','redo']);
    },
  getMxGraphXml: function(editor){
    var enc = new mxCodec(mxUtils.createXmlDocument());
    var node = enc.encode(editor.graph.model);
    return mxUtils.getXml(node);
  }
//    listeners: {
//        afterrender: function () {
//            console.log()
//            new mxApplication('mxgraph/config/editor.xml',name,category,mid,source);
//        }
////      beforerender: function () {
////        new mxApplication('mxgraph/config/editor.xml',null,null,null,null);
////    }
////      close:function(){
////
////      }
//////      beforeshow: function () {
//////        new mxApplication('mxgraph/config/editor.xml',null,null,null,null);
//////    }
//  }
});