/**
 * Created by IntelliJ IDEA.
 * User: yongliu
 * Date: 3/21/12
 * Time: 5:48 PM
 * To change this template use File | Settings | File Templates.
 */


Ext.define('FlexCenter.UnitUserView', {
  extend:'Oz.desktop.Module',

  requires:[
    'FlexCenter.user.view.UserView',
    'FlexCenter.user.view.RoleView',
      'FlexCenter.user.view.FeatureView',
    'Ext.grid.*',
    'Ext.data.*',
      'Oz.access.RoleAccess'
  ],

  id:'unitUserView',
  moduleName:'unitUserView',

  init:function () {
    this.launcher = {
      text:userRoleRes.title,
      iconCls:'user-man16',
      handler:this.createWindow,
      scope:this
    };
  },

  createWindow:function () {
    var desktop = this.app.getDesktop(), win;
//    console.log(globalRes);

    win = desktop.getWindow('myUnitUserView');
    if (!win) {
      win = desktop.createWindow({
        id:'myUnitUserView',
        title:userRoleRes.title,
//        iconCls:'user',
        width:850,
        height:500,
        shim:false,
//        modal:true,
        border:false,
        resizable: false,
        maximizable:false,
        layout:'fit',
        items:[
          {
//          border:false,
          xtype:'tabpanel',
          items:[
            {
              xtype:'userView',
              title:userRoleRes.manageUser
            },
            {
              xtype:'roleView',
              title:userRoleRes.manageRole
            },
              {
                  xtype:'featrueView',
                  title:'权限管理'
              }
          ]
          }
        ],
        buttons:[
          {
            text:globalRes.buttons.close,
            handler:function () {
              win.close();
            }
          }
        ]
      });
    }

    win.show();
  }


});