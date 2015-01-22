/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-10
 * Time: 4:18 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.form.ExtendMultiSelect', {
        extend: 'Ext.form.field.Base',

        alternateClassName: 'Oz.ux.ExtendMultiSelect',

        alias: ['widget.extendmultiselect', 'widget.extendmultiselectfield'],

        requires: [
            'Ext.panel.Panel',
            'Ext.grid.Panel',
            'Ext.data.Store',
            'Ext.data.StoreManager',
            'Ext.form.FieldSet',
            'Ext.ux.data.PagingMemoryProxy',
            'Oz.data.AvailableStore',
            'Ext.ux.statusbar.StatusBar',

            'Oz.layout.component.form.MultiSelect'
        ],

        gridCfg: {},
        firstAvailableCfg: null,
        secondAvailableCfg: null,
        selectedCfg: null,

        selectedViewCfg: null,
        firstAvailableViewCfg: null,
        secondAvailableViewCfg: null,

        availableIdProperty: null,
        selectedIdProperty: null,

        firstAvailableTitle: 'Available',
        secondAvailableTitle: 'Available',
        selectedTitle: 'Selected',

        columns: [],
        firstAvailableColumns: null,
        secondAvailableColumns: null,
        selectedColumns: null,

        maxSelected: null,
        selectedSorters: null,
        accountExportLayoutMode: false,

        pageSize: 10,
        filterMode: 'remote',

        firstAvailableStore: undefined,
        secondAvailableStore: undefined,
        selectedStore: undefined,
        priorityFiled: undefined,

        firstAvailableType: undefined,
        secondAvailableType:undefined,

        componentLayout: 'itemmultiselectfield',

        // private
        initComponent: function () {
            var me = this;

            if (me.firstAvailableCfg == null) {
                me.firstAvailableCfg = me.gridCfg;
            }

            if (me.secondAvailableCfg == null) {
                me.secondAvailableCfg = me.gridCfg;
            }
            if (me.selectedCfg == null) {
                me.selectedCfg = me.gridCfg;
            }

            if (me.firstAvailableColumns == null && me.columns != null) {
                me.firstAvailableColumns = me.columns;
            }

            if (me.secondAvailableColumns == null && me.columns != null) {
                me.secondAvailableColumns = me.columns;
            }

            if (me.selectedColumns == null && me.firstAvailableColumns != null) {
                me.selectedColumns = me.firstAvailableColumns;
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
                firstAvailableStoreCfg = {
                    sorters: me.firstAvailableStore ? (me.firstAvailableStore.sorters ? me.firstAvailableStore.sorters.items : null) : null,
                    model: me.firstAvailableStore.model
                },
                firstAvailableStore = Ext.create('Oz.data.AvailableStore',
                    Ext.applyIf(firstAvailableStoreCfg,
                        this.filterMode == 'local' ?
                        {
                            pageSize: this.pageSize,
                            reader: me.firstAvailableStore.reader,
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
//                'datachanged': function() {
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
                                        if (store.proxy.__data.length <= (store.currentPage - 1) * store.pageSize) {
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
                firstAvailableViewConfig = Ext.applyIf({
                    forceFit: true,
                    plugins: Ext.applyIf({
                        ptype: 'gridviewdragdrop',
                        enableDrag: !me.readOnly,
                        enableDrop: !me.readOnly,
                        onViewRender: Oz.Utils.onDragDropViewRender
                    }, me.enableSort ?
                    {ddGroup: 'availableGridDDGroup-' + me.id}
                        :
                    {
                        ddGroup: 'availableGridDDGroup-' + me.id,
                        dropGroup: 'selectedGridDDGroup-' + me.id
                    }),
                    listeners: {
                        beforedrop: function (node, data) {
                            var realData = [];
                            Ext.each(data.records, function(record){
                                if (record.get('type') == "agency") {
                                    record.set("priority",99999);
                                    realData.push(record);
                                }
                            });
                            if (realData.length > 0) {
                                data.records = realData;
                                return true;
                            } else {
                                return false;
                            }
                        },
                        drop: function (n, d, m, dp) {
                            me.updatePriorityFiled();
                        }
                    }
                }, me.firstAvailableViewCfg),
                secondAvailableStoreCfg = {
                    sorters: me.secondAvailableStore ? (me.secondAvailableStore.sorters ? me.secondAvailableStore.sorters.items : null) : null,
                    model: me.secondAvailableStore.model
                },
                secondAvailableStore = Ext.create('Oz.data.AvailableStore',
                    Ext.applyIf(secondAvailableStoreCfg,
                        this.filterMode == 'local' ?
                        {
                            pageSize: this.pageSize,
                            reader: me.secondAvailableStore.reader,
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
//                'datachanged': function() {
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
                                        if (store.proxy.__data.length <= (store.currentPage - 1) * store.pageSize) {
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
                                            if (d[ip] == obj[ip] ) {
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
                secondAvailableViewConfig = Ext.applyIf({
                    forceFit: true,
                    plugins: Ext.applyIf({
                        ptype: 'gridviewdragdrop',
                        enableDrag: !me.readOnly,
                        enableDrop: !me.readOnly,
                        onViewRender: Oz.Utils.onDragDropViewRender
                    }, me.enableSort ?
                    {ddGroup: 'availableGridDDGroup-' + me.id}
                        :
                    {
                        ddGroup: 'availableGridDDGroup-' + me.id,
                        dropGroup: 'selectedGridDDGroup-' + me.id
                    }),
                    listeners: {
                        beforedrop: function (node, data) {
                            var realData = [];
                            Ext.each(data.records, function(record){
                                if (record.get('type') == "agent") {
                                    record.set("priority",99999);
                                    realData.push(record);
                                }
                            });
                            if (realData.length > 0) {
                                data.records = realData;
                                return true;
                            } else {
                                return false;
                            }
                        }, 
                        drop: function (n, d, m, dp) {
                            me.updatePriorityFiled();
                        }
                    }
                }, me.secondAvailableViewCfg),
                selectedViewCfg = Ext.applyIf({
                    forceFit: true,
                    plugins: Ext.applyIf({
                        ptype: 'gridviewdragdrop',
                        enableDrag: !me.readOnly,
                        enableDrop: !me.readOnly,
                        onViewRender: Oz.Utils.onSelfDragDropViewRender
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
                        drop: function (n, d, m, dp) {
                            if (me.priorityFiled) {
                                var records = this.store.getRange();
                                for (var i = 0; i < records.length; i++) {
                                    var rec = records[i];
                                    rec.set(me.priorityFiled, i + 1);
                                }
                            }

                            me.fireEvent('updatedPriorityFiled');

                            this.store.sort(me.selectedSorters ? me.selectedSorters : firstAvailableStore.sorters);
                        }
                    }
                }, me.selectedViewCfg),
                commonConfig = {
                    multiSelect: true,
                    stripeRows: true,
                    autoDestroy: true,
                    flex: 1
                },
                firstAvailableConfig = Ext.apply({
                    title: me.firstAvailableTitle,
                    height: '200',
                    width: '400',
                    itemId: 'agency',
                    viewConfig: firstAvailableViewConfig,
                    store: firstAvailableStore,
                    margins: '0 5 0 0',
                    autoScroll: true,
                    forceFit: true,
                    columns: me.firstAvailableColumns,

                    // paging bar on the bottom
                    bbar: Ext.create('Ext.toolbar.Paging', {
                        //pageSize: 10,
                        store: firstAvailableStore,
                        displayMsg: '{0} - {1} of {2}',
                        displayInfo: true
                    })
                }, me.firstAvailableCfg, commonConfig),
                secondAvailableConfig = Ext.apply({
                    title: me.secondAvailableTitle,
                    height: '200',
                    width: '400',
                    itemId: 'agent',
                    viewConfig: secondAvailableViewConfig,
                    store: secondAvailableStore,
                    margins: '0 5 0 0',
                    autoScroll: true,
                    forceFit: true,
                    columns: me.secondAvailableColumns,

                    // paging bar on the bottom
                    bbar: Ext.create('Ext.toolbar.Paging', {
                        //pageSize: 10,
                        store: secondAvailableStore,
                        displayMsg: '{0} - {1} of {2}',
                        displayInfo: true
                    })
                }, me.secondAvailableCfg, commonConfig);

            if (me.selectedViewCfg && me.selectedViewCfg.listeners && me.selectedViewCfg.listeners != null) {
                for (var event in me.selectedViewCfg.listeners) {
                    if (event && me.selectedViewCfg.listeners[event]) {
                        selectedViewCfg.listeners[event] = me.selectedViewCfg.listeners[event];
                    }
                }
            }

            if (!me.selectedStore) {
                me.selectedStore = Ext.create('Ext.data.Store', {
                    model: me.firstAvailableStore.model,
                    sorters: me.selectedSorters ? me.selectedSorters : me.firstAvailableStore.sorters,
                    listeners: {
                        add: function (store) {
                            me.updateSelectedGridStatusBar(store.getCount());
                        },
                        remove: function (store) {
                            me.updateSelectedGridStatusBar(store.getCount());
                        }
                    }
                })
            }

            var selectedConfig = Ext.apply({
                    title: me.selectedTitle,
                    height: '400',
                    width: '400',
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
                }, me.selectedCfg, commonConfig),
                firstAvailableGrid = Ext.widget('grid', firstAvailableConfig),
                secondAvailableGrid = Ext.widget('grid', secondAvailableConfig),
                selectedGrid = Ext.widget('grid', selectedConfig),
                innerCt,
                buttons = [];
            me.callParent(arguments);
            if (!Ext.isIE) {
                me.el.mask('rendering...');
            }


            me.firstAvailableGrid = firstAvailableGrid;
            me.secondAvailableGrid = secondAvailableGrid;
            me.selectedGrid = selectedGrid;

            if (!me.readOnly) {
                me.mon(me.firstAvailableGrid, 'itemdblclick', this.onFirstAvailableDblClick, this);
                me.mon(me.secondAvailableGrid, 'itemdblclick', this.onSecondAvailableDblClick, this);
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
                me.firstAvailableGrid.setHeight(180);
                me.firstAvailableGrid.setWidth(400);
                me.secondAvailableGrid.setHeight(180);
                me.secondAvailableGrid.setWidth(400);
                me.selectedGrid.setHeight(360);
                me.selectedGrid.setWidth(400);
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
                firstAvailableGrid = me.firstAvailableGrid,
                secondAvailableGrid = me.secondAvailableGrid,
                selectedGrid = me.selectedGrid,
                firstAvailableStore = firstAvailableGrid.getStore(),
                secondAvailableStore = secondAvailableGrid.getStore(),
                selectedStore = selectedGrid.getStore(), models=[],firstAvailableModels = [],secondAvailableModels = [];
            if (selectedGrid) {
                selectedGrid.rowspan = '2';
                // Clear both field stores
                selectedStore.removeAll();
                firstAvailableStore.removeAll();
                secondAvailableStore.removeAll();
                // Clone the contents of the main store into the fromField
                if (this.filterMode == 'local') {
                    me.firstAvailableStore.each(function (model) {
                        firstAvailableModels.push(model.data);
                    });

                    me.secondAvailableStore.each(function (model) {
                        secondAvailableModels.push(model.data);
                    });
                    var proxy = firstAvailableStore.getProxy();
                    firstAvailableStore.setProxy(new Ext.ux.data.PagingMemoryProxy({data: firstAvailableModels, store: firstAvailableStore}));
                    firstAvailableStore.load({params: {start: 0, limit: me.pageSize}, initLoad: true});
                    secondAvailableStore.setProxy(new Ext.ux.data.PagingMemoryProxy({data: secondAvailableModels, store: secondAvailableStore}));
                    secondAvailableStore.load({params: {start: 0, limit: me.pageSize}, initLoad: true});
                    delete proxy;
                }
                else {
                    me.store.each(function (model) {
                        models.push(model.copy(model.getId()));
                    });
                    firstAvailableStore.add(models);
                    secondAvailableStore.add(models);
                }
            }

            Ext.Function.defer(
                function () {
                    var innerCt = me.innerCt = Ext.create('Ext.panel.Panel', {
                        renderTo: me.bodyEl,
                        frame: true,
                        style: 'border:none;',
                        layout: {
                            type: 'table',
                            columns: 3
//              pack: 'start',
//              align: 'stretch'
                        },
                        items: [ firstAvailableGrid,
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
                                            var selModel = firstAvailableGrid.getSelectionModel();
                                            if (selModel.hasSelection()) {
                                                var records = selModel.getSelection();

                                                if (me.maxSelected && records) {
                                                    var total = me.selectedStore.getCount() + records.length;
                                                    if (total > me.maxSelected) {
                                                        return false;
                                                    }
                                                }

                                                selectedStore.add(records);
                                                firstAvailableStore.remove(records);
                                                firstAvailableStore.sort(firstAvailableStore.sorters);
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
                                                    records = firstAvailableStore.getRange(0, endIndex);
                                                }
                                            } else {
                                                records = firstAvailableStore.getRange();
                                            }

                                            if (records) {
                                                selectedStore.add(records);
                                                firstAvailableStore.remove(records);
                                                firstAvailableStore.sort(firstAvailableStore.sorters);
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
                                            var tmpRecords = [];
                                            Ext.each(records, function (record) {
                                                var type = record.get('type');
                                                if (type == 'agency') {
                                                    record.set("priority",99999);
                                                    tmpRecords.push(record);
                                                }
                                            });
                                                firstAvailableStore.add(tmpRecords);
                                                selectedStore.remove(tmpRecords);
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
                                                if(records.get('type' == 'agency')){
                                                    records.set("priority",99999);
                                                    firstAvailableStore.add(records);
                                                    selectedStore.remove(records);
                                                    me.updatePriorityFiled();
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            selectedGrid,
                            secondAvailableGrid, {
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
                                            var selModel = secondAvailableGrid.getSelectionModel();
                                            if (selModel.hasSelection()) {
                                                var records = selModel.getSelection();

                                                if (me.maxSelected && records) {
                                                    var total = me.selectedStore.getCount() + records.length;
                                                    if (total > me.maxSelected) {
                                                        return false;
                                                    }
                                                }

                                                selectedStore.add(records);
                                                secondAvailableStore.remove(records);
                                                secondAvailableStore.sort(secondAvailableStore.sorters);
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
                                                    records = secondAvailableStore.getRange(0, endIndex);
                                                }
                                            } else {
                                                records = secondAvailableStore.getRange();
                                            }

                                            if (records) {
                                                selectedStore.add(records);
                                                secondAvailableStore.remove(records);
                                                secondAvailableStore.sort(secondAvailableStore.sorters);
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
                                            var tmpRecords = [];
                                            Ext.each(records, function (record) {
                                                var type = record.get('type');
                                                if (type == 'agent') {
                                                    record.set("priority",99999);
                                                    tmpRecords.push(record);
                                                }
                                            });
                                            secondAvailableStore.add(tmpRecords);
                                            selectedStore.remove(tmpRecords);
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
                                                if(records.get('type') == "agent")
                                                {
                                                records.set("priority",99999);
                                                secondAvailableStore.add(records);
                                                selectedStore.remove(records);
                                                me.updatePriorityFiled();
                                                }
                                            }
                                        }
                                    }
                                ]
                            }]
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

                        if (me.accountExportLayoutMode) {
                            model.set('displayOrder', val['displayOrder']);
                            model.set('format', val['format']);
                            model.set('formatId', val['formatId']);

                            model.beginEdit();
                            model.dirty = false;
                            model.editing = false;
                            model.modified = {};
                            model.endEdit();
                        }

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
                if (me.firstAvailableGrid)me.firstAvailableGrid.setDisabled(readOnly);
                if (me.secondAvailableGrid)me.secondAvailableGrid.setDisabled(readOnly);
//        Ext.Array.forEach(me.innerCt.query('button'), function(button) {
//          button.setDisabled(readOnly);
//        });
            }
        },

        onFirstAvailableDblClick: function (view, model) {
            var me = this;
            var selectedStore = this.selectedGrid.getStore(),
                firstAvailableStore = this.firstAvailableGrid.getStore();
            if (me.maxSelected) {
                var total = me.selectedStore.getCount() + 1;
                if (total > me.maxSelected) {
                    return false;
                }
            }
            firstAvailableStore.remove(model);
            selectedStore.add(model);
            this.firstAvailableGrid.getSelectionModel().select(model);
            me.updatePriorityFiled();
        },
        onSecondAvailableDblClick: function (view, model) {
            var me = this;
            var selectedStore = this.selectedGrid.getStore(),
                secondAvailableStore = this.secondAvailableGrid.getStore();
            if (me.maxSelected) {
                var total = me.selectedStore.getCount() + 1;
                if (total > me.maxSelected) {
                    return false;
                }
            }
            secondAvailableStore.remove(model);
            selectedStore.add(model);
            this.selectedGrid.getSelectionModel().select(model);
            me.updatePriorityFiled();
        },

        onSelectedDblClick: function (view, model) {
            var me = this;
            var selectedStore = this.selectedGrid.getStore(),
                firstAvailableStore = this.firstAvailableGrid.getStore(),
                secondAvailableStore = this.secondAvailableGrid.getStore();
                 model.set("priority",99999);
                if(model.get('type') == "agent"){
                    secondAvailableStore.add(model);
                }else{
                    firstAvailableStore.add(model); 
                }
                selectedStore.remove(model);
            this.selectedGrid.getSelectionModel().select(model);
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