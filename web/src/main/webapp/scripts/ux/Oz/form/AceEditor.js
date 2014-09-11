/**
 * Created by IntelliJ IDEA.
 * User: wangy
 * Date: 11/21/11
 * Time: 10:26 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Oz.form.AceEditor', {
  extend: 'Ext.form.field.Base',
  alias: ['widget.aceeditor'],

  requires: [
    'Oz.layout.component.form.AceEditor',
    'Oz.util.AceEditorNav'
  ],

  inheritableStatics: {
    keyWords: [
      {label: 'Key Word', value: 'if', expression: 'if', isKeyWord: true},
      {label: 'Key Word', value: 'return', expression: 'return', isKeyWord: true},
      {label: 'Key Word', value: 'case', expression: 'case', isKeyWord: true},
      {label: 'Key Word', value: 'continue', expression: 'continue', isKeyWord: true},
      {label: 'Key Word', value: 'else', expression: 'else', isKeyWord: true},
      {label: 'Key Word', value: 'for', expression: 'for', isKeyWord: true},
      {label: 'Key Word', value: 'while', expression: 'while', isKeyWord: true}
    ],

    getStore: function (){
      this.store = Ext.StoreMgr.get(this.storeId+'_auto_comp');
      if (!this.store){
        this.store = new Ext.data.JsonStore({
          // store configs
//          autoDestroy: true,

          proxy: {
            type:   'memory',
            reader: {
              type: 'json',
              root: 'root'
            }
          },

          fields: ['value', 'label', 'expression', {name: 'isKeyWord', type: 'boolean'}]
        });
      }

      return this.store;
    }
  },

  /**
   * @cfg {Object} defaultListConfig
   * Set of options that will be used as defaults for the user-configured {@link #listConfig} object.
   */
  defaultListConfig: {
    deferEmptyText: false,
//    emptyText: '<span style="color: gray; font-style: italic;">&nbsp;&nbsp;No matching results.</span>',
    loadingText:    'Loading...',
    loadingHeight:  70,
//    minWidth:       70,
    width:          400,
    maxHeight:      300,
    loadingHeight: 20,
    shadow:        false,
    cls:            'ace-editor-auto-completion-div'
  },

  pickerWidth: 400,

  editorConfig: {
    syntax: "javascript"
  },

  varStoreId:     undefined,
  editorRow:      undefined,
  editorStartPos: undefined,
  editorEndPos:   undefined,


  componentLayout: 'aceeditorfield',

  height: 150,
  width: 250,
  /**
   * @cfg {String} appendOnly True if the list should only allow append drops when drag/drop is enabled
   * (use for lists which are sorted, defaults to false).
   */
  appendOnly: false,

  /**
   * @cfg {Boolean} allowBlank False to require at least one item in the list to be selected, true to allow no
   * selection (defaults to true).
   */
  allowBlank: true,

  /**
   * @cfg {String} blankText Default text displayed when the control contains no items (defaults to 'This field is required')
   */
  blankText: 'This field is required',

  showInvisible: false,
  showGutter: false,
  enableFullScreen: true,

  constructor: function (cfg){
    var me = this;
    Ext.apply(this, {
      expressionField:   'expression',
      valueField:   'value',
      displayField: 'label',
      width:        200,
      listConfig:   {
        getInnerTpl: function (){
          return '<tpl for=".">' +
              '<div class="criteria-item ' +
              '<tpl if="isKeyWord == true">criteria-item-key</tpl>' +
              '<tpl if="isKeyWord == false">criteria-item-var</tpl>' +
              '">' +
              '<h3><span>{' +
              me.displayField +
              '}</h3>{' +
              me.expressionField + '}' +
              '</div>' +
              '</tpl>';
        }
      }
    }, cfg);

    this.callParent(arguments);
  },

  initEvents: function() {
    this.addEvents('change')
  },

  // No content generated via template, it's all added components
  getSubTplMarkup: function() {
    return '';
  },

  setRawValue: function (value){
    this.callParent(arguments);
    if (this.editor){
      this.editor.getSession().setValue(value);
    }
  },

  getRawValue: function (){
    if (this.editor){
      return this.editor.getSession().getValue();
    } else{
      return ''
    }
  },

  // private
  getContentTarget: function() {
    return this.inputEl;
  },

  ddReorder: true,

  // private
  initComponent: function() {
    if(this.enableFullScreen){
      var plugins = this.plugins || [];
      plugins.push(Ext.create('Oz.plugins.form.MaxWrapButton', {
        varStoreId: this.varStoreId
      }));
      this.plugins = plugins;
    }

    this.store = this.self.getStore();
    this.varStore = Ext.StoreManager.get(this.varStoreId);
    this.callParent(arguments);
    this.on('afterrender', this.initEditor, this);
  },

  onRender: function(ct, position) {
    this.callParent(arguments);

    var me = this;
    this.editorId = 'ace-editor-' + Ext.id();
    var innerCt = this.innerCt = Ext.widget('container', {
      renderTo: me.bodyEl,
      height: this.height,
      width: this.width,
      layout: 'fit',
      cls: 'ace-editor-container-border',
      items: [
        {
          xtype: 'container',
          border: false,
          cls:    'ace-editor-container-div',
          id: this.editorId
        }
      ]
    });

    me.inputEl = this.innerCt.getEl();
    if(this.tabIndex){
      this.inputEl.dom.setAttribute('tabIndex', this.tabIndex);
    }

    // Must set upward link after first render
    innerCt.ownerCt = me;

    // Set the initial value
    me.setRawValue(me.rawValue);
    me.validate();
    me.clearInvalid();
  },

  initEditor: function (){
    var editor = this.editor = ace.edit(this.editorId);
//      editor.setTheme("ace/theme/monokai");
    editor.setTheme("ace/theme/eclipse");
    editor.getSession().setMode("ace/mode/" + this.editorConfig.syntax);

    var TokenTooltip = require("ace/token_tooltip").TokenTooltip;
    editor.tokenTooltip = new TokenTooltip(editor, this);

    this.overrideEditor(editor);

    if (this.value){
      editor.getSession().setValue(this.value);
    }
    editor.resize(true);

    editor.setShowInvisibles(this.showInvisible);
    editor.renderer.setShowGutter(this.showGutter);

    this.setEditorReadOnly(this.readOnly)

    if(this.defaultFocus)
      Ext.Function.defer(editor.focus, 100, editor);
  },

  overrideEditor: function (editor){
    var me = this;
    var navigateUp = editor.navigateUp;
    editor.navigateUp = function (){
      if (me.autoCompletionVisiable){
        if (me.listKeyNav){
          me.listKeyNav.up();
        }
      }
      else{
        navigateUp.apply(editor, arguments);
      }
    }
    var navigateDown = editor.navigateDown;
    editor.navigateDown = function (){
      if (me.autoCompletionVisiable){
        if (me.listKeyNav){
          me.listKeyNav.down();
        }
      }
      else{
        navigateDown.apply(editor, arguments);
      }
    }
    var navigateLeft = editor.navigateLeft;
    editor.navigateLeft = function (){
      if (me.autoCompletionVisiable){
        me.hidePicker();
      }
      navigateLeft.apply(editor, arguments);
    }
    var navigateRight = editor.navigateRight;
    editor.navigateRight = function (){
      if (me.autoCompletionVisiable){
        me.hidePicker();
      }
      navigateRight.apply(editor, arguments);
    }

    editor.getSession().on('change', function (){
      me.value = editor.getSession().getValue();
      me.clearInvalid();
      me.fireEvent('keyup', me, me.value);
    });

    editor.on('enterKey', function (args){
      if (me.autoCompletionVisiable && me.picker && me.listKeyNav && me.picker.highlightedItem){
        me.listKeyNav.enter();
        args.propagationStopped = true;
      }
    });
    editor.on('escKey', function (args){
      if (me.autoCompletionVisiable && me.picker && me.listKeyNav && me.picker.highlightedItem){
        me.hidePicker();
        args.propagationStopped = true;
      }
    });
    editor.on('disableAutoCompletion', function (args){
      me.hidePicker();
    });

    editor.on("mousedown", function (args){
      me.hidePicker();
    });
    editor.on("focus", function (args) {
      if (me.varStore)
        me.varStore.clearFilter();

      Ext.Function.defer(function () {
        if (!me.autoCompletionVisiable)
          me.onFocus();
      }, 100);
    });

    editor.on("blur", function (args) {
//      me.hidePicker();

      Ext.Function.defer(function () {
        if (!me.autoCompletionVisiable)
          me.onBlur()
      }, 100);
    });

    editor.on('enableAutoCompletion', function (args){
      if(this.readOnly){
        return;
      }

      var lineState = args.lineState,
          line = args.line,
          cursor = args.cursor,
          statement = line.substring(0, cursor.column),
          tokens = editor.getSession().bgTokenizer.tokenizer.getLineTokens(statement).tokens,
          lastStatement = tokens.length > 0 ? tokens[tokens.length - 1].value : '',
          layer = editor.renderer.$cursorLayer,
          lineHeight = me.lineHeight || (me.lineHeight = editor.renderer.layerConfig.lineHeight),
          gutterWidth = me.showGutter ? editor.renderer.$gutterLayer.gutterWidth : 0,
          characterWidth = me.characterWidth || (me.characterWidth =layer.config.characterWidth);

      if (!lastStatement || !lastStatement.trim() || tokens[tokens.length - 1].type == 'keyword.operator'){
        me.hidePicker();
        return;
      }

      // build the suggestion box content
      var lines = [];
      var results = me.self.keyWords;
      for(var i = 0; i < results.length; i++){
        var keyword = results[i];
        if (keyword[me.valueField].toLowerCase().indexOf(lastStatement.toLowerCase()) == 0){
          lines[lines.length] = keyword;
        }
      }

      if (me.varStore){
        me.varStore.each(function (res){
          var variable = res.get(me.valueField);
          if (variable.toLowerCase().indexOf(lastStatement.toLowerCase()) == 0){
            lines[lines.length] = res.data;
          }
        });
      }

      if (lines.length > 0){
        me.store.loadData(lines);
        var box = me.innerCt.getBox();
        me.editorRow = cursor.row;
        me.editorStartPos = tokens.length > 1 ? (statement.length - tokens[tokens.length - 1].value.length) : 0;
        me.editorEndPos = statement.length;
        me.showPicker(gutterWidth + (statement.length - lastStatement.length) * characterWidth + box.x - editor.getSession().getScrollLeft() + 2,
            (cursor.row + 1) * lineHeight + box.y - editor.getSession().getScrollTop());
      }
      else{
        me.hidePicker();
      }
    });
  },

  getTokenTip: function (token) {
    var me=this,
        statement = token.value,
        results = me.self.keyWords;
    for (var i = 0; i < results.length; i++) {
      var keyword = results[i];
      if (keyword[me.valueField].toLowerCase() == statement.toLowerCase()) {
        return keyword[me.valueField] + ":" + keyword[me.displayField];
      }
    }

    if (me.varStore) {
      var index = me.varStore.findExact(me.valueField, statement);
      if(index!=-1){
        var rec = me.varStore.getAt(index);
        return rec.data[me.expressionField] + ": " + rec.data[me.displayField];

      }
    }
    return null;
  },

  getErrors: function (value){
    var me = this,
        errors = me.callParent(arguments);

    if (!me.allowBlank && !value){
      errors.push(me.blankText);
    }

    return errors;
  },

  onDisable: function() {
    var me = this ;

    me.callParent();
    this.setEditorReadOnly(true);
  },

  onEnable: function() {
    var me = this ;

    me.callParent();
    this.setEditorReadOnly(false);
  },

  setReadOnly: function(readOnly) {
    this.readOnly = readOnly;
    this.setEditorReadOnly(readOnly);
  },

  setEditorReadOnly: function(readOnly){
    if (this.editor){
      this.editor.setReadOnly(readOnly);
    }
  },

  /**
   * Return a reference to the picker component for this field, creating it if necessary by
   * calling {@link #createPicker}.
   * @return {Ext.Component} The picker component
   */
  getPicker: function (){
    var me = this;
    return me.picker || (me.picker = me.createPicker());
  },

  showPicker: function (x, y){
    var picker = this.getPicker(),
//      dom = picker.getEl().dom,
        pw = this.pickerWidth,
        vw = Ext.getBody().getWidth(),
        xx = pw + x > vw ? vw - pw : x;

//    dom.style.display = 'block';
//    dom.style.left = xx + 'px';
//    dom.style.top = y + 'px';

    picker.setPagePosition(xx, y);
    picker.show();

    this.mon(Ext.getDoc(), {
      mousewheel: this.collapseIf,
      mousedown: this.collapseIf,
      scope: this
    });

    this.autoCompletionVisiable = true;
  },

  hidePicker: function (){
    var picker = this.picker;
    if (picker){
//      var dom = picker.getEl().dom;
//      dom.style.display = 'none';
      picker.hide();
    }

    this.mun(Ext.getDoc(), {
      mousewheel: this.collapseIf,
      mousedown: this.collapseIf,
      scope: this
    });

    this.autoCompletionVisiable = false;
  },

  collapseIf: function(e) {
    var me = this;
    if (!me.isDestroyed && !e.within(me.bodyEl, false, true) && !e.within(me.picker.el, false, true)) {
      me.hidePicker();
    }
  },

  createPicker: function (){
    var me = this,
        picker,
        menuCls = Ext.baseCSSPrefix + 'menu',
        opts = Ext.apply({
          loadMask:       false,
          selModel:       {
            mode: 'SINGLE'
          },
          floating:       true,
          hidden:         true,
          ownerCt:        me.ownerCt,
          cls:            menuCls,
          store:          me.store,
          displayField:   me.displayField,
          focusOnToFront: false,

          viewConfig: {
            getRowClass: function (record, rowIndex, rowParams, store){
              return record.get("isKeyWord") ? "error-row" : "";
            }
          },

          listeners: {
            hide: function(){
              if(me.editor){
                Ext.Function.defer(function(){
                  me.editor.focus(50);
                }, 50);
              }
            }
          }
        }, me.listConfig, me.defaultListConfig);

    picker = me.picker = Ext.create('Ext.view.BoundList', opts);

    picker.doAutoRender();

    me.mon(picker.getSelectionModel(), 'selectionchange', me.onListSelectionChange, me);

    var keyNav = me.listKeyNav = Ext.create('Oz.util.AceEditorNav', {
      boundList: picker
    });

    me.mon(picker, {
//      itemclick: me.onItemClick,
//      refresh: me.onListRefresh,
      scope: me
    });

    return picker;
  },

  onListSelectionChange: function (list, selectedRecords){
    var me = this,
        hasRecords = selectedRecords.length > 0;
    // Only react to selection if it is not called from setValue, and if our list is
    // expanded (ignores changes to the selection model triggered elsewhere)
    if (me.autoCompletionVisiable){
      Ext.defer(me.hidePicker, 1, me);
      /*
       * Only set the value here if we're in multi selection mode or we have
       * a selection. Otherwise setValue will be called with an empty value
       * which will cause the change event to fire twice.
       */
      if (hasRecords){
        var record = selectedRecords[0];
//        var v = me.field.getRawValue();

        var s = record.data[me.valueField];


        var selection = this.editor.selection,
            session = this.editor.getSession();
        if (selection){
          selection.selectTo(me.editorRow, me.editorStartPos);
          var range = selection.getRange();
          session.replace(range, s);
          selection.clearSelection();
          this.editor.moveCursorTo(me.editorRow, me.editorStartPos + s.length);
        }

        me.fireEvent('varselect', me, selectedRecords);
      }
      this.editor.focus(100);
    }
  },


  markInvalid: function (errors){
    if (this.inputEl){
      this.inputEl.addCls('markInvalid-cls');
      if (this.inputEl.dom){
        this.inputEl.dom.setAttribute('aria-invalid', 'true');
        this.inputEl.dom.setAttribute('data-errorqtip', '<ul><li>' + errors + '</li></ul>');
      }
    }
  },

  clearInvalid: function (){
    if (this.inputEl){
      this.inputEl.removeCls('markInvalid-cls');
      if (this.inputEl.dom){
        this.inputEl.dom.setAttribute('data-errorqtip', '');
        this.inputEl.dom.setAttribute('aria-invalid', 'false');
      }
    }
  },

  onDestroy: function() {
    this.mun(Ext.getDoc(), {
      mousewheel: this.collapseIf,
      mousedown: this.collapseIf,
      scope: this
    });

    if (this.listKeyNav){
      this.listKeyNav.destroy();
    }
    if (this.picker){
      this.picker.destroy();
    }
    if (this.editor){
      this.editor.tokenTooltip.destroy();
      this.editor.destroy();
      delete this.editorId;
    }
    this.innerCt.removeAll(true);
    Ext.destroyMembers(this, 'innerCt');
    this.callParent();
  }
});