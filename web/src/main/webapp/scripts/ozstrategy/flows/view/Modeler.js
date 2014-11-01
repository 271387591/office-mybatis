/**
 * Created by lihao on 8/21/14.
 */
Ext.define('FlexCenter.flows.view.Modeler', {
    requires: [
        'FlexCenter.flows.view.FormFieldSetter',
        'Ext.ux.form.field.DateTimeField',
        'FlexCenter.flows.view.ProcessUserSetter',
        'FlexCenter.flows.view.CountersignTaskWindow'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.modeler',
    autoScroll: true,
    layout: 'border',
    navCellWidth:240,
    navCellHeight:35,
    graph:null,
    developer:true,
    process:null,
    bodyPadding:1,
    inheritableStatics: {
//      disableTooltip: false,

        setDisableTooltip: function (value) {
            this.disableTooltip = value;
        },

        isDisableTooltip: function () {
            return this.disableTooltip == true;
        }
    },
    initComponent: function () {
        var me = this;
        me.process=me.activity();
        if(me.processRecord){
            me.process.setProperties(me.processRecord)
        }
        var store=Ext.create('Ext.data.TreeStore', {
            storeId:'StartEventsStore',
            fields:['text','expanded','children','leaf','stencil'],
            root: {
                expanded: true,
                children: [
                    { text: "开始事件",expanded: false,iconCls:'start-events', children:[
                        { text: "开始", leaf: true,iconCls:'startevent-none',stencil:'StartNoneEvent' },
                        { text: "时间事件", leaf: true,iconCls:'startevent-timer',stencil:'StartTimerEvent' },
                        { text: "消息事件", leaf: true,iconCls:'startevent-message',stencil:'StartMessageEvent' },
                        { text: "错误事件", leaf: true,iconCls:'startevent-error',stencil:'StartErrorEvent' }
                    ] },
                    { text: "任务",expanded: false, children:[
                        { text: "用户任务", leaf: true,iconCls:'activity-type-user',stencil:'UserTask' },
                        { text: "Service task", leaf: true,iconCls:'activity-type-service',stencil:'ServiceTask' },
                        { text: "Script task", leaf: true,iconCls:'activity-type-script',stencil:'ScriptTask' },
                        { text: "Business rule task", leaf: true,iconCls:'activity-type-business-rule',stencil:'BusinessRule' },
                        { text: "Receive task", leaf: true,iconCls:'activity-type-receive',stencil:'ReceiveTask' },
                        { text: "Manual task", leaf: true,iconCls:'activity-type-manual',stencil:'ManualTask' },
                        { text: "Mail task", leaf: true,iconCls:'activity-type-send',stencil:'MailTask' }
                    ] },
                    { text: "子流程",expanded: false, children:[
                        { text: "普通子流程", leaf: true,iconCls:'structural-expanded-subprocess',stencil:'SubProcess'},
                        { text: "事件子流程", leaf: true,iconCls:'structural-event-subprocess',stencil:'EventSubProcess' },
                        { text: "Call activity", leaf: true,iconCls:'structural-task',stencil:'CallActivity' }
                    ] },
                    { text: "网关",expanded: false, children:[
                        { text: "排他网关", leaf: true,iconCls:'gateway-exclusive-databased',stencil:'ExclusiveGateway' },
                        { text: "归并网关", leaf: true,iconCls:'gateway-parallel',stencil:'ParallelGateway'  },
                        { text: "包含网关", leaf: true,iconCls:'gateway-inclusive',stencil:'InclusiveGateway'  },
                        { text: "Event gateway", leaf: true,iconCls:'gateway-eventbased',stencil:'EventGateway'  }
                    ] },
                    { text: "Boundary Events",expanded: false, children:[
                        { text: "Boundary error event", leaf: true,iconCls:'catching-error',stencil:'BoundaryErrorEvent' },
                        { text: "Boundary timer event", leaf: true,iconCls:'catching-timer',stencil:'BoundaryTimerEvent'  },
                        { text: "Boundary signal event", leaf: true,iconCls:'catching-signal',stencil:'BoundarySignalEvent'  }
                    ] },
                    { text: "Intermediate Catching Events",expanded: false, children:[
                        { text: "Intermediate timer catching event", leaf: true,iconCls:'intermediate-timer-catching-event',stencil:'CatchTimerEvent' },
                        { text: "Intermediate signal catching event", leaf: true,iconCls:'intermediate-signal-catching-event',stencil:'CatchSignalEvent' },
                        { text: "Intermediate message catching event", leaf: true,iconCls:'intermediate-message-catching-event',stencil:'CatchMessageEvent' }
                    ] },
                    { text: "Intermediate Throwing Events",expanded: false, children:[
                        { text: "Intermediate none throwing event", leaf: true,iconCls:'intermediate-none-throwing-event',stencil:'ThrowNoneEvent' },
                        { text: "Intermediate signal throwing event", leaf: true,iconCls:'intermediate-signal-throwing-event',stencil:'ThrowSignalEvent' }
                    ] },
                    { text: "结束事件",expanded: false, children:[
                        { text: "空结束", leaf: true,iconCls:'end-event',stencil:'EndNoneEvent' },
                        { text: "错误结束", leaf: true,iconCls:'end-error-event',stencil:'EndErrorEvent' }
                    ] }
                ]
            }
        });
        me.tbar=[
            {
                xtype: 'button',
                text: '重绘',
                iconCls: 'mxGraphRefresh',
                itemId: 'redrawActionId',
                handler:function(btn,evt){
                    me.redraw();
                }
            },'-',
            {
                xtype: 'button',
                text: '保存',
                iconCls: 'save',
                handler: function(button,evt){
                    me.savefunc();
                }
            },'-',
            {
                xtype: 'button',
                text: '删除',
                iconCls: 'mxGraphRemove',
                handler: function(button,evt){
                    me.deletefunc()
                }
            },'-',
            {
                xtype: 'button',
                text: '撤销',
                iconCls: 'undo',
                handler: function(button,evt){
                    me.undo();
                }
            },'-',
            {
                xtype: 'button',
                text: '恢复',
                iconCls: 'redo',
                handler: function(button,evt){
                    me.redo();
                }
            },'-',
            {
                xtype: 'button',
                text:'选择顶点',
                scope: this,
                handler:function()
                {
                    me.graph.selectVertices();
                }
            },'-',
            {
                xtype: 'button',
                text:'选择连接',
                scope: this,
                handler:function()
                {
                    me.graph.selectEdges();
                }
            },'-',
            {
                xtype: 'button',
                text:'全选',
                scope: this,
                handler:function()
                {
                    me.graph.selectAll();
                }
            }
            
        ];
        me.items=[
            {
                region: 'west',
                title: '流程元素',
                split: true,
                width: me.navCellWidth,
                itemId:'navGraphTree',
                xtype:'treepanel',
                rootVisible: false,
                collapsible: true,
                titleCollapse:true,
//                        onResize: function(){
//                            console.log('sdf')
////                            this.callParent(arguments);
////                            if(this.graph){
////                                this.graph.sizeDidChange();
////                            }
//                        },
                viewConfig: {
                    getRowClass: function(record, rowIndex, rowParams, store){
                        return (record.get('leaf')==false) ? "blue-grid-row" : "";
                    }
                },
                store:store
            },{
                region: 'east',
                title: '流程属性('+me.processRecord.name+')',
                collapsible: true,
                itemId:'graphProperties',
                split: true,
                width: 250,
                titleCollapse:true,
                autoScroll:true,
                items:me.Process()
            },{
                region: 'center',
                itemId:'graphContainer',
                autoScroll:true,
                listeners:{
                    afterrender:function(panel){
                        var dom=panel.body.dom.firstChild.children[0]
                        me.insertVertexTemplate(dom);
                    }
                },
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            iconCls: 'zoom',
                            text:'变焦',
                            menu: [{
                                text:'400%',
                                handler: function(item){
                                    me.graph.getView().setScale(4);
                                }
                            },
                                {
                                    text:'200%',
                                    handler: function(item){
                                        me.graph.getView().setScale(2);
                                    }
                                },
                                {
                                    text:'150%',
                                    scope:this,
                                    handler: function(item){
                                        me.graph.getView().setScale(1.5);
                                    }
                                },
                                {
                                    text:'100%',
                                    scope:this,
                                    handler: function(item){
                                        me.graph.getView().setScale(1);
                                    }
                                },
                                {
                                    text:'75%',
                                    scope:this,
                                    handler: function(item){
                                        me.graph.getView().setScale(0.75);
                                    }
                                },
                                {
                                    text:'50%',
                                    scope:this,
                                    handler: function(item){
                                        me.graph.getView().setScale(0.5);
                                    }
                                },
                                {
                                    text:'25%',
                                    scope:this,
                                    handler: function(item){
                                        me.graph.getView().setScale(0.25);
                                    }
                                }]

                        },
                        {
                            iconCls: 'zoom',
                            tooltip: '缩放比例',
                            handler: function(button,evt){
                                Ext.Msg.prompt('缩放比例','请输入要缩放的比例',function(btn,text){
                                    if(btn=='ok'){
                                        text=parseInt(text);
                                        if(!isNaN(text)){
                                            me.graph.getView().setScale(text / 100);
                                        }
                                    }
                                });
                            }
                        },'-',
                        {
                            iconCls: 'zoomIn',
                            tooltip: '放大',
                            handler: function(button,evt){
                                me.zoomIn();
                            }
                        },'-',
                        {
                            iconCls: 'zoomOut',
                            tooltip: '缩小',
                            handler: function(button,evt){
                                me.zoomOut();
                            }
                        },'-',
                        {
                            iconCls: 'zoomActual',
                            tooltip: '实际大小',
                            handler: function(button,evt){
                                me.actualSize();
                            }
                        }
                        ,'->',
                        {
                            xtype:'button',
                            text: '预览',
                            enableToggle: true,
                            toggleHandler: function(btn,press){
                                me.showPreviewWin(btn,press);
                            },
                            pressed: false
                        }
                    ]
                }]
            }
            
        ];
        me.callParent(arguments);
    },
    savefunc:function(){
        var me=this,graRes;
        if(me.graph){
            var encoder = new mxCodec();
            var model=me.graph.getModel();
            var root = model.getRoot();
            var doc = mxUtils.createXmlDocument();
            var process = doc.createElement('Process');
            process.setAttribute('name', me.processRecord.name?me.processRecord.name:'');
            process.setAttribute('category', me.processRecord.category?me.processRecord.category:'');
            process.setAttribute('documentation', me.processRecord.documentation?me.processRecord.documentation:'');
            root.setValue(process);
            var node = encoder.encode(model);
            graRes= mxUtils.getPrettyXml(node);
            console.log(graRes);
        }
        var win=Ext.widget('processListForm',{
            buttonSave:true,
            graRes:graRes,
            processRecord:me.processRecord
//            process:me.process
        });
        me.mon(win, 'updateFlow', function (data) {
            me.fireEvent('updateFlow',data);
            win.close();
        });
        win.show();
    },
    redraw:function(){
        this.graph.model.clear();
    },
    deletefunc:function(){
        this.editor.execute('delete');
    },
    undo:function(){
        this.editor.execute('undo');
    },
    redo:function(){
        this.editor.execute('redo');
    },
    zoomIn:function(){
        this.editor.execute('zoomIn');
    },
    zoomOut:function(){
        this.editor.execute('zoomOut');
    },
    actualSize:function(){
        this.editor.execute('actualSize');
    },
    copy:function(){
        this.editor.execute('copy');
    },
    cut:function(){
        this.editor.execute('cut');
    },
    paste:function(){
        this.editor.execute('paste');
    },
    edit:function(){
        this.graph.startEditing();
    },
    blurValue:function(form,cell,obj){
        var data = form.getForm().getValues();
        obj.properties=data;
        cell.value.setAttribute('activity',Ext.encode(obj));
    },
    showPreviewWin:function (btn, pressed) {
        var me=this;
        var win = me.getPreviewWin();
        if (pressed) {
            win.show();
            win.alignTo(me.down('#graphContainer').getEl(), 'br-br?', [0, -27]);
            if (me.outline){
                me.outline.update(true);
            }
        }
        else {
            win.hide();
        }

    },
    getPreviewWin:function(){
        var me=this;
        if (!me.previewWin) {
            me.previewWin = Ext.widget('panel', {
                renderTo: me.down('#graphContainer').getEl(),
                bodyCls: 'graph-body-cls',
                height: 150,
                width:150,
                alignTo:function (element, position, offsets) {
                    if (element && element != null && element.isComponent) {
                        element = element.getEl();
                    }
                    if (this.el) {
                        var xy = this.el.getAlignToXY(element, position, offsets);
                        this.setPagePosition(xy);
                    }
                    return this;
                },
                listeners: {
                    scope: this,
                    afterrender: function(panel){
                        var dom=panel.body.dom.firstChild.children[0]
                        var outline = new mxOutline(me.graph, dom);
                        dom.style.cursor = 'move';
                        dom.style.position = 'absolute';
                    }
                }
            });
        }
        return me.previewWin;
    },
    activity:function(cell){
        var obj=function(cell){
            
            this.childShapes=[];
            this.dockers=[];
            this.stencil={id:''};
            this.outgoing=[];
            this.properties={};
            if(cell && mxUtils.isNode(cell.value)){
                this.resourceId=cell.id;
                this.setStencil(cell.value.nodeName);
//                this.addOutgoing(cell);
                this.setBounds(cell.geometry.x,cell.geometry.y,cell.geometry.width,cell.geometry.height);
            }else if(cell && cell.isEdge){
                this.resourceId=cell.id;
                this.stencil={id:'SequenceFlow'};
                this.outgoing.push({resourceId:cell.source.id});
                this.setTarget(cell.target.id)
                this.dockers=[
                    {
                        "x": 50.0,
                        "y": 30.0
                    },
                    {
                        "x": 192.0,
                        "y": 30.0
                    },
                    {
                        "x": 192.0,
                        "y": 30.1
                    },
                    {
                        "x": 50.0,
                        "y": 30.0
                    }
                ];
            }
        };
        
        obj.prototype.addChildShapes=function(shapes){
            this.childShapes.push(shapes);
        }
        obj.prototype.clearChildShapes=function(shapes){
            this.childShapes=[];
        }
        obj.prototype.setStencil=function(id){
            this.stencil.id=id;
        }
        obj.prototype.setResourceId=function(resourceId){
            this.resourceId=resourceId;
        }
        obj.prototype.addDockers=function(docker){
            this.dockers.push(docker);
        }
        obj.prototype.addOutgoing=function(cell){
            var edges=cell.edges;
            if(edges){
                for(var i=0;i<edges.length;i++){
                    var edgeObj={
                        resourceId:edges[i].id
                    };
                    this.outgoing.push(edgeObj);
                }
            }
        }
        obj.prototype.setBounds=function(x,y,width,height){
            this.bounds={
                upperLeft:{
                    x:x,
                    y:y
                },
                lowerRight:{
                    x:x+width,
                    y:y+height
                }
            };
        }
        obj.prototype.setProperties=function(properties){
            this.properties=properties;
        }
        obj.prototype.setTarget=function(target){
            this.target={
                resourceId:target
            }
        }
        
        return new obj(cell);
    },
    Process:function(){
        var me=this;
        var process_id=me.processRecord?('process_'+me.processRecord.id):('process_'+new Date().getTime());
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            bodyPadding:5,
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'process_id',
                    value:process_id,
                    listeners:{
                        afterrender:function(f){
                            me.processRecord.process_id= f.getValue();
                        }
                    }
                },
                {
                    xtype:'hidden',
                    name:'globalTypeId',
                    value:me.processRecord.globalTypeId,
                    listeners:{
                        afterrender:function(f){
                            me.processRecord.globalTypeId= f.getValue();
                        }
                    }
                },
                {
                    xtype:'hidden',
                    name:'id',
                    value:me.processRecord.id,
                    listeners:{
                        afterrender:function(f){
                            me.processRecord.id= f.getValue();
                        }
                    }
                },
                {
                    xtype:'hidden',
                    name:'flowFormId',
                    value:me.processRecord.flowFormId,
                    listeners:{
                        afterrender:function(f){
                            me.processRecord.flowFormId= f.getValue();
                        }
                    }
                },
                {
                    fieldLabel: '流程名称',
                    name: 'name',
                    value:me.processRecord.name,
                    listeners:{
                        afterrender:function(f){
                            me.processRecord.name= f.getValue();
                        },
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.processRecord.name=newValue;
                        }
                    }
                },
                {
                    fieldLabel: '引用表单',
                    name:'flowFormName',
                    readOnly:true,
                    value:me.processRecord.flowFormName,
                    readOnlyCls:'x-item-disabled'
                },
                {
                    fieldLabel: '流程分类',
                    name:'category',
                    readOnly:true,
                    value:me.processRecord.category,
                    readOnlyCls:'x-item-disabled'
                },{
                    xtype:'textareafield',
                    grow: true,
                    fieldLabel:'描述',
                    name:'documentation',
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.processRecord.documentation=newValue;
                        }
                    }
                }]
        });
        return form;
    },
    SequenceFlow:function(cell){
        var me=this;
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid',
                    value:cell.value.getAttribute('overrideid')
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },{
                    fieldLabel: '流程条件',
                    name: 'conditionsequenceflow',
                    value:cell.value.getAttribute('conditionsequenceflow'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('conditionsequenceflow',newValue);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    hidden:!me.developer,
                    fieldLabel: '默认流',
                    valueField: 'type',
                    displayField: 'displayText',
                    value:cell.value.getAttribute('defaultflow','None'),
                    name:'defaultflow',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['None', '标准'],
                            ['Default', '默认流程']
                        ]
                    }),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('defaultflow',newValue);
                            if(newValue == 'Default'){
                                var overlay = new mxCellOverlay(new mxImage('mxgraph/images/connector/list/type.default.png', 11, 11),'默认流程',mxConstants.ALIGN_CENTER,mxConstants.ALIGN_MIDDLE);
                                overlay.id='defaultflow';
                                me.graph.addCellOverlay(cell, overlay);
                            }else{
                                var overlays=cell.overlays;
                                if(overlays){
                                    for(var i=0;i<overlays.length;i++){
                                        if(overlays[i].id=='defaultflow'){
                                            me.graph.removeCellOverlay(cell, overlays[i]);
                                        }
                                    }
                                }
                                
                            }
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    hidden:!me.developer,
                    fieldLabel: '条件流',
                    valueField: 'type',
                    displayField: 'displayText',
                    value:cell.value.getAttribute('conditionalflow','None'),
                    name:'conditionalflow',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['None', '标准'],
                            ['Conditional', '条件流程']
                        ]
                    }),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('conditionalflow',newValue);
                            if(newValue == 'Conditional'){
                                var overlay = new mxCellOverlay(new mxImage('mxgraph/images/connector/list/type.expression.png', 11, 11),'默认流程',mxConstants.ALIGN_CENTER,mxConstants.ALIGN_MIDDLE);
                                overlay.id='conditionalflow';
                                me.graph.addCellOverlay(cell, overlay);
                            }else{
                                var overlays=cell.overlays;
                                if(overlays){
                                    for(var i=0;i<overlays.length;i++){
                                        if(overlays[i].id=='conditionalflow'){
                                            me.graph.removeCellOverlay(cell, overlays[i]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    value:cell.value.getAttribute('documentation'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('documentation',newValue);
                        }
                    }
                }]
        });
        return form;
    },
    StartNoneEvent:function(cell){
        var me=this;
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel: 'Id',
                    hidden:!me.developer,
                    name:'overrideid',
                    value:cell.value.getAttribute('overrideid')
                },
                {
                    fieldLabel: 'initiator',
                    name:'initiator',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('initiator')
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },{
                    fieldLabel: '字段设置',
                    xtype:'trigger',
                    name: 'formproperties',
                    hidden:true,
                    value:cell.value.getAttribute('formproperties'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('formproperties',newValue);
                        }
                    },
                    onTriggerClick:function(){
                        var value = form.down('trigger[name=formproperties]').getValue();
                        var win=Ext.widget('formFieldSetter',{
                            formId:me.process.properties.flowFormId,
                            defId:me.process.properties.id,
                            taskKey:cell.id,
                            formproperties:value,
                            callBack:function(data){
                                form.down('trigger[name=formproperties]').setValue(data);
                                cell.value.setAttribute('formproperties',data);
                            }
                        });
                        if(win){
                            win.show();
                        }
                    }
                },{
                    fieldLabel:'监听器',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('executionlisteners'),
                    name:'executionlisteners'
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    value:cell.value.getAttribute('documentation'),
                    grow: true,
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('documentation',newValue);
                        }
                    }
                }]
        });
        return form;
    },
    showTimerdurationdefinition:function(){
        var me=this;
        var win=Ext.widget('window',{
            width:300,
            layout:'fit',
            title:'时间间隔',
            items:[
                {
                    xtype:'form',
                    layout: 'anchor',
                    border:false,
                    defaults: {
                        anchor: '100%',
                        labelWidth:60
                    },
                    bodyPadding:5,
                    defaultType: 'textfield',
                    buttons: [
                        {
                            text: globalRes.buttons.ok,
                            formBind: true,
                            scope: me,
                            handler: function () {
                                
                            }
                        },
                        {
                            text: '取消',
                            handler: function () {
                                win.close();
                            }
                        }
                    ],
                    items: [
                        {
                            xtype:'container',
                            layout:'hbox',
                            items:[
                                {
                                    name: 'name',
                                    xtype: 'numberfield',
                                    anchor: '100%',
                                    minValue: 0,
                                    hideTrigger: true,
                                    keyNavEnabled: false,
                                    margin:'0 5 0 0',
                                    mouseWheelEnabled: false
                                },{
                                    xtype:'combo',
                                    name:'category',
                                    editable:false,
                                    triggerAction:'all',
                                    displayField: 'name',
                                    valueField: 'value',
                                    allowBlank: false,
                                    store:Ext.create('Ext.data.ArrayStore', {
                                        fields: ['name', 'value'],
                                        data: [
                                            ['秒','缺省浅蓝'],
                                            ['分','浅灰']
                                        ]
                                    })
                                }  
                            ]
                        }]
                }
            ]
        });
        win.show();
    },
    StartTimerEvent:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:100
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '执行时间',
                    name: 'timerdatedefinition',
                    xtype:'datetimefield',
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '间隔时间',
                    xtype:'trigger',
                    name: 'timerdurationdefinition',
                    onTriggerClick:function(){
                        me.showTimerdurationdefinition();
//                        var value = form.down('trigger[name=formproperties]').getValue();
//                        var win=Ext.widget('formFieldSetter',{
//                            formId:me.process.properties.flowFormId,
//                            defId:me.process.properties.id,
//                            taskKey:cell.id,
//                            formproperties:value,
//                            callBack:function(data){
//                                form.down('trigger[name=formproperties]').setValue(data);
//                                activity(form);
//                            }
//                        });
//                        if(win){
//                            win.show();
//                        }
                    }
                },{
                    fieldLabel: '时间周期',
                    name: 'timercycledefinition',
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel:'监听器',
                    hidden:!me.developer,
                    name:'executionlisteners'
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    StartMessageEvent:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: '参考消息',
                    name: 'messageref',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel:'监听器',
                    hidden:!me.developer,
                    name:'executionlisteners'
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    StartErrorEvent:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
            if(me.graph){
                me.updateProcess(me.graph);
            }
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '错误引用',
                    name: 'errorref',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel:'监听器',
                    hidden:!me.developer,
                    name:'executionlisteners'
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    StartErrorEvent:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: '错误引用',
                    name: 'errorref',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel:'监听器',
                    hidden:!me.developer,
                    name:'executionlisteners'
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    
    checkFirstTask:function(cell){
        var edges = cell.edges;
        if(edges && edges.length>0){
            for(var i=0;i<edges.length;i++){
                var target=edges[i].target;
                var source=edges[i].source;
                var parent=source.getParent();
                if(parent && !parent.value&& source && (source.value.getAttribute('type')=='startEvent')&&target && target.id==cell.id){
                    return true;
                }
            }
        }
        return false;
    },
    UserTask:function(cell){
        var me=this;
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel:'Id',
                    name:'overrideid',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        }
                    }
                },
                {
                    fieldLabel: '循环类型',
                    name: 'looptype',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('looptype'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('looptype',newValue);
                        }
                    }
                },
                {
                    fieldLabel: '补偿',
                    name: 'isforcompensation',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('isforcompensation'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('isforcompensation',newValue);
                        }
                    }
                },
                
                {
                    fieldLabel: '名称',
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },{
                    fieldLabel: '表单引用',
                    name: 'formkeydefinition',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('formkeydefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('formkeydefinition',newValue);
                        }
                    }
                },{
                    fieldLabel: '到期日期',
                    name: 'duedatedefinition',
                    xtype:'datetimefield',
                    value:cell.value.getAttribute('duedatedefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('duedatedefinition',newValue);
                        }
                    }
                },{
                    fieldLabel: '优先权',
                    name: 'prioritydefinition',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('prioritydefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('prioritydefinition',newValue);
                        }
                    }
                },{
                    fieldLabel: '审核人员',
                    xtype:'trigger',
                    name: 'usertaskassignment',
                    value:Ext.decode(),
                    editble:false,
                    value:cell.value.getAttribute('usertaskassignment'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            try{
                                var data = Ext.decode(newValue);
                                cell.value.setAttribute('usertaskassignment',newValue);
                            }catch(e){
                                cell.value.setAttribute('usertaskassignment','');
                                form.down('trigger[name=usertaskassignment]').setValue('');
                            }
                        }
                    },
                    onTriggerClick:function(){
                        if(me.checkFirstTask(cell)){
                            Ext.Msg.alert('人员设置','系统自动分配主流程第一个任务点为发起人执行，无需设置人员。');
                            return;
                        }
                        var value = form.down('trigger[name=usertaskassignment]').getValue();
                        var win=Ext.widget('processUserSetter',{
                            callBack:function(data){
                                form.down('trigger[name=usertaskassignment]').setValue(data);
                                cell.value.setAttribute('usertaskassignment',data);
                            }
                        });
                        if(win){
                            win.show();
                        }
                    }
                },{
                    fieldLabel: '字段设置',
                    xtype:'trigger',
                    name: 'formproperties',
                    value:cell.value.getAttribute('formproperties'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            try{
                                var str = Ext.decode(newValue);
                                cell.value.setAttribute('formproperties',newValue);
                            }catch(e){
                                cell.value.setAttribute('formproperties','');
                                form.down('trigger[name=formproperties]').setValue('');
                            }
                            
                        }
                    },
                    onTriggerClick:function(){
                        var value = form.down('trigger[name=formproperties]').getValue();
                        var win=Ext.widget('formFieldSetter',{
                            formId:me.processRecord.flowFormId,
                            formproperties:value,
                            callBack:function(data){
                                form.down('trigger[name=formproperties]').setValue(data);
                                cell.value.setAttribute('formproperties',data);
                            }
                        });
                        if(win){
                            win.show();
                        }
                    }
                },{
                    fieldLabel: '会签设置',
                    xtype:'trigger',
                    name: 'countersign',
                    value:cell.value.getAttribute('countersign'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            try{
                                var str = Ext.decode(newValue);
                                cell.value.setAttribute('tasktype','Countersign');
                            }catch(e){
                                cell.value.setAttribute('tasktype','');
                                form.down('trigger[name=countersign]').setValue('');
                                cell.value.setAttribute('countersign','');
                            }
                        }
                    },
                    onTriggerClick:function(){
                        if(me.checkFirstTask(cell)){
                            Ext.Msg.alert('会签设置','主流程第一个任务点不能设置为会签任务');
                            return;
                        }
                        var value = form.down('trigger[name=countersign]').getValue();
                        var win=Ext.widget('countersignTaskWindow',{
                            data:value,
                            callBack:function(data){
                                form.down('trigger[name=countersign]').setValue(data);
                                cell.value.setAttribute('countersign',data);
                            }
                        });
                        if(win){
                            win.show();
                        }
                    }
                },{
                    fieldLabel: '监听',
                    name: 'tasklisteners',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('tasklisteners'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('tasklisteners',newValue);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    hidden:!me.developer,
                    fieldLabel: '是否异步',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    value:cell.value.getAttribute('asynchronousdefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('asynchronousdefinition',newValue);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否互斥',
                    hidden:!me.developer,
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    value:cell.value.getAttribute('exclusivedefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('exclusivedefinition',newValue);
                        }
                    }
                },{
                    fieldLabel:'监听器',
                    hidden:!me.developer,
                    name:'executionlisteners',
                    value:cell.value.getAttribute('executionlisteners'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('executionlisteners',newValue);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    value:cell.value.getAttribute('documentation'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('documentation',newValue);
                        }
                    }
                }]
        });
        return form;
    },
    ServiceTask:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:100
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    xtype:'hidden',
                    fieldLabel: '循环类型',
                    name: 'looptype',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                {
                    xtype:'hidden',
                    fieldLabel: '补偿',
                    name: 'isforcompensation',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                
                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: '服务类名',
                    name: 'servicetaskclass',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '执行监听器',
                    name: 'executionlisteners',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '表达式',
                    name: 'servicetaskexpression',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '委托表达式',
                    name: 'servicetaskdelegateexpression',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '返回值名称',
                    name: 'servicetaskresultvariable',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '类成员变量',
                    name: 'servicetaskfields',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否异步',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否互斥',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否连续(多实例)',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'multiinstance_sequential',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '基数(多实例)',
                    name: 'multiinstance_cardinality',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '集合(多实例)',
                    name: 'multiinstance_collection',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '元素变量(多实例)',
                    name: 'multiinstance_variable',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '完成条件(多实例)',
                    name: 'multiinstance_condition',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    ScriptTask:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:100
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    xtype:'hidden',
                    fieldLabel: '循环类型',
                    name: 'looptype',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                {
                    xtype:'hidden',
                    fieldLabel: '补偿',
                    name: 'isforcompensation',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                
                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: '脚本格式',
                    name: 'scriptformat',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '脚本',
                    name: 'scripttext',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '执行监听器',
                    name: 'executionlisteners',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否异步',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否互斥',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否连续(多实例)',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'multiinstance_sequential',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '基数(多实例)',
                    name: 'multiinstance_cardinality',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '集合(多实例)',
                    name: 'multiinstance_collection',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '元素变量(多实例)',
                    name: 'multiinstance_variable',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '完成条件(多实例)',
                    name: 'multiinstance_condition',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    BusinessRule:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:100
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    xtype:'hidden',
                    fieldLabel: '循环类型',
                    name: 'looptype',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                {
                    xtype:'hidden',
                    fieldLabel: '补偿',
                    name: 'isforcompensation',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                
                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: '类名',
                    name: 'ruletask_class',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '输入变量',
                    name: 'ruletask_variables_input',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '返回变量',
                    name: 'ruletask_result',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '规则',
                    name: 'ruletask_rules',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否排除',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'ruletask_exclude',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '执行监听器',
                    name: 'executionlisteners',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否异步',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否互斥',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否连续(多实例)',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'multiinstance_sequential',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '基数(多实例)',
                    name: 'multiinstance_cardinality',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '集合(多实例)',
                    name: 'multiinstance_collection',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '元素变量(多实例)',
                    name: 'multiinstance_variable',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '完成条件(多实例)',
                    name: 'multiinstance_condition',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    ReceiveTask:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:100
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    xtype:'hidden',
                    fieldLabel: '循环类型',
                    name: 'looptype',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                {
                    xtype:'hidden',
                    fieldLabel: '补偿',
                    name: 'isforcompensation',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                
                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: '执行监听器',
                    name: 'executionlisteners',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否异步',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否互斥',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否连续(多实例)',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'multiinstance_sequential',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '基数(多实例)',
                    name: 'multiinstance_cardinality',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '集合(多实例)',
                    name: 'multiinstance_collection',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '元素变量(多实例)',
                    name: 'multiinstance_variable',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '完成条件(多实例)',
                    name: 'multiinstance_condition',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    ManualTask:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:100
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    xtype:'hidden',
                    fieldLabel: '循环类型',
                    name: 'looptype',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                {
                    xtype:'hidden',
                    fieldLabel: '补偿',
                    name: 'isforcompensation',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                
                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: '执行监听器',
                    name: 'executionlisteners',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否异步',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否互斥',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否连续(多实例)',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'multiinstance_sequential',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '基数(多实例)',
                    name: 'multiinstance_cardinality',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '集合(多实例)',
                    name: 'multiinstance_collection',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '元素变量(多实例)',
                    name: 'multiinstance_variable',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '完成条件(多实例)',
                    name: 'multiinstance_condition',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    MailTask:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:100
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    xtype:'hidden',
                    fieldLabel: '循环类型',
                    name: 'looptype',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                {
                    xtype:'hidden',
                    fieldLabel: '补偿',
                    name: 'isforcompensation',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },
                
                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: '执行监听器',
                    name: 'executionlisteners',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '收件人',
                    name: 'mailtaskto',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '发件人',
                    name: 'mailtaskfrom',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '主题',
                    name: 'mailtasksubject',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '抄送',
                    name: 'mailtaskcc',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '加密抄送',
                    name: 'mailtaskbcc',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '邮件文本',
                    name: 'mailtasktext',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '邮件HTML格式',
                    name: 'mailtaskhtml',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '格式编码',
                    name: 'mailtaskcharset',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否异步',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否互斥',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否连续(多实例)',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'multiinstance_sequential',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners: {
                        select: function (combo, record, index) {
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '基数(多实例)',
                    name: 'multiinstance_cardinality',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '集合(多实例)',
                    name: 'multiinstance_collection',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '元素变量(多实例)',
                    name: 'multiinstance_variable',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '完成条件(多实例)',
                    name: 'multiinstance_condition',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    SubProcess:function(cell){
        var me=this;
        
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:70
            },
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel: 'ID',
                    hidden:!me.developer,
                    name:'overrideid',
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        }
                    }
                },
                {
                    xtype:'hidden',
                    fieldLabel: '循环类型',
                    name: 'looptype',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('looptype'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('looptype',newValue);
                        }
                    }
                },{
                    fieldLabel: '名称',
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },,{
                    fieldLabel: '执行监听器',
                    name: 'executionlisteners',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('executionlisteners'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('executionlisteners',newValue);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否异步',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    value:cell.value.getAttribute('asynchronousdefinition'),
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('asynchronousdefinition',newValue);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否互斥',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    value:cell.value.getAttribute('exclusivedefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('exclusivedefinition',newValue);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    value:cell.value.getAttribute('documentation'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('documentation',newValue);
                        }
                    }
                }]
        });
        return form;
    },
    EventSubProcess:function(cell){
        var me=this;
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:70
            },
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel: 'Id',
                    name:'overrideid',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        }
                    }
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },{
                    fieldLabel: '执行监听器',
                    name: 'executionlisteners',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('executionlisteners'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('executionlisteners',newValue);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否异步',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    value:cell.value.getAttribute('asynchronousdefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('asynchronousdefinition',newValue);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否互斥',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    value:cell.value.getAttribute('exclusivedefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('exclusivedefinition',newValue);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    value:cell.value.getAttribute('documentation'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('documentation',newValue);
                        }
                    }
                }]
        });
        return form;
    },
    CallActivity:function(cell){
        var me=this;
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:100
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid',
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        }
                    }
                },
                {
                    xtype:'hidden',
                    fieldLabel: '循环类型',
                    name: 'looptype',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },
                {
                    xtype:'hidden',
                    fieldLabel: '补偿',
                    name: 'isforcompensation',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },

                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: '执行监听器',
                    name: 'executionlisteners',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },{
                    fieldLabel: '条用元素',
                    name: 'callactivitycalledelement',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },{
                    fieldLabel: '输入参数',
                    name: 'callactivityinparameters',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },{
                    fieldLabel: '输出参数',
                    name: 'callactivityoutparameters',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否异步',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否互斥',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },{
                    xtype: 'combo',
                    triggerAction: 'all',
                    editable: false,
                    model: 'local',
//                    width: 100,
                    fieldLabel: '是否连续(多实例)',
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'multiinstance_sequential',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', '是'],
                            ['No', '否']
                        ]
                    }),
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },{
                    fieldLabel: '基数(多实例)',
                    name: 'multiinstance_cardinality',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },{
                    fieldLabel: '集合(多实例)',
                    name: 'multiinstance_collection',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },{
                    fieldLabel: '元素变量(多实例)',
                    name: 'multiinstance_variable',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },{
                    fieldLabel: '完成条件(多实例)',
                    name: 'multiinstance_condition',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        },
                        afterrender:function(f){
                            var value= f.getValue();
                            cell.value.setAttribute('overrideid', value);
                        }
                    }
                }]
        });
        return form;
    },
    Gateway:function(cell,type){
        var me=this;
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid',
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        }
                    }
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },
                {
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    value:cell.value.getAttribute('documentation'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('documentation',newValue);
                        }
                    }
                }]
        });
        return form;
    },
    BoundaryErrorEvent:function(cell){
        var me=this;
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid',
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        }
                    }
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },
                {
                    fieldLabel: '错误引用',
                    name: 'errorref',
                    value:cell.value.getAttribute('errorref'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('errorref',newValue);
                        }
                    }
                },
                
                {
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    value:cell.value.getAttribute('documentation'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('documentation',newValue);
                        }
                    }
                }]
        });
        return form;
    },
    BoundaryTimerEvent:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: '持续时间(PT5M)',
                    name: 'timerdurationdefinition',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '时间(ISO-8601)',
                    name: 'timerdatedefinition',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '时间周期(R3/PT10H)',
                    name: 'timercycledefinition',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    BoundarySignalEvent:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.value.setAttribute('activity',Ext.encode(act));
        }
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid'
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: '单例引用',
                    name: 'signalref',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                }]
        });
        var rec=cell.value.getAttribute('activity');
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    ThrowNoneEvent:function(cell){
        var me=this;
        var form=Ext.widget('form',{
            layout: 'anchor',
            border:false,
            bodyPadding:5,
            defaults: {
                anchor: '100%',
                labelWidth:60
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype:'hidden',
                    name:'overrideid',
                    value:cell.value.getAttribute('overrideid'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('overrideid',newValue);
                        }
                    }
                },
                {
                    fieldLabel: '名称',
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },{
                    fieldLabel: '执行监听器',
                    name: 'executionlisteners',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('executionlisteners'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('executionlisteners',newValue);
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:'描述',
                    xtype:'textareafield',
                    grow: true,
                    value:cell.value.getAttribute('documentation'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('documentation',newValue);
                        }
                    }
                }]
        });
        return form;
    },
    
    
    showProperties:function(cell){
        var me=this,form,title;
        if(cell){
            if(mxUtils.isNode(cell.value)){
                var nodeName=cell.value.nodeName,name=cell.value.getAttribute('name'),title=name?'节点属性（'+name+')':'节点属性';
                if('StartNoneEvent'==nodeName){
                    form=me.StartNoneEvent(cell);
                }else if('StartTimerEvent'==nodeName){
                    form=me.StartTimerEvent(cell);
                }else if('StartMessageEvent'==nodeName){
                    form=me.StartMessageEvent(cell);
                }else if('StartErrorEvent'==nodeName){
                    form=me.StartErrorEvent(cell);
                }else if('UserTask'==nodeName){
                    form=me.UserTask(cell);
                }else if('ServiceTask'==nodeName){
                    form=me.ServiceTask(cell);
                }else if('ScriptTask'==nodeName){
                    form=me.ScriptTask(cell);
                }else if('BusinessRule'==nodeName){
                    form=me.BusinessRule(cell);
                }else if('ReceiveTask'==nodeName){
                    form=me.ReceiveTask(cell);
                }else if('ManualTask'==nodeName){
                    form=me.ManualTask(cell);
                }else if('MailTask'==nodeName){
                    form=me.MailTask(cell);
                }else if('SubProcess'==nodeName){
                    form=me.SubProcess(cell);
                }else if('EventSubProcess'==nodeName){
                    form=me.EventSubProcess(cell);
                }else if('CallActivity'==nodeName){
                    form=me.CallActivity(cell);
                }else if('ExclusiveGateway'==nodeName){
                    form=me.Gateway(cell,nodeName);
                }else if('ParallelGateway'==nodeName){
                    form=me.Gateway(cell,nodeName);
                }else if('InclusiveGateway'==nodeName){
                    form=me.Gateway(cell,nodeName);
                }else if('EventGateway'==nodeName){
                    form=me.Gateway(cell,nodeName);
                }else if('BoundaryErrorEvent'==nodeName){
                    form=me.BoundaryErrorEvent(cell);
                }else if('BoundaryTimerEvent'==nodeName){
                    form=me.BoundaryTimerEvent(cell);
                }else if('BoundarySignalEvent'==nodeName){
                    form=me.BoundarySignalEvent(cell);
                }else if('CatchTimerEvent'==nodeName){
                    form=me.StartTimerEvent(cell);
                }else if('CatchSignalEvent'==nodeName){
                    form=me.BoundarySignalEvent(cell);
                }else if('CatchMessageEvent'==nodeName){
                    form=me.StartMessageEvent(cell);
                }else if('ThrowNoneEvent'==nodeName){
                    form=me.ThrowNoneEvent(cell);
                }else if('ThrowNoneEvent'==nodeName){
                    form=me.BoundarySignalEvent(cell);
                }else if('EndNoneEvent'==nodeName){
                    form=me.ThrowNoneEvent(cell);
                }else if('EndErrorEvent'==nodeName){
                    form=me.BoundaryErrorEvent(cell);
                }else if('SequenceFlow'==nodeName){
                    form=me.SequenceFlow(cell);
                }
            }
        }else{
            form=me.Process();
            title='流程属性('+form.getForm().getValues().name+')';
        }
        var  graphProperties=me.down('#graphProperties');
        if(graphProperties){
            graphProperties.setTitle(title)
            graphProperties.removeAll();
            graphProperties.add(form);
        }
    },
    insertVertexTemplate:function(dom){
        var me=this,treepanel=me.down('#navGraphTree');
        mxModeler.prototype.showProperties=function(cell){
            me.showProperties(cell);
        };
        var modeler=new mxModeler(dom,'mxgraph/config/templates.xml');
        modeler.setConnectImagePath('mxgraph/images/connector.gif');
        me.graph=modeler.getGraph();
        me.editor= modeler.getEditor();
        me.graRes?modeler.reloadGraph(me.graRes):'';
        var initTreepanel=function(treepanel){
            var view=treepanel.getView()
            view.getStore().each(function(model){
                var node=view.getNode(model);
                if(model.get('leaf')!=false){
                    var stencil=model.get('stencil');
                    modeler.makeDraggable(node,me.editor.templates[stencil]);
                }
            })
        };
        treepanel.on('itemexpand',function( item,eOpts ){
            initTreepanel(treepanel);
        });
    },
    getGraph:function(){
        return this.graph;
    }
});
