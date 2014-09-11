/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-9-22
 * Time: 下午5:11
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.AModelEditForm',{
    requires:[
        'FlexCenter.activiti.view.CKEditor',
        'FlexCenter.activiti.view.FormPreview1'
    ],
    extend:'Ext.Window',
    alias: 'widget.aModelEditForm',
    itemId:'aModelEditForm',
    width: 800,
    height: 550,
    title: '添加表单',
    maximizable:true,
    shim:false,
    modal: true,
    layout: 'fit',
    initComponent:function(){
        Ext.WindowManager.setBase(0);
        var me=this;
        var form = Ext.create('Ext.form.Panel',{
            frame: 'true',
            bodyPadding: 5,
            layout: 'form',
            defaults: {
                anchor: '100%'
            },
            items:[
                {
                    xtype: 'fieldset',
                    checkboxToggle: false,
                    title: '表单信息',
                    autoHeight: true,
                    defaultType: 'textfield',
                    defaults: {               // defaults are applied to items, not the container
                        anchor: '100%'
                    },
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
                            minLength: 1,
                            tabIndex: 1,
                            blankText:'必填',
                            allowBlank: false
                        },
                        {
                            xtype: 'textarea',
                            fieldLabel: '表单描述',
                            name: 'description',
                            maxLength: 50,
                            minLength: 1,
                            blankText:'必填',
                            tabIndex: 2,
                            allowBlank: false
                        },
                        {
                            xtype: 'ckeditor',
                            name: 'content'
                        }
                    ]
                }

            ]

        });
        me.buttons=[
            {
                xtype: 'button',
                text: '预览',
                handler:function(){
                    var value = me.down('ckeditor').getValue();
                    if(!value)return;
                    var win = Ext.widget('window',{
                        width:810,
                        autoHeight:true,
                        minHeight:400,
                        modal:true,
                        itemId:'previewWindow',
                        title:'表单预览',
//                        layout: 'fit',
                        autoScroll:true,

                        buttons:[{
                        xtype: 'button',
                        text: '取消',
                        handler: function(){
                            win.close();
                        }
                    },{
                        xtype: 'button',
                        text: '取值',
                        handler: function(){
                            var p =Ext.ComponentQuery.query('#formPreview')[0];
//                            console.log(p.getValue())
                            var value = p.getFormValue();
                            console.log(value)
                        }
                    }],
                        items:[
                            {
                                xtype:'formPreview',
                                width:810,
                                formHtml:value
                            }
                        ]
                        }).show();
//                    win.show();
//                    new DesignerWin({defHtml:value}).show();

                }
            },
            {
                xtype:'button',
                text:' 保存',
                handler: function(){
                    if(!me.checkNameType(me.down('ckeditor').getValue())){
                        Ext.MessageBox.alert('提示信息','字段名称只能是数字,字母,_组成,并且_不能在最前或者最后！');
                        return;
                    }
                    if(me.checkName(me.down('ckeditor').getValue())){
                        Ext.MessageBox.alert('提示信息','字段名称不能重复,请检查重新命名！');
                        return;
                    };
                    if(!me.down('form').getForm().isValid()){
                        return;
                    }
                    var data=me.down('form').getValues();
                    var m=me.activeRecord;
//                    if(!m)
//                        me.fireEvent('addForm',me,data);
//                    else{
//                        me.fireEvent('updateForm',me,data)
//                    }
                }
            },
            {
                xtype:'button',
                text: '取消',
                handler: function(){
                    me.close();
                }
            }
        ];
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
    queryWidget:function(values){
        var me = this;
        var form = document.createElement('form');
        form.innerHTML = values;
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
        var table=$('table[xtype=table]',form);
        var detailGrids=$('table[xtype=detailGrid]',table);
        if(table){
            for(var i=0;i<table.length;i++){
                var widgets=$(selectors[i],table).not($(selectors[i],detailGrids));
                if(widgets && widgets.length>0) {
                    for(var j=0;j<widgets.length;j++){
                        var widget=widgets[j];
                        var name=widget.getAttribute('name');
                        
                    }
                }
            }
        }
        
    },
    checkName: function(values){
        var me = this;
        var form = document.createElement('form');
        form.innerHTML = values;
        var gridNames = new Array();
        var count = 0;
        var childNodes = form.childNodes;
        Ext.each(childNodes,function(item){
            count = me.circleGetGridName(item,gridNames,count);
        });
        for(var i = 0 ; i < gridNames.length ; i++){
            for(var j = i+1 ; j < gridNames.length ; j++){
                if(gridNames[i] == gridNames[j]){
                    return true;
                }
            }
        };
        var elements = form.elements;
        for(var i = 0 ; i < elements.length ; i++){
            for(var a = 0 ; a < gridNames.length ; a++){
                if(gridNames[a] == elements[i].getAttribute('name')){
                    return true;
                }
            }
            if(elements[i].getAttribute('type') == 'radio'){
                for(var j = i + 1; j < elements.length ; j++){
                    if(elements[j].getAttribute('type') != 'radio'){
                        if(elements[i].getAttribute('name') == elements[j].getAttribute('name')){
                            return true;
                        }
                    }
                }
            }else if(elements[i].getAttribute('type') == 'checkbox'){
                for(var j = i + 1; j < elements.length ; j++){
                    if(elements[j].getAttribute('type') != 'checkbox'){
                        if(elements[i].getAttribute('name') == elements[j].getAttribute('name')){
                            return true;
                        }
                    }
                }
            }else{
                for(var j = i + 1 ;j < elements.length ; j++){
                    if(elements[i].getAttribute('name') == elements[j].getAttribute('name')){
                        return true;
                    }
                }
            }
        }
        return false;
    },
    //正则表达式验证规则
    valueRegExp:function(regExpStr,value){
        var regExp = new RegExp(regExpStr);
        if(regExp.test(value)){
            return true;
        }else{
            return false;
        }
    },
    checkNameType: function(values){
        var form = document.createElement('form');
        form.innerHTML = values;
        var elements = form.elements;
        for(var i = 0 ; i < elements.length ; i++){
            var name = elements[i].getAttribute('name');
            if(!this.valueRegExp(/^(?!_)(?![0-9])(?!.*?_$)[0-9A-Za-z_]+$/,name)){
                return false;
            }
        }
        return true;
    },
    circleGetGridName: function(item,gridNames,count){
        var me = this;
        if(item.nodeName == 'TABLE'){
            if(item.getAttribute('xtype') != null && item.getAttribute('xtype') == 'grid'){
                gridNames[count] = item.getAttribute('name');
                count ++;
            }else{
                var trArray = item.childNodes[1].childNodes;
                Ext.each(trArray,function(item){
                    if(item.nodeName == 'TR'){
                        var tdArray = item.childNodes;
                        Ext.each(tdArray,function(item){
                            if(item.nodeName == 'TD' || item.nodeName == 'TH'){
                                var array = item.childNodes;
                                Ext.each(array,function(item){
                                    count = me.circleGetGridName(item,gridNames,count);
                                });
                            }
                        });
                    }
                });
            }
        }
        return count;
    }

});
