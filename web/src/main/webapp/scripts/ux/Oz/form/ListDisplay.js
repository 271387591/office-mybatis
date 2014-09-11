/**
 * Created by .
 * User: wangy
 * Date: 11/18/11
 * Time: 11:54 AM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Example:
 *
var prefixOfferedText = 'You have selected these roles: ';
var noSelectedOfferedText = 'Nothing'
var suffixOfferedText = ', Click edit to add or change selected roles.';

var listdisplayfield = {
  fieldLabel: scheduleRes.scheduleName,
  xtype: 'listdisplayfield',
  name: 'dd',

  maxLabelLength : 90,
  btnText:globalRes.buttons.edit,
  noSelectedText: noSelectedOfferedText,
  emptyText : prefixOfferedText + suffixOfferedText,
  textTpl : prefixOfferedText + '{0}' + suffixOfferedText,
  value: ['3', '4', '6'],
  displayField: 'text',
  valueField: 'value',

    store: Ext.create('Ext.data.ArrayStore', {
      data: [
        ['123', 'One Hundred Twenty Three'],
        ['1', 'One'],
        ['2', 'Two'],
        ['3', 'Three'],
        ['4', 'Four'],
        ['5', 'Five'],
        ['6', 'Six'],
        ['7', 'Seven'],
        ['8', 'Eight'],
        ['9', 'Nine']
      ],
      fields: ['value','text'],
      sorters: {
        field: 'value',
        direction: 'ASC'
      }
    }),
 
  listConfig: {
    fromConfig: {
      title : 'Available Roles'
    },
    toConfig: {
      title : 'Selected Roles'
    },
    //                value: ['3', '4', '6'],
    allowBlank: false
  }
}
 */

