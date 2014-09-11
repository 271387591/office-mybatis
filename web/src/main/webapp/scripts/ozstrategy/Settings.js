/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('FlexCenter.Settings', {
    extend: 'Ext.window.Window',

    uses: [
      'Ext.tree.Panel',
      'Ext.tree.View',
      'Ext.form.field.Checkbox',
      'Ext.layout.container.Anchor',
      'Ext.layout.container.Border',

      'Ext.ux.desktop.Wallpaper',

      'FlexCenter.model.WallpaperModel'
    ],

    layout: 'anchor',
    title: '设置背景',
    modal: true,
    width: 640,
    height: 480,
    border: false,
    resizable: false,
    maximizable:false,

    initComponent: function () {
      var me = this;

      me.selected = me.desktop.getWallpaper();
      me.stretch = me.desktop.wallpaper.stretch;

      me.preview = Ext.create('widget.wallpaper');
      me.preview.setWallpaper(me.selected);
      me.tree = me.createTree();

      me.buttons = [
        { text: '确定', handler: me.onOK, scope: me },
        { text: '取消', handler: me.close, scope: me }
      ];

      me.items = [{
        anchor: '0 -1',
        border: false,
        layout: 'border',
        items: [
          me.tree,
          {
            xtype: 'panel',
            title: '预览',
            region: 'center',
            layout: 'fit',
            items: [ me.preview ]
          }
        ]
      }

//        , {
//        xtype: 'checkbox',
//        boxLabel: 'Stretch to fit',
//        checked: me.stretch,
//        listeners: {
//          change: function (comp) {
//            me.stretch = comp.checked;
//          }
//        }
//      }
      ];

      me.callParent();
    },

    createTree : function() {
      var me = this;

      function child (text,img) {
        return { img: img, text: text, iconCls: '', leaf: true };
      }

      var tree = new Ext.tree.Panel({
          title: '桌面背景',
          rootVisible: false,
          lines: false,
          autoScroll: true,
          width: 150,
          region: 'west',
          split: true,
          minWidth: 100,
          listeners: {
            afterrender: { fn: this.setInitialSelection, delay: 100 },
            select: this.onSelect,
            scope: this
          },
          store: Ext.create('Ext.data.TreeStore', {
              model: 'FlexCenter.model.WallpaperModel',
              root: {
                text:'Wallpaper',
                expanded: true,
                children:[
                  { text: "无", iconCls: '', leaf: true },
                  child('深蓝',basePath+'oz_wallpapers/Blue-Sencha.jpg'),
                  child('黑色',basePath+'oz_wallpapers/Dark-Sencha.jpg'),
                  child('木纹',basePath+'oz_wallpapers/Wood-Sencha.jpg'),
//                  child('浅蓝','blue.jpg'),
                  child('蓝色',basePath+'oz_wallpapers/desk.jpg'),
                  child('浅蓝',basePath+'oz_wallpapers/desktop.jpg'),
//                  child('desktop2.jpg'),
                  child('天空',basePath+'oz_wallpapers/sky.jpg')
                ]
              }
            })
        });

      return tree;
    },

    getTextOfWallpaper: function (path) {
      var text = path, slash = path.lastIndexOf('/');
      if (slash >= 0) {
        text = text.substring(slash+1);
      }
      var dot = text.lastIndexOf('.');
      text = Ext.String.capitalize(text.substring(0, dot));
      text = text.replace(/[-]/g, ' ');
      return text;
    },

    onOK: function () {
      var me = this;
      if (me.selected) {
        me.desktop.setWallpaper(me.selected, me.stretch);
      }
      me.destroy();
    },

    onSelect: function (tree, record) {
      var me = this;

      if (record.data.img) {
        me.selected = record.data.img;
      } else {
        me.selected = Ext.BLANK_IMAGE_URL;
      }
      me.preview.setWallpaper(me.selected);
    },

    setInitialSelection: function () {
      var s = this.desktop.getWallpaper();
      if (s) {
        var path = '/Wallpaper/' + this.getTextOfWallpaper(s);
        this.tree.selectPath(path, 'text');
      }
    }
  });
