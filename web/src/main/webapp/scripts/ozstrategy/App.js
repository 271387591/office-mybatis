Ext.define('FlexCenter.App', {
  extend: 'Ext.ux.desktop.App',

  requires: [
    'Ext.window.MessageBox',
    'Ext.tip.QuickTipManager',
    'Ext.view.BoundList',
    'Ext.ux.desktop.ShortcutModel',
    'Ext.form.field.Text',
    'FlexCenter.UnitUserView',
    'FlexCenter.SystemBaseDataView',
    'FlexCenter.FlowFormManager',
    'FlexCenter.FlowManagerView',
    'Ext.util.Cookies',
    'FlexCenter.ChangePassword',
    'FlexCenter.Settings'
  ],

  constructor: function (config) {
    this.callParent(config);
    Ext.override(Ext.form.field.Text,{
      onBlur: function(){
        this.callOverridden();
        if(this.xtype==='textfield' && this.getValue() && this.getValue() != ''){
          this.setValue(Ext.String.trim(this.getValue()));
        }
      }
    });

    Ext.override(Ext.form.field.TextArea,{
      onBlur: function(){
        this.callOverridden();
        if(this.xtype==='textarea' && this.getValue() && this.getValue() != ''){
          this.setValue(Ext.String.trim(this.getValue()));
        }
      }
    });
  },

  init: function() {
    this.callParent();
  },

  getPlugin: function(name) {
    return this.plugins[name];
  },

  getModules:function () {
      var items=[];
      if(globalRes.isAdmin || (accessRes.showUserManager)){
          items.push(new FlexCenter.UnitUserView());
      }
      if(globalRes.isAdmin || (accessRes.showSystemDataManager)){
          items.push(new FlexCenter.SystemBaseDataView());
      }
      if(globalRes.isAdmin || (accessRes.showFlowFormManager)){
          items.push(new FlexCenter.FlowFormManager());
      }
      if(globalRes.isAdmin || (accessRes.showFlowManager)){
          items.push(new FlexCenter.FlowManagerView());
      }
      return items;
  },

  getDesktopConfig:function () {
    var me = this, ret = me.callParent(),shortcutDataArray = [];
      if((globalRes.isAdmin || accessRes.showUserManager)){
          shortcutDataArray.push({ name:userRoleRes.title, iconCls:'manageUser-shortcut', module:'unitUserView' });
      }
      if(globalRes.isAdmin || (accessRes.showSystemDataManager)){
          shortcutDataArray.push({ name:systemRes.managerTitle, iconCls:'globalType-shortcut', module:'systemBaseDataView' });
      }
      if(globalRes.isAdmin || (accessRes.showFlowFormManager)){
          shortcutDataArray.push({ name:flowFormRes.flowFormManager, iconCls:'form-manager', module:'flowFormManager' });
      }
      if(globalRes.isAdmin || (accessRes.showFlowManager)){
          shortcutDataArray.push({ name:workFlowRes.flowDefineManagerTitle,iconCls:'workflow-manager',module:'flowManagerView'});
      }
    return Ext.apply(ret, {
      //cls: 'ux-desktop-black',
//      contextMenuItems:[
//        { text:'改变设置', handler:me.onSettings, scope:me }
//      ],

      shortcuts:Ext.create('Ext.data.Store', {
        model:'Ext.ux.desktop.ShortcutModel',
        data:shortcutDataArray
      }),
      wallpaper:Ext.util.Cookies.get('FlexCenter_wallpaper') || basePath+'oz_wallpapers/desktop.jpg',
//      wallpaper:Ext.util.Cookies.get('FlexCenter_wallpaper') || 'wallpapers/../wallpapers/desktop.jpg',
      wallpaperStretch:false
    });
  },

  // config for the start menu
  getStartConfig : function() {
    var me = this, ret = me.callParent();

    return Ext.apply(ret, {
      title: globalRes.userFullName,
      iconCls: 'user',
      height: 300,
      toolConfig: {
        width: 150,
        items: [
          {
            text:userRoleRes.passwordTilte,
            iconCls:'user-edit',
            handler: me.onChangePassword,
            scope: me
          },
          {
            text:globalRes.changeBackground,
            iconCls:'settings',
            handler: me.onSettings,
            scope: me
          },
//          '-',
//          {
//            xtype: 'label',
//            text: '主题风格'
//          },
//          {
//            text: '默认',
//            themeValue: '',
//            textAlign: 'left',
//            iconCls: 'nonIcon',
//            handler: me.onSwapTheme
//          },
//          {
//            text: 'Gray',
//            themeValue: '-gray',
//            textAlign: 'left',
//            iconCls: 'nonIcon',
//            handler: me.onSwapTheme
//          },
//          {
//            text: 'Access',
//            themeValue: '-access',
//            textAlign: 'left',
//            iconCls: 'nonIcon',
//            handler: me.onSwapTheme
//          },
          '-',
          '->',
          {
            text:globalRes.title.logout,
            iconCls:'app-logout',
            handler: me.onLogout,
            scope: me
          }
        ]
      }
    });
  },
  getTaskbarConfig: function () {
    var ret = this.callParent(),me=this;
      var languageCombo = {
          xtype: 'combo',
//          typeAhead: true,
          triggerAction: 'all',
          editable: false,
          model: 'local',
          width: 100,
          valueField: 'type',
          displayField: 'displayText',
          store: Ext.create('Ext.data.ArrayStore', {
              fields: ['type', 'displayText'],
              data: [
                  ['zh_CN', '中文'],
                  ['en_US', 'English']
              ]
          }),
          listeners: {
              select: function (combo, record, index) {
                  me.chooseLocale(combo.getValue());
              },
              afterrender: function (combo) {
                  var locale = Ext.util.Cookies.get('locale');
                  if (locale) {
                      combo.setValue(locale);
                  } else {
                      combo.setValue('zh_CN');
                  }
              }
          }
      }
      var changeGraw={
          xtype: 'combo',
//          typeAhead: true,
          value:'classic',
          triggerAction: 'all',
          editable: false,
          model: 'local',
          width: 100,
          valueField: 'type',
          displayField: 'displayText',
          store: Ext.create('Ext.data.ArrayStore', {
              fields: ['type', 'displayText'],
              data: [
//                  ['-access','Accessibility'],
                  ['classic','缺省浅蓝'],
                  ['-gray','浅灰']
//                  ['-neptune','Neptune']
              ]
          }),
          listeners: {
              select: function (combo, record, index) {
                  var value=combo.getValue();
                  if(value){
                      var css=value=='classic'?extTheme:extTheme+value;
                      var cookie=value=='classic'?undefined:value;
                      var expires = new Date();
                      expires.setDate(expires.getDate() + 300);
                      setCookie("FlexCenter_Ext_Theme", cookie, expires, '', '', '')
                      Ext.util.CSS.swapStyleSheet("FlexCenter_Ext_Theme", css + ".css");

                  }
              },
              afterrender: function (combo) {
                  var locale = Ext.util.Cookies.get('FlexCenter_Ext_Theme');
                  if (locale!='undefined') {
                      combo.setValue(locale);
                  } else {
                      combo.setValue('classic');
                  }
              }
          }
      };

    return Ext.apply(ret, {
      startBtnText:globalRes.buttons.start,
      quickStart: [
//            { name: 'Accordion Window', iconCls: 'accordion', module: 'acc-win' },
//            { name: 'Grid Window', iconCls: 'icon-grid', module: 'grid-win' }
      ],
      trayItems: [
        { xtype: 'trayclock' },'-',
          languageCombo,'-',
          changeGraw
      ]
    });
  },
    chooseLocale: function (locale) {
        //set the server locale
        Ext.Ajax.request({
            url: 'resetLocaleController/resetLocale',
            params: {localeName: locale},
            success: function (response, opts) {
                Ext.util.Cookies.set('locale', locale);
                window.location.reload();
            },
            failure: function (response, opts) {
                Ext.Msg.show({
                    title: globalRes.title.resetLocale,
                    msg: globalRes.msg.resetLocaleFail,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    },
    

  onLogout: function () {

    Ext.MessageBox.show({
      title: globalRes.title.logout,
      msg : globalRes.msg.logout,
      width: 400,
      icon: Ext.MessageBox.QUESTION,
      buttons: Ext.MessageBox.YESNO,
      buttonText: {
        yes: globalRes.buttons.ok,
        no: globalRes.buttons.cancel
      },
      fn: function(btn){
        if(btn == 'yes'){
            isLogout=true;
          document.location.replace(globalRes.logoutUrl);
        }
      }
    });
  },

  onSettings: function () {
    var dlg = new FlexCenter.Settings({
      desktop: this.desktop
    });
    dlg.show();
  },
  onChangePassword:function(){
    var me = this;
    var change = Ext.widget('changepassword').show();
    change.setPasswordInfo(globalRes.userId, '');
    me.mon(change, 'doChangePassword', function(changeWin, userId, oldPass, newPass) {
      Ext.Ajax.request({
        url: 'userController.do?method=updatePassword',
        params: { userId: userId, oldPassword: oldPass ,newPassword:newPass },
        method: 'POST',
        success: function (response, options) {
        var result = Ext.decode(response.responseText);
          if (result.success) {
            Ext.MessageBox.show({
              title: userRoleRes.passwordTilte,
              width: 300,
              msg: result.message,
              buttons: Ext.MessageBox.OK,
              icon: Ext.MessageBox.INFO
            });
            changeWin.close();
          }
          else {
            Ext.MessageBox.show({
              title: userRoleRes.passwordTilte,
              width: 300,
              msg: result.message,
              buttons: Ext.MessageBox.OK,
              icon: Ext.MessageBox.ERROR
            });
          }
        },
        failure: function (response, options) {
          Ext.MessageBox.alert(globalRes.title.fail, Ext.String.format(globalRes.remoteTimeout,response.status));
        }
      });
    }, me);
  }

});

