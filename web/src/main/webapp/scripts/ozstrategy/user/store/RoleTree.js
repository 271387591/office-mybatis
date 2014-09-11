/**
 * Created with IntelliJ IDEA.
 * User: zhubq
 * Date: 13-9-17
 * Time: am 11:53
 * To change this template use File | Settings | File Templates.
 */
 Ext.define("FlexCenter.user.store.RoleTree",{
     extend:'Ext.data.TreeStore',
     alias:'store.roleTree',
     requires:[
        'FlexCenter.user.model.Role'
     ],
     model:'FlexCenter.user.model.Role',
     sorters:[{
         property:'id',
         direction:'AES'
     }],
     root: {
       expanded: true,
       id:"0",
       text: "所有角色"
     },
     proxy:{
         type:'ajax',
         url:'userRoleController.do?method=getAllRoleList'
     },
     autoLoad:true
 });