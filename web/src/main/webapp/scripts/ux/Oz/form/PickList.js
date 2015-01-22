/**
 * Created by IntelliJ IDEA.
 * User: wangy
 * Date: 11/21/11
 * Time: 10:26 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Oz.form.PickList', {
  extend: 'Ext.form.field.Base',
  alias: ['widget.picklistfield', 'widget.picklist'],
//  alternateClassName: ['Ext.ux.PickList'],
  requires: [
    'Oz.layout.component.form.PickList',
    'Ext.button.Button',
    'Ext.data.Store',
    'Ext.data.proxy.Memory'
  ],

  fromConfig: [],

  toConfig: [],

  componentLayout: 'picklistfield',

  height: 150,
  width: 250,
  /**
   * @cfg {String} appendOnly True if the list should only allow append drops when drag/drop is enabled
   * (use for lists which are sorted, defaults to false).
   */
  appendOnly: false,

  /**
   * @cfg {String} displayField Name of the desired display field in the dataset (defaults to 'text').
   */
  displayField: 'text',

  /**
   * @cfg {String} valueField Name of the desired value field in the dataset (defaults to the
   * value of {@link #displayField}).
   */

  /**
   * @cfg {Boolean} allowBlank False to require at least one item in the list to be selected, true to allow no
   * selection (defaults to true).
   */
  allowBlank: true,

  /**
   * @cfg {String} blankText Default text displayed when the control contains no items (defaults to 'This field is required')
   */
  blankText: 'This field is required',

  /**
   * @cfg {String} delimiter The string used to delimit the selected values when {@link #getSubmitValue submitting}
   * the field as part of a form. Defaults to ','. If you wish to have the selected values submitted as separate
   * parameters rather than a single delimited parameter, set this to <tt>null</tt>.
   */
  delimiter: ',',

  initEvents: function() {
    this.addEvents('change')
  },

  // No content generated via template, it's all added components
  getSubTplMarkup: function() {
    return '';
  },

  /**
   * Clears any values currently selected.
   */
  clearValue: function() {
    this.setValue([]);
  },

  /**
   * Return the value(s) to be submitted for this field. The returned value depends on the {@link #delimiter}
   * config: If it is set to a String value (like the default ',') then this will return the selected values
   * joined by the delimiter. If it is set to <tt>null</tt> then the values will be returned as an Array.
   */
  getSubmitValue: function() {
    var me = this,
      delimiter = me.delimiter,
      val = me.getValue();
    if (!val)
      return '';
    return Ext.isString(delimiter) ? val.join(delimiter) : val;
  },

  getSelectModels: function() {
    var toStore = this.toField.getComponent('list').getStore();
    if (this.toField && toStore.getCount() > 0)
      toStore.getRange();
    return [];
  },

  getRawValue: function() {
    var me = this,
      toField = me.toField,
      rawValue = me.rawValue,
      toStore = toField.getComponent('list').getStore();

    if (toField) {
      if (toStore.getCount() > 0) {
        rawValue = Ext.Array.map(toStore.getRange(), function (model) {
          return model.get(me.valueField);
        });
      }
      else {
        return [];
      }
    }
    me.rawValue = rawValue;
    return rawValue;
  },

