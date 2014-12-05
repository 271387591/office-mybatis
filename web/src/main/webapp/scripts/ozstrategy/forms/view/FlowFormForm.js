/**
 * Created by lihao on 8/8/14.
 */
Ext.define('FlexCenter.forms.view.FlowFormForm',{
    requires:[
        'FlexCenter.forms.view.CKEditor',
        'FlexCenter.forms.view.FormPreviewWindow'
    ],
    extend:'Ext.Window',
    alias: 'widget.flowFormForm',
    itemId:'flowFormForm',
    title: flowFormRes.flowFormForm.title,
    maximized: true,
    maximizable:false,
    shim:false,
    modal: true,
    layout: 'fit',
    animCollapse : true,
    initComponent:function(){
        Ext.WindowManager.setBase(0);
        var me=this;
        var ckeditor=Ext.create('FlexCenter.forms.view.CKEditor',{
            name:'content'
        });
        var form = Ext.create('Ext.form.Panel',{
            border:false,
            layout: 'border',
            bodyPadding:1,
            tbar:[
                '-',
                {
                    xtype:'button',
                    text:globalRes.buttons.save,
                    iconCls: 'save',
                    formBind: true,
                    handler: function(){
                        var ret = me.checkHtml(ckeditor.getValue());
                        if(ret){
                            Ext.MessageBox.alert(ret.title,ret.msg);
                            return;
                        }
                        if(!me.down('form').getForm().isValid()){
                            return;
                        }
                        var jsonHtml=me.convertJson(ckeditor.getValue());
                        var data=me.down('form').getValues();
                        data.jsonHtml=Ext.encode(jsonHtml,true);
                        var m=me.activeRecord;
                        if(!m)
                            me.fireEvent('addForm',me,data);
                        else{
                            me.fireEvent('updateForm',me,data)
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: workFlowRes.modeler.preview,
                    iconCls:'btn-preview',
                    handler:function(){
                        var value =ckeditor.getValue();
                        if(!value)return;
                        var ret = me.checkHtml(value);
                        if(ret){
                            Ext.MessageBox.alert(ret.title,ret.msg);
                            return;
                        }
                        Ext.widget('formPreviewWindow',{
                            formHtml:value
                        }).show();
                    }
                },
                {
                    xtype: 'button',
                    text: globalRes.buttons.close,
                    iconCls:'close',
                    handler:function(){
                        me.close();
                    }
                }
            ],
            items:[
                {
                    xtype: 'panel',
                    region:'east',
                    frame: false,
                    collapsible: true,
                    title: flowFormRes.flowFormForm.detail,
                    autoHeight: true,
                    defaultType: 'textfield',
                    defaults: {               
                        anchor: '100%'
                    },
                    layout:'form',
                    bodyPadding:5,
                    width:220,
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
                            fieldLabel: flowFormRes.flowFormForm.name,
                            name: 'name',
                            maxLength: 20,
                            labelWidth:60,
                            minLength: 1,
                            tabIndex: 1,
                            blankText:globalRes.tooltip.notEmpty,
                            listeners:{
                                blur:function(input){
                                    if(!me.isEdit){
                                        ajaxPostRequest('flowFormController.do?method=checkNameExist',{name:input.getValue()},function(result){
                                            if(!result.success){
                                                input.markInvalid(message.error.name.exist);
//                                                input.reset();
                                            }
                                        });
                                    }
                                }

                            },
                            allowBlank: false
                        },{
                            fieldLabel: flowFormRes.flowFormForm.displayName,
                            name: 'displayName',
                            maxLength: 20,
                            labelWidth:60,
                            minLength: 1,
                            tabIndex: 1,
                            blankText:globalRes.tooltip.notEmpty,
                            allowBlank: false
                        },
                        {
                            xtype: 'textarea',
                            fieldLabel: workFlowRes.modeler.processDocumentation,
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
                    title:flowFormRes.flowFormForm.design,
                    autoScroll:true,
                    defaults: {               
                        anchor: '100%'
                    },
                    layout:'form',
                    items:[
                        ckeditor
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
    convertJson:function(v){
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
            'table[xtype=detailGrid]',
            'input[xtype=posselector]'
        ];
        var table=$('table[xtype=table]',form);
        var detailGrids=$('table[xtype=detailGrid]',table);
        var createObj=function(item){
            var obj={};
            obj.name=item.attr('name');
            obj.label=item.attr('txtlabel');
            obj.xtype=item.attr('xtype');
            obj.dataType=item.attr('dataType')?item.attr('dataType'):'string';
            obj.dataType=obj.xtype=='detailGrid'?'array':obj.dataType;
            obj.dateFormat=item.attr('txtvaluetype') || '';
            return obj;
        }
        var items=[];
        for(var i=0;i<selectors.length;i++){
            var obj;
            var item=$(selectors[i],table).not($(selectors[i],detailGrids));
            item.each(function(index,it){
                obj=createObj($(it));
                items.push(obj);
            });
        }
        for(var i=0;i<items.length;i++){
            var item=items[i];
            if(item.xtype=='detailGrid'){
                var children = $('table[xtype=detailGrid][name='+item.name+']',table);
                var childs=[];
                for(var m=0;m<selectors.length;m++){
                    var sel=$(selectors[m],children);
                    sel.each(function(index,se){
                        var obj=createObj($(se));
                        childs.push(obj);
                    });
                }
                item.children=childs;
            }
        }
        return items;
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
    checkHtml:function(v){
        var me = this;
        var form = document.createElement('form');
        form.innerHTML = v;
        var table=$('table[xtype=table]',form);
        if(table.length<1){
            var ret={};
            ret.title=flowFormRes.flowFormForm.checkHtmlTitle;
            ret.msg=flowFormRes.flowFormForm.checkHtmlMsg;
            return ret;
        }
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
            items.each(function(index,item){
                var obj={};
                obj.name=$(item).attr('name');
                obj.label=$(item).attr('txtlabel');
                names.push(obj);
            });
        }
        var detailTables=$('table[xtype=detailGrid]',form);
        for(var i=0;i<detailTables.length;i++){
            var detail=detailTables[i];
            var detailChild=$('table[xtype=detailGrid]',detail);
            if(detailChild.length>0){
                var ret={};
                ret.title=flowFormRes.flowFormForm.checkHtmlDetailTitle;
                ret.msg=flowFormRes.flowFormForm.checkHtmlDetailMsg;
                return ret;
            }
            var obj={};
            obj.name=$(detail).attr('name');
            obj.label=$(detail).attr('txtlabel');
            obj.xtype=$(detail).attr('xtype');
            names.push(obj);
        }
        for(var i=0;i<names.length;i++){
            var name1=names[i].name;
            var label1=names[i].label;
            var xtype1=names[i].xtype;
            if(name1){
                var regExp = new RegExp(/^(?!_)(?![0-9])(?!.*?_$)[0-9A-Za-z_]+$/);
                if(!regExp.test(name1)){
                    var msg=(xtype1)?flowFormRes.flowFormForm.detailTable:flowFormRes.flowFormForm.formField;
                    var ret={};
                    ret.title=flowFormRes.flowFormForm.nameEror;
                    ret.msg=msg+Ext.String.format(flowFormRes.flowFormForm.nameErorMsg1,label);
                    return ret;
                }
            }
            for(var j=i+1;j<names.length;j++){
                var name2=names[j].name;
                var label2=names[j].label;
                var xtype2=names[j].xtype;
                if(name1==name2){
                    var msg=(xtype1 && xtype2 && xtype1==xtype2)?flowFormRes.flowFormForm.detailTable:flowFormRes.flowFormForm.formField;
                    msg=msg+Ext.String.format(flowFormRes.flowFormForm.nameErorMsg2,label1,msg,label2,msg);
                    var ret={};
                    ret.title=flowFormRes.flowFormForm.nameErorMsg3;
                    ret.msg=msg;
                    return ret;
                }
            }
        }
    }
});
