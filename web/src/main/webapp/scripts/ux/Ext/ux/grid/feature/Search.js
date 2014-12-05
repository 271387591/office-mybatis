/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-02
 * Time: 10:42 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.grid.feature.Search', {
      /* Begin Definitions */
      extend: 'Ext.grid.feature.Feature',
      alias: 'feature.search',

      uses: [
        'Ext.menu.Menu',
        'Ext.menu.CheckItem',
        'Ext.toolbar.Toolbar',

        'Ext.form.field.Trigger'
      ],

      /* End Definitions */
      floating: false,

      /**
       * @cfg {Boolean} autoReload
       * Defaults to true, reloading the datasource when a filter change happens.
       * Set this to false to prevent the datastore from being reloaded if there
       * are changes to the filters.  See <code>{@link updateBuffer}</code>.
       */
      autoReload: true,

      /**
       * @cfg {String} searchMode
       * Defaults to remote, use proxy query remote server data.
       * Set to local or other, use store filter implements query.
       */
      searchMode: 'remote',

      /**
       * @cfg {String} selectAllText
       * Text to display on menu select all
       */
      selectAllText: globalRes.selectAllText,//'Search All Columns',

      /**
       * @cfg {String} searchText
       * Text to display on menu button
       */
      searchText: 'Search',

      /**
       * @cfg {String} searchTipText
       * Text to display as input tooltip. Set to '' for no tooltip
       */
      searchTipText: 'Type a text to search and press Enter',

      /**
       * @cfg {String} position
       * Where to display the search controls. Valid values are top and bottom (defaults to bottom)
       * Corresponding toolbar has to exist at least with mimimum configuration tbar:[] for position:top or bbar:[]
       * for position bottom.
       */
      position: 'top',

      /**
       * @cfg {String} isAppend
       * Whether append the search controls to the end of the toolbar. (defaults to true)
       */
      isAppend: true,

      /**
       * @cfg {String} alone
       * Whether it would be display as a separated toolbar. Valid values are true. if there is no toolbar at that
       * position, a new toolbar would be created.
       */
      alone: false,

      /**
       * @cfg {String} iconCls
       * Icon class for menu button (defaults to icon-magnifier)
       */
      iconCls: 'icon-magnifier',

      /**
       * @cfg {String/Array} checkIndexes
       * Which indexes to check by default. Can be either 'all' for all indexes
       * or array of dataIndex names, e.g. ['persFirstName', 'persLastName']
       */
      checkIndexes: 'all',

      /**
       * @cfg {Array} disableIndexes
       * Array of index names to disable (not show in the menu), e.g. ['persTitle', 'persTitle2']
       */
      disableIndexes: [],

      /**
       * @cfg {Array} readonlyIndexes
       * Array of index names to disable (show in menu disabled), e.g. ['persTitle', 'persTitle2']
       */

      /**
       * @cfg {String} dateFormat
       * how to format date values. If undefined (the default)
       * date is formatted as configured in column model
       */
      dateFormat: undefined,

      /**
       * @cfg {Boolean} showSelectAll
       * Select All item is shown in menu if true (defaults to true)
       */
      showSelectAll: true,

      /**
       * @cfg {String} menuStyle
       * Valid values are 'checkbox' and 'radio'. If menuStyle is radio
       * then only one field can be searched at a time and selectAll is automatically switched off.
       */
      menuStyle: 'checkbox',

      /**
       * @cfg {Number} minChars
       * minimum characters to type before the request is made. If undefined (the default)
       * the trigger field shows magnifier icon and you need to click it or press enter for search to start. If it
       * is defined and greater than 0 then maginfier is not shown and search starts after minChars are typed.
       */

      /**
       * @cfg {String} minCharsTipText
       * Tooltip to display if minChars is > 0
       */
      minCharsTipText: 'Type at least {0} characters',

      /**
       * @cfg {Object} paramNames Params name map (defaults to {fields:'fields', query:'query'}
       */
      paramNames: {
        fields: 'fields',
        query: 'query'
      },
      /**
       * @cfg {String}
       * shortcutKey Key to fucus the input field (defaults to r = Sea_r_ch). Empty string disables shortcut
       */
      shortcutKey: 'r',

      /**
       * @cfg {String}
       * shortcutModifier Modifier for shortcutKey. Valid values: alt, ctrl, shift (defaults to alt)
       */
      shortcutModifier: 'alt',

      /**
       * @cfg {Integer} updateBuffer
       * Number of milliseconds to defer store updates since the last filter change.
       */
      updateBuffer: 500,

      // doesn't handle grid body events
      hasFeatureEvent: false,

      searchFieldWidth: 150,

      getDockedParent: function () {
        return null;
      },

      /** @private */
      constructor: function (config) {
        var me = this;

        config = config || {};
        Ext.apply(me, config);

//      me.deferredUpdate = Ext.create('Ext.util.DelayedTask', me.reload, me);

        // Init filters
        me.fields = [];
      },

      init: function (grid) {
        var me = this,
            view = me.view,
            store = view.getStore();

        me.store = store;

        if (grid.rendered) {
          // create search toolbar
          me.createSearch(grid);
        } else {
          me.mon(grid, 'afterrender', function () {
            // create search toolbar
            me.createSearch(grid);
          }, me)
        }

//      me.mon(view, 'refresh', me.onRefresh);
        me.mon(grid, 'beforedestroy', me.destroy, me);

        // Add event and filters shortcut on grid panel
//      grid.addEvents('searchupdate');
      },

      createSearch: function (grid) {
        var me = this;

        me.createMenu(grid);

        me.searchField = Ext.widget('trigger', {
              trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',

              trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
              width: me.searchFieldWidth,

              hasSearch: false,

              disabled: me.disabled,

              store: me.store,

              onTrigger1Click: function () {
                var store = this.store,
                    proxy = store.getProxy();

                if (this.hasSearch) {
                  this.setValue('');

                  if (me.listFields().length < 1)
                    return;

                  if (proxy && proxy.$className == 'Ext.ux.data.PagingMemoryProxy' && store.clearLocalFilter) {
                    store.clearLocalFilter();
                  }
                  else if (me.searchMode == 'remote') {
                    proxy.extraParams[me.paramNames.fields] = [];
                    proxy.extraParams[me.paramNames.query] = '';

                    store.loadPage(1, {
                      fromSearch: true
                    });

                    store['hasSearch'] = false;

                  } else {
                    store.clearFilter();
                  }
                  this.hasSearch = false;
                  this.triggerEl.item(0).setDisplayed('none');
                  me.trigger1None();
                  this.doComponentLayout();
                }
              },
              onTrigger2Click: function () {
                var store = this.store,
                    proxy = store.getProxy(),
                    v = this.getValue(),
                    value = !v ? v : Ext.String.trim('' + v);

                if (me.listFields().length < 1)
                  return;

                if (value.length < 1) {
                  this.onTrigger1Click();
                  return;
                }
                if (proxy && proxy.$className == 'Ext.ux.data.PagingMemoryProxy' && store.filterLocalBy) {
                  store.filterLocalBy({
                    filterFn: function (record) {
                      for (var i = 0; i < me.listFields().length; i++) {
                        var fieldValue = record.get(me.listFields()[i]);
                        var reg = new RegExp(value, 'gi');
                        if (reg.test(fieldValue)) {
                          return true;
                        }
                      }
                      return false;
                    }
                  });
                }
                else if (me.searchMode == 'remote') {
                  proxy.extraParams[me.paramNames.fields] = me.listFields();
                  proxy.extraParams[me.paramNames.query] = value;

                  store.loadPage(1, {
                    fromSearch: true
                  });

                  store['hasSearch'] = true;

                } else {
                  store.clearFilter();
                  store.filter(function (record) {
                    for (var i = 0; i < me.listFields().length; i++) {
                      var fieldValue = record.get(me.listFields()[i]);
                      var reg = new RegExp(value, 'gi');
                      if (reg.test(fieldValue)) {
                        return true;
                      }
                    }
                    return false;
                  });
                }

                this.hasSearch = true;
                this.triggerEl.item(0).setDisplayed('block');
                me.trigger1Block();
                this.doComponentLayout();
              },
              listeners: {
                afterrender: function () {
                  this.triggerEl.item(0).setDisplayed('none');
                  me.trigger1None();

                },
                specialkey: function (f, e) {
                  if (e.getKey() == e.ENTER) {
                    this.onTrigger2Click();
                  }
                }
              }
            }
        );


        if (me.alone) {
          me.createToolbar(grid);
        }
        else {
          var bars = me.getDockedParent(),
              menu = {
                text: me.searchText,
                menu: me.menu,
                iconCls: me.iconCls
              };
          if (bars) {
            bars.add(menu, me.searchField);
            return;
          }
          bars = grid.getDockedItems('toolbar[dock="' + me.position + '"]');
          if (bars && bars[0]) {
            var bar = bars[0];

            if (me.isAppend) {
              // append the control to the end
              // is there a splitter?
              var fill = bar.query('tbfill');
              if (fill && fill[0]) {
                // found fill, just add to the end
                bar.add(' ', '-', menu, me.searchField);
              }
              else {
                bar.add('->', '-', menu, me.searchField);
              }
            }
            else {
              // insert to head of the toolbar
              bar.insert(0, menu);
              bar.insert(1, me.searchField);
              bar.insert(2, ' ');
              bar.insert(3, '-');
            }
          }
          else {
            // not toolbar found for this position, create a new one
            me.createToolbar(grid);
          }
        }
      },

      trigger1Block: function () {
        var pNode = this.searchField.triggerEl.item(0).dom.parentNode;
        if (pNode && pNode != null) {
          pNode.style.width = 17;
        }
        delete pNode;
      },

      trigger1None: function () {
        var pNode = this.searchField.triggerEl.item(0).dom.parentNode;
        if (pNode && pNode != null) {
          pNode.style.width = 0;
        }
        delete pNode;
      },

      createMenu: function (grid) {
        var me = this,
            menu = me.menu = Ext.create('Ext.menu.Menu');

        // add Select All item plus separator
        if (this.showSelectAll && 'radio' !== this.menuStyle) {
          menu.add(Ext.create('Ext.menu.CheckItem', {
            text: me.selectAllText,
            checked: !(this.checkIndexes instanceof Array),
            hideOnClick: false,
            handler: function (item) {
              var checked = item.checked;
              item.parentMenu.items.each(function (i) {
                if (item !== i && i.setChecked && !i.disabled) {
                  i.setChecked(checked);
                }
              });
            }
          }), '-');
        }

        // add new items
        var columns = grid.headerCt.getGridColumns();
        var group = undefined;
        if ('radio' === this.menuStyle) {
          group = 'g' + (new Date).getTime();
        }
        Ext.each(columns, function (column) {
          var disable = false, config = column.initialConfig;
          if (config && config.header && config.dataIndex) {
            Ext.each(this.disableIndexes, function (item) {
              disable = disable ? disable : item === config.dataIndex;
            });
            if (!disable) {
              var me = this;
              menu.add(Ext.create('Ext.menu.CheckItem', {
                text: config.header,
                hideOnClick: false,
                group: group,
                checked: 'all' === this.checkIndexes,
                dataIndex: config.dataIndex,
                handler: function (item) {
                  var selAll, checked = item.checked;
                  item.parentMenu.items.each(function (i) {
                    if (i.setChecked && !i.disabled && i.text == me.selectAllText) {
                      selAll = i;
                    }
                    else if (item != i && i.setChecked && !i.disabled) {
                      checked = checked && i.checked;
                    }
                  });
                  if (selAll) {
                    selAll.setChecked(checked);
                  }
                }
              }));
            }
          }
        }, this);

        // check items
        if (this.checkIndexes instanceof Array) {
          Ext.each(this.checkIndexes, function (di) {
            var item = menu.items.find(function (itm) {
              return itm.dataIndex === di;
            });
            if (item) {
              item.setChecked(true, true);
            }
          }, this);
        }

        // disable items
        if (this.readonlyIndexes instanceof Array) {
          Ext.each(this.readonlyIndexes, function (di) {
            var item = menu.items.find(function (itm) {
              return itm.dataIndex === di;
            });
            if (item) {
              item.disable();
            }
          }, this);
        }
      },

      createToolbar: function (grid) {
        var me = this;
        grid.addDocked(Ext.create('Ext.toolbar.Toolbar', {
              dock: me.position,
              items: [
                {
                  text: me.searchText,
                  menu: me.menu,
                  iconCls: me.iconCls
                },
                me.searchField
              ]
            }
        ), me.alone ? 0 : undefined);
      },

      /**
       * @private Create the Filter objects for the current configuration, destroying any existing ones first.
       */
      listFields: function () {
        var me = this,
            fields = [];

        me.menu.items.each(function (item) {
          if (item.checked && item.dataIndex) {
            fields.push(item.dataIndex);
          }
        });

        return fields;
      },

      getSearchField: function () {
        return this.searchField;
      },

      /**
       * @private
       * Handler called by the grid 'beforedestroy' event
       */
      destroy: function () {
        if (!this.store) return;

        var me = this,
            store = me.store,
            proxy = store.getProxy();
        if (me.searchMode == 'remote') {
          delete proxy.extraParams[me.paramNames.fields];
          delete proxy.extraParams[me.paramNames.query];
        } else {
          store.clearFilter();
        }

        delete me.fields;
        Ext.destroyMembers(me, 'menu', 'searchField');
        me.clearListeners();
      }
    }
);