//  value: 'sadfasdfadsfa',

  setRawValue: function(value) {
    var me = this,
      Array = Ext.Array,
      toStore, fromStore, models;

    me.rawValue = value;

    if (me.toField) {
      toStore = me.toField.getComponent('list').getStore();
      fromStore = me.fromField.getComponent('list').getStore();

      // Move any selected values back to the fromField
      if (toStore.getCount() > 0)
        fromStore.add(toStore.getRange());
      toStore.removeAll();

      // Move the new values over to the toField
      models = [];
      Ext.Array.forEach(value.split(','), function(val) {
        var undef,
          model = fromStore.findRecord(me.valueField, val, undef, undef, true, true);
        if (model) {
          models.push(model);
        }
      });
      fromStore.remove(models);
      toStore.add(models);
    }

    return value;
  },

  // private
  getContentTarget: function() {
    return this.inputEl;
  },

  ddReorder: true,

  // private
  initComponent: function() {
    var me = this;

    if (me.store.autoCreated) {
      me.valueField = me.displayField = 'field1';
      if (!me.store.expanded) {
        me.displayField = 'field2';
      }
    }

    if (!Ext.isDefined(me.valueField)) {
      me.valueField = me.displayField;
    }

    me.callParent();

    if (me.ddReorder && !me.dragGroup && !me.dropGroup) {
      me.dragGroup = me.dropGroup = 'MultiselectDD-' + Ext.id();
      me.dragZone = {};
      me.dropZone = {};
    }
  },

  onRender: function(ct, position) {
    this.callParent(arguments);

    var me = this,
      panelConfig = {
        tbar: me.tbar,
        flex: 1,
//        autoScroll: true,
        layout: 'fit',
        listeners: {
          afterrender: this.onItemRender,
          scope: me
        }
      },
      listConfig = {
        xtype: 'boundlist',
        itemId: 'list',
        deferInitialRefresh: false,
        multiSelect: true,
        displayField: me.displayField,
        border: false,
        disabled: me.disabled,
        listeners: {
          itemdblclick: function (view, model, element) {
            if (!me.readOnly) {
              var itemId = view.ownerCt.itemId,
                anotherViewId = itemId == 'from' ? 'to' : 'from',
                anotherView = me.innerCt.down("#" + anotherViewId + ' > #list');

              view.store.remove(model);
              anotherView.store.add(model);
              anotherView.getSelectionModel().select(model);
              anotherView.getTargetEl().scrollTo('top', anotherView.getTargetEl().first().getHeight());
              me.fireEvent('change', me, me.getValue());
            }
          }
        }
      },
      fromConfig = Ext.apply({
        title: 'Available',
        itemId: 'from',
        items:Ext.apply({store: Ext.create('Ext.data.Store', {model: me.store.model})}, listConfig)
      }, panelConfig, me.fromConfig),
      toConfig = Ext.apply({
        title: 'Selected',
        itemId: 'to',
        items:Ext.apply({store: Ext.create('Ext.data.Store', {model: me.store.model})}, listConfig)
      }, panelConfig, me.toConfig);

    var fromField = me.fromField = Ext.create('Ext.panel.Panel', fromConfig);
    var toField = me.toField = Ext.create('Ext.panel.Panel', toConfig);

    var innerCt = this.innerCt = Ext.widget('container', {
      renderTo: me.bodyEl,
      height: this.height,
      width: this.width,
      layout: {
        type: 'hbox',
        align: 'stretch'
      },
      items: [
        fromField,
        {
          xtype: 'container',
          margins: '0 4',
          html: ''
        },
        toField
      ]
    });

    // Must set upward link after first render
    innerCt.ownerCt = me;

    // Rebind the store so it gets cloned to the fromField
    me.bindStore(me.store);

    // Set the initial value
    me.setRawValue(me.rawValue);
  },

  bindStore: function(store, initial) {
    this.mun(store, 'datachanged', this.onStoreDataChange, this);
    this.mon(store, 'datachanged', this.onStoreDataChange, this);
    this.updateData(true);
  },

  onStoreDataChange: function() {
    this.updateData(false);
    this.setValue(this.getValue());
  },

  updateData: function(flag) {
    var me = this,
      toField = me.toField.getComponent('list'),
      fromField = me.fromField.getComponent('list'),
      models;

//    me.callParent(arguments);

    if (toField) {
      // Clear both field stores
      toField.store.removeAll();
      fromField.store.removeAll();

      // Clone the contents of the main store into the fromField
      models = [];
      me.store.each(function(model) {
        models.push(model.copy(model.getId()));
      });
      fromField.store.add(models);
    }
  },

  onItemRender: function(panel) {
    var me = this;
    if (me.draggable || me.dragGroup) {
      me.dragZone[panel.itemId] = Ext.create('Oz.dd.DragZone', {
        view: panel.getComponent('list'),
        ddGroup: me.dragGroup,
        dragText: '{0} Item{1}'
      });
    }
    if (me.droppable || me.dropGroup) {
      me.dropZone[panel.itemId] = Ext.create('Ext.view.DropZone', {
        view: panel.getComponent('list'),
        ddGroup: me.dropGroup,
        handleNodeDrop: function(data, dropRecord, position) {
          var view = this.view,
            store = view.getStore(),
            records = data.records,
            index;

          // remove the Models from the source Store
          data.view.store.remove(records);

          index = store.indexOf(dropRecord);
          if (position === 'after') {
            index++;
          }
          store.insert(index, records);
          view.getSelectionModel().select(records);
          me.fireEvent('change', me, me.getValue());
        }
      });
    }
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
    var me = this,fromList, toList;

    me.callParent();
    me.updateReadOnly();
    if (me.fromField && (fromList = me.fromField.getComponent('list'))) {
      fromList.disable();
    }
    if (me.toField && (toList = me.toField.getComponent('list'))) {
      toList.disable();
    }
  },

  onEnable: function() {
    var me = this,fromList, toList;

    me.callParent();
    me.updateReadOnly();
    if (me.fromField && (fromList = me.fromField.getComponent('list'))) {
      fromList.enable();
    }
    if (me.toField && (toList = me.toField.getComponent('list'))) {
      toList.enable();
    }
  },

  setReadOnly: function(readOnly) {
    this.readOnly = readOnly;
    this.updateReadOnly();
  },

  /**
   * @private Lock or unlock the BoundList's selection model to match the current disabled/readonly state
   */
  updateReadOnly: function() {
    var me = this,
      readOnly = me.readOnly || me.disabled,
      fromList, toList;
    if (me.fromField && (fromList = me.fromField.getComponent('list'))) {
      fromList.getSelectionModel().setLocked(readOnly);
    }
    if (me.toField && (toList = me.toField.getComponent('list'))) {
      toList.getSelectionModel().setLocked(readOnly);
    }
  },

  getToStore: function(){
    return this.toField.getComponent('list').getStore();
  },

  onDestroy: function() {
    if (this.dragZone) {
      Ext.destroy([this.dragZone['from']])
      Ext.destroy([this.dragZone['to']])
    }
    if (this.dropZone) {
      Ext.destroy([this.dropZone['from']])
      Ext.destroy([this.dropZone['to']])
    }
    this.fromField.getComponent('list').getStore().destroyStore();
    this.toField.getComponent('list').getStore().destroyStore();

    Ext.destroyMembers(this, 'fromField', 'toField', 'innerCt');
    this.callParent();
  }
});