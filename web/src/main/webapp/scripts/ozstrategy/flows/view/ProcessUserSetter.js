/**
 * Created by lihao on 9/17/14.
 */
Ext.define('FlexCenter.flows.view.ProcessUserSetter', {
    requires: [
        'FlexCenter.user.view.UserSelector',
        'FlexCenter.user.view.RoleSelector'
    ],
    extend: 'Ext.Window',
    alias: 'widget.processUserSetter',
    title: workFlowRes.modeler.usertaskassignmentTitle,
    shim: false,
    modal: true,
    layout: 'fit',
    width:500,
    height:300,
    border:false,
    getStore:function(){
        var me=this;
        var store=Ext.StoreManager.lookup("ProcessUserSetterStore");
        var data=[
            {
                "assignment_type": 'assignee',
                "resourceassignmentexpr": ''
            },
            {
                "assignment_type": 'candidateUsers',
                "resourceassignmentexpr": ''
            },
            {
                "assignment_type": 'candidateRoles',
                "resourceassignmentexpr": ''
            }
        ];
        if(me.formproperties){
            var formproperties=Ext.decode(me.formproperties);
            var items=formproperties.items,len=items.length;
        }
        store=Ext.create("Ext.data.Store",{
            storeId:'ProcessUserSetterStore',
            fields:['assignment_type','resourceassignmentexpr','resourceassignmentexprDisplay'],
            data:data
        });
        return store;

    },
    initComponent:function(){
        var me=this;
        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });
        var store=me.getStore();
        var items=[
            {
                xtype:'grid',
                plugins: [cellEditing],
                margin:'0 1 0 0',
                autoScroll: true,
                store:store,
                columns:[
                    {xtype: 'rownumberer'},
                    {
                        header: workFlowRes.processUserSetter.assignment_type,
                        width:120,
                        dataIndex: 'assignment_type',
                        renderer:function(v,rec){
                            if(v=='assignee'){
                                return workFlowRes.processUserSetter.assignee;
                            }else if(v=='candidateUsers'){
                                return workFlowRes.processUserSetter.candidateUsers;
                            }else if(v=='candidateRoles'){
                                return workFlowRes.processUserSetter.candidateRoles;
                            }
                            return '';
                        }
                    },{
                        header: workFlowRes.processUserSetter.assValue,
                        flex:1,
                        dataIndex: 'resourceassignmentexprDisplay',
                        editor: {
                            xtype:'trigger',
                            onTriggerClick:function(){
                                var rec = me.down('grid').getSelectionModel().getSelection()[0];
                                var type=rec.get('assignment_type'),type;
                                if(type=='assignee'){
                                    var win = Ext.widget('userSelector',{
                                        type:'SINGLE',
                                        processAssignee:'processAssignee',
                                        resultBack:function(ids,names,usernames){
                                            rec.set('resourceassignmentexprDisplay',names);
                                            rec.set('resourceassignmentexpr',usernames);
                                        }
                                    });
                                    win.show();
                                }else if(type == 'candidateUsers'){
                                    var win = Ext.widget('userSelector',{
                                        resultBack:function(ids,names,usernames){
                                            rec.set('resourceassignmentexprDisplay',names);
                                            rec.set('resourceassignmentexpr',usernames);
                                        }
                                    });
                                    win.show();
                                }else if(type == 'candidateRoles'){
                                    var win = Ext.widget('roleSelector',{
                                        resultBack:function(ids,names,userIds,userNames,userFullNames){
                                            rec.set('resourceassignmentexprDisplay',names);
                                            rec.set('resourceassignmentexpr',userNames);
                                        }
                                    });
                                    win.show();
                                }
                            }
                        }
                    },{
                        xtype:'actioncolumn',
                        header:globalRes.buttons.clear,
                        width:50,
                        items:[
                            {
                                iconCls:'delete',
                                tooltip:globalRes.buttons.clear,
                                handler:function(grid, rowIndex, colIndex){
                                    var rec = grid.getStore().getAt(rowIndex);
                                    rec.set('resourceassignmentexprDisplay','');
                                    rec.set('resourceassignmentexpr','');
                                }
                            }
                        ]
                    }
                ]
            }
        ];
        me.items=items;
        me.buttons=[
            {
                xtype:'button',
                text: globalRes.buttons.ok,
                handler: function(){
                    var store = me.down('grid').getView().getStore();
                    var assignee={},candidateUsers={},candidateRoles={};
                    store.each(function(rec){
                        var data=rec.data;
                        var type=data.assignment_type;
                        if(type=='assignee'){
                            if(data.resourceassignmentexpr){
                                assignee.assignment_type=data.assignment_type;
                                assignee.resourceassignmentexpr=data.resourceassignmentexpr;
                            }
                        }else if(type=='candidateUsers'){
                            if(data.resourceassignmentexpr){
                                candidateUsers.assignment_type=data.assignment_type;
                                candidateUsers.resourceassignmentexpr=data.resourceassignmentexpr;
                            }
                        }else if(type=='candidateRoles'){
                            if(data.resourceassignmentexpr){
                                candidateRoles.assignment_type=data.assignment_type;
                                candidateRoles.resourceassignmentexpr=data.resourceassignmentexpr;
                            }
                        }
                    });
                    var array=[];
                    array.push(assignee);
                    array.push(candidateUsers);
                    array.push(candidateRoles);
                    if(me.callBack){
                        me.callBack(Ext.encode(array));
                    }
                    me.close();
                }
            },{
                xtype:'button',
                text: globalRes.buttons.close,
                handler: function(){
                    me.close();
                }
            }
        ];
        me.callParent(arguments);
    }
});