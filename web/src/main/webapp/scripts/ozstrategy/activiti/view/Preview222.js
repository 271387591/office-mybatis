/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-10-14
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.view.Preview',{
    requires:[
        'Oz.form.FormDataCustomFiled'
//        'OzSOA.jiuzhai.view.UserSelector',
//        'OzSOA.jiuzhai.view.PositionSelector',
//        'OzSOA.jiuzhai.view.OrgSelector'
    ],
    extend:'Ext.panel.Panel',
    alias: 'widget.preview',
    itemId:'preview',
    maximizable:true,
    border:false,
    shim:false,
    editorStyle: 'margin: 5px 2px 0px 0px;color:#03386C;border-collapse:collapse;',
    thStyle:'font-weight: bold;text-align:center;background-color: #D0E0F4;padding: 2px 2px 2px 2px;',

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
                items:[
                    {
                        itemId: 'previewFormId',
                        checkboxToggle: false,
                        title: '业务表单',
                        xtype: 'fieldset',
                        autoScroll: true,
                        defaultType: 'textfield',
                        defaults: {               // defaults are applied to items, not the container
                            anchor: '100%'
                        },
                        collapsed: false,
                        listeners:{
                            afterrender:function(proto,props){
//            var count = me.items.items[0].body.dom.childNodes[0].childNodes[0].childElementCount;
                                //ckeditor的子节点(源码对应的数组节点).
//            Ext.ComponentQuery.query('#previewFormId')[0]
                                var arr = proto.body.dom;
                                try{
                                    arr=arr.childNodes;
                                }catch (e){
                                    arr=arr.children[0].childNodes;
                                }
                                Ext.each(arr,function(item){
                                    if(item.nodeName == 'P'){
                                        var childArr = item.childNodes;
                                        Ext.each(childArr,function(item){
                                            if(item.nodeName == 'INPUT'){
                                                me.convertWidget(item);
                                            }else if(item.nodeName == 'TEXTAREA'){
                                                me.convertWidget(item);
                                            }else if(item.nodeName == 'SELECT'){
                                                me.convertWidget(item)
                                            }
                                        });
                                    }else if(item.nodeName == 'TABLE'){
                                        if(item.getAttribute('xtype') != null && item.getAttribute('xtype') == 'grid'){
                                            me.convertWidget(item);
                                        }else{
                                            item.setAttribute('style',me.editorStyle);
                                            me.circleConvert(item);
                                        }
                                    }
                                });
                            }
//                            resize: function(form,width,height){
//                                form.setHeight(me.getHeight() - 8);
//                            }
                        },
                        html:html
                    }
                ]

            }
        ];
        me.callParent();
    },

    //创建一个span去追加到原始html控件后面。
    createSpan:function(item){
        var span = document.createElement('span');
        var newNode = item.cloneNode(true);
        span.appendChild(newNode);
        item.parentNode.insertBefore(span,item);
        item.parentNode.removeChild(item);
        var arr = [span,newNode];
        return arr;
    },
    //创建extjs控件。
    convertWidget: function(item){
        var me = this;
        var xtype = item.getAttribute('xtype');
        var name = item.getAttribute('name');
        var value = item.getAttribute('value');
        var width = item.getAttribute('width');
        var height = item.getAttribute('height');
        var nodeType = item.nodeName;
        var chmod = item.getAttribute('chmod');

        if(xtype != null){
            if(xtype == 'userselector'){
                this.createGroupBox(item,name,value,'选择人员',width,xtype,chmod);
            }else if(xtype == 'depselector'){
                this.createGroupBox(item,name,value,'选择部门',width,xtype,chmod);
            }else if(xtype == 'posselector'){
                this.createGroupBox(item,name,value,'选择岗位',width,xtype,chmod);
            }else if(xtype == 'datefield'){
                var arr = me.createSpan(item);
                var span = arr[0];
                Ext.create('Ext.container.Container', {
                    layout: {
                        type: 'hbox'
                    },
                    width: 400,
                    renderTo: span,
                    border: 1,
                    items: [{
                        xtype: 'datefield',
                        itemId: name,
                        disabled: chmod == 1?true: false,
                        hidden: chmod == 2?true: false,
                        format:'Y-m-d H:i:s',
                        handler:function(){
                            alert('a');
                        }
                    }]
                });
                span.removeChild(arr[1]);
            }else if(xtype == 'fileattach'){
                this.createGroupBox(item,name,value,'选择附件',width,chmod);
            }else if(xtype == 'grid'){
                var gridName = item.getAttribute('name');
                var firstTD = item.childNodes[1].childNodes[1].childNodes;
                var secondTD = item.childNodes[1].childNodes[3].childNodes;
                var columns = new Array();
                var i = 0;
                var j = 0;
                var names = new Array();
                var error;
                var modelData = new Array();
                var editors = new Array();
                Ext.each(secondTD,function(item){
                    if(item.nodeName == 'TD' || item.nodeName == 'TH'){
                        if(item.childNodes[0].nodeName != '#text'){
                            var name = item.childNodes[0].getAttribute('name');
                            if(name != null){
                                names[j] = name;
                                modelData[j] = {name:name};
                            }
                            var xtype = item.childNodes[0].getAttribute('xtype');
                            if(xtype != null){
                                if(xtype == 'userselector'){
                                    editors[j] = {
                                        xtype: 'formDataCustomFiled',
                                        name: name,
                                        itemId: name,
                                        labelWidth: 50,
                                        width: width,
                                        msgTarget: 'side',
                                        anchor: '100%',
                                        buttonText:'选择人员',
                                        onClick:function(){
                                            Ext.widget('userSelector',{
//                                                type:'SINGLE',
                                                returnObj:true,
                                                resultBack: function(ids,names,records){
//                                                    console.log(orgId,orgName);
                                                    Ext.ComponentQuery.query('#' + name)[0].selectorObj = records;
                                                    var rec = Ext.ComponentQuery.query('#'+gridName)[0].getSelectionModel().getSelection()[0];
                                                    rec.set(name,names);
                                                    rec.set(name + 'Id',ids);
                                                }
                                            }).show();
                                        }

                                    };
                                }else if(xtype == 'depselector'){
                                    editors[j] = {
                                        xtype: 'formDataCustomFiled',
                                        allowBlank: false,
                                        name: name,
                                        itemId:name,
                                        labelWidth: 50,
                                        msgTarget: 'side',
                                        anchor: '100%',
                                        buttonText:'选择部门',
                                        onClick:function(){
                                            Ext.widget('orgSelector',{
//                                                type:'SINGLE',
                                                returnObj:true,
                                                resultBack: function(orgId,orgName,records){
//                                                    console.log(orgId,orgName);
                                                    Ext.ComponentQuery.query('#' + name)[0].selectorObj = records;
                                                    var rec = Ext.ComponentQuery.query('#'+gridName)[0].getSelectionModel().getSelection()[0];
                                                    rec.set(name,orgName);
                                                    rec.set(name + 'Id',orgId);
                                                }
                                            }).show();
                                        }
                                    };
                                }else if (xtype == 'posselector'){
                                    editors[j] = {
                                        xtype: 'formDataCustomFiled',
                                        allowBlank: false,
                                        name: name,
                                        itemId:name,
                                        labelWidth: 50,
                                        msgTarget: 'side',
                                        anchor: '100%',
                                        buttonText:'选择岗位',
                                        onClick:function(){
                                            Ext.widget('positionSelector',{
//                                                type:'SINGLE',
                                                returnObj:true,
                                                resultBack: function(posId,posName,records){
//                                                    console.log(posId,posName);
                                                    Ext.ComponentQuery.query('#' + name)[0].selectorObj = records;
                                                    var rec = Ext.ComponentQuery.query('#'+gridName)[0].getSelectionModel().getSelection()[0];
                                                    rec.set(name,posName);
                                                    rec.set(name + 'Id',posId);
                                                }
                                            }).show();
                                        }
                                    }
                                }else if(xtype == 'datefield'){
                                    var dataFormat = item.childNodes[0].getAttribute('dataformat');
                                    if(dataFormat == 'yyyy-MM-dd'){
                                        dataFormat = 'Y-m-d';
                                    }else{
                                        dataFormat = 'Y-m-d H:i:s'
                                    }
                                    editors[j] = {
                                        xtype: 'datefield',
                                        allowBlank: false,
                                        itemId: name,
                                        name: name,
                                        format: dataFormat,
                                        minValue: '01-01-06'
                                    }
                                }
                            }else if(item.childNodes[0].nodeName == 'SELECT'){
                              var multiple = item.childNodes[0].getAttribute('multiple');
                              var data = new Array();
                              var options = item.childNodes[0].childNodes;
                              var count = 0;
                              var selectObj = [];
                              Ext.each(options,function(item){
                                var abbr = item.getAttribute('value');
                                var name = item.innerHTML;
                                data[count] = {'abbr':abbr,'name':name};
                                selectObj.push({value: abbr,label: name});
                                count++;
                              });
                              var states = Ext.create('Ext.data.Store', {
                                fields: ['abbr', 'name'],
                                data : data
                              });
                              editors[j] = {
                                  xtype: 'combobox',
                                  itemId: name,
                                  selectObj: selectObj,
                                  width: width,
                                  store: states,
                                  disabled: chmod == 1?true: false,
                                  hidden: chmod == 2?true: false,
                                  displayField: 'name',
//                                  valueField: 'abbr',
                                  multiSelect: multiple
//                                  listeners:{
//                                    select: function(combo, records, eOpts){
//                                      var rec = Ext.ComponentQuery.query('#'+gridName)[0].getSelectionModel().getSelection()[0];
//                                      var snames=[];
//                                      Ext.Array.each(records,function(record){
//                                        var sname=record.get('name');
//                                        var value=record.get('abbr');
//                                        var obj={};
//                                        obj.value=value;
//                                        obj.label=sname;
//                                        snames.push(obj);
//                                      });
//                                      rec.set(name,snames);
//                                      console.log(rec);
////                                        rec.set(name + 'Id',posId);
//                                    }
//
//                                  }

                              };
                            }else{
                                editors[j] = {
                                  xtype: 'textfield',
                                  itemId: name,
                                  allowBlank: false
                            };
                            }
                        }else{
                            names[j] = '';
                            error = '明细表格式错误,第二行必须插入控件!';
                        }
                        j++;
                    }
                });
                if(error != null){
                    alert(error);
                    return;
                }
                Ext.each(firstTD,function(item){
                    if(item.nodeName == 'TD' || item.nodeName == 'TH'){
                        columns[i] = {header:item.innerHTML,flex:1,dataIndex: names[i],editor:editors[i],renderer:function(v,metaData,record){
                            if(v instanceof Date){
                                return Ext.Date.format(new Date(v),'Y-m-d');
                            }
//                            else if(v instanceof Array){
//                              var data=[];
//                              Ext.Array.each(v,function(obj){
//                                data.push(obj.label);
//                              })
//                              return data.join(',');
//                            }
                            return v;
                        }};
                      i++;
                    }
                });
                columns[i] = {
                    xtype: 'actioncolumn',
                    width:80,
                    sortable: false,
                    items: [{
                        icon: 'scripts/shared/icons/fam/delete.gif',
                        tooltip: '删除该行',
                        handler: function(grid, rowIndex, colIndex) {
                            store.removeAt(rowIndex);
                        }
                    }]
                }
                var arr = me.createSpan(item);
                var span = arr[0];
                Ext.define('Plant',{
                    extend: 'Ext.data.Model',
                    fields: modelData
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
                    height: 200,
                    sType:'detail',
//                    title: '明细表',
//                    frame: true,
                    tbar: [{
                        text: '添加记录',
                        iconCls:'add',
                        handler : function(){
                            var r = Ext.create('Plant',{

                            });
                            store.insert(0,r);
                            cellEditing.startEditByPosition({row: 0, column: 0});
                        }
                    }
//                        {
//                            text: '删除记录',
//                            handler: function(){
//
//                            }
//                        }
                    ],
                    plugins: [cellEditing]
                });

                span.removeChild(arr[1]);
            }else if (xtype == 'entitySelect'){
                var model = item.getAttribute('source');
                Ext.Ajax.request({
                    url:'html/flowFormDataController/sourceValues',
                    params: {'model':model},
                    method: 'POST',
                    success: function (response, options){
                        var result=Ext.decode(response.responseText);
                        if(result.result){
                            var data = new Array();
                            var communicate = result.communicate;
                            var count = 0;
                            for(var key in communicate){
                                data[count] = {'abbr':key,'name':communicate[key]};
                                count++;
                            }
                            var states = Ext.create('Ext.data.Store', {
                                fields: ['abbr', 'name'],
                                data : data
                            });
                            var arr = me.createSpan(item);
                            var span = arr[0];
                            Ext.create('Ext.form.field.ComboBox', {
                                fieldLabel: '选择实例:',
                                itemId: name,
                                store: states,
                                disabled: chmod == 1?true: false,
                                hidden: chmod == 2?true: false,
                                displayField: 'name',
                                valueField: 'abbr',
                                itemId: name,
                                renderTo: span
                            });
                            span.removeChild(arr[1]);
                        }
                    },
                    failure: function (response, options) {
                        Ext.MessageBox.alert('失败', '请求超时或网络故障,错误编号：' + response.status);
                    }
                });
            }
        }else{
            if(nodeType == 'INPUT'){
                var type = item.getAttribute('type');
                if(type == 'hidden'){
                    me.createInput(item,value,width,name,'Hidden',chmod);
                }else if(type == 'checkbox'){
//                    me.createInput(item,value,width,name,'Checkbox');
                }else if(type == 'radio'){
//                    console.log(item.previousSibling);
//                    console.log(item.nextSibling);
//                    me.createInput(item,value,width,name,'Radio');
                }else{
                    me.createInput(item,value,width,name,'Text',chmod);
                }
            }else if(nodeType == 'TEXTAREA'){
                me.createInput(item,value,width,name,'TextArea',chmod);
            }else if(nodeType == 'SELECT'){
                var multiple = item.getAttribute('multiple');
                var data = new Array();
                var options = item.childNodes;
                var count = 0;
                var selectObj = [];
                Ext.each(options,function(item){
                    var abbr = item.getAttribute('value');
                    var name = item.innerHTML;
                    data[count] = {'abbr':abbr,'name':name};
                    selectObj.push({value: abbr,label: name});
                    count++;
                });
                var states = Ext.create('Ext.data.Store', {
                    fields: ['abbr', 'name'],
                    data : data
                });
                var arr = me.createSpan(item);
                var span = arr[0];
                Ext.create('Ext.form.field.ComboBox', {
//                    fieldLabel: '下拉框',
                    itemId: name,
                    selectObj: selectObj,
                    width: width,
                    store: states,
                    disabled: chmod == 1?true: false,
                    hidden: chmod == 2?true: false,
                    displayField: 'name',
                    valueField: 'abbr',
                    multiSelect: multiple,
//                    itemId: name,
                    renderTo: span
                });
                span.removeChild(arr[1]);
            }
        }
    },
    //循环替换成extjs控件。
    circleConvert: function(item){
        var me = this;
        var trArray = item.childNodes[1].childNodes;
        Ext.each(trArray,function(item){
            if(item.nodeName == 'TR'){
                var tdArray = item.childNodes;
                Ext.each(tdArray,function(item){
                    if(item.nodeName == 'TD' || item.nodeName == 'TH'){
                        if(item.nodeName == 'TH'){
                            item.setAttribute('style',me.thStyle);
                        }
                        var array = item.childNodes;
                        Ext.each(array,function(item){
                            if(item.nodeName != '#text' && item.getAttribute('chmod') != null && item.getAttribute('chmod') == 2){
                                item.parentNode.parentNode.setAttribute('style','display:none;');
                            }
                            if(item.nodeName == 'INPUT'){
                                me.convertWidget(item);
                            }else if(item.nodeName == 'TABLE'){
                                if(item.getAttribute('xtype') != null && item.getAttribute('xtype') == 'grid'){
                                    me.convertWidget(item);
                                }else{
                                    item.setAttribute('style',me.editorStyle);
                                    me.circleConvert(item);
                                }
                            }else if(item.nodeName == 'TEXTAREA'){
                                me.convertWidget(item);
                            }else if(item.nodeName == 'SELECT'){
                                me.convertWidget(item)
                            }
                        });
                    }
                });
            }
        });
    },
    //把自定义控件替换成extjs控件.
    createGroupBox: function(item,name,value,str,width,xtype,chmod){
        var me = this;
        var arr = me.createSpan(item);
        var span = arr[0];
        Ext.create('FlexCenter.activiti.view.GroupBox',{name:name,value:value,str:str,span:span,fieldWidth:width,fieldXtype:xtype,chmod:chmod});
        span.removeChild(arr[1]);
    },
    //过滤相同单选复选框的name
    filtrationName: function(names,elements,i,type,count){
        var template = 0;
        for(var j = i - 1 ; j >= 0 ; j--){
            if(elements[j].getAttribute('type') == type){
                if(elements[j].getAttribute('name') == elements[i].getAttribute('name')){
                    template++;
                    break;
                }
            }
        }
        if(template == 0){
            names[count] = elements[i].getAttribute('name');
            count++;
        }
        return count;
    },
    //替换原始控件
    createInput: function(item,value,width,name,appendName,chmod){
        var me = this;
        var arr = me.createSpan(item);
        var span = arr[0];
        if(appendName == 'Radio'){

//            Ext.create('Ext.form.field.'+appendName, {
//                width: width||120,
//                itemId: name,
//                renderTo: span,
//                items:[{
//
//                }]
//            });
        }else if(appendName == 'Checkbox'){

        }else{
            var config= {
                width: width||120,
                itemId: name,
                value: value,
                renderTo: span,
                readOnly:chmod == 1?true: false,
                readOnlyCls:'x-item-disabled',
//                disabled: chmod == 1?true: false,
                hidden: chmod == 2?true: false
            };
            if(appendName=='Date'){
                config.format='Y-m-d'
            }
            Ext.create('Ext.form.field.'+appendName, config);
        }
        span.removeChild(arr[1]);
    },
    //循环获取控件的name,用来查找itemId获取值.
    circleGetGridName: function(item,count,names){
        var me = this;
        var trArray = item.childNodes[1].childNodes;
        Ext.each(trArray,function(item){
            if(item.nodeName == 'TR'){
                var tdArray = item.childNodes;
                Ext.each(tdArray,function(item){
                    if(item.nodeName == 'TD' || item.nodeName == 'TH'){
                        var array = item.childNodes;
                        Ext.each(array,function(item){
                            if(item.nodeName == 'TABLE'){
                                if(item.getAttribute('xtype') != null && item.getAttribute('xtype') == 'grid'){
                                    count = me.getGridName(item,count,names);
                                }else{
                                    count = me.circleGetGridName(item,count,names);
                                }
                            }
                        });
                    }
                });
            }
        });
        return count;
    },
    //获取grid的name.
    getGridName: function(item,count,names){
        names[count] = item.getAttribute('name');
        item.parentNode.removeChild(item);
        count++;
        return count;
    },
    getGridValue: function(html){
//        console.log(html)
        var me=this;
        var form = document.createElement('form');
        form.innerHTML = html;
        var names = new Array();
        var count = 0;
        var nodes = form.childNodes;
        //迭代找出明细表的名字。用来获取明细表中的数组对象。
        Ext.each(nodes,function(item){
            if(item.nodeName == 'TABLE'){
                if(item.getAttribute('xtype') != null && item.getAttribute('xtype') == 'grid'){
                    count = me.getGridName(item,count,names);
                }else{
                    count = me.circleGetGridName(item,count,names);
                }
            }
        });
        //迭代找出其他单一控件的值。
        var elements = form.elements;
        var radioNames = new Array();
        var checkboxNames = new Array();
        var userSelectorNames = new Array();
        var depSelectorNames = new Array();
        var posSelectorNames = new Array();
        var selectNames = new Array();
        var radioCount = 0;
        var checkboxCount = 0;
        var userSelectorCount = 0;
        var depSelectorCount = 0;
        var posSelectorCount = 0;
        var selectCount = 0;

        for(var i = 0 ; i < elements.length ; i++){
            if(elements[i].getAttribute('type') == 'radio'){
                radioCount = me.filtrationName(radioNames,elements,i,'radio',radioCount);
            }else if(elements[i].getAttribute('type') == 'checkbox'){
                checkboxCount = me.filtrationName(checkboxNames,elements,i,'checkbox',checkboxCount);
            }else if(elements[i].nodeName == 'SELECT'){
                selectNames[selectCount] = elements[i].getAttribute('name');
                selectCount++;
            }else if(elements[i].getAttribute('xtype') == 'userselector'){
                userSelectorNames[userSelectorCount] = elements[i].getAttribute('name');
                userSelectorCount++;
            }else if(elements[i].getAttribute('xtype') == 'depselector'){
                depSelectorNames[depSelectorCount] = elements[i].getAttribute('name');
                depSelectorCount++;
            }else if(elements[i].getAttribute('xtype') == 'posselector'){
                posSelectorNames[posSelectorCount] = elements[i].getAttribute('name');
                posSelectorCount++;
            }else{
                names[count] = elements[i].getAttribute('name');
                count++;
            }
        }
        var value = {};
        console.log('names',names)
        Ext.each(names,function(item){
            var name = item;
            var component = Ext.ComponentQuery.query('#' + item)[0];
            if(component){
                if(component.sType  && component.sType == 'detail'){
                    var store = component.getStore();
                    var values=[];
                    store.each(function(model){
                        var fields=model.fields;
                        var data={};
                        fields.each(function(field){
                            //明细表中控件的name
                            var name=field.name;
                            //明细表的组建
                            var component = Ext.ComponentQuery.query('#' + name)[0];
                            if(component == null){
                                data[name] = '';
                            }else{
                                if(component.xtype == 'combobox'){
                                    var selectValues = component.getValue();
                                    var checkValues = [];
                                    Ext.each(selectValues,function(item){
                                        Ext.each(component.selectObj,function(record){
                                            if(item == record.label){
                                                checkValues.push(record);
                                            }
                                        });
                                    });
                                    data[name] = checkValues;
                                }else if(component.xtype == 'formDataCustomFiled'){
                                    data[name] = component.selectorObj;
                                }else{
                                    data[name] = component.getValue() || '';
                                }
                            }
//                        data[name]=model.get(name);
                        })
                        values.push(data);
                    });
                    value[name]=values;
//                var gridValue = component.store.data.items;
//                Ext.each(gridValue,function(item){
//                    value[name] = item.data || '';
//
//                });
                }else if(component.xtype == 'formDataCustomFiled'){
                    value[name] = component.propertiesId || '';
                }else if(component.xtype == 'datefield'){
                    value[name] = Ext.util.Format.date(component.getValue(), 'Y-m-d H:i:s');
                }else{
                    value[name] = component.getValue() || '';
                }
            }
        });
        //构造单选框的值.
        Ext.each(radioNames,function(item){
            var radioName = item;
            var radioElements = document.getElementsByName(radioName);
            Ext.each(radioElements,function(item){
                if(item.checked){
                    var name = item.getAttribute('txtlabel');
                    var map = [{label: name,value: item.value}];
                    value[radioName] = map || '';
                }
            });
        });
        //构造复选框的值
        Ext.each(checkboxNames,function(item){
            var checkboxName = item;
            var checkboxElements = document.getElementsByName(checkboxName);
            var itemValue = [];
            var i = 0;
            Ext.each(checkboxElements,function(item){
                if(item.checked){
                    var name = item.getAttribute('txtlabel');
                    var map = [{label: name,value: item.value}];
                    itemValue[i] = map;
                    i++
                }
            });

            value[checkboxName] = itemValue || '';
        });
        //构造人员选择器的值
        Ext.each(userSelectorNames,function(item){
          var userSelectorName = item;
//          Ext.each(depSelectorElements,function(item){
//            var depSelector = Ext.ComponentQuery.query('#' + )[0];
//            console.log(depSelector);
////            value[depSelectorName] = [{id: ,value:}]
//
//          });
          //这段代码需要去判断同一种选择器的name不能重复。
          var userSelector = Ext.ComponentQuery.query('#'+ userSelectorName)[0];
          value[userSelectorName] = userSelector.selectorObj || '';
        });
        //构造部门选择器的值
        Ext.each(depSelectorNames,function(item){
          var depSelectorName = item;
//          Ext.each(depSelectorElements,function(item){
//            var depSelector = Ext.ComponentQuery.query('#' + )[0];
//            console.log(depSelector);
////            value[depSelectorName] = [{id: ,value:}]
//
//          });
          //这段代码需要去判断同一种选择器的name不能重复。
          var depSelector = Ext.ComponentQuery.query('#'+ depSelectorName)[0];
          value[depSelectorName] = depSelector.selectorObj || '';
        });
        //构造岗位选择器的值
        Ext.each(posSelectorNames,function(item){
        var posSelectorName = item;
//            Ext.each(depSelectorElements,function(item){
//              var depSelector = Ext.ComponentQuery.query('#' + )[0];
//              console.log(depSelector);
//  //            value[depSelectorName] = [{id: ,value:}]
//
//            });
        //这段代码需要去判断同一种选择器的name不能重复。
          var posSelector = Ext.ComponentQuery.query('#'+ posSelectorName)[0];
          value[posSelectorName] = posSelector.selectorObj || '';
        });
        //构造下拉框的值
        Ext.each(selectNames,function(item){
          var selectName = item;
//          var selectElements = document.getElementsByName(selectName);
//          Ext.each(selectElements,function(item){
//            if(item.checked){
//              var name = item.getAttribute('txtlabel');
//              var map = [{name: name,value: item.value}];
//              value[radioName] = map || '';
//            }
//          });
          //这段代码需要去判断同一种选择器的name不能重复。
          var select = Ext.ComponentQuery.query('#' + selectName)[0];
          var selectValues = select.getValue();
          var checkValues = [];
          Ext.each(selectValues,function(item){
            Ext.each(select.selectObj,function(record){
              if(item == record.value){
                checkValues.push(record);
              }
            });
          });
          value[selectName] = checkValues || ''
        });

        console.log(value);
        return value;
    },
    dateFormat: function(value){
        if(null != value){
            return Ext.Date.format(new Date(value),'Y-m-d');
        }else{
            return null;
        }
    }
});