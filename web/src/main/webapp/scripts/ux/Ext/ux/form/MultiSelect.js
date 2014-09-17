/**
 * A control that allows selection of multiple items in a list.
 */
Ext.define('Ext.ux.form.MultiSelect', {
        extend: 'Ext.form.field.Base',

        alternateClassName: 'Ext.ux.Multiselect',

        alias: ['widget.multiselect', 'widget.multiselectfield'],

        requires: [
            'Ext.panel.Panel',
            'Ext.grid.Panel',
            'Ext.data.Store',
            'Ext.data.StoreManager',
            'Ext.form.FieldSet',
            'Ext.ux.data.PagingMemoryProxy',
            'Ext.ux.data.AvailableStore',
            'Ext.ux.dd.DragZone',
            'Ext.ux.utils.Utils',
            'Ext.ux.statusbar.StatusBar'
        ],

        gridCfg: {},
        availableCfg: null,
        selectedCfg: null,

        selectedViewCfg: null,
        availableViewCfg: null,

        availableIdProperty: null,
        selectedIdProperty: null,

        availableTitle: 'Available',
        selectedTitle: 'Selected',

        columns: [],
        availableColumns: null,
        selectedColumns: null,

        maxSelected: null,
        selectedSorters: null,

        pageSize: 10,
        filterMode: 'remote',

        selectedStore: undefined,
        priorityFiled: undefined,

        height: 200,

        // private
        initComponent: function () {
            var me = this;

            if (me.availableCfg == null) {
                me.availableCfg = me.gridCfg;
            }

            if (me.selectedCfg == null) {
                me.selectedCfg = me.gridCfg;
            }

            if (me.availableColumns == null && me.columns != null) {
                me.availableColumns = me.columns;
            }
            if (me.selectedColumns == null && me.availableColumns != null) {
                me.selectedColumns = me.availableColumns;
            }

            me.callParent();
        },

        bindStore: function (store, initial) {
            var me = this,
                oldStore = me.store;

            if (oldStore && !initial && oldStore !== store && oldStore.autoDestroy) {
                oldStore.destroyStore();
            }

            me.store = store ? Ext.data.StoreManager.lookup(store) : null;
        },

        // private
        onRender: function (ct, position) {
            var me = this,
                availableStoreCfg = {
                    sorters: me.store ? (me.store.sorters ? me.store.sorters.items : null) : null,
                    model: me.store.model
                },
                availableStore = Ext.create('Ext.ux.data.AvailableStore',
                    Ext.applyIf(availableStoreCfg,
                            this.filterMode == 'local' ?
                        {
                            pageSize: this.pageSize,
                            reader: me.store.reader,
                            filterLocalBy: function (filters) {
                                var me = this,
                                    decoded = me.decodeFilters(filters),
                                    i = 0,
                                    length = decoded.length;

                                me.filters.clear();
                                for (; i < length; i++) {
                                    me.filters.replace(decoded[i]);
                                }

                                me.loadPage(1);
                            },
                            clearLocalFilter: function () {
                                this.filters.clear();
                                this.loadPage(1);
                            },
                            listeners: {
//                'datachanged': function(store) {
//                  this.load();
//                },
                                'remove': function (store, model) {
//                  var r, d = model.data, ip = store.proxy.reader.getIdProperty();
//                  for (var i = 0; i < store.proxy.__data.length; i++) {
//                    var obj = store.proxy.__data[i];
//                    if (d[ip] == obj[ip]) {
//                      r = obj;
//                      break;
//                    }
//                  }
//                  if (r){
//                    Ext.Array.remove(store.proxy.__data, r);
//                    console.log('store.getTotalCount()', store.getTotalCount(), store.proxy.__data.length, (store.currentPage - 1) * store.pageSize);
//                    if (store.proxy.__data.length <= (store.currentPage - 1) * store.pageSize) {
//                      console.log('store.currentPage > - 1', store.currentPage - 1);
//                      store.loadPage(store.currentPage > 0 ? store.currentPage - 1 : 1);
//                    }
//                    else
//                      store.load();
//                  }
                                },
                                'batchRemove': function (store, models) {
                                    var r, ip = store.proxy.reader.getIdProperty();
                                    for (var j = 0; j < models.length; j++) {
                                        var model = models[j], d = model.data;
                                        for (var i = 0; i < store.proxy.__data.length; i++) {
                                            var obj = store.proxy.__data[i];
                                            if (d[ip] == obj[ip]) {
                                                r = obj;
                                                Ext.Array.remove(store.proxy.__data, obj);
                                                break;
                                            }
                                        }
                                    }
                                    if (r) {
                                        Ext.Array.remove(store.proxy.__data, r);
                                        if (store.proxy.__data && store.proxy.__data.length <= (store.currentPage - 1) * store.pageSize) {
                                            store.loadPage(store.currentPage > 0 ? store.currentPage - 1 : 1);
                                        }
                                        else
                                            store.load();
                                    }
                                },
                                'add': function (store, models) {
                                    var ip = store.proxy.reader.getIdProperty();
                                    for (var j = 0; j < models.length; j++) {
                                        var model = models[j];


                                        var d = model.data, r = true;
                                        for (var i = 0; i < store.proxy.__data.length; i++) {
                                            var obj = store.proxy.__data[i];
                                            if (d[ip] == obj[ip]) {
                                                r = false;
                                                break;
                                            }
                                        }
                                        if (r) {
                                            store.proxy.__data.push(d);
                                        }
                                    }

                                    if (store.currentPage < 1) {
                                        store.loadPage(1);
                                    }
                                    else {
                                        store.load();
                                    }
                                }
                            }
                        } : null
                    )
                ), //blank store to begin
                availableViewConfig = Ext.applyIf({
                    forceFit: true,
                    plugins: Ext.applyIf({
                        ptype: 'gridviewdragdrop',
                        enableDrag: !me.readOnly,
                        enableDrop: !me.readOnly,
                        onViewRender: Ext.ux.utils.Utils.onDragDropViewRender
                    }, me.enableSort ?
                    {ddGroup: 'availableGridDDGroup-' + me.id}
                        :
                    {
                        ddGroup: 'availableGridDDGroup-' + me.id,
                        dropGroup: 'selectedGridDDGroup-' + me.id
                    })
                }, me.availableViewCfg),
                selectedViewCfg = Ext.applyIf({
                    forceFit: true,
                    plugins: Ext.applyIf({
                        ptype: 'gridviewdragdrop',
                        enableDrag: !me.readOnly,
                        enableDrop: !me.readOnly,
                        onViewRender: Ext.ux.utils.Utils.onDragDropViewRender
                    }, me.enableSort ?
                    {ddGroup: 'availableGridDDGroup-' + me.id}
                        :
                    {
                        dragGroup: 'selectedGridDDGroup-' + me.id,
                        dropGroup: 'availableGridDDGroup-' + me.id
                    }),
                    listeners: {
                        beforedrop: function (node, data) {
                            if (me.maxSelected) {
                                if (data && data.records && data.view.id != this.id) {
                                    var total = this.store.getCount() + data.records.length;
                                    if (total > me.maxSelected) {
                                        return false;
                                    }
                                }
                            }
                        },
                        drop: function (node, data, m, dp) {
                            if (me.priorityFiled) {
                                var records = this.store.getRange();
//                    if (me.etlFileLayoutMode && data && data.records) {
//                      var dropRecords = data.records;
//                      //filter selected exists data;
//                      var needSetDefaultValueRecordArray = [];
//                      Ext.Array.each(dropRecords, function (dropRecord) {
//                        Ext.Array.each(records, function (selectRecord) {
//                          if (dropRecord.get('variableId') === selectRecord.get('variableId')) {
//                            needSetDefaultValueRecordArray.push(selectRecord);
//                            return false;
//                          }
//                        });
//                      });
//                      me.setRecordDefaultValue(needSetDefaultValueRecordArray);
//                    }

                                for (var i = 0; i < records.length; i++) {
                                    var rec = records[i];
                                    rec.set(me.priorityFiled, i + 1);
                                }
                            }

                            me.fireEvent('updatedPriorityFiled');

                            this.store.sort(me.selectedSorters ? me.selectedSorters : availableStore.sorters);
                        }
                    }
                }, me.selectedViewCfg),
                commonConfig = {
                    multiSelect: true,
                    stripeRows: true,
                    autoDestroy: true,
                    flex: 1
                },
                availableConfig = Ext.apply({
                    title: me.availableTitle,
                    height: me.ownerCt ? me.ownerCt.getHeight() - 45 : '100%',
                    itemId: me.itemId,
                    viewConfig: availableViewConfig,
                    store: availableStore,
                    margins: '0 5 0 0',
                    autoScroll: true,
                    forceFit: true,
                    columns: me.availableColumns,

                    // paging bar on the bottom
                    bbar: Ext.create('Ext.toolbar.Paging', {
                        //pageSize: 10,
                        store: availableStore,
                        displayMsg: '{0} - {1} of {2}',
                        displayInfo: true
                    })
                }, me.availableCfg, commonConfig, {flex: me.availableCfg && me.availableCfg.flex ? me.availableCfg.flex : 1 });

            if (!availableStore.proxy.__data) {
                availableStore.proxy.__data = [];
            }

            if (me.selectedViewCfg && me.selectedViewCfg.listeners && me.selectedViewCfg.listeners != null) {
                for (var event in me.selectedViewCfg.listeners) {
                    if (event && me.selectedViewCfg.listeners[event]) {
                        selectedViewCfg.listeners[event] = me.selectedViewCfg.listeners[event];
                    }
                }
            }

            if (!me.selectedStore) {
                me.selectedStore = Ext.create('Ext.data.Store', {
                    model: me.store.model,
                    sorters: me.selectedSorters ? me.selectedSorters : me.store.sorters,
                    listeners: {
                        add: function (store) {
                            me.updateSelectedGridStatusBar(store.getCount());
                            try {
                                me.up('form').getForm().checkDirty();
                            } catch (e) {
                            }
                        },
                        remove: function (store) {
                            me.updateSelectedGridStatusBar(store.getCount());
                            try {
                                me.up('form').getForm().checkDirty();
                            } catch (e) {
                            }
                        }
                    }
                })
            }

            var selectedConfig = Ext.apply({
                    title: me.selectedTitle,
                    height: me.ownerCt ? me.ownerCt.getHeight() - 45 : '100%',
                    itemId: me.selectedItemId,
                    viewConfig: selectedViewCfg,
                    store: me.selectedStore, //blank store to begin
                    margins: '0 0 0 5',
                    autoScroll: true,
                    forceFit: true,
                    columns: me.selectedColumns,
                    bbar: me.maxSelected ? Ext.create('Ext.ux.StatusBar', {
                        id: 'selectedGrid-statusBar',
                        text: ''
                    }) : null,
                    listeners: {
                        afterrender: function () {
                            me.updateSelectedGridStatusBar(me.selectedStore.getCount());
                        }
                    }
                }, me.selectedCfg, commonConfig, {flex: me.selectedCfg && me.selectedCfg.flex ? me.selectedCfg.flex : 1}),
                availableGrid = Ext.widget('grid', availableConfig),
                selectedGrid = Ext.widget('grid', selectedConfig),
                innerCt,
                buttons = [];
            me.callParent(arguments);
            if (!Ext.isIE) {
                me.el.mask('rendering...');
            }

            me.availableGrid = availableGrid;
            me.selectedGrid = selectedGrid;

            if (!me.readOnly) {
                me.mon(me.availableGrid, 'itemdblclick', this.onAvailableDblClick, this);
                me.mon(me.selectedGrid, 'itemdblclick', this.onSelectedDblClick, this);
            }


            var form = me.up('form');
            me.mon(form, 'resize', this.onFormResizeHandler, this);
        },

        updateSelectedGridStatusBar: function (count) {
            var me = this;
            if (me.maxSelected) {
                var sb = Ext.getCmp('selectedGrid-statusBar');
                var tpl = 'Current/Maximum: {0}/{1}';
                var maximum = me.maxSelected ? me.maxSelected : '&infin;';
                sb.setStatus(Ext.String.format(tpl, count, maximum));
            }
        },

        onFormResizeHandler: function () {
            var me = this;
            var height = me.ownerCt ? me.ownerCt.getHeight() - 45 : '100%';
            if (Ext.isNumber(height)) {
                me.availableGrid.setHeight(height);
                me.selectedGrid.setHeight(height);
            }
        },

//    // private
//    afterRender: function() {
//      var me = this;
//      me.callParent();
//
//      // Rebind the store so it gets cloned to the availableField
//      me.bindStore(me.store);
//    },

        // No content generated via template, it's all added components
        getSubTplMarkup: function () {
            return '';
        },

        afterRender: function () {
            this.callParent();

            var me = this,
                availableGrid = me.availableGrid,
                selectedGrid = me.selectedGrid,
                availableStore = availableGrid.getStore(),
                selectedStore = selectedGrid.getStore(), models;
            if (selectedGrid) {
                // Clear both field stores
                selectedGrid.getStore().removeAll();
                availableStore.removeAll();

                // Clone the contents of the main store into the fromField
                models = [];
                if (this.filterMode == 'local') {
                    me.store.each(function (model) {
                        models.push(model.data);
                    });

                    var proxy = availableStore.getProxy();
                    availableStore.setProxy(new Ext.ux.data.PagingMemoryProxy({data: models, store: availableStore}));
                    availableStore.load({params: {start: 0, limit: me.pageSize}, initLoad: true});
                    delete proxy;
                }
                else {
                    me.store.each(function (model) {
                        models.push(model.copy(model.getId()));
                    });
                    availableStore.add(models);
                }
            }

            Ext.Function.defer(
                function () {
                    var height = me.ownerCt.getHeight() - 20;
                    var innerCt = me.innerCt = Ext.create('Ext.panel.Panel', {
                        renderTo: me.bodyEl,
                        frame: true,
                        height: height || me.height,
                        style: 'border:none;',
                        layout: {
                            type: 'hbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items: [
                            availableGrid,
                            {
                                xtype: 'container',
                                width: 30,
                                height: '100%',
                                layout: {
                                    type: 'vbox',
                                    padding: '0',
                                    pack: 'center',
                                    align: 'center'
                                },
                                defaults: {margins: '0 0 5 0'},
                                items: [
                                    {
                                        xtype: 'button',
                                        iconCls: 'arrow_right',
                                        tooltip: globalRes.tooltip.moveToRight,
                                        disabled: me.readOnly,
                                        handler: function () {
                                            var selModel = availableGrid.getSelectionModel();
                                            if (selModel.hasSelection()) {
                                                var records = selModel.getSelection();

                                                if (me.maxSelected && records) {
                                                    var total = me.selectedStore.getCount() + records.length;
                                                    if (total > me.maxSelected) {
                                                        return false;
                                                    }
                                                }
                                                selectedStore.add(records);
                                                availableStore.remove(records);
                                                if (!me.etlFileLayoutMode) {
                                                    availableStore.sort(availableStore.sorters);
                                                }
                                                me.updatePriorityFiled();
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'arrow_right_double',
                                        tooltip: globalRes.tooltip.moveAllToRight,
                                        disabled: me.readOnly,
                                        handler: function () {
                                            var records;

                                            if (me.maxSelected) {
                                                var endIndex = me.maxSelected - me.selectedStore.getCount() - 1;
                                                if (endIndex >= 0) {
                                                    records = availableStore.getRange(0, endIndex);
                                                }
                                            } else {
                                                records = availableStore.getRange();
                                            }

                                            if (records) {
                                                selectedStore.add(records);
                                                availableStore.remove(records);
                                                if (!me.etlFileLayoutMode) {
                                                    availableStore.sort(availableStore.sorters);
                                                }
                                                me.updatePriorityFiled();
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'arrow_left_double',
                                        tooltip: globalRes.tooltip.moveAllToLeft,
                                        disabled: me.readOnly,
                                        handler: function () {
                                            var records = selectedStore.getRange();
                                            availableStore.add(records);
                                            selectedStore.remove(records);
                                            me.updatePriorityFiled();
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'arrow_left',
                                        tooltip: globalRes.tooltip.moveToLeft,
                                        disabled: me.readOnly,
                                        handler: function () {
                                            var selModel = selectedGrid.getSelectionModel()
                                            if (selModel.hasSelection()) {
                                                var records = selModel.getSelection();
                                                availableStore.add(records);
                                                selectedStore.remove(records);
                                                me.updatePriorityFiled();
                                            }
                                        }
                                    }
                                ]
                            },
                            selectedGrid
                        ]
                    });

                    // Must set upward link after first render
                    innerCt.ownerCt = me;
                    me.ownerCt.doLayout();
                    if (!Ext.isIE) {
                        me.el.unmask();
                    }
                }, 100);
        },

        updatePriorityFiled: function () {
            var me = this;
            new Ext.util.DelayedTask(function () {
                if (me.priorityFiled) {
                    var records = me.selectedStore.getRange();
                    for (var i = 0; i < records.length; i++) {
                        var rec = records[i];
                        rec.set(me.priorityFiled, i + 1);
                    }
                    try {
                        me.selectedGrid.getView().refresh();
                    } catch (e) {
                    }
                }
                me.fireEvent('updatedPriorityFiled');
            }).delay(500);
        },

        setRawValue: function (value) {
            var me = this,
                Array = Ext.Array,
                selectedStore, availableStore,
                isLocalMode = this.filterMode == 'local';

            value = Array.from(value);
            me.rawValue = value;

            if (me.rendered && me.selectedGrid) {
                selectedStore = me.selectedGrid.getStore();
                availableStore = me.availableGrid.getStore();

                // Move any selected values back to the fromField
                availableStore.add(selectedStore.getRange());
                selectedStore.removeAll();

                // Move the new values over to the toField
                var store, models = [], data;
                if (isLocalMode) {
                    store = this.store;
                    data = store.data.clone();
                }
                else {
                    store = availableStore;
                }
                Ext.Array.forEach(value, function (val) {
                    var id = (val.getId && Ext.isFunction(val.getId)) ? val.getId() : val.id || val;
                    if (me.availableIdProperty) {
//            id = val[me.availableIdProperty];
                        // if val is model record then use it data.
                        id = val.isModel ? val.data[me.availableIdProperty] : val[me.availableIdProperty];
                    }
                    var model = store.getById(id);

                    if (model) {
                        models.push(model);
                        if (data) {
                            var index = data.indexOf(model);
                            if (index !== -1) {
                                data.removeAt(index);
                            }
                        }
                    }
                });
                selectedStore.add(models);
                me.updateSelectedGridStatusBar(models.length);
                if (isLocalMode) {
                    var arr = [];
                    data.each(function (model) {
                        arr.push(model.data);
                    });
                    var proxy = availableStore.getProxy();
                    if (proxy.$className == 'Ext.ux.data.PagingMemoryProxy') {
                        proxy.data = arr;
                    }
                    else {
                        availableStore.setProxy(new Ext.ux.data.PagingMemoryProxy({data: arr}));
                        delete proxy;
                    }
                    availableStore.load({params: {start: 0, limit: 10}, initLoad: true});
                }
                else {
                    availableStore.remove(models);
                }
            }

            return value;
        },

        getRawValue: function () {
            var me = this,
                selectedGrid = me.selectedGrid,
                rawValue = me.rawValue;

            if (selectedGrid) {
                rawValue = Ext.Array.map(selectedGrid.getStore().getRange(), function (model) {
                    return model.data;
                });
            }

            me.rawValue = rawValue;
            return rawValue;
        },

        getCompleteValue: function () {
            var me = this,
                selectedGrid = me.selectedGrid,
                rawValue = me.rawValue;

            if (selectedGrid) {
                var store = selectedGrid.getStore();
                if (store.isFiltered()) {
                    if (store.clearLocalFilter) {
                        store.clearLocalFilter();
                    }
                    else
                        store.clearFilter();
                }
                rawValue = Ext.Array.map(store.getRange(), function (model) {
                    return model.data;
                });
            }

            me.rawValue = rawValue;
            return rawValue;
        },


        getSubmitValue: function () {
            return this.processRawValue(this.getCompleteValue());
        },

        getModelData: function () {
            var me = this,
                data = null;
            if (!me.disabled && !me.isFileUpload()) {
                data = {};
                data[me.getName()] = me.processRawValue(me.getCompleteValue());
            }
            return data;
        },

        // no conversion
        valueToRaw: function (value) {
            var models = [];

            if (value) {
                if (Ext.isArray(value)) {
                    Ext.Array.forEach(value, function (model) {
                        models.push(model);
                    });
                }
                if (Ext.isObject(value)) {
                    value.each(function (model) {
                        models.push(model);
                    });
                }
            }

            return models;
        },

        onDisable: function () {
            this.callParent();
            this.disabled = true;
            this.updateReadOnly();
        },

        onEnable: function () {
            this.callParent();
            this.disabled = false;
            this.updateReadOnly();
        },

        setReadOnly: function (readOnly) {
            this.readOnly = readOnly;
            this.updateReadOnly();
        },

        /**
         * @private Cascade readOnly/disabled state to the sub-fields and buttons
         */
        updateReadOnly: function () {
            var me = this,
                readOnly = me.readOnly || me.disabled;

            if (me.rendered) {
                if (me.selectedGrid)me.selectedGrid.setDisabled(readOnly);
                if (me.availableGrid)me.availableGrid.setDisabled(readOnly);
//        Ext.Array.forEach(me.innerCt.query('button'), function(button) {
//          button.setDisabled(readOnly);
//        });
            }
        },

        onAvailableDblClick: function (view, model) {
            var me = this;
            var selectedStore = this.selectedGrid.getStore(),
                availableStore = this.availableGrid.getStore();
            if (me.maxSelected) {
                var total = me.selectedStore.getCount() + 1;
                if (total > me.maxSelected) {
                    return false;
                }
            }
            availableStore.remove(model);
            selectedStore.add(model);
            this.selectedGrid.getSelectionModel().select(model);
            me.updatePriorityFiled();
        },

        onSelectedDblClick: function (view, model) {
            var me = this;
            var selectedStore = this.selectedGrid.getStore(),
                availableStore = this.availableGrid.getStore();
            availableStore.add(model);
            selectedStore.remove(model);
            this.availableGrid.getSelectionModel().select(model);
            me.updatePriorityFiled();
        },

        onDestroy: function () {
            var form = this.up('form');
            if (!this.readOnly) {
                this.mun(this.availableGrid, 'itemdblclick', this.onAvailableDblClick, this);
                this.mun(this.selectedGrid, 'itemdblclick', this.onSelectedDblClick, this);
            }

            if (form) {
                this.mon(form, 'resize', this.onFormResizeHandler, this);
            }
//      if(this.selectedGrid.getStore()){
//        this.selectedGrid.getStore().destroyStore();
//      }
//      if(this.availableGrid.getStore()){
//        this.availableGrid.getStore().destroyStore();
//      }
            Ext.destroy(this.selectedGrid, this.availableGrid);
            Ext.destroyMembers(this, 'innerCt');
            this.callParent();
        }
    }
);