Ext.define('Oz.form.ListDisplay', {
  extend:'Ext.form.field.Base',
  alias: 'widget.listdisplayfield',

  requires: [
    'Oz.form.PickList',
    'Oz.layout.component.form.ListDisplay',
    'Ext.util.Format',
    'Ext.util.DelayedTask',
    'Ext.XTemplate',
    'Ext.layout.component.field.Field'
  ],

  alternateClassName: [
    'Ext.form.ListDisplayField',
    'Ext.form.ListDisplay'
  ],

  fieldSubTpl: [
    '<div id="{id}" class="{fieldCls}"></div>',
    {
      compiled: true,
      disableFormats: true
    }
  ],

  componentLayout: 'listdisplayfield',

  /**
   * @cfg {String} [fieldCls="x-form-display-field"]
   * The default CSS class for the field.
   */
  fieldCls: Ext.baseCSSPrefix + 'form-display-field',

  /**
   * @cfg {Boolean} htmlEncode
   * false to skip HTML-encoding the text when rendering it. This might be useful if you want to
   * include tags in the field's innerHTML rather than rendering them as string literals per the default logic.
   */
  htmlEncode: false,

  /**
   * @cfg {String} blankText Default text displayed when the control contains no items (defaults to 'This field is required')
   */
  blankText: 'This field is required',

  emptyText : 'None Selected',

  initEvents: Ext.emptyFn,

  /**
   * @cfg {String} btnIconCls
   * @hide
   */
  btnIconCls: 'table-edit',

  /**
   * @cfg {String} btnText
   * @hide
   */
  btnText: 'Button',

  maxLabelLength : 50,

  delimiter : ',',
  winWidth : 500,
  winHeight : 400,
  winTitle : '',
  listConfig: {},

  getRawValue : function() {
    return this.value;
  },

  getSelectModels : function() {
    var me=this,
      v = this.value,
      models = [];
    this.store.each(function(model){
      if (Ext.Array.contains(v, model.get(me.valueField))){
        models.push(model);
      }
    });

    return models;
  },

  setValue: function(value) {
    this.callParent(arguments);
    if(this.selector){
      this.selector.setValue(value);
    }
  },

  setRawValue: function(value) {
    var me = this,
      t = this.emptyText,
      v = Ext.isArray(this.value) ? this.value : (this.value || '').split(','),
      values = [];

    var containFn = function(arr, v) {
      for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        if((obj + '') == v + '') return true;
      }
      return false;
    }

    if (me.selector && v.length > 0 && me.selector.store.getCount() > 0) {
      Ext.each(me.selector.store.getRange(), function(model) {
        if (containFn(v, model.get(me.valueField)))
          values.push(model.get(me.displayField));
      });
    }
    if (this.textTpl && values && values.length > 0) {
      t = Ext.String.format(this.textTpl, values.length > 0 ? values.join(this.delimiter) : this.noSelectedText);
    }
    t = this.getLabelText(t);

    if (this.htmlEncode) {
      t = Ext.util.Format.htmlEncode(t);
    }
    me.rawValue = t;
    if (me.rendered) {
      me.inputEl.dom.innerHTML = me.htmlEncode ? Ext.util.Format.htmlEncode(t) : t;
    }
    return v;
  },

  // private
  getContentTarget: function() {
    return this.inputEl;
  },

  onRender: function(ct, position) {
    var me = this;
    me.callParent(arguments);

    me.imageBtnEl.setStyle('display', null);
    me.imageBtnEl.setStyle('width', 55);

    var btnConfig = Ext.apply({
      renderTo: me.imageBtnEl,
      text: this.btnText,
      scope: this,
      handler: this.onBtnClick
    }, {
      iconCls: me.btnIconCls
    });

    var btn = me.btn = Ext.widget('button', btnConfig);


    // Must set upward link after first render
    btn.ownerCt = me;



    // Set the initial value
    me.setRawValue(me.rawValue);
  },

  afterRender : function() {
    this.callParent(arguments);
    this.initListWin();
    this.setRawValue(this.value);
  },

  onBtnClick: function() {
    this.listWin.show();
  },

  initListWin : function() {
    if (!this.listWin) {
      var me = this,
        pickConfig = {
          xtype: 'picklistfield',
          name: 'itemselector',
          anchor: '95%'
        },
        defaultConfig = {
          value: me.value,
          readOnly : me.readOnly,
          store: me.store,
          valueField: me.valueField,
          displayField: me.displayField,

          listeners: {
            scope: me,
            change: this.onPickListChange,
            afterrender: this.onPickListRender
          }
        };
      var config = Ext.apply(pickConfig, this.listConfig, defaultConfig);
      this.listWin = new Ext.window.Window({
        title: this.readOnly ? Oz.util.Utils.markReadOnlyTitle(this.winTitle) : this.winTitle,
        layout : 'fit',
        closeAction : 'hide',
        width : this.winWidth,
        modal: true,
        height : this.winHeight,
        bodyStyle: 'padding:10px;',
        items:[
          config
        ]
      });
      this.listWin.render(Ext.getBody());
    }
  },

  onPickListChange: function(pl, value) {
    this.setValue(value);
  },

  onPickListRender: function(pl) {
    this.selector = pl;
  },

  getLabelText : function(s) {
    this.initToolTip(s);
    if (s.length > this.maxLabelLength) {
      s = s.substring(0, this.maxLabelLength) + '...'
    }
    return s;
  },

  initToolTip : function(text) {
    if (this.tootip) {
      this.tootip.destroy();
      Ext.destroy(this.tootip);
    }
    this.tootip = new Ext.ToolTip({
      target: this.inputEl,
//      cls : 'text-wrap',
      html: text,
      listeners: {
        scope: this,
        'beforeshow':function(){
          return !(this.disabled || this.hasActiveError())
        }
      }
    });
  },

  setWinTitle: function(title){
    if(this.listWin){
      this.listWin.setTitle(title);
    }
    this.winTitle = title;
  },

  setTextTpl: function(textTpl, sync) {
    this.textTpl = textTpl;
    if (sync)this.setValue(this.getValue());
  },

  setEmptyText: function(text, sync) {
    this.emptyText = text;
    if (sync)this.setValue(this.getValue());
  },

  getErrors : function(value) {
    var me = this,
      errors = me.callParent(arguments),
      numSelected;

    value = Ext.Array.from(value || me.getValue());
    numSelected = value.length;

    if (!me.allowBlank && numSelected < 1) {
      errors.push(me.blankText);
    }

    return errors;
  },


  onDisable: function() {
    this.callParent();
    if (this.btn)this.btn.disable();
    this.clearInvalid();
  },

  onEnable: function() {
    this.callParent();
    if (this.btn)this.btn.enable();
  },

  setReadOnly: function(readOnly) {
    this.readOnly = readOnly;
    if (this.selector) {
      this.selector.setReadOnly(readOnly);
    }
  },

  onDestroy: function() {
    if(this.selector)
      Ext.destroyMembers('listWin','selector');
    Ext.destroyMembers(this, 'btn', 'tootip');
    this.callParent();
  }
});