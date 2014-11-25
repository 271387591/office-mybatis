Ext.define('Oz.LoginWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.loginwindow',
    requires: 'Ext.form.*',

    bodyStyle: 'padding:5px;',
    title: loginRes.appsName,
    iconCls: 'icon-login',

    layout: 'fit',
    plain: true,
//  modal: true,
    width: 400,
//    height: 310,
    autoHeight: true,
    closable: false,
    resizable: false,
    closeAction: 'hide',
    defaultFocus:'username',
    loginError:undefined,

    config: {
      title: 'Login Window'
    },
    items: [
      {
      xtype: 'form',
      id: 'login-form',
      baseCls: 'x-plain',
      border: false,
      bodyStyle: {
        padding: '5px'
      },

      url: loginRes.formAction,
      standardSubmit: true,

      items: [{
        xtype: 'fieldset',
        title: Ext.Date.format(new Date(), 'Y-d-m - H:i l'),
        autoHeight: true,
        html: loginRes.picture
      }, {
        xtype: 'fieldset',
        title: loginRes.title,
        defaultType: 'textfield',
        defaults: {
          anchor: '100%',
          allowBlank: false
        },
        autoHeight: true,
        items: [{
          fieldLabel: loginRes.username,
          name: 'j_username',
          tabIndex : 1,
          id: 'username',
          allowBlank: false
        }, {
          fieldLabel: loginRes.password,
          name: 'j_password',
          tabIndex : 2,
          inputType: 'password',
          allowBlank: false,
          minLength: 5
        }]
      }]
    }
    ],

    focus: function() {
      this.down('#username').focus();
    },

    onWinShow : function(win){
      if (this.loginError) {
        Ext.MessageBox.show({
          title: loginRes.errorTitle,
          width: 400,
          modal: true,
          scope:this,
          msg: this.loginError,
          buttons: Ext.MessageBox.OK,
          icon: Ext.MessageBox.ERROR,
          fn: function() {
            this.focus();

            var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
              scope: this,
              enter: function(){
                this.doLogin();
              }
            });
          }
        });
      }
    },

    doLogin: function(){
      if (this.form.isValid()) {
        this.form.submit({
            success: function(form, action) {
//              document.location = loginRes.mainUrl;
//              document.location.replace(loginRes.mainUrl);
            },
            failure: function(form, action) {
              Ext.Msg.alert('Failed', action.result.msg);
            }
          });
      }
    },

    doReset: function(){
      this.form.reset();
    },

    initComponent: function() {
      this.dockedItems = [{
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        layout: {
          pack: 'center'
        },
        items: [{
          minWidth: 80,
          tabIndex : 3,
          text: loginRes.login,
          handler: function() {
            this.doLogin();
          },
          scope: this
        },{
          minWidth: 80,
          tabIndex : 4,
          text: loginRes.reset,
          handler: function() {
            this.doReset();
          },
          scope: this
        }]
      }];
      Ext.apply(this,{
        listeners:{
          'show': this.onWinShow
        }
      });

      this.callParent(arguments);

      this.form = this.getComponent('login-form').getForm();

      if (!this.loginError) {
        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
          scope: this,
          enter: function(){
            this.doLogin();
          }
        });
      }
    }
  }
);
