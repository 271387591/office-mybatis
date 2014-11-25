/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 7/1/13
 * Time: 11:32 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.user.view.FeatureView',{
    extend: 'Ext.grid.Panel',
    alias: 'widget.featrueView',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.toolbar.Paging',
        'Ext.toolbar.TextItem',
        'FlexCenter.user.store.AllFeatures',
        'Oz.access.RoleAccess'
    ],
    layout: 'fit',
    border: false,
    getStore: function () {
        var store = Ext.StoreManager.lookup('allFeaturesList');
        if (!store) {
            store = Ext.create('FlexCenter.user.store.AllFeatures', {
                storeId: 'allFeaturesList'
            });
        }
        return store;
    },
    initComponent: function () {
        var me = this;

        me.store = me.getStore();
        me.features=[{
            ftype: 'search',
            disableIndexes : ['id','description','criteria','createDate'],
            paramNames: {
                fields: 'fields',
                query: 'keyword'
            },
            searchMode : 'remote'
        }];
        me.columns = [
            {
                header:'权限名称',
                dataIndex:'name',
                flex:1
            },
            {
                header:'显示名称',
                dataIndex:'displayName',
                flex:1
            },
            {
                header: '描述',
                dataIndex: 'description',
                flex:1
            },{
                header: '分类',
                dataIndex: 'criteria',
                flex:1
            },
            {
                header: '创建时间',
                dataIndex: 'createDate',
                flex:1
            }
            ];

        me.dockedItems = [{
            xtype: 'pagingtoolbar',
            store: me.getStore(),
            dock: 'bottom',
            displayInfo: true
        }],
        me.on('afterrender',function(){
            me.getStore().load();
        });
        me.callParent();
    },
    onAddClick: function(){

        var me = this;
        var win = Ext.create('FlexCenter.user.view.FeatureForm',{
            title:'添加功能',
            isEdit:false
        });
        win.show();
        win.setActiveRecord(null);
        this.mon(win, 'addFeature', function (win, data) {
            temwin = win;
            temwin.close();
            me.updateData(data);

        });

    },

    onEditClick: function(){
        var me = this;
        var record = me.getSelectionModel().getSelection()[0];
        if(record){
            var win = Ext.create('FlexCenter.user.view.FeatureForm',{
                title:'编辑功能',
                isEdit:true
            });
            win.setActiveRecord(record);
            win.show();
            this.mon(win, 'updateFeature', function (win, data) {
                temwin = win;
                temwin.close();
                me.updateData(data);
            });
        }else{
            Ext.MessageBox.show({
                title: '编辑功能',
                width: 300,
                msg: '请选择要编辑的功能',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
        }



    },

    onDeleteClick: function(){
        var me = this;
        var record = me.getSelectionModel().getSelection()[0];
        if(record){
            Ext.Msg.confirm('删除功能','确定要删除功能['+record.data.displayName+']吗？',function(txt){
                if(txt==='yes'){
                    record.data.action='delete';
                    me.updateData({id:record.data.id,action:'delete'});
                }
            });
        }else{
            Ext.MessageBox.show({
                title: '删除功能',
                width: 300,
                msg: '请选择要删除的功能',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
        }
    },
    updateData: function (data) {
        var me = this;
      Ext.Ajax.request({
        url: 'userRoleController.do?method=saveOrUpdate',
        params: data,
        method: 'POST',
        success: function (response, options) {
          var result = Ext.decode(response.responseText);
          
            me.getStore().load();
        },
        failure: function (response, options) {
          Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
        }
      });
//        userRoleController.saveOrUpdate([data], function (result) {
//            if (result.success == true) {
//                me.getStore().reload();
//            }
//        });

    },

    onSearchClick: function(){
        var me = this;
        var textField = me.down('textfield#searchRoleName');
        var store = me.getStore();
        store.getProxy().extraParams = {keyword: textField.getValue()};
        store.load();
    }
})
