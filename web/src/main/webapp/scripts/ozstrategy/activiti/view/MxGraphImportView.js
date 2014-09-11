/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-12-31
 * Time: 下午2:27
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.MxGraphImportView',{
  requires: [],
  extend: 'Ext.Window',
  alias: 'widget.importView',
//  width: 400,
//  height: 300,
  modal: true,
  border: false,
  title: '导入',
  initComponent: function(){
    var me = this;
    me.items = {
      xtype: 'form',
      defaults: {
        anchor: '100%'
      },
//      border: false,
      bodyPadding: 10,
      frame: true,
      items: [
        {
        xtype: 'filefield',
  //        fieldLabel: 'xml文件',
        itemId: 'file',
        labelWidth: 40,
        msgTarget: 'side',
        allowBlank: false,
        anchor: '100%',
        buttonText: '选择文件'
        },
        {
          xtype: 'text',
          text: '支持.XML格式的文件'
        }
      ]
    }

    me.buttons = [{
      text: '导入',
      handler: function() {
        var form = me.down('form').getForm();
        if(form.isValid()){
            if(!me.valueRegExp(/(.xml$)/,me.down('#file').value)){
              Ext.MessageBox.alert('提示信息','只能传入.xml结尾的文件');
              return;
            }else{
              var file = me.down('#file').fileInputEl.dom.files[0];
              var reader = new FileReader();
              reader.onload = function(e)
              {
                var xml = e.target.result;
                try
                {
                  var document = mxUtils.parseXml(xml);
                  //var model = new window.parent.mxGraphModel();
                  var codec = new mxCodec(document);
                  codec.decode(document.documentElement,me.graphEditor.graph.model);
                  me.close();
                }
                catch(e)
                {
                  mxUtils.alert('invalid Or Missing File: ' + e.message);
                }

              };
              reader.onerror = function(e)
              {
                console.log(e);
              };
              reader.readAsText(file);
            }
        }
      }
    }]
    me.callParent(arguments);
  },

  //正则表达式验证规则
  valueRegExp:function(regExpStr,value){
    var regExp = new RegExp(regExpStr);
    if(regExp.test(value)){
      return true;
    }else{
      return false;
    }
  }

});