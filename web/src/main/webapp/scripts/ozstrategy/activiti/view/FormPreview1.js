/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-10-14
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.FormPreview1',{
    requires:[
        'Oz.form.FormDataCustomFiled',
//        'Oz.form.TimePickerField',
        'Oz.form.DateTimePicker',
        'FlexCenter.user.view.UserSelector',
        'Ext.ux.form.DateTimeField'
//        'OzSOA.jiuzhai.view.PositionSelector',
//        'OzSOA.jiuzhai.view.OrgSelector'
    ],
    extend:'Ext.panel.Panel',
    alias: 'widget.formPreview1',
    itemId:'formPreview1',
    border:false,
    editorStyle: 'margin: 5px 2px 0px 0px;color:#03386C;border-collapse:collapse;',
    thStyle:'text-align:center;background-color: #D0E0F4;',
    layout:'fit',
    initComponent: function(){
        var me = this;
        var html = me.formHtml;
        me.items = [
            {
                border:false,
                xtype:'form',
                bodyPadding: 3,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                html:html,
                listeners:{
                    afterrender:function(proto){
                        var dom = proto.body.dom;
                        formFields=[];
                        me.renderWidget(dom);
                    }
                }
            }
        ];
        me.callParent();
    },
    getFormFields:function(){
        var me=this;
        return formFields || [];
    },
    getFormValue:function(){
        var me=this;
        var form=me.down('form');
        return form.getForm().getValues();
        
    },
    renderWidget:function(dom){
        var me=this;
        var table=$('table[xtype=table]',dom);
        var detailGrids=$('table[xtype=detailGrid]',table);
        if(table){
            var ths=$('th',table).not($('th',detailGrids));
            if(ths && ths.length>0){
                for(var i=0;i<ths.length;i++){
                    var th=ths[i];
                    var style=th.getAttribute('style');
                    if(style){
                        style=me.thStyle+style;
                    }else{
                        style=me.thStyle;
                    }
                    th.setAttribute('style',style);
                }
            }
            var textfields=$('input[xtype=textfield]',table).not($('input[xtype=textfield]',detailGrids));
            if(textfields && textfields.length>0){
                for(var i=0;i<textfields.length;i++){
                    me.createTextfield(textfields[i]);
                }
            }
            var textareas=$('textarea[xtype=textareafield]',table).not($('textarea[xtype=textareafield]',detailGrids));
            if(textareas && textareas.length>0){
                for(var i=0;i<textareas.length;i++){
                    me.createTextarea(textareas[i]);
                }
            }
            var datefields=$('input[xtype=datefield]',table).not($('input[xtype=datefield]',detailGrids));
            if(datefields && datefields.length>0){
                for(var i=0;i<datefields.length;i++){
                    me.createDatefield(datefields[i]);
                }
            }
            var combos=$('select[xtype=combo]',table).not($('select[xtype=combo]',detailGrids));
            if(combos && combos.length>0){
                for(var i=0;i<combos.length;i++){
                    me.createCombos(combos[i]);
                }
            }
            var boxgroups=$('boxgroup[xtype=boxgroup]',table).not($('boxgroup[xtype=boxgroup]',detailGrids));
            if(boxgroups && boxgroups.length>0){
                for(var i=0;i<boxgroups.length;i++){
                    me.createBoxGroup(boxgroups[i]);
                }
            }
            var girds=detailGrids;
            if(girds && girds.length>0){
                for(var i=0;i<girds.length;i++){
                    me.createGrid(girds[i]);
                }
            }
            var userselectors=$('input[xtype=userselector]',table).not($('input[xtype=userselector]',detailGrids));
            if(userselectors && userselectors.length>0){
                for(var i=0;i<userselectors.length;i++){
                    me.createSelector(userselectors[i]);
                }
            }
            var depselectors=$('input[xtype=depselector]',table).not($('input[xtype=depselector]',detailGrids));
            if(depselectors && depselectors.length>0){
                for(var i=0;i<depselectors.length;i++){
                    me.createSelector(depselectors[i]);
                }
            }
            var posselectors=$('input[xtype=posselector]',table).not($('input[xtype=posselector]',detailGrids));
            if(posselectors && posselectors.length>0){
                for(var i=0;i<posselectors.length;i++){
                    me.createSelector(posselectors[i]);
                }
            }
            
            
        }
    },
    createGrid:function(item){
        var me=this;
        var name = item.getAttribute('name');
        var value = item.getAttribute('value');
        var width = item.getAttribute('xwidth');
        var columns=[],fields=[];
        var tds=$('td',item);
        var searchWidget=function(td){
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
            for(var i=0;i<selectors.length;i++){
                var widget=$(selectors[i],td);
                if(widget && widget.length>0){
                    return widget[0];
                }
            }
        };
        var filedObjs=[];
        for(var i=0;i<tds.length;i++){
            var td=tds[i];
            var widget=searchWidget(td);
            if(!widget)break;
            var xtype=widget.getAttribute('xtype');
            var wname=widget.getAttribute('name');
            widget.setAttribute('name',name+'_'+wname);
            wname=widget.getAttribute('name');
            fields.push(wname);
            var txtlabel = widget.getAttribute('txtlabel');
            var obj={
                header:txtlabel,
                flex:1,
                dataIndex:wname
            };
            var filedObj={
                name:wname,
                xtype:xtype,
                itemId:wname
            }
            filedObjs.push(filedObj);
            if(xtype=='textfield'){
                obj.editor=me.createTextfield(widget,true);
            }else if(xtype=='textareafield'){
                obj.editor=me.createTextfield(widget,true);
            }else if(xtype=='datefield'){
                obj.editor=me.createDatefield(widget,true);
                obj.renderer=function(v){
                    return v?Ext.Date.format(new Date(v),obj.editor.format):v;
                };
            }else if(xtype=='combo'){
                obj.editor=me.createCombos(widget,true);
            }else if(xtype=='boxgroup'){
                obj.editor=me.createBoxGroup(widget,true);
                obj.renderer=function(v,metaData,record,index,col){
                    if(v){
                        for(var i in v){
                            if(v[i] instanceof Array){
                                return v[i].join(',');
                            }
                            return v[i];
                        }
                    }
                    return '';
                };
            }
            columns.push(obj);
        }
        var deleteCol={
            xtype: 'actioncolumn',
            width:30,
            sortable: false,
            items: [{
                iconCls: 'delete',
                tooltip: '删除',
                handler: function(grid, rowIndex, colIndex) {
                    store.removeAt(rowIndex);
                }
            }]
        };
        columns.push(deleteCol);
        var span = document.createElement('span');
        var parentNode=item.parentNode;
        if(parentNode){
            var parentNodeChild=parentNode.childNodes;
            if(parentNodeChild && parentNodeChild.length>0){
                for(var i=0;i<parentNodeChild.length;i++){
                    if(parentNodeChild[i].nodeName == '#text'){
                        parentNode.removeChild(parentNodeChild[i]);
                    }
                }
            }
            parentNode.insertBefore(span,item);
            parentNode.removeChild(item);
        }
        Ext.define('Plant',{
            extend: 'Ext.data.Model',
            fields: fields
        });
        var storeData=[];
        if(value){
            storeData=Ext.decode(value);
        }
        var store=Ext.create('Ext.data.Store',{
            model: 'Plant',
            data:storeData
        });

        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            renderTo: span,
            columns: columns,
            itemId: name,
            width: 800,
            autoHeight:true,
            minHeight: 200,
            sType:'detail',
            tbar: [{
                text: '添加记录',
                iconCls:'add',
                handler : function(){
                    var r = Ext.create('Plant',{

                    });
                    store.insert(0,r);
                    cellEditing.startEditByPosition({row: 0, column: 0});
                }
            },
            {
                text: '删除记录',
                handler: function(){
                    var store = grid.getStore();
                    store.each(function(model){
                        console.log(model);
                    })
                    

                }
            }
            ],
            plugins: [cellEditing]
        });
        var fieldObj={
            name:name,
            xtype:'detailGrid',
            itemId:name,
            fields:filedObjs
        };
        formFields.push(fieldObj);
        return grid;
    },
    createSelector:function(item,grid){
        var me=this;
        var name = item.getAttribute('name');
        var chmod = item.getAttribute('chmod');
        var xtype = item.getAttribute('xtype');
        var value = item.getAttribute('value');
        var span = document.createElement('span');
        var parentNode=item.parentNode;
        if(parentNode){
            var parentNodeChild=parentNode.childNodes;
            if(parentNodeChild && parentNodeChild.length>0){
                for(var i=0;i<parentNodeChild.length;i++){
                    if(parentNodeChild[i].nodeName == '#text'){
                        parentNode.removeChild(parentNodeChild[i]);
                    }
                }
            }
            parentNode.insertBefore(span,item);
            parentNode.removeChild(item);
        }
        var config={
            xtype: 'formDataCustomFiled',
            name: name,
            itemId:name,
            labelWidth: 50,
            msgTarget: 'side',
            width:200,
            anchor: '100%',
            readOnly: chmod == 1?true: false,
            readOnlyCls:'x-item-disabled',
            hidden: chmod == 2?true: false
        };
        if(!grid){
            config.renderTo=span;
        }
        if(xtype == 'userselector'){
            config.buttonText='选择人员';
            config.onClick=function(){
                Ext.widget('userSelector',{
//                        type:'SINGLE',
                    returnObj:true,
                    resultBack: function(ids,names,userNames,records){
//                            console.log(ids,names);
//                        me.down('#' + name).setValue(names);
//                        me.down('#' + name).propertiesId = ids;
//                        me.down('#' + name).selectorObj = records;
                    }
                }).show();
                
            }
        }else if(xtype == 'depselector'){
            config.buttonText='选择部门';
            config.onClick=function(){

            }
        }else if(xtype == 'posselector'){
            config.buttonText='选择岗位';
            config.onClick=function(){

            }
        }
        var fieldObj={
            name:name,
            xtype:xtype,
            itemId:name
        };
        formFields.push(fieldObj);
        return Ext.widget('formDataCustomFiled',config);
    },
    createBoxGroup:function(item,grid){
        var me=this;
        var name = item.getAttribute('name');
        var multiple = item.getAttribute('multiple');
        var chmod = item.getAttribute('chmod');
        var xtype = item.getAttribute('xtype');
        var span = document.createElement('span');
        var parentNode=item.parentNode;
        if(parentNode){
            var parentNodeChild=parentNode.childNodes;
            if(parentNodeChild && parentNodeChild.length>0){
                for(var i=0;i<parentNodeChild.length;i++){
                    if(parentNodeChild[i].nodeName == '#text'){
                        parentNode.removeChild(parentNodeChild[i]);
                    }
                }
            }
            parentNode.insertBefore(span,item);
            parentNode.removeChild(item);
        }
        var inputs=$('input',item),groups=[];
        if(inputs && inputs.length>0){
            for(var i=0;i<inputs.length;i++){
                var input=inputs[i];
                var checked=input.getAttribute('checked');
                var obj={
                    boxLabel:input.getAttribute('txtlabel'),
                    name:input.getAttribute('name'),
                    inputValue:input.getAttribute('value')
                }
                'checked'==checked?obj.checked=true:'';
                groups.push(obj);
            }
        }
        var config={
            labelWidth:1,
            name:name,
            itemId:name,
            readOnly: chmod == 1?true: false,
            readOnlyCls:'x-item-disabled',
            hidden: chmod == 2?true: false,
            items:groups
        }
        if(!grid){
            config.renderTo=span;
        }
        var fieldObj={
            name:name,
            xtype:xtype,
            itemId:name
        };
        formFields.push(fieldObj);
        return multiple?Ext.widget('checkboxgroup',config):Ext.widget('radiogroup',config);
    },
    createCombos:function(item,grid){
        var me=this;
        var name = item.getAttribute('name');
        var multiple = item.getAttribute('multiple');
        var chmod = item.getAttribute('chmod');
        var xtype = item.getAttribute('xtype');
        var span = document.createElement('span');
        var parentNode=item.parentNode;
        if(parentNode){
            var parentNodeChild=parentNode.childNodes;
            if(parentNodeChild && parentNodeChild.length>0){
                for(var i=0;i<parentNodeChild.length;i++){
                    if(parentNodeChild[i].nodeName == '#text'){
                        parentNode.removeChild(parentNodeChild[i]);
                    }
                }
            }
            parentNode.insertBefore(span,item);
            parentNode.removeChild(item);
        }
        var childs=item.childNodes;
        var data=[],values=[];
        if(childs && childs.length>0){
            for(var i=0;i<childs.length;i++){
                var option=childs[i];
                var optValue=option.getAttribute('value');
                var selected=option.getAttribute('selected');
                var optDvalue=option.value;
                var obj={};
                obj.value=optValue;
                obj.name=optDvalue;
                data.push(obj);
                if(selected){
                    values.push(optValue);
                }
            }
        }
        var store = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data : data
        });
        var config={
            store: store,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            editable:false,
            multiSelect:multiple,
            name:name,
            itemId:name,
            readOnly: chmod == 1?true: false,
            readOnlyCls:'x-item-disabled',
            hidden: chmod == 2?true: false
        };
        if(values.length>0){
            config.value=values;
        }
        if(!grid){
            config.renderTo=span;
        }
        var fieldObj={
            name:name,
            xtype:xtype,
            itemId:name
        };
        formFields.push(fieldObj);
        return Ext.widget('combo',config);
    },
    createDatefield:function(item,grid){
        var me=this;
        var name = item.getAttribute('name');
        var value = item.getAttribute('value');
        var xtype = item.getAttribute('xtype');
        if(value){
            value = item.value;
        }
        var chmod = item.getAttribute('chmod');
        var txtvaluetype = item.getAttribute('txtvaluetype');
        var span = document.createElement('span');
        var parentNode=item.parentNode;
        if(parentNode){
            var parentNodeChild=parentNode.childNodes;
            if(parentNodeChild && parentNodeChild.length>0){
                for(var i=0;i<parentNodeChild.length;i++){
                    if(parentNodeChild[i].nodeName == '#text'){
                        parentNode.removeChild(parentNodeChild[i]);
                    }
                }
            }
            parentNode.insertBefore(span,item);
            parentNode.removeChild(item);
        }
        if('yyyy-MM-dd'==txtvaluetype){
            var config={
                itemId: name,
                name:name,
                format:'Y-m-d',
                readOnly: chmod == 1?true: false,
                hidden: chmod == 2?true: false,
                readOnlyCls:'x-item-disabled'
            };
            if(value){
                config.value=Ext.Date.parse(value,'Y-m-d');
            }
            if(!grid){
                config.renderTo=span;
            }
            var fieldObj={
                name:name,
                xtype:xtype,
                itemId:name
            };
            formFields.push(fieldObj);
            return Ext.widget('datefield',config);
            
        }else if('yyyy-MM-dd HH:mm:ss'==txtvaluetype){
            var config={
                itemId: name,
                name:name,
                format:'Y-m-d H:i:s',
                readOnly: chmod == 1?true: false,
                hidden: chmod == 2?true: false,
                readOnlyCls:'x-item-disabled'
            };
            if(value){
                config.value=Ext.Date.parse(value,'Y-m-d');
            }
            if(!grid){
                config.renderTo=span;
            }
            var fieldObj={
                name:name,
                xtype:xtype,
                itemId:name
            };
            formFields.push(fieldObj);
            return Ext.widget('datetimefield',config);
        }
    },
    createTextarea:function(item,grid){
        var me=this;
        var name = item.getAttribute('name');
        var value = item.getAttribute('value');
        if(value){
            value = item.value;
        }
        var chmod = item.getAttribute('chmod');
        var xtype = item.getAttribute('xtype');
        var span = document.createElement('span');
        var parentNode=item.parentNode;
        if(parentNode){
            var parentNodeChild=parentNode.childNodes;
            if(parentNodeChild && parentNodeChild.length>0){
                for(var i=0;i<parentNodeChild.length;i++){
                    if(parentNodeChild[i].nodeName == '#text'){
                        parentNode.removeChild(parentNodeChild[i]);
                    }
                }
            }
            parentNode.insertBefore(span,item);
            parentNode.removeChild(item);
        }
        var config={
            itemId: name,
            name:name,
            readOnly: chmod == 1?true: false,
            hidden: chmod == 2?true: false,
            readOnlyCls:'x-item-disabled'
        };
        if(value){
            config.value=value;
        }
        if(!grid){
            config.renderTo=span;
        }
        var fieldObj={
            name:name,
            xtype:xtype,
            itemId:name
        };
        formFields.push(fieldObj);
        return Ext.widget('textareafield',config);
    },
    createTextfield:function(item,grid){
        var me=this;
        var name = item.getAttribute('name');
        var value = item.getAttribute('value');
        var chmod = item.getAttribute('chmod');
        var xtype = item.getAttribute('xtype');
        var xvtype = item.getAttribute('xvtype');
//        var span=me.createSpan(item);
        var span = document.createElement('span');
        var parentNode=item.parentNode;
        if(parentNode){
            var parentNodeChild=parentNode.childNodes;
            if(parentNodeChild && parentNodeChild.length>0){
                for(var i=0;i<parentNodeChild.length;i++){
                    if(parentNodeChild[i].nodeName == '#text'){
                        parentNode.removeChild(parentNodeChild[i]);
                    }
                }
            }
            parentNode.insertBefore(span,item);
            parentNode.removeChild(item);
        }
        var config={
            itemId: name,
            name:name,
            readOnly: chmod == 1?true: false,
            hidden: chmod == 2?true: false,
            readOnlyCls:'x-item-disabled'
        };
        if(value){
            config.value=value;
        }
        if(xvtype=='notNull'){
            config.allowBlank=false;
        }
        if(!grid){
            config.renderTo=span;
        }
        var fieldObj={
            name:name,
            xtype:xtype,
            itemId:name
        };
        formFields.push(fieldObj);
        return Ext.widget('textfield',config);
    }
});