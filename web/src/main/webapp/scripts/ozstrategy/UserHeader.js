Ext.define('FlexCenter.UserHeader', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.userHeader',
  requires : [
    'FlexCenter.UserToolbar'
  ],
  initComponent: function () {
    var me = this;
    Ext.apply(this, {
      border: false,
      layout: 'anchor',
      region: 'north',
      height: 25,
      items: [
        {
          id: 'header-top',
          xtype: 'toolbar',
//          margin: '0 0 1 0',
//          anchor: 'none -43',
          items: [
            {
              xtype: 'label',
              html:'logo'
            },
            {
              xtype: 'label',
              html: '办公自动化系统',
              style: 'font-size:16px;',
            },
            '->',
            {
              xtype: 'label',
              iconCls: 'grid-add',
              id: 'head-lb-1',
              cls: 'welcome',
              style: 'font-size:12px',
              text: '欢迎您, '+globalRes.userFullName
            },
            '-',
            {
              xtype: 'label',
              id: 'head-lb-3',
              cls: 'welcome',
              style: 'font-size:12px',
              text: '今天是：' +this.getToday()
            }
          ]
        }
      ]
    });
    this.callParent(arguments);
  },

  getToday:function(){
    var today = new Date();
    var date = Ext.Date.format(today, 'Y年m月d日');
    var week = Ext.Date.format(today, 'w');
      console.log(week)
    var weekArray = new Array("日","一","二","三","四","五","六");
    return date +' 星期'+weekArray[week];
  }
});
