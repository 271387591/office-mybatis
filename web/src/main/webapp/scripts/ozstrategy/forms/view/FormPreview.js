/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-10-14
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.forms.view.FormPreview',{
    requires:[
        'FlexCenter.user.view.UserSelector',
        'Ext.ux.form.field.DateTimeField'
    ],
    extend:'Ext.panel.Panel',
    alias: 'widget.formPreview',
    thStyle:'text-align:center;background-color: #D0E0F4;',
    layout:'fit',
    autoScroll: true,
    initComponent: function(){
        var me = this;
        me.formHtml=me.setFormValue();
        me.items = [
            {
                border:false,
                xtype:'form',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                frame:false,
                autoScroll: true,
                items:[
                    {
                        itemId: 'previewFormId',
                        checkboxToggle: false,
                        xtype: 'fieldset',
                        autoScroll: true,
                        defaultType: 'textfield',
                        defaults: {               
                            anchor: '100%'
                        },
                        html : me.formHtml,
//                        bodyPadding: 3,
                        collapsed: false,
                        listeners:{
                            afterrender:function(proto){
                                var dom = proto.body.dom;
                                me.renderWidget(dom);
                            }
                        }
                    }
                ]
            }
        ];
        me.callParent();
    },
    setFormValue:function(){
        var me=this;
        if(me.formHtml && me.formValue){
            var formHtml=me.formHtml,formValue= me.formValue,chmods=me.chmods || {};
            var form = document.createElement('form');
            form.innerHTML = formHtml;
            var table=$('table[xtype=table]',form),detail=$('table[xtype=detailGrid]',form);
            for(var item in formValue){
                var selectors=[
                    'input[xtype=textfield][name='+item+']',
                    'textarea[xtype=textareafield][name='+item+']',
                    'input[xtype=datefield][name='+item+']',
                    'select[xtype=combo][name='+item+']',
                    'boxgroup[xtype=boxgroup][name='+item+']',
                    'input[xtype=userselector][name='+item+']',
                    'input[xtype=depselector][name='+item+']',
                    'input[xtype=posselector][name='+item+']'
                ];
                var value=formValue[item];
                var chmod=chmods[item];
                for(var i=0;i<selectors.length;i++){
                    var field=$(selectors[i],table).not($(selectors[i],detail));
                    if(field.length>0){
                        field.attr('value',Ext.encode(value,true));
                    }
                    if(chmod){
                        
                        field=$(selectors[i],table);
                        field.attr('chmod',chmod);
                    }
                }
                var detailName = $(detail).attr('name');
                if(item==detailName){
                    detail.attr('value',Ext.encode(value,true));
                }
            }
            return form.innerHTML;
        }
        return me.formHtml;
        
    },
    getFormValue:function(){
        var me=this;
        var form = document.createElement('form');
        form.innerHTML = me.formHtml;
        var selectors=[
            'tbody > tr > td > input[xtype=textfield]',
            'tbody > tr > td > textarea[xtype=textareafield]',
            'tbody > tr > td > input[xtype=datefield]',
            'tbody > tr > td > select[xtype=combo]',
            'tbody > tr > td > boxgroup[xtype=boxgroup]',
            'tbody > tr > td > input[xtype=userselector]',
            'tbody > tr > td > input[xtype=depselector]',
            'tbody > tr > td > input[xtype=posselector]'
        ];
        var table=$('table[xtype=table]',form),detail=$('table[xtype=detailGrid]',form);
        var selectItemValue=function(type,table){
            var names=[];
            for(var i=0;i<selectors.length;i++){
                var items=$(selectors[i],type);
                if(table){
                    items=$(selectors[i],type).not($(selectors[i],detail));
                }
                for(var j=0;j<items.length;j++){
                    var item=items[j];
                    var obj={};
                    obj.name=item.getAttribute('name');
                    obj.xtype=item.getAttribute('xtype');
                    names.push(obj);
                }
            }
            return names;
        }
        for(var i=0;i<table.length;i++){
            var names = selectItemValue(table[i],true);
            for(var j=0;j<detail.length;j++){
                var obj={};
                obj.name=detail[j].getAttribute('name');
                obj.xtype=detail[j].getAttribute('xtype');
                obj.fields=selectItemValue(detail[j]);
                names.push(obj);
            }
        }
        var datas={};
        for(var i=0;i<names.length;i++){
            var name=names[i];
            var xtype=name.xtype;
            var item=Ext.ComponentQuery.query('#'+name.name);
            
            if(item && item.length>0){
                item=item[0];
                if('detailGrid'==xtype){
                    var store=item.getStore();
                    var values=[];
                    store.each(function(model){
                        var fields=model.fields;
                        var obj={};
                        fields.each(function(field){
                            obj[field.name]=model.get(field.name);
                        });
                        values.push(obj);
                    });
                    datas[name.name]=values;
                }else if('datefield'==xtype){
                    var dateValue=item.getValue();
                    if(dateValue){
                        datas[name.name]=dateValue.getTime();
                    }
                }else{
                    datas[name.name]=item.getValue();
                }
            }
        }
        return datas;
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
        var gridTxtlabel = item.getAttribute('txtlabel');
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
        for(var i=0;i<tds.length;i++){
            var td=tds[i];
            var widget=searchWidget(td);
            if(!widget)break;
            var xtype=widget.getAttribute('xtype');
            var wname=widget.getAttribute('name');
            var chmod = item.getAttribute('chmod');
            widget.setAttribute('name',name+'_'+wname);
            wname=widget.getAttribute('name');
            fields.push(wname);
            var txtlabel = widget.getAttribute('txtlabel');
            var obj={
                header:txtlabel,
                flex:1,
                dataIndex:wname
            };
            if(xtype=='textfield'){
                obj.editor=me.createTextfield(widget,true);
                obj.hidden=obj.editor.hidden;
                obj.disabled =obj.editor.readOnly;
            }else if(xtype=='textareafield'){
                obj.editor=me.createTextfield(widget,true);
                obj.hidden=obj.editor.hidden;
                obj.disabled =obj.editor.readOnly;
            }else if(xtype=='datefield'){
                obj.editor=me.createDatefield(widget,true);
                //obj.renderer=function(v){
                //    return v?Ext.Date.format(new Date(v),obj.editor.format):v;
                //};
                obj.hidden=obj.editor.hidden;
                obj.disabled =obj.editor.readOnly;
            }else if(xtype=='combo'){
                obj.editor=me.createCombos(widget,true);
                obj.hidden=obj.editor.hidden;
                obj.disabled =obj.editor.readOnly;
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
                obj.hidden=obj.editor.hidden;
                obj.disabled =obj.editor.readOnly;
            }else if(xtype == 'userselector' || xtype == 'depselector' || xtype == 'posselector'){
                if(xtype=='userselector'){
                    obj.editor= new Ext.form.field.Trigger({
                        triggerClass : 'x-form-browse-trigger',
                        editable:false,
                        itemId:wname+i,
                        readOnly: chmod == 1?true: false,
                        readOnlyCls:'x-item-disabled',
                        hidden: chmod == 2?true: false,
                        emptyText:userRoleRes.changeUsers,
                        onTriggerClick:function(){
                            var rec = Ext.ComponentQuery.query('#'+name)[0].getSelectionModel().getSelection()[0];
                            Ext.widget('userSelector',{
                                resultBack:function(ids,values,usernames){
                                    if(rec){
                                        rec.set(wname,values); 
                                    }
                                }
                            }).show();
                        }
                    });
                    obj.hidden=obj.editor.hidden;
                    obj.disabled =obj.editor.readOnly;
                }
            }
            columns.push(obj);
        }
        var deleteCol={
            xtype: 'actioncolumn',
            width:30,
            sortable: false,
            items: [{
                iconCls: 'delete',
                tooltip: workFlowRes.deleteFlow,
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
//        var model = Ext.create('Ext.data.Model',{
//            fields: fields
//        });
        var storeData=[];
        if(value){
            storeData=Ext.decode(value);
        }
        var store=Ext.create('Ext.data.Store',{
            fields: fields,
            data:storeData
        });

        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });
         
        width=width?width.substr(0,width.length-2):1000;
        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            renderTo: span,
            columns: columns,
            itemId: name,
            titleAlign:'center',
            title:gridTxtlabel,
//            width: width,
            autoHeight:true,
            height: 250,
            margins:1,
            sType:'detail',
            tbar: [{
                text: flowFormRes.flowFormView.addRes,
                iconCls:'add',
                handler : function(){
                    store.insert(0,{fields:fields});
                    cellEditing.startEditByPosition({row: 0, column: 0});
                }
            }
            ],
            plugins: [cellEditing]
        });
        return grid;
    },
    createSelector:function(item,grid,table){
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
            name: name,
            itemId:name,
            labelWidth: 50,
            readOnly: chmod == 1?true: false,
            readOnlyCls:'x-item-disabled',
            hidden: chmod == 2?true: false
        };
        if(value){
            value=Ext.decode(value,true)
            config.value=value;
        }
        if(!grid){
            config.renderTo=span;
        }
        if(xtype == 'userselector'){
            config.emptyText=userRoleRes.changeUsers;
            config.onTriggerClick=function(){
                Ext.widget('userSelector',{
//                        type:'SINGLE',
                    returnObj:true,
                    resultBack: function(ids,names,userNames,records){
                        var widget = Ext.ComponentQuery.query('#'+name)[0];
                        widget.setValue(names);
                    }
                }).show();
                
            }
        }else if(xtype == 'depselector'){
            config.emptyText=userRoleRes.changeDepart;
            config.onTriggerClick=function(){
//                Ext.widget('userSelector',{
////                        type:'SINGLE',
//                    returnObj:true,
//                    resultBack: function(ids,names,userNames,records){
//                        var widget = Ext.ComponentQuery.query('#'+name)[0];
//                        console.log(widget)
//                        console.log('names',names)
//                        widget.setValue(names);
//                    }
//                }).show();

            }
        }else if(xtype == 'posselector'){
            config.emptyText=userRoleRes.changeDuty;
            config.onTriggerClick=function(){

            }
        }
        return new Ext.form.field.Trigger(config);
    },
    createBoxGroup:function(item,grid){
        var me=this;
        var name = item.getAttribute('name');
        var multiple = item.getAttribute('multiple');
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
        var inputs=$('input',item),groups=[];
        if(inputs && inputs.length>0){
            for(var i=0;i<inputs.length;i++){
                var input=inputs[i];
                var checked=input.getAttribute('checked');
                var obj={
                    boxLabel:input.getAttribute('txtlabel'),
                    name:input.getAttribute('name'),
                    inputValue:input.getAttribute('value'),
                    readOnly: chmod == 1?true: false,
                    readOnlyCls:'x-item-disabled',
                    hidden: chmod == 2?true: false
                }
                'checked'==checked?obj.checked=true:'';
                groups.push(obj);
            }
        }
        var config={
            labelWidth:1,
            name:name,
            itemId:name,
            items:groups
        }
        if(value){
            value=Ext.decode(value,true)
            config.value=value;
        }
        if(!grid){
            config.renderTo=span;
        }
        return multiple?Ext.widget('checkboxgroup',config):Ext.widget('radiogroup',config);
    },
    createCombos:function(item,grid){
        var me=this;
        var name = item.getAttribute('name');
        var multiple = item.getAttribute('multiple');
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
        var childs=item.childNodes;
        var data=[];
        if(childs && childs.length>0){
            for(var i=0;i<childs.length;i++){
                var option=childs[i];
                var optValue=option.getAttribute('value');
                var optDvalue=option.value;
                var obj={};
                obj.value=optValue;
                obj.name=optDvalue;
                data.push(obj);
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
        if(value){
            value=Ext.decode(value,true)
            config.value=value;
        }
        if(!grid){
            config.renderTo=span;
        }
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
            if(!grid){
                config.renderTo=span;
            }
            if(value){
                value=Ext.decode(value,true)
                var date=new Date();
                date.setTime(value);
                config.value=date
            }
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
                value=Ext.decode(value,true)
                var date=new Date();
                date.setTime(value);
                config.value=date;
            }
            if(!grid){
                config.renderTo=span;
            }
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
            config.value=Ext.decode(value,true);
        }
        if(!grid){
            config.renderTo=span;
        }
        return Ext.widget('textareafield',config);
    },
    createTextfield:function(item,grid){
        var me=this;
        var name = item.getAttribute('name');
        var value = item.getAttribute('value');
        var chmod = item.getAttribute('chmod');
        var xtype = item.getAttribute('xtype');
        var datatype = item.getAttribute('datatype');
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
            anchor: '100%',
            readOnly: chmod == 1?true: false,
            hidden: chmod == 2?true: false,
            readOnlyCls:'x-item-disabled'
        };
        if(datatype=='number'){
            config.hideTrigger= true;
            config.keyNavEnabled= false;
            config.mouseWheelEnabled= false;
        }
        if(value){
            config.value=Ext.decode(value,true);
        }
        if(!grid){
            config.renderTo=span;
        }
        if(datatype=='number'){
            return Ext.widget('numberfield',config);
        }
        return Ext.widget('textfield',config);
    }
});