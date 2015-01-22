/**
 * Created by IntelliJ IDEA.
 * User: yongliu
 * Date: 11/15/11
 * Time: 2:49 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.plugins.form.ListDisplay', {
  extend: 'Ext.AbstractPlugin',

  mixins: {
    observable: 'Ext.util.Observable'
  },

  alias: 'plugin.listdisplay',
  alternateClassName: 'Oz.ux.ListDisplay',

  requires: [
    'Ext.util.Observable',
    'Ext.window.Window',
    'Ext.form.Panel',
    'Ext.button.Button'
  ],

  btnText:'Edit',
  maxTextLength : 50,
  delimiter : ',',
  winWidth : 500,
  winHeight:400,
  disabled : false,
  noSelectedText : 'nothing',
  emptyText : 'None Selected',
  values : [],
//  setWinTitle : Ext.emptyFn,
//  setTextTpl : Ext.emptyFn,
//  setText : Ext.emptyFn,


  constructor: function(cfg) {
    Ext.apply(this, cfg);

    this.callParent(arguments);
  },

  /**
   * Called by plug-in system to initialize the plugin for a specific text field (or text area, combo box, date field).
   * Most all the setup is delayed until the component is rendered.
   */
  init: function(textField) {
    this.textField = textField;
    if (!textField.rendered) {
      textField.on('afterrender', this.handleAfterRender, this);
    }
    else {
      // probably an existing input element transformed to extjs field
      this.handleAfterRender();
    }
  },
  handleAfterRender: function(textField) {
    //////////////get init variable --------------
    this.btnText = this.textField.btnText;
    this.store = this.textField.store;
    this.delimiter = this.textField.delimiter;
    this.winWidth = this.textField.winWidth;
    this.winHeight = this.textField.winHeight;
    this.disabled = this.textField.disabled;
    this.readOnly = this.textField.readOnly;
    this.displayField = this.textField.displayField;
    this.valueField = this.textField.valueField;
    this.winTitle = this.textField.winTitle;
    this.textTpl = this.textField.textTpl;
    this.text = this.textField.text;
    ////////////end get init variable ------------
    if(this.textField){
      this.textField.setValue(this.getLabelText(this.textField.getValue()));
    }


    this.createButtonEl();
    this.addListeners();
    ////add event
    this.textField.setWinTitle = this.setWinTitle;
    this.textField.setValue = this.setValue;
  },
  setWinTitle : function(title){
    this.winTitle = title;
  },

  setValue : function(values,flag){
    var value = '',
      textTpl = this.listDisplayPlugin.textTpl;
    if(values && Ext.isArray(values) && values.length > 0){
      this.listDisplayPlugin.getTargetValue(values);
      var targets = this.listDisplayPlugin.getTargetNames(values);
      var text = Ext.String.format(textTpl,targets.length > 0 ?targets.join(this.listDisplayPlugin.delimiter) : '');
      value = this.listDisplayPlugin.getLabelText(text);
      delete targets,text;
    }else{
      this.listDisplayPlugin.values = [];
      if(flag)
        value = this.listDisplayPlugin.getLabelText(values);
      else
        value = this.listDisplayPlugin.getLabelText(this.text);
    }
    this.setRawValue(value);
    this.valueRecords = values;
    return values;
  },

  createButtonEl : function(){
    var me = this;
    this.button = Ext.create('Ext.button.Button',{
      renderTo : this.textField.bodyEl,
      alignTo : 'tr',
      text:this.btnText,
      iconCls : 'table-edit',
      disabled : this.disabled,
      handler : function(){
        me.onButtonClickHandler();
      }
    });

    this.textField.listDisplayPlugin = this;
    delete me;
  },

  addListeners : function(){
    var textfield = this.textField;

    this.mon(textfield,'change',this.onTextChange,this);
    this.mon(textfield,'disable',this.onDisabled,this);
    this.mon(textfield,'enable',this.onEnable,this);

  },
  onTextChange : function(textfield,newValue,oldValue){
    var value = Ext.String.format(newValue,this.getTargetNames().length > 0 ? this.getTargetNames().join(this.delimiter) : '');
    textfield.setValue(this.getLabelText(value));
  },
  onDisabled : function(){
    this.button.setDisabled(true);
  },
  onEnable : function(){
    this.button.enable();
  },

  getLabelText : function(v){
    this.initToolTip(v);
    if(v.length > this.maxTextLength)
      v = v.substring(0,this.maxTextLength) + '...';
    return v;
  },

  initToolTip : function(text) {
    if (this.textField.tootip) {
      this.textField.tootip.destroy();
      Ext.destroy(this.textField.tootip);
    }
    this.textField.tootip = Ext.create('Ext.tip.ToolTip',{
      target: this.textField.el,
      cls : 'text-wrap',
      html: text
    });
  },

  updateText : function(v){
    var t = this.textField.getValue(),
      text = this.emptyText;
    if (Ext.isArray(v) && v.length > 0) {
      text = Ext.String.format(this.textField.textTpl, v.length > 0 ? v.join(this.delimiter) : this.noSelectedText);
    }
    this.textField.setValue(text,true);
  },

  getTargetNames : function(records){
    var targetNames = [];
    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      if(record && record != null){
        targetNames.push(record.get('targetTypeName'));
      }
      delete record;
    }
    delete records;
    return targetNames;
  },
  getTargetValue : function(records){
    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      if(record && record != null){
        this.values.push(record.get('targetTypeId'));
      }
      delete record;
    }
    delete records;
  },
  onButtonClickHandler : function(){
    var me = this,
      title = this.textField.winTitle;
//    if(!me.win)
    me.win = Ext.create('Ext.window.Window',{
      title : me.winTitle || title,
      //closeAction : 'hide',
      width : this.winWidth,
      modal: true,
      height : this.winHeight,
      layout:'fit',
      items:{
        xtype:'form',
        layout:'fit',
        labelWidth:125,
        labelAlign:'left',
        frame:true,
        border:true,
        formBind:true,
        autoScroll: true,
        defaultType:'textfield',
        monitorValid:true,
        items:{
          xtype: 'itemselector',
          name: 'itemselector',
          readOnly : me.readOnly,
//            fieldLabel: me.pickListLabel,
//            hideLabel : me.hidePickListLabel,
          sameStore : true,
          anchor: '95%',
          store: me.store,
          multiselects : true,//me.multiselects,
          value : me.values,
          displayField: me.displayField,
          valueField: me.valueField,
          listeners : {
            'afterrender' : function() {
              //this.setHeight(this.ownerCt.body.getHeight() - this.ownerCt.body.getPadding('tb') - this.el.getMargins('tb') - /*Margins*/ 5);
              //me.selector = this;
            },
            'change' : function(comp, oValue, sValue) {
              me.updateText(this.getRawValue(),false);
            }
          }
        }
      }
    });

    me.win.show();

  }

});