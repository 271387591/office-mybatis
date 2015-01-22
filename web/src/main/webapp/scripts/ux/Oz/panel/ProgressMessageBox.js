/**
 * Created by .
 * User: kangpan
 * Date: 25/11/11
 * Time: 10:37 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.panel.ProgressMessageBox', {
  extend:'Ext.window.Window',
  alias: 'widget.progressmsg',

  width: 400,
  height: 300,
  intervals: 1000,

  total: 0,
  current: 0,

  onEsc: Ext.emptyFn,
  closable: false,

  requires: [
    'Ext.ProgressBar',
    'Ext.form.FieldSet'
  ],

  initComponent: function() {
    var me = this;
    Ext.applyIf(this, {
      layout: 'fit',
      frame: true,
      bodyStyle:'padding: 15px',
      items:{
        xytpe: 'panel',
        layout: 'border',
            border: false,
        items: [
          {
            xytpe: 'panel',
            border: false,
//            frame: true,
            region: 'north',
            height: 20,
            items: [
              {
                xtype:'progressbar',
                text:'Initializing...',
                listeners: {
                  'afterrender': function() {
                    me.progress = this;
                  }
                }
              },
              {
                frame: true,
                html: ''
              }
            ]
          },
          {
            xtype: 'panel',
            region: 'center',
            layout: 'fit',
            margins: '10 0 0 0',

            frame: true,
            items: [
              {
                xtype:'panel',
                region: 'center',
                title: 'Details',
                defaultType: 'panel',
                autoScroll: true,

                items: [
                  {
                    border: false,
                    html:"Preparing...."
                  }
                ],
                listeners: {
                  'afterrender': function() {
                    me.msgbox = this;
                  }
                }
              }
            ]
          }
        ]
      }
    });
    this.callParent(arguments);
  },
  updateProgress: function(i, total, message) {
    this.progress.updateProgress((i + 1) / total, (i + 1) + ' of ' + total + ' Completed...');
    this.msgbox.add({
      border: false,
      html:message
    });
    this.msgbox.doLayout();
    this.msgbox.body.scroll('bottom',this.msgbox.body.getHeight());
  }
});
