Ext.define('FlexCenter.UserHeader', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.userHeader',
  initComponent: function () {
    var me = this;
    Ext.apply(this, {
      border: false,
      layout: 'anchor',
      region: 'north',
      items: [
        {
          xtype: 'toolbar',
              height: 37,
          items: [
            {
              xtype: 'label',
              html:'logo'
            },
            {
              xtype: 'label',
              html: '办公自动化系统',
              style: 'font-size:16px;'
            },
            '->',
            {
              xtype: 'label',
              id: 'head-lb-1',
              cls: 'welcome',
              style: 'font-size:12px',
              text: globalRes.welcome
            },
              {
                  text:globalRes.userFullName,
                  style: 'font-size:12px',
                  menu: {
                      xtype: 'menu',
                      plain: true,
                      items: {
                          xtype: 'buttongroup',
                          columns: 2,
                          defaults: {
                              xtype: 'button',
//                              scale: 'large',
                              iconAlign: 'left'
                          },
                          items: [
                              {
                                  colspan: 2,
                                  iconCls:'user-edit',
                                  text: userRoleRes.editUserProfile,
                                  scale: 'small',
                                  width: 130
                              },
                              {
                                  colspan: 2,
                                  iconCls:'logout',
                                  text: globalRes.buttons.logout,
                                  scale: 'small',
                                  width: 130,
                                  handler:me.onLogout
                              }
                          ]
                      }
                  }
            },
              
            '-',
            {
              xtype: 'label',
              id: 'head-lb-3',
              cls: 'welcome',
              style: 'font-size:12px',
              text: globalRes.welcomeToday +this.getToday()
            }
          ]
        }
      ]
    });
    this.callParent(arguments);
  },
    onLogout: function () {

        Ext.MessageBox.show({
            title: globalRes.title.logout,
            msg : globalRes.userFullName+'：'+globalRes.msg.logout,
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

  getToday:function(){
    var today = new Date();
    var date = Ext.Date.format(today, 'Y年m月d日');
    var week = Ext.Date.format(today, 'w');
    var weekArray = new Array("日","一","二","三","四","五","六");
    return date +' 星期'+weekArray[week];
  }
});
