Ext.define('Oz.plugins.form.Suggest', {
  extend: 'Ext.AbstractPlugin',

  mixins: {
    observable: 'Ext.util.Observable'
  },

  alias: 'plugin.suggest',
  alternateClassName: 'Oz.ux.Suggest',

  requires: [
    'Ext.Function',
    'Ext.data.StoreManager',

    'Ext.util.Observable'
  ],

  constructor: function(config) {
    this.fieldConfig = Ext.apply({}, config, {
      suggestOn: true,
      displayField: '',
      valueField: '',
      caseSensitive: false,
      anyMatch: false,

      /**
       * @cfg {String} triggerCls
       * An additional CSS class used to style the trigger button. The trigger will always get the
       * {@link #triggerBaseCls} by default and <code>triggerCls</code> will be <b>appended</b> if specified.
       * Defaults to 'x-form-arrow-trigger' for ComboBox.
       */
      triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',

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
       * @cfg {String} triggerAction The action to execute when the trigger is clicked.
       * <div class="mdetail-params"><ul>
       * <li><b><code>'all'</code></b> : <b>Default</b>
       * <p class="sub-desc">{@link #doQuery run the query} specified by the <code>{@link #allQuery}</code> config option</p></li>
       * <li><b><code>'query'</code></b> :
       * <p class="sub-desc">{@link #doQuery run the query} using the {@link Ext.form.field.Base#getRawValue raw value}.</p></li>
       * </ul></div>
       * <p>See also <code>{@link #queryParam}</code>.</p>
       */
      triggerAction: 'all',

      /**
       * @cfg {String} allQuery The text query to send to the server to return all records for the list
       * with no filtering (defaults to '')
       */
      allQuery: '',

      /**
       * @cfg {String} queryParam Name of the parameter used by the Store to pass the typed string when the ComboBox is configured with
       * <code>{@link #queryMode}: 'remote'</code> (defaults to <code>'query'</code>). If explicitly set to a falsy value it will
       * not be sent.
       */
      queryParam: 'query',

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
       * @cfg {Boolean} autoSelect <code>true</code> to automatically highlight the first result gathered by the data store
       * in the dropdown list when it is opened. (Defaults to <code>true</code>). A false value would cause nothing in the
       * list to be highlighted automatically, so the user would have to manually highlight an item before pressing
       * the enter or {@link #selectOnTab tab} key to select it (unless the value of ({@link #typeAhead}) were true),
       * or use the mouse to select a value.
       */
      autoSelect: true,

//      /**
//       * @cfg {Boolean} typeAhead <code>true</code> to populate and autoselect the remainder of the text being
//       * typed after a configurable delay ({@link #typeAheadDelay}) if it matches a known value (defaults
//       * to <code>false</code>)
//       */
//      typeAhead: false,
//
//      /**
//       * @cfg {Number} typeAheadDelay The length of time in milliseconds to wait until the typeahead text is displayed
//       * if <code>{@link #typeAhead} = true</code> (defaults to <code>250</code>)
//       */
//      typeAheadDelay: 250,

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

      /**
       * @cfg {String} valueNotFoundText When using a name/value combo, if the value passed to setValue is not found in
       * the store, valueNotFoundText will be displayed as the field text if defined (defaults to undefined). If this
       * default text is used, it means there is no value set and no validation will occur on this field.
       */

      /**
       * The value of the match string used to filter the store. Delete this property to force a requery.
       * Example use:
       * <pre><code>
       var combo = new Ext.form.field.ComboBox({
       ...
       queryMode: 'remote',
       listeners: {
       // delete the previous query in the beforequery event or set
       // combo.lastQuery = null (this will reload the store the next time it expands)
       beforequery: function(qe){
       delete qe.combo.lastQuery;
       }
       }
       });
       * </code></pre>
       * To make sure the filter in the store is not cleared the first time the ComboBox trigger is used
       * configure the combo with <code>lastQuery=''</code>. Example use:
       * <pre><code>
       var combo = new Ext.form.field.ComboBox({
       ...
       queryMode: 'local',
       triggerAction: 'all',
       lastQuery: ''
       });
       * </code></pre>
       * @property lastQuery
       * @type String
       */

      /**
       * @cfg {Object} defaultListConfig
       * Set of options that will be used as defaults for the user-configured {@link #listConfig} object.
       */
      defaultListConfig: {
        emptyText: '',
        loadingText: 'Loading...',
        loadingHeight: 70,
        minWidth: 70,
        maxHeight: 300,
        shadow: 'sides'
      },

      /**
       * @cfg {Boolean} lazyInit <tt>true</tt> to not initialize the list for this combo until the field is focused
       * (defaults to <tt>true</tt>)
       */
      lazyInit : true
    });

    this.callParent(arguments);
  },

  init: function(field){
    var //me = this,
      isDefined = Ext.isDefined,
      store = this.store,
      isLocalMode;

    if(!this.suggestOn){
      return;
    }
    var thisXType = field.getXType();

    // only allow text field or text area to allow suggest
    if ('textareafield' != thisXType && 'textfield' != thisXType){
      return;
    };

    Ext.apply(field, this.fieldConfig);

    Ext.apply(field, {
      beforeBlur: function() {
        var me = this;
        me.doQueryTask.cancel();
        if (me.forceSelection) {
          me.assertValue();
        } else {
          me.collapse();
        }
      },

      // private
      assertValue: function() {
        var me = this,
          value = me.getRawValue(),
          rec;

        // For single-select, match the displayed value to a record and select it,
        // if it does not match a record then revert to the most recent selection.
        rec = me.findRecordByDisplay(value);
        if (rec) {
          me.select(rec);
        } else {
          me.setValue(me.lastSelection);
        }
        me.collapse();
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
            me.store = null;
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

        if (me.fireEvent('beforequery', qe) === false || qe.cancel) {
          return false;
        }

        // get back out possibly modified values
        queryString = qe.query;
        forceAll = qe.forceAll;

        // query permitted to run
        // expand before starting query so LoadMask can position itself correctly
        me.expand();

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

        return true;
      },

      // store the last key and doQuery if relevant
      onKeyUp: function(e, t) {
        var me = this,
          key = e.getKey();

        if (!me.readOnly && !me.disabled) {
          me.lastKey = key;
          // we put this in a task so that we can cancel it if a user is
          // in and out before the queryDelay elapses

          // perform query w/ any normal key or backspace or delete
          if (!e.isSpecialKey() || key == e.BACKSPACE || key == e.DELETE) {
            me.doQueryTask.delay(me.queryDelay);
          }
        }

        if (me.enableKeyEvents) {
          me.callParent(arguments);
        }
      },

      initEvents: function() {
        var me = this;

        // Add handlers for keys to expand/collapse the picker
        me.keyNav = Ext.create('Ext.util.KeyNav', me.inputEl, {
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
          me.inputEl.dom.setAttribute('autocomplete', 'off');
        }

        /*
         * Setup keyboard handling. If enableKeyEvents is true, we already have
         * a listener on the inputEl for keyup, so don't create a second.
         */
        if (!me.enableKeyEvents) {
          me.mon(me.inputEl, 'keyup', me.onKeyUp, me);
        }
      },

      onListRefresh: function() {
        this.alignPicker();
        this.syncSelection();
      },

      onItemClick: function(picker, record){
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
            var v = me.getRawValue();

            var s = record.data[me.valueField];
            if(me.startPos > 0){
              me.setValue(v.substring(0, me.startPos) + s + v.substring(me.endPos));
            }
            else{
              me.setValue(record.data[me.valueField] + v.substring(me.endPos));
            }

            me.moveCursorToPosition(me.startPos + s.length);

            me.fireEvent('select', me, selectedRecords);
          }
          me.inputEl.focus();
        }
      },
      /**
       * Expand this field's picker dropdown.
       */
      expand: function() {
        var me = this,
          bodyEl, picker, collapseIf;

        if (me.rendered && !me.isExpanded && !me.isDestroyed) {
          bodyEl = me.bodyEl;
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
          me.fireEvent('expand', me);
          me.onExpand();
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
          keyNav = me.listKeyNav = Ext.create('Ext.view.BoundListKeyNav', this.inputEl, {
            boundList: picker,
            forceKeyDown: true,
            tab: function(e) {
              if (selectOnTab) {
                this.selectHighlighted(e);
                me.triggerBlur();
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
        me.inputEl.focus();
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
            picker.setSize(me.bodyEl.getWidth(), picker.store && picker.store.getCount() ? null : 0);
          }
          if (picker.isFloating()) {
            picker.alignTo(me.inputEl, me.pickerAlign, me.pickerOffset);

            // add the {openCls}-above class if the picker was aligned above
            // the field due to hitting the bottom of the viewport
            isAbove = picker.el.getY() < me.inputEl.getY();
            me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
            picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
          }
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
          me.bodyEl.removeCls([openCls, openCls + aboveSfx]);
          picker.el.removeCls(picker.baseCls + aboveSfx);

          // remove event listeners
          doc.un('mousewheel', collapseIf, me);
          doc.un('mousedown', collapseIf, me);
          Ext.EventManager.removeResizeListener(me.alignPicker, me);
          me.fireEvent('collapse', me);
          me.onCollapse();
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
       * @private
       * Runs on mousewheel and mousedown of doc to check to see if we should collapse the picker
       */
      collapseIf: function(e) {
        var me = this;
        if (!me.isDestroyed && !e.within(me.bodyEl, false, true) && !e.within(me.picker.el, false, true)) {
          me.collapse();
        }
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
            selModel: {
              mode: 'SINGLE'
            },
            floating: true,
            hidden: true,
            ownerCt: me.ownerCt,
            cls: me.el.up('.' + menuCls) ? menuCls : '',
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

      onDestroy : function(){
        var me = this;
        Ext.EventManager.removeResizeListener(me.alignPicker, me);
        Ext.destroy(me.picker, me.keyNav);
        me.callParent();
      },

      // private
      unsetDelayCheck : function(){
        delete this.delayedCheck;
      },

      // private
      fireKey : function(e){
        var fn = function(ev){
          if (ev.isNavKeyPress() && !this.isExpanded() && !this.delayedCheck) {
            this.fireEvent("specialkey", this, ev);
          }
        };
        //For some reason I can't track down, the events fire in a different order in webkit.
        //Need a slight delay here
        if(this.inEditor && Ext.isWebKit && e.getKey() == e.TAB){
          fn.defer(10, this, [new Ext.EventObjectImpl(e)]);
        }else{
          fn.call(this, e);
        }
      },

      // private
      onEmptyResults : function(){
        this.collapse();
      },

      moveCursorToPosition: function(cursorPosition) {
        var d = this.inputEl.dom;
        if(d.createTextRange){
          var r = d.createTextRange().duplicate();
          r.move('character', cursorPosition);
          r.select();
        } else {
          d.selectionStart = cursorPosition;
          d.selectionEnd = cursorPosition;
        }
      },

      getCursorPosition: function() {
        var s, e, r;
        var d = this.inputEl.dom;
        if(d.createTextRange){
          r = d.createTextRange().duplicate();
          r.moveEnd('character', d.value.length);
          if(r.text === ''){
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

      getUserInputToMatch: function() {
        this.endPos = this.getCursorPosition();
        var v = this.getRawValue();
        v = v.substring(0, Math.min(v.length, this.endPos));
        var fields = v.split(/[ |,|;|\'|\"|\s|\f|\t|\n|\r|\(|\)|\+|\-|\*|\/]+/gi);
        if (fields.length > 0) v = fields[fields.length - 1];

        this.startPos = this.endPos - v.length;
        return v;
      },

      // private
      initQuery: function(){
        var v = this.getUserInputToMatch();
        this.doQuery(v);
      }//,
    });

    field.addEvents(
      /**
       * @event expand
       * Fires when the field's picker is expanded.
       * @param {Ext.form.field.Picker} field This field instance
       */
      'expand',
      /**
       * @event collapse
       * Fires when the field's picker is collapsed.
       * @param {Ext.form.field.Picker} field This field instance
       */
      'collapse',
      /**
       * @event beforequery
       * Fires before all queries are processed. Return false to cancel the query or set the queryEvent's
       * cancel property to true.
       * @param {Object} queryEvent An object that has these properties:<ul>
       * <li><code>combo</code> : Ext.form.field.ComboBox <div class="sub-desc">This combo box</div></li>
       * <li><code>query</code> : String <div class="sub-desc">The query string</div></li>
       * <li><code>forceAll</code> : Boolean <div class="sub-desc">True to force "all" query</div></li>
       * <li><code>cancel</code> : Boolean <div class="sub-desc">Set to true to cancel the query</div></li>
       * </ul>
       */
      'beforequery',
      /**
       * @event select
       * Fires when a value is selected via the picker.
       * @param {Ext.form.field.Picker} field This field instance
       * @param {Mixed} value The value that was selected. The exact type of this value is dependent on
       * the individual field and picker implementations.
       */
      'select'
    );

    field.bindStore(store, true);
    if(store){
      store = Ext.data.StoreManager.lookup(store);
      if (store.autoCreated) {
        field.queryMode = 'local';
        field.valueField = field.displayField = 'field1';
        if (!store.expanded) {
          field.displayField = 'field2';
        }
      }
    }


    if (!isDefined(field.valueField)) {
      field.valueField = field.displayField;
    }

    isLocalMode = field.queryMode === 'local';
    if (!isDefined(field.queryDelay)) {
      field.queryDelay = isLocalMode ? 10 : 500;
    }

    field.doQueryTask = Ext.create('Ext.util.DelayedTask', field.initQuery, field);

    field.selectedIndex = -1;
    field.startPos = -1;
    field.endPos = -1;
  },

  getStore: function(){
    if(Ext.isString(this.store)){
      this.store = Ext.create(this.store);
    }

    return this.store;
  },

  loadSuggest: function(config){
    var me = this,
      store = me.getStore(),
      key;

    if(store && Ext.isObject(config)){
      for (key in config) {
        store.getProxy().setExtraParam(key, config[key]);
      }

      store.load();
    }
  }
});