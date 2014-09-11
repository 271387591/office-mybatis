/**
 * Created with IntelliJ IDEA.
 * User: kangpan
 * Date: 13-9-17
 * Time: am 11:53
 * To change this template use File | Settings | File Templates.
 */
 Ext.define("FlexCenter.system.store.GlobalTypeTree",{
     extend:'Ext.data.TreeStore',
     alias:'store.globalTypeTree',
     requires:[
        'FlexCenter.system.model.GlobalType'
     ],
     model:'FlexCenter.system.model.GlobalType',
     sorters:[{
         property:'path',
         direction:'AES'
     }],
     proxy:{
         type:'ajax',
         url:'globalTypeController.do?method=getTreeList'
     },
     autoLoad:false
 });