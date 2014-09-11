/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-12-31
 * Time: 上午11:31
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.MxGraphExportView',{
  requires: [
      'Oz.util.base64'
  ],
  extend: 'Ext.Window',
  alias: 'widget.exportView',
  title: 'XML',
//  width: 680,
//  height: 480,
  border: false,
  modal: true,
  initComponent: function(){
    var me = this;
    me.items ={
        xtype: 'form',
        defaults: {
          anchor: '100%'
        },
        frame: true,
        bodyPadding: 10,
        items: {
          xtype: 'textfield',
          allowBlank: false,
          fieldLabel: '导出文件名称:',
          itemId: 'exportId'
//        width: 670,
//        height:475,
//        value: ''
        }
    }
    me.buttons = [
      {
        xtype: 'button',
        text: '导出',
        handler: function(){
          if(me.down('#exportId').getValue() == ''){
            Ext.MessageBox.alert('提示信息','导出文件名称必填!');
            return;
          }
          if(me.modelName == null){
            alert('流程名称必填!');
          }
          var name = me.down('#exportId').getValue();
//          var mxGraphXml=new Oz.util.base64().encode(me.getMxGraphXml());
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
          data.value = me.modelName;//form表单值
          downForm.appendChild(data);
          var data1 = document.createElement('input');
          data1.type = 'hidden';//隐藏域
          data1.name = 'mxGraphXml';// form表单参数
          data1.value = me.getMxGraphXml();//form表单值
          downForm.appendChild(data1);
          document.body.appendChild(downForm);
          downForm.submit();
          document.body.removeChild(downForm);
          me.close();
        }
      },
      {
        xtype: 'button',
        text: '取消',
        handler: function(){
          me.close();
        }
      }
    ]
    me.callParent(arguments);
  },

  getMxGraphXml: function(){
      var editor = this.graphEditor;
      var enc = new mxCodec(mxUtils.createXmlDocument());
      var node = enc.encode(editor.graph.model);
      return mxUtils.getXml(node);
  }
//  listeners: {
//    afterrender: function(){
//      var editor = this.graphEditor;
//      var enc = new mxCodec(mxUtils.createXmlDocument());
//      var node = enc.encode(editor.graph.model);
//      this.down('#xmlValue').setValue(mxUtils.getXml(node));
//    }
//  }
})