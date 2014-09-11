Ext.define('Oz.plugins.form.SuggestField', {
  extend: 'Ext.AbstractPlugin',

  mixins: {
    observable: 'Ext.util.Observable'
  },

  alias: 'plugin.suggestfield',
  alternateClassName: 'Oz.ux.SuggestField',

  inheritableStatics: {
    defaultRegexp: /[ |,|;|\'|\"|\s|\f|\t|\n|\r|\(|\)|\+|\-|\*|\/]+/gi,
    templateRegexp: /\$\{ */gi,
    storeId: 'Suggest_Variable_Store',
    getStore: function() {
      this.store = Ext.StoreMgr.get(this.storeId);
      if (!this.store) {
        this.store = Ext.create("FlexCenter.store.SuggestExpressions", {
          storeId: this.storeId
        });
      }

      return this.store;
    },

    loadSuggest: function(config, operation) {
      var me = this,
        store = me.getStore(),
        key;

      if (store && Ext.isObject(config)) {
        for (key in config) {
          store.getProxy().setExtraParam(key, config[key]);
        }

        store.load(operation || {});
      }
    }
  },

  requires: [
    'Ext.util.Observable',
    'Ext.util.DelayedTask',
    'Ext.util.KeyNav',
    'Ext.view.BoundList',
    'Ext.view.BoundListKeyNav'
  ],

  /**
   * @cfg {Boolean} matchFieldWidth
   * Whether the picker dropdown's width should be explicitly set to match the width of the field.
   * Defaults to <tt>true</tt>.
   */
  matchFieldWidth: true,

  /**
   * @cfg {String} pickerAlign
   * The {@link Ext.core.Element#alignTo alignment position} with which to align the picker. Defaults
   * to <tt>"tl-bl?"</tt>
   */
  pickerAlign: 'tl-bl?',

  /**
   * @cfg {Array} pickerOffset
   * An offset [x,y] to use in addition to the {@link #pickerAlign} when positioning the picker.
   * Defaults to undefined.
   */

  /**
   * @cfg {String} openCls
   * A class to be added to the field's {@link #bodyEl} element when the picker is opened. Defaults
   * to 'x-pickerfield-open'.
   */
  openCls: Ext.baseCSSPrefix + 'pickerfield-open',

  /**
   * @property isExpanded
   * @type Boolean
   * True if the picker is currently expanded, false if not.
   */

  /**
   * @cfg {String} queryMode
   * The mode in which the ComboBox uses the configured Store. Acceptable values are:
   * <div class="mdetail-params"><ul>
   * <li><b><code>'remote'</code></b> : <b>Default</b>
   * <p>In <code>queryMode: 'remote'</code>, the ComboBox loads its Store dynamically based upon user interaction.</p>
   * <p>This is typically used for "autocomplete" type inputs, and after the user finishes typing, the Store is {@link Ext.data.Store#load load}ed.</p>
   * <p>A parameter containing the typed string is sent in the load request. The default parameter name for the input string is <code>query</code>, but this
   * can be configured using the {@link #queryParam} config.</p>
   * <p>In <code>queryMode: 'remote'</code>, the Store may be configured with <code>{@link Ext.data.Store#remoteFilter remoteFilter}: true</code>,
   * and further filters may be <i>programatically</i> added to the Store which are then passed with every load request which allows the server
   * to further refine the returned dataset.</p>
   * <p>Typically, in an autocomplete situation, {@link #hideTrigger} is configured <code>true</code> because it has no meaning for autocomplete.</p></li>
   * <li><b><code>'local'</code></b> :
   * <p class="sub-desc">ComboBox loads local data</p>
   * <pre><code>
   var combo = new Ext.form.field.ComboBox({
   renderTo: document.body,
   queryMode: 'local',
   store: new Ext.data.ArrayStore({
   id: 0,
   fields: [
   'myId',  // numeric value is the key
   'displayText'
   ],
   data: [[1, 'item1'], [2, 'item2']]  // data is local
   }),
   valueField: 'myId',
   displayField: 'displayText',
   triggerAction: 'all'
   });
   * </code></pre></li>
   * </ul></div>
   */
  queryMode: 'remote',

  queryCaching: true,

  /**
   * @cfg {Number} pageSize If greater than <code>0</code>, a {@link Ext.toolbar.Paging} is displayed in the
   * footer of the dropdown list and the {@link #doQuery filter queries} will execute with page start and
   * {@link Ext.toolbar.Paging#pageSize limit} parameters. Only applies when <code>{@link #queryMode} = 'remote'</code>
   * (defaults to <code>0</code>).
   */
  pageSize: 0,

  /**
   * @cfg {Number} queryDelay The length of time in milliseconds to delay between the start of typing and
   * sending the query to filter the dropdown list (defaults to <code>500</code> if <code>{@link #queryMode} = 'remote'</code>
   * or <code>10</code> if <code>{@link #queryMode} = 'local'</code>)
   */

  /**
   * @cfg {Number} minChars The minimum number of characters the user must type before autocomplete and
   * {@link #typeAhead} activate (defaults to <code>4</code> if <code>{@link #queryMode} = 'remote'</code> or <code>0</code> if
   * <code>{@link #queryMode} = 'local'</code>, does not apply if <code>{@link Ext.form.field.Trigger#editable editable} = false</code>).
   */

  /**
   * @cfg {Boolean} selectOnTab
   * Whether the Tab key should select the currently highlighted item. Defaults to <code>true</code>.
   */
  selectOnTab: true,

  /**
   * @cfg {Boolean} forceSelection <code>true</code> to restrict the selected value to one of the values in the list,
   * <code>false</code> to allow the user to set arbitrary text into the field (defaults to <code>false</code>)
   */
  forceSelection: false,

  inUsed: true,

  asTemplate: false,

  /**
   * @cfg {Object} defaultListConfig
   * Set of options that will be used as defaults for the user-configured {@link #listConfig} object.
   */
  defaultListConfig: {
    deferEmptyText: false,
//    emptyText: '<span style="color: gray; font-style: italic;">&nbsp;&nbsp;No matching results.</span>',
    loadingText: 'Loading...',
    loadingHeight: 70,
    minWidth: 70,
    maxHeight: 300,
//    minHeight: 20,
    shadow: 'sides'
  },

  /**
   * @cfg {Boolean} lazyInit <tt>true</tt> to not initialize the list for this combo until the field is focused
   * (defaults to <tt>true</tt>)
   */
  lazyInit : true ,


  /////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Set up and tear down
  //
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  constructor: function(cfg) {
    var me = this;

    Ext.apply(this, {
      valueField: 'value',
      displayField: 'label',
      expressionField: 'expression',
      width: 200,
      listConfig: {
        getInnerTpl: function() {
//          return '<tpl for="."><div data-qtip="{value}: {label}">{value}: {label}</div></tpl>';

//          return '<tpl for=".">' +
//              '<div class="criteria-item ' +
//              '<tpl if="isKeyWord == true">criteria-item-key</tpl>' +
//              '<tpl if="isKeyWord == false">criteria-item-var</tpl>' +
//              '">' +
//              '<h3><span>{' +
//              me.displayField +
//              '}</h3>{' +
//              me.expressionField + '}' +
//              '</div>' +
//              '</tpl>';

          if (Ext.isIE && !Ext.isIE9) {
            return '<tpl for=".">' +
              '<table border="0" width="99%" cellpadding="0" cellspacing="0" class="criteria-item-table' +
              '<tpl if="isKeyWord == true">criteria-item-key</tpl>' +
              '<tpl if="isKeyWord == false">criteria-item-var</tpl>' +
              '">' +
              '<tr>' +
              '<td><div>' +
              '{' + me.expressionField + '}' +
              '</div></td>' +
              '<td align="right"><label>' +
              '{' + me.displayField + '}' +
              '</label></td>' +
              '</tr>' +
              '</table>' +
              '</tpl>';
          } else {
            return '<tpl for=".">' +
              '<div class="criteria-item ' +
              '<tpl if="isKeyWord == true">criteria-item-key</tpl>' +
              '<tpl if="isKeyWord == false">criteria-item-var</tpl>' +
              '">' +
              '<span>' +
              '{' + me.expressionField + '}' +
              '<label>' +
              '{' + me.displayField + '}' +
              '</label>' +
              '</span>' +
              '</div>' +
              '</tpl>';
          }
        }
      }
    }, cfg);

    this.callParent(arguments);
  },

  /**
   * Called by plug-in system to initialize the plugin for a specific text field (or text area, combo box, date field).
   * Most all the setup is delayed until the component is rendered.
   */
  init: function(field) {
    var me = this;
    me.field = field;

    if (!field.rendered) {
      this.mon(field, 'afterrender', this.handleAfterRender, this);
    }
    else {
      // probably an existing input element transformed to extjs field
      this.handleAfterRender(field);
    }

    field.addEvents('varbeforequery', 'varcollapse', 'varexpand', 'varselect');

    if (field.xtype == 'combo') {
      Ext.apply(field, {
        trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
        useSuggest: false,
        onTrigger2Click : function() {
          var sel = field.triggerEl.last();
          sel.toggleCls(Ext.baseCSSPrefix + 'form-search-trigger');
          sel.toggleCls(Ext.baseCSSPrefix + 'form-clear-trigger');

          // hide current picker and switch to use the picker of combo or plugin.
          (me.inUsed ? me : this).collapse();
          if (me.listKeyNav) {
            me.listKeyNav[this.useSuggest ? 'enable' : 'disable']();
          }

          if (this.listKeyNav) {
            this.listKeyNav[!this.useSuggest ? 'enable' : 'disable']();
          }

          this.useSuggest = !this.useSuggest;
          me.inUsed = this.useSuggest
        }
      });

      me.mon(field, 'beforequery', this.onFieldBeforeQuery, this);
    }
    me.mon(field, 'blur', this.onFieldBlur, this);
    me.mon(field, 'focus', this.onFieldFocus, this);
  },

  /**
   * After the field has been rendered sets up the plugin (create the Element for the image button, attach listeners).
   * @private
   */
  handleAfterRender: function(field) {
    this.initPlugin(field);

    // use combobox's query as default.
    if (field.xtype == 'combo') {
      if (this.listKeyNav) {
        this.listKeyNav.disable();
      }
      this.inUsed = false;
    }

    if ((field.xtype == 'textfield') && (!Ext.isIE || (Ext.isIE9))){
      Ext.Function.defer(function (){
        var plugin = field.constructPlugin(Ext.create('Oz.plugins.form.MaxWrapButton', {
          varStoreId: this.self.storeId
        }));

        field.initPlugin(plugin)
        field.plugins.push(plugin);
      }, 500, this);
    }
  },

  initPlugin: function(field) {
    var me = this,
      store = me.self.getStore(),
      isLocalMode;

    if (field.xtype == 'htmleditor'){
      if (field.enableSourceEdit){
        field.suggestFocusEl = field.textareaEl;
      }
      else return;
    }
    else
      field.suggestFocusEl = field.inputEl;

    // Add handlers for keys to expand/collapse the picker
    me.keyNav = Ext.create('Ext.util.KeyNav', field.suggestFocusEl, {
      down: function() {
        if (!me.isExpanded) {
          // Don't call expand() directly as there may be additional processing involved before
          // expanding, e.g. in the case of a ComboBox query.
          me.onTriggerClick();
        }
      },
      esc: me.collapse,
      scope: me,
      forceKeyDown: true
    });


    // Disable native browser autocomplete
    if (Ext.isGecko) {
      field.suggestFocusEl.dom.setAttribute('autocomplete', 'off');
    }
    me.mon(field.suggestFocusEl, 'keyup', me.onKeyUp, me);

    me.bindStore(store);

    if (store) {
      store = Ext.data.StoreManager.lookup(store);
      if (store.autoCreated) {
        me.queryMode = 'local';
        me.valueField = me.displayField = 'field1';
        if (!store.expanded) {
          me.displayField = 'field2';
        }
      }
    }

    if (!Ext.isDefined(me.valueField)) {
      me.valueField = me.displayField;
    }

    isLocalMode = me.queryMode === 'local';
    if (!Ext.isDefined(me.queryDelay)) {
      me.queryDelay = isLocalMode ? 10 : 500;
    }

    me.doQueryTask = Ext.create('Ext.util.DelayedTask', me.initQuery, me);

    me.selectedIndex = -1;
    me.startPos = -1;
    me.endPos = -1;
  },

  // invoked when a different store is bound to this combo
  // than the original
  resetToDefault: function() {

  },

  bindStore: function(store, initial) {
    var me = this,
      oldStore = me.store;

    // this code directly accesses this.picker, bc invoking getPicker
    // would create it when we may be preping to destroy it
    if (oldStore && !initial) {
      if (oldStore !== store && oldStore.autoDestroy) {
        oldStore.destroy();
      } else {
        oldStore.un({
          scope: me,
          load: me.onLoad,
          exception: me.collapse
        });
      }
      if (!store) {
//        me.store = null;
        if (me.picker) {
          me.picker.bindStore(null);
        }
      }
    }
    if (store) {
      if (!initial) {
        me.resetToDefault();
      }

      me.store = Ext.data.StoreManager.lookup(store);
      me.store.on({
        scope: me,
        load: me.onLoad,
        exception: me.collapse
      });
      if (me.picker) {
        me.picker.bindStore(store);
      }
    }
  },

  onLoad: function() {
    var me = this;

    me.syncSelection();
  },

  onTriggerClick: function() {
    var me = this;
    if (!me.field.readOnly && !me.field.disabled) {
      if (me.isExpanded) {
        me.collapse();
      } else {
        me.field.onFocus({});
        if (me.triggerAction === 'all') {
          me.doQuery(me.allQuery, true);
        } else {
          me.doQuery(me.field.getRawValue(), false, true);
        }
      }
      me.field.suggestFocusEl.focus(100);
    }
  },

  onFieldBeforeQuery: function () {
    return !this.inUsed;
  },

  onFieldBlur: function() {
    this.lostFocus = true;
  },

  onFieldFocus: function() {
    this.lostFocus = false;
  },

  // store the last key and doQuery if relevant
  onKeyUp: function(e, t) {
    var me = this,
      key = e.getKey();

    if (!me.field.readOnly && !me.field.disabled) {
      me.lastKey = key;
      // we put this in a task so that we can cancel it if a user is
      // in and out before the queryDelay elapses

      // perform query w/ any normal key or backspace or delete
      if (!e.isSpecialKey() || key == e.BACKSPACE || key == e.DELETE) {
        me.doQueryTask.delay(me.queryDelay);
      }
    }

//    if (me.enableKeyEvents) {
//      me.callParent(arguments);
//    }
  },

  moveCursorToPosition: function(cursorPosition) {
    var d = this.field.suggestFocusEl.dom;
    if (d.createTextRange) {
      var r = d.createTextRange().duplicate();
      r.move('character', cursorPosition);
      r.select();
    } else {
      d.selectionStart = cursorPosition;
      d.selectionEnd = cursorPosition;
    }
  },

  getUserInputToMatch: function() {
    this.endPos = this.getCursorPosition();
    var v = this.identityExpression(this.field.getRawValue());

    if(v!=null&&Ext.String.trim(v).length>0){
      //
    }else{
      return '__________';
    }

    this.startPos = this.endPos - v.length;
    return v;
  },

  identityExpression: function (str) {
    var v = this.asTemplate ? this.identityTemplateExpression(str) : str;
    v = v.substring(0, Math.min(v.length, this.endPos));
    var fields = v.split(this.self.defaultRegexp);
    if (fields.length > 0) v = fields[fields.length - 1];
    return v;
  },

  identityTemplateExpression: function (str) {
    if (/\$\{/.test(str)){
      var v = str;
      v = v.substring(0, Math.min(v.length, this.endPos));
      var fields = v.split(this.self.templateRegexp);
      if (fields.length > 0) v = fields[fields.length - 1];
      if (/\}/.test(v)){
        return '__________';
      }
      return v;
    }
    return '__________';
  },

  getCursorPosition: function() {
    var s, e, r;
    var d = this.field.suggestFocusEl.dom;
    if (d.createTextRange) {
      r = d.createTextRange().duplicate();
      r.moveEnd('character', d.value.length);
      if (r.text === '') {
        s = d.value.length;
      } else {
        s = d.value.lastIndexOf(r.text);
      }
      r = d.createTextRange().duplicate();
      r.moveStart('character', -d.value.length);
      e = r.text.length;
    } else {
      s = d.selectionStart;
      e = d.selectionEnd;
    }

    return e;// return end cursor position
  },

  /**
   * Executes a query to filter the dropdown list. Fires the {@link #beforequery} event prior to performing the
   * query allowing the query action to be canceled if needed.
   * @param {String} queryString The SQL query to execute
   * @param {Boolean} forceAll <code>true</code> to force the query to execute even if there are currently fewer
   * characters in the field than the minimum specified by the <code>{@link #minChars}</code> config option.  It
   * also clears any filter previously saved in the current store (defaults to <code>false</code>)
   * @return {Boolean} true if the query was permitted to run, false if it was cancelled by a {@link #beforequery} handler.
   */
  doQuery: function(queryString, forceAll) {
    queryString = queryString || '';

    // store in object and pass by reference in 'beforequery'
    // so that client code can modify values.
    var me = this,
      qe = {
        query: queryString,
        forceAll: forceAll,
        combo: me,
        cancel: false
      },
      store = me.store,
      isLocalMode = me.queryMode === 'local';

    if (me.lostFocus || !me.inUsed || me.field.fireEvent('varbeforequery', qe) === false || qe.cancel) {
      return false;
    }

    // get back out possibly modified values
    queryString = qe.query;
    forceAll = qe.forceAll;

    // make sure they aren't querying the same thing
    if (!me.queryCaching || me.lastQuery !== queryString) {
      me.lastQuery = queryString;

      // forceAll means no filtering - show whole dataset.
      if (forceAll) {
        store.clearFilter();
      } else {
        // Clear filter, but supress event so that the BoundList is not immediately updated.
        store.clearFilter(true);
        store.filter(me.valueField, queryString);
      }
    }

    // Hidden suggesting list When there is no data for automatic completion
    if (store.getCount()){
      // query permitted to run
      // expand before starting query so LoadMask can position itself correctly
      me.expand();
    } else{
      me.collapse();
    }

    return true;
  },

  // private
  initQuery: function() {
    if (this.lostFocus) return;
    var v = this.getUserInputToMatch();
    this.doQuery(v);
  },

  /**
   * @private Synchronizes the selection in the picker to match the current value of the combobox.
   */
  syncSelection: function() {
    var me = this,
      ExtArray = Ext.Array,
      picker = me.picker,
      selection, selModel;
    if (picker) {
      // From the value, find the Models that are in the store's current data
      selection = [];
      ExtArray.forEach(me.valueModels || [], function(value) {
        if (value && value.isModel && me.store.indexOf(value) >= 0) {
          selection.push(value);
        }
      });

      // Update the selection to match
      me.ignoreSelection++;
      selModel = picker.getSelectionModel();
      selModel.deselectAll();
      if (selection.length) {
        selModel.select(selection);
      }
      me.ignoreSelection--;
    }
  },

  /**
   * Collapse this field's picker dropdown.
   */
  collapse: function() {
    if (this.isExpanded && !this.isDestroyed) {
      var me = this,
        openCls = me.openCls,
        picker = me.picker,
        doc = Ext.getDoc(),
        collapseIf = me.collapseIf,
        aboveSfx = '-above';

      // hide the picker and set isExpanded flag
      picker.hide();
      me.isExpanded = false;

      // remove the openCls
      me.field.bodyEl.removeCls([openCls, openCls + aboveSfx]);
      picker.el.removeCls(picker.baseCls + aboveSfx);

      // remove event listeners
      doc.un('mousewheel', collapseIf, me);
      doc.un('mousedown', collapseIf, me);
      Ext.EventManager.removeResizeListener(me.alignPicker, me);
      me.field.fireEvent('varcollapse', me);
      me.onCollapse();
      me.field.suggestFocusEl.focus(100);
    }
  },

  /**
   * @private
   * Disables the key nav for the BoundList when it is collapsed.
   */
  onCollapse: function() {
    var me = this,
      keyNav = me.listKeyNav;
    if (keyNav) {
      keyNav.disable();
      me.ignoreMonitorTab = false;
    }
  },

  /**
   * Expand this field's picker dropdown.
   */
  expand: function() {
    var me = this,
      bodyEl, picker, collapseIf;

    if (this.lostFocus) {
      return;
    }

    if (me.field.rendered && !me.isExpanded && !me.isDestroyed) {
      bodyEl = me.field.bodyEl;
      picker = me.getPicker();
      collapseIf = me.collapseIf;

      // show the picker and set isExpanded flag
      picker.show();
      me.isExpanded = true;
      me.alignPicker();
      bodyEl.addCls(me.openCls);

      // monitor clicking and mousewheel
      me.mon(Ext.getDoc(), {
        mousewheel: collapseIf,
        mousedown: collapseIf,
        scope: me
      });
      Ext.EventManager.onWindowResize(me.alignPicker, me);
      me.field.fireEvent('varexpand', me);
      me.onExpand();
    }
  },

  collapseIf: function(e) {
    var me = this;
    if (!me.isDestroyed && !e.within(me.bodyEl, false, true) && !e.within(me.picker.el, false, true)) {
      me.collapse();
    }
  },

  /**
   * @private
   * Enables the key nav for the BoundList when it is expanded.
   */
  onExpand: function() {
    var me = this,
      keyNav = me.listKeyNav,
      selectOnTab = me.selectOnTab,
      picker = me.getPicker();

    // Handle BoundList navigation from the input field. Insert a tab listener specially to enable selectOnTab.
    if (keyNav) {
      keyNav.enable();
    } else {
      keyNav = me.listKeyNav = Ext.create('Ext.view.BoundListKeyNav', this.field.suggestFocusEl, {
        boundList: picker,
        forceKeyDown: true,
        tab: function(e) {
          if (selectOnTab) {
            this.selectHighlighted(e);
            me.onFieldBlur();
          }
          // Tab key event is allowed to propagate to field
          return true;
        }
      });
    }

    // While list is expanded, stop tab monitoring from Ext.form.field.Trigger so it doesn't short-circuit selectOnTab
    if (selectOnTab) {
      me.ignoreMonitorTab = true;
    }

    Ext.defer(keyNav.enable, 1, keyNav); //wait a bit so it doesn't react to the down arrow opening the picker
    me.field.suggestFocusEl.focus(100);
  },

  /**
   * Return a reference to the picker component for this field, creating it if necessary by
   * calling {@link #createPicker}.
   * @return {Ext.Component} The picker component
   */
  getPicker: function() {
    var me = this;
    return me.picker || (me.picker = me.createPicker());
  },

  /**
   * Create and return the component to be used as this field's picker. Must be implemented
   * by subclasses of Picker.
   * @return {Ext.Component} The picker component
   */
  createPicker: function() {
    var me = this,
      picker,
      menuCls = Ext.baseCSSPrefix + 'menu',
      opts = Ext.apply({
        loadMask: false,
        selModel: {
          mode: 'SINGLE'
        },
        floating: true,
        hidden: true,
        ownerCt: me.field.ownerCt,
        cls: me.field.el.up('.' + menuCls) ? menuCls : '',
        store: me.store,
        displayField: me.displayField,
        focusOnToFront: false,
        pageSize: me.pageSize
      }, me.listConfig, me.defaultListConfig);

    picker = me.picker = Ext.create('Ext.view.BoundList', opts);

    me.mon(picker, {
      itemclick: me.onItemClick,
      refresh: me.onListRefresh,
      scope: me
    });
    me.mon(picker.getSelectionModel(), 'selectionchange', me.onListSelectionChange, me);

    return picker;
  },

  onListRefresh: function() {
    this.alignPicker();
    this.syncSelection();
  },

  onItemClick: function(picker, record) {
    /*
     * If we're doing single selection, the selection change events won't fire when
     * clicking on the selected element. Detect it here.
     */
    var me = this,
      lastSelection = me.lastSelection,
      valueField = me.valueField,
      selected;

    if (lastSelection) {
      selected = lastSelection[0];
      if (selected && (record.get(valueField) === selected.get(valueField))) {
        me.collapse();
      }
    }
  },

  onListSelectionChange: function(list, selectedRecords) {
    var me = this,
      hasRecords = selectedRecords.length > 0;
    // Only react to selection if it is not called from setValue, and if our list is
    // expanded (ignores changes to the selection model triggered elsewhere)
    if (!me.ignoreSelection && me.isExpanded) {
      Ext.defer(me.collapse, 1, me);
      /*
       * Only set the value here if we're in multi selection mode or we have
       * a selection. Otherwise setValue will be called with an empty value
       * which will cause the change event to fire twice.
       */
      if (hasRecords) {
        var record = selectedRecords[0];
        var v = me.field.getRawValue();

        var s = record.data[me.valueField];
        if (me.startPos > 0) {
          me.field.setValue(v.substring(0, me.startPos) + s + v.substring(me.endPos));
        }
        else {
          me.field.setValue(record.data[me.valueField] + v.substring(me.endPos));
        }

        me.moveCursorToPosition(me.startPos + s.length);

        me.field.fireEvent('varselect', me, selectedRecords);
      }
      me.field.suggestFocusEl.focus(100);
    }
  },

  /**
   * @protected
   * Aligns the picker to the
   */
  alignPicker: function() {
    var me = this,
      picker, isAbove,
      aboveSfx = '-above';

    if (this.isExpanded) {
      picker = me.getPicker();
      if (me.matchFieldWidth) {
        // Auto the height (it will be constrained by min and max width) unless there are no records to display.
        picker.setSize(me.field.bodyEl.getWidth(), picker.store && picker.store.getCount() ? null : 0);
      }
      if (picker.isFloating()) {
        picker.alignTo(me.field.suggestFocusEl, me.pickerAlign, me.pickerOffset);

        // add the {openCls}-above class if the picker was aligned above
        // the field due to hitting the bottom of the viewport
        isAbove = picker.el.getY() < me.field.suggestFocusEl.getY();
        me.field.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
        picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
      }
    }
  },

  destroy : function() {
    var me = this;

    Ext.EventManager.removeResizeListener(me.alignPicker, me);
    var collapseIf = this.collapseIf
    me.mun(Ext.getDoc(), {
      mousewheel: collapseIf,
      mousedown: collapseIf,
      scope: me
    });

    if (me.picker) {
      me.mun(me.picker, {
        itemclick: me.onItemClick,
        refresh: me.onListRefresh,
        scope: me
      });
      me.mun(me.picker.getSelectionModel(), 'selectionchange', me.onListSelectionChange, me);
      Ext.destroy(me.picker.loadMask, me.picker);
      me.picker = null;
    }
    me.bindStore(null);
    me.mun(me.field.suggestFocusEl, 'keyup', me.onKeyUp, me);
    me.mun(me.field, 'blur', this.onFieldBlur, this);
    me.mun(me.field, 'focus', this.onFieldFocus, this);
    if (me.keyNav) {
      me.keyNav.destroy();
      me.keyNav = null;
    }
    if (me.listKeyNav) {
      me.listKeyNav.destroy();
      me.listKeyNav = null;
    }
    me.field.suggestFocusEl = null;
    delete me.isExpanded;
    me.callParent();
  }
});