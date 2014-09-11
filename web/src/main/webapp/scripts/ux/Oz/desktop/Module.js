/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-05
 * Time: 3:03 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.desktop.Module', {
    extend: 'Ext.ux.desktop.Module',

    uses: ['Ext.StoreManager'],

    models: [],
    stores: [],
    views: [],

    moduleName : '',

    onClassExtended: function(cls, data) {
      var className = Ext.getClassName(cls),
        match = className.match(/^(.*)\.controller\./);

      if (match !== null) {
        var namespace = Ext.Loader.getPrefix(className) || match[1],
          onBeforeClassCreated = data.onBeforeClassCreated,
          requires = [],
          modules = ['model', 'view', 'store'],
          prefix;

        data.onBeforeClassCreated = function(cls, data) {
          var i, ln, module,
            items, j, subLn, item;

          for (i = 0,ln = modules.length; i < ln; i++) {
            module = modules[i];

            items = Ext.Array.from(data[module + 's']);

            for (j = 0,subLn = items.length; j < subLn; j++) {
              item = items[j];

              prefix = Ext.Loader.getPrefix(item);

              if (prefix === '' || prefix === item) {
                requires.push(namespace + '.' + module + '.' + item);
              }
              else {
                requires.push(item);
              }
            }
          }

          Ext.require(requires, Ext.Function.pass(onBeforeClassCreated, arguments, this));
        };
      }
    },

    constructor: function (config) {
      var me = this;

      Ext.apply(me, config);

      me.callParent(arguments);

//      this.createGetters('model', this.models);
//      this.createGetters('store', this.stores);
//      this.createGetters('view', this.views);
    },

//    createGetters: function(type, refs) {
//      type = Ext.String.capitalize(type);
//      Ext.Array.each(refs, function(ref) {
//        var fn = 'get',
//          parts = ref.split('.');
//
//        // Handle namespaced class names. E.g. feed.Add becomes getFeedAddView etc.
//        Ext.Array.each(parts, function(part) {
//          fn += Ext.String.capitalize(part);
//        });
//        fn += type;
//
//        if (!this[fn]) {
//          this[fn] = Ext.Function.pass(this['get' + type], [ref], this);
//        }
//        // Execute it right away
//        this[fn](ref);
//      }, this);
//    },

    getModuleClassName: function(name, type) {
      var namespace = Ext.Loader.getPrefix(this.self.getName());
      if (namespace) {
        return this.moduleName == '' ? namespace + '.' + type + '.' + name : namespace + '.' + this.moduleName + "." + type + '.' + name;
      }
      else {
        return this.moduleName == '' ? type + '.' + name : this.moduleName + "." + type + '.' + name;
      }
    },

    getAppModuleClassName: function(name, type) {
      var namespace = Ext.Loader.getPrefix(this.self.getName());
      return namespace + '.'  + type + '.' + name;
    },

    getStore: function(name) {
      var store = Ext.StoreManager.get(name);

      if (!store) {
        store = Ext.create(this.getModuleClassName(name, 'store'), {
            storeId: name
          }
        );
      }

      return store;
    },

    getAppStore: function(name) {
      var store = Ext.StoreManager.get(name);

      if (!store) {
        store = Ext.create(this.getAppModuleClassName(name, 'store'), {
            storeId: name
          }
        );
      }

      return store;
    },

    getModel: function(model) {
      model = this.getModuleClassName(model, 'model');

      return Ext.ModelManager.getModel(model);
    },

    getView: function(view) {
      view = this.getModuleClassName(view, 'view');

      return Ext.ClassManager.get(view);
    }
  }
);