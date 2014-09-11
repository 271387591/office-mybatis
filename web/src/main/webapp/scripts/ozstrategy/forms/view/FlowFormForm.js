/**
 * Created by lihao on 8/8/14.
 */
Ext.define('FlexCenter.forms.view.FlowFormForm',{
    requires:[
        'FlexCenter.forms.view.CKEditor',
        'FlexCenter.forms.view.FormPreview'
    ],
    extend:'Ext.Window',
    alias: 'widget.flowFormForm',
    itemId:'flowFormForm',
    title: '添加表单',
    maximized: true,
    maximizable:false,
    shim:false,
    modal: true,
    layout: 'fit',
    animCollapse : true,
    initComponent:function(){
        Ext.WindowManager.setBase(0);
        var me=this;
        var form = Ext.create('Ext.form.Panel',{
            border:false,
            layout: 'border',
//            buttonAlign: 'left',
            buttons:[
            {
                xtype: 'button',
                text: '预览',
                handler:function(){
                    var value =me.down('#ckeditoritemId').getValue();
                    if(!value)return;
                    var ret = me.checkNames(value);
                    if(ret){
                        Ext.MessageBox.alert(ret.title,ret.msg);
                        return;
                    }
                    var win = Ext.widget('window',{
                        width:1010,
                        autoHeight:true,
                        minHeight:500,
                        modal:true,
                        itemId:'previewWindow',
                        shim:false,
                        title:'表单预览',
                        autoScroll:true,
                        buttons:[{
                            xtype: 'button',
                            text: globalRes.buttons.close,
                            handler: function(){
                                win.close();
                            }
                        }],
                        items:[
                            {
                                xtype:'formPreview',
                                itemId:'formPreview',
                                formHtml:value
                            }
                        ]
                    }).show();

                }
            },
            {
                xtype:'button',
                text:' 保存',
                formBind: true,
                handler: function(){
                    var ckeditor=me.down('#ckeditoritemId');
                    var ret = me.checkNames(ckeditor.getValue());
                    if(ret){
                        Ext.MessageBox.alert(ret.title,ret.msg);
                        return;
                    }
                    if(!me.down('form').getForm().isValid()){
                        return;
                    }
                    var data=me.down('form').getValues();
                    var m=me.activeRecord;
                    if(!m)
                        me.fireEvent('addForm',me,data);
                    else{
                        me.fireEvent('updateForm',me,data)
                    }
                }
            },
            {
                xtype:'button',
                text: globalRes.buttons.close,
                handler: function(){
                    me.close();
                }
            }
        ],
            items:[
                {
                    xtype: 'panel',
                    region:'west',
                    frame: false,
                    collapsible: true,
                    title: '表单信息',
                    autoHeight: true,
                    defaultType: 'textfield',
                    defaults: {               
                        anchor: '100%'
                    },
                    layout:'form',
                    width:200,
                    split: true,
                    margins: '0 1 0 0',
                    autoScroll:true,
                    collapsed: false,
                    items: [
                        {
                            xtype: 'hidden',
                            name: 'id'
                        },
                        {
                            fieldLabel: '表单名称',
                            name: 'name',
                            maxLength: 20,
                            labelWidth:60,
                            minLength: 1,
                            tabIndex: 1,
                            blankText:'必填',
                            listeners:{
                                blur:function(input){
                                    if(!me.isEdit){
                                        ajaxPostRequest('flowFormController.do?method=checkNameExist',{name:input.getValue()},function(result){
                                            if(!result.success){
                                                input.markInvalid('表单名称已存在');
//                                                input.reset();
                                            }
                                        });
                                    }
                                }

                            },
                            allowBlank: false
                        },{
                            fieldLabel: '显示名称',
                            name: 'displayName',
                            maxLength: 20,
                            labelWidth:60,
                            minLength: 1,
                            tabIndex: 1,
                            blankText:'必填',
                            allowBlank: false
                        },
                        {
                            xtype: 'textarea',
                            fieldLabel: '表单描述',
                            labelWidth:60,
                            name: 'description',
                            maxLength: 50,
                            minLength: 1,
                            tabIndex: 2
                        }
                    ]
                },{
                    
                    xtype: 'panel',
                    region:'center',
                    title:'表单设计',
                    autoScroll:true,
                    defaults: {               
                        anchor: '100%'
                    },
                    layout:'fit',
                    tbar:[
                        {
                            xtype:'button',
                            frame:true,
                            text:'格式化处理',
                            iconCls:'user-add',
                            scope:this,
                            handler:function(){
                                var ckeditor=me.down('#ckeditoritemId');
                                var value = me.formatValue(ckeditor.getValue() || '');
                                ckeditor.setValue(value);
                            }
                        }

                    ],
                    items:[
                        {
                            itemId:'ckeditoritemId',
                            xtype: 'ckeditor',
                            name: 'content'
                        }
                    ]
                }

            ]

        });
        
        me.items = [form];
        this.addEvents(['addForm','updateForm']);
        me.callParent();
    },
    getFormPanel: function(){
        var me = this;
        return me.down('form').getForm();
    },
    setActiveRecord: function(record){
        this.activeRecord = record;
        if (record) {
            this.getFormPanel().loadRecord(record);
        } else {
            this.getFormPanel().reset();
        }
    },
    formatValue:function(v){
        var form = document.createElement('form');
        form.innerHTML = v;
        var selectors=[
            'input[xtype=textfield]',
            'textarea[xtype=textareafield]',
            'input[xtype=datefield]',
            'select[xtype=combo]',
            'boxgroup[xtype=boxgroup]',
            'input[xtype=userselector]',
            'input[xtype=depselector]',
            'input[xtype=posselector]'
        ];
        var tds=$('td',form);
        for(var i=0;i<tds.length;i++){
            var items=$(selectors.join(','),tds[i]);
            if(items.length>1){
                for(var j=1;j<items.length;j++){
                    items[j].remove();
                }
            }
        }
        return form.innerHTML;
    },
    checkNames:function(v){
        var me = this;
        var form = document.createElement('form');
        form.innerHTML = v;
        var selectors=[
            'input[xtype=textfield][name]',
            'textarea[xtype=textareafield][name]',
            'input[xtype=datefield][name]',
            'select[xtype=combo][name]',
            'boxgroup[xtype=boxgroup][name]',
            'input[xtype=userselector][name]',
            'input[xtype=depselector][name]',
            'input[xtype=posselector][name]'
        ];
        var names=[];
        for(var i=0;i<selectors.length;i++){
            var items=$(selectors[i],form);
            for(var j=0;j<items.length;j++){
                var obj={};
                obj.name=items[j].getAttribute('name');
                obj.label=items[j].getAttribute('txtlabel');
                names.push(obj);
            }
        }
        var detailTables=$('table[xtype=detailGrid]',form);
        for(var i=0;i<detailTables.length;i++){
            var obj={};
            obj.name=detailTables[i].getAttribute('name');
            obj.label=detailTables[i].getAttribute('txtlabel');
            obj.xtype=detailTables[i].getAttribute('xtype');
            names.push(obj);
        }
        for(var i=0;i<names.length;i++){
            var name1=names[i].name;
            var label1=names[i].label;
            var xtype1=names[i].xtype;
            if(name1){
                var regExp = new RegExp(/^(?!_)(?![0-9])(?!.*?_$)[0-9A-Za-z_]+$/);
                if(!regExp.test(name1)){
                    var msg=(xtype1)?'明细表':'字段';
                    var ret={};
                    ret.title='名称命名错误';
                    ret.msg=msg+'名称【'+label1+'】命名不符合规范，名称只能是数字,字母,_组成,并且_不能在最前或者最后！';
                    return ret;
                }
            }
            for(var j=i+1;j<names.length;j++){
                var name2=names[j].name;
                var label2=names[j].label;
                var xtype2=names[j].xtype;
                if(name1==name2){
                    var msg=(xtype1 && xtype2 && xtype1==xtype2)?'明细表':'字段';
                    msg=msg+'【'+label1+'】与'+msg+'【'+label2+'】名称重复，请保持每个'+msg+'名称必须唯一！';
                    var ret={};
                    ret.title='名称重复';
                    ret.msg=msg;
                    return ret;
                }
            }
        }
    }
});
