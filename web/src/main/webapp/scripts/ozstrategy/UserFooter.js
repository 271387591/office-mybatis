Ext.define('FlexCenter.UserFooter', {
  extend: 'Ext.Toolbar',
  alias: 'widget.userFooter',
  requires: [
    'Ext.ux.window.Notification'
  ],
  initComponent: function () {
    var me = this;
    Ext.apply(this, {
      region: "south",
      height: 28,
      items: [
        {
          xtype: 'button',
          text: '退出登录',
          iconCls: 'logout',
          margin: '0 10 0 5',
          handler: me.onLogout
        },
        {
          id: 'messageTip',
          xtype: 'button',
          hidden: true,
          autoWidth: true,
          height: 20,
          handler: function () {
            var centerTabPanel = me.ownerCt.down('#centerPanel');
            centerTabPanel.addPanel('messageView','messageView');
          }
        },
        '->',
        {
          xtype: 'label',
          text: globalRes.copyrightInfo,
          margins: '0 300 0 0'
        },
        {
          xtype: 'button',
          text: '与我们联系',
          margins: '0 5 0 0',
          iconCls: 'icon-phone',
          handler: function () {
            Ext.create('widget.uxNotification', {
              title: '联系我们',
              position: 'b',
              manager: 'instructions',
//                    cls: 'ux-notification-window',
              stickWhileHover: false,
              height: 120,
              width: 220,
              html: globalRes.instructions,
              autoCloseDelay: 2000,
              slideInDuration: 500,
              slideBackDuration: 200
//                    ,
//                    slideBackDuration: 500
//                    ,
//                    slideInAnimation: 'bounceOut',
//                    slideBackAnimation: 'easeIn'
            }).show();
          }
        },
        '-',
        {
          margins: '0 5 0 5',
          xtype: 'combo',
          mode: 'local',
          editable: false,
          value: '切换皮肤',
          width: 100,
          triggerAction: 'all',
          store: [
            ['ext-all', '缺省浅蓝'],
            ['ext-all-gray', '浅灰']
          ],
          listeners: {
            scope: this,
            'select': function (combo, record, index) {
              if (combo.value != '') {
                var expires = new Date();
                expires.setDate(expires.getDate() + 300);
                setCookie("OzSOA-Ext-Theme", combo.value, expires, '', '', '')
                Ext.util.CSS.swapStyleSheet("OzSOA-Ext-Theme", extTheme + combo.value + ".css");
              }
            }
          }
        }
      ],
      listeners: {
        'afterrender': function () {
//          me.loadNewMessage();
//          var runner = new Ext.util.TaskRunner();
//          runner.start({
//            run: me.loadNewMessage,
//            interval: 1000 * 60
//          })
        }
      }
    });
    this.callParent(arguments);
  },
  loadNewMessage: function () {
    Ext.Ajax.request({
      url: 'messageController.do?method=countUnReadMessage',
      method: 'POST',
      success: function (response, options) {
        var count = Ext.decode(response.responseText);
        var megBtn = Ext.getCmp('messageTip');
        if (count > 0) {
          megBtn.setText('<div style="height:25px;"><img src="images/newpm.gif" style="height:12px;"/>你有<strong style="color: red;">' + count + '</strong>条未读信息</div>');
          megBtn.show();
        } else {
          megBtn.hide();
        }
      },
      failure: function (response, options) {
      },
      scope: this
    })
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
      fn: function (btn) {
        if (btn == 'yes') {
          isLogout = true;
          document.location.replace(globalRes.logoutUrl);
        }
      }
    });
  }
}); 
