/**
 * Created by lihao on 8/21/14.
 */
Ext.define('FlexCenter.flows.view.Modeler', {
    requires: [
        'Ext.Component'
    ],
    extend: 'Ext.panel.Panel',
    alias: 'widget.modeler',
//    iconCls: 'workflow-manager-16',
    autoScroll: true,
    layout: 'border',
    navCellWidth:240,
    navCellHeight:35,
    graph:null,
    developer:true,
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
        var store=Ext.create('Ext.data.TreeStore', {
            storeId:'StartEventsStore',
            fields:['text','expanded','children','leaf','stencil'],
            root: {
                expanded: true,
                children: [
                    { text: "Start Events",expanded: false,iconCls:'start-events', children:[
                        { text: "Start", leaf: true,iconCls:'startevent-none',stencil:'StartNoneEvent' },
                        { text: "Start timer event", leaf: true,iconCls:'startevent-timer',stencil:'StartTimerEvent' },
                        { text: "Start message event", leaf: true,iconCls:'startevent-message',stencil:'StartMessageEvent' },
                        { text: "Start error event", leaf: true,iconCls:'startevent-error',stencil:'StartErrorEvent' }
                    ] },
                    { text: "Activities",expanded: false, children:[
                        { text: "User task", leaf: true,iconCls:'activity-type-user',stencil:'UserTask' },
                        { text: "Service task", leaf: true,iconCls:'activity-type-service',stencil:'ServiceTask' },
                        { text: "Script task", leaf: true,iconCls:'activity-type-script',stencil:'ScriptTask' },
                        { text: "Business rule task", leaf: true,iconCls:'activity-type-business-rule',stencil:'BusinessRule' },
                        { text: "Receive task", leaf: true,iconCls:'activity-type-receive',stencil:'ReceiveTask' },
                        { text: "Manual task", leaf: true,iconCls:'activity-type-manual',stencil:'ManualTask' },
                        { text: "Mail task", leaf: true,iconCls:'activity-type-send',stencil:'MailTask' }
                    ] },
                    { text: "Structural",expanded: false, children:[
                        { text: "Sub process", leaf: true,iconCls:'structural-expanded-subprocess',stencil:'SubProcess'},
                        { text: "Event sub process", leaf: true,iconCls:'structural-event-subprocess',stencil:'EventSubProcess' },
                        { text: "Call activity", leaf: true,iconCls:'structural-task',stencil:'CallActivity' }
                    ] },
                    { text: "Gateways",expanded: false, children:[
                        { text: "Exclusive gateway", leaf: true,iconCls:'gateway-exclusive-databased',stencil:'ExclusiveGateway' },
                        { text: "Parallel gateway", leaf: true,iconCls:'gateway-parallel',stencil:'ParallelGateway'  },
                        { text: "Inclusive gateway", leaf: true,iconCls:'gateway-inclusive',stencil:'InclusiveGateway'  },
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
                    { text: "End Events",expanded: false, children:[
                        { text: "End event", leaf: true,iconCls:'end-event',stencil:'EndNoneEvent' },
                        { text: "End error event", leaf: true,iconCls:'end-error-event',stencil:'EndErrorEvent' }
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
//                            me.fireEvent('save',button,evt);
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
                title: 'Westsdf水电费',
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
                title: '属性',
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
//        me.items=[
////            {
////                xtype: 'box',
////                region: 'north',
////                html: 'Ext.Layout.Browser',
////                height: 20
////            },
//            {
//                region: 'center',
//                layout:'border',
//                border:false,
//                tbar:[
//                    
//                ],
//                items:[
//                    {
//                        region: 'west',
//                        title: 'Westsdf水电费',
//                        split: true,
//                        width: me.navCellWidth,
//                        itemId:'navGraphTree',
//                        xtype:'treepanel',
//                        rootVisible: false,
//                        collapsible: true,
//                        titleCollapse:true,
////                        onResize: function(){
////                            console.log('sdf')
//////                            this.callParent(arguments);
//////                            if(this.graph){
//////                                this.graph.sizeDidChange();
//////                            }
////                        },
//                        viewConfig: {
//                            getRowClass: function(record, rowIndex, rowParams, store){
//                                return (record.get('leaf')==false) ? "blue-grid-row" : "";
//                            }
//                        },
//                        store:store
//                    },{
//                        region: 'east',
//                        title: '属性',
//                        collapsible: true,
//                        itemId:'graphProperties',
//                        split: true,
//                        width: 250,
//                        autoScroll:true,
//                        items:me.Process()
//                    },{
//                        region: 'center',
//                        itemId:'graphContainer',
//                        autoScroll:true,
//                        listeners:{
//                            afterrender:function(panel){
//                                var dom=panel.body.dom.firstChild.children[0]
//                                me.insertVertexTemplate(dom);
//                            }
//                        },
//                        dockedItems: [{
//                            xtype: 'toolbar',
//                            dock: 'bottom',
//                            items: [
//                                {
//                                    iconCls: 'zoom',
//                                    text:'变焦',
//                                    menu: [{
//                                            text:'400%',
//                                            handler: function(item){
//                                                me.graph.getView().setScale(4);
//                                            }
//                                        },
//                                        {
//                                            text:'200%',
//                                            handler: function(item){
//                                                me.graph.getView().setScale(2);
//                                            }
//                                        },
//                                        {
//                                            text:'150%',
//                                            scope:this,
//                                            handler: function(item){
//                                                me.graph.getView().setScale(1.5);
//                                            }
//                                        },
//                                        {
//                                            text:'100%',
//                                            scope:this,
//                                            handler: function(item){
//                                                me.graph.getView().setScale(1);
//                                            }
//                                        },
//                                        {
//                                            text:'75%',
//                                            scope:this,
//                                            handler: function(item){
//                                                me.graph.getView().setScale(0.75);
//                                            }
//                                        },
//                                        {
//                                            text:'50%',
//                                            scope:this,
//                                            handler: function(item){
//                                                me.graph.getView().setScale(0.5);
//                                            }
//                                        },
//                                        {
//                                            text:'25%',
//                                            scope:this,
//                                            handler: function(item){
//                                                me.graph.getView().setScale(0.25);
//                                            }
//                                        }]
//                                    
//                                },
//                                {
//                                    iconCls: 'zoom',
//                                    tooltip: '缩放比例',
//                                    handler: function(button,evt){
//                                        Ext.Msg.prompt('缩放比例','请输入要缩放的比例',function(btn,text){
//                                            if(btn=='ok'){
//                                                text=parseInt(text);
//                                                if(!isNaN(text)){
//                                                    me.graph.getView().setScale(text / 100);
//                                                }
//                                            }
//                                        });
//                                    }
//                                },'-',
//                                {
//                                    iconCls: 'zoomIn',
//                                    tooltip: '放大',
//                                    handler: function(button,evt){
//                                        me.zoomIn();
//                                    }
//                                },'-',
//                                {
//                                    iconCls: 'zoomOut',
//                                    tooltip: '缩小',
//                                    handler: function(button,evt){
//                                        me.zoomOut();
//                                    }
//                                },'-',
//                                {
//                                    iconCls: 'zoomActual',
//                                    tooltip: '实际大小',
//                                    handler: function(button,evt){
//                                        me.actualSize();
//                                    }
//                                }
//                                ,'->',
//                                {
//                                    xtype:'button',
//                                    text: '预览',
//                                    enableToggle: true,
//                                    toggleHandler: function(btn,press){
//                                        me.showPreviewWin(btn,press);
//                                    },
//                                    pressed: false
//                                }
//                            ]
//                        }]
//                    }
//                ]
//
//            }
//        ];
        me.callParent(arguments);
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
        var activity=function(form){
            var act=me.process;
            act.setResourceId('canvas');
            act.setStencil('BPMNDiagram');
            act.setBounds(0,0,window.screen.width,window.screen.height);
            if(me.processRecord){
                form.getForm().setValues(me.processRecord);
            }
            var value=form.getForm().getValues();
            act.setProperties(value);
            me.process=act;
        };
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
                    name:'process_id'
                },
                {
                fieldLabel: '流程名称',
                name: 'name',
                listeners:{
                    blur:function( f, The, eOpts ){
                        activity(form);
                    }
                }
            },{
                fieldLabel: '引用表单',
                name:'formName',
                readOnly:true,
                listeners:{
                    blur:function( f, The, eOpts ){
                        activity(form);
                    }
                }
            },{
                xtype:'textareafield',
                grow: true,
                fieldLabel:'描述',
                name:'documentation',
                listeners:{
                    blur:function( f, The, eOpts ){
                        activity(form);
                    }
                }
            }]
        });
        var rec=me.process;
        if(rec){
            var properties=rec.properties;
            if(properties){
                form.getForm().setValues(properties);
            }
        }
        activity(form);
        return form;
    },
    SequenceFlow:function(cell){
        var me=this;
        var activity=function(form){
            var act=me.activity(cell);
            act.setProperties(form.getForm().getValues());
            cell.activity=Ext.encode(act);
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
                    xtype:'hidden',
                    name:'defaultflow',
                    value:'None'
                },
                {
                    xtype:'hidden',
                    name:'conditionalflow',
                    value:'None'
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
                    fieldLabel: '流程条件',
                    name: 'conditionsequenceflow',
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
        var rec=cell.activity;
        if(rec){
            var properties=Ext.decode(rec).properties;
            if(properties){
                form.getForm().setValues(Ext.decode(rec).properties);
            }
        }
        activity(form);
        return form;
    },
    StartNoneEvent:function(cell){
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
                    xtype:'hidden',
                    name:'initiator'
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
                    fieldLabel: '字段设置',
                    name: 'formproperties',
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
    UserTask:function(cell){
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
                    fieldLabel: '表单引用',
                    name: 'formkeydefinition',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '到期日期',
                    name: 'duedatedefinition',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '优先权',
                    name: 'prioritydefinition',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '任务分配',
                    name: 'usertaskassignment',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '字段设置',
                    name: 'formproperties',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '监听',
                    name: 'tasklisteners',
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
                labelWidth:70
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
                },{
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
    EventSubProcess:function(cell){
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
                labelWidth:70
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
    CallActivity:function(cell){
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
                    fieldLabel: '条用元素',
                    name: 'callactivitycalledelement',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '输入参数',
                    name: 'callactivityinparameters',
                    hidden:!me.developer,
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                        }
                    }
                },{
                    fieldLabel: '输出参数',
                    name: 'callactivityoutparameters',
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
    Gateway:function(cell,type){
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
                },
                {
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
    BoundaryErrorEvent:function(cell){
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
                },
                {
                    fieldLabel: '错误引用',
                    name: 'errorref',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            activity(form);
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },
                
                {
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
                    fieldLabel: '执行监听器',
                    name: 'executionlisteners',
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
    
    
    showProperties:function(cell){
        var me=this,form,title;
        if(cell){
            if(mxUtils.isNode(cell.value)){
                var nodeName=cell.value.nodeName,title='属性（'+cell.value.getAttribute('label')+')';
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
                }
            }else if(cell.isEdge()){
                form=me.SequenceFlow(cell);
                title='属性（'+cell.value+')'
            }
        }else{
            form=me.Process();
            title='属性('+form.getForm().getValues().name+')';
        }
        var  graphProperties=me.down('#graphProperties');
        if(graphProperties){
            graphProperties.setTitle(title)
            graphProperties.removeAll();
            graphProperties.add(form);
        }
    },
    
    updateProcess:function(graph){
        var me=this;
        if(graph.model && graph.model.cells){
            var pro=me.process || me.activity(null),cells=graph.model.cells;
            pro.clearChildShapes();
            for(var i in cells){
                var cell=cells[i];
                if(mxUtils.isNode(cell.value)){
                    var child=Ext.decode(cell.value.getAttribute('activity'));
                    var edges=cell.edges,outgoing=[];
                    if(edges){
                        for(var i=0;i<edges.length;i++){
                            if(edges[i].target!=null && edges[i].target.id!=cell.id){
                                var edgeObj={
                                    resourceId:edges[i].id
                                };
                                outgoing.push(edgeObj);
                            }
                        }
                    }
                    child.outgoing=outgoing;
                    pro.addChildShapes(child);
                }else if(cell.isEdge()){
                    var child=me.activity(cell);
                    pro.addChildShapes(child);
                }
            }
            me.process=pro;
        }
        return me.process;
    },
    
    initGraph:function(dom){
        var me=this;
        mxEvent.disableContextMenu(document.body);
        var xmlRequest = mxUtils.load('mxgraph/config/templates.xml');
        var node = xmlRequest.getDocumentElement();
        var editor = new mxEditor(node);
        me.editor= editor;
        var graph=editor.graph;
        mxCellEditor.prototype.modified=false;
        mxGraph.prototype.cellsResizable=false;
        mxConnectionHandler.prototype.connectImage = new mxImage('mxgraph/images/connector.gif', 16, 16);
        mxRectangleShape.prototype.crisp = true;

        mxGraphHandler.prototype.guidesEnabled = true;
        graph.panningHandler.autoExpand = true;
        graph.constrainChildren = false;
        graph.extendParents = false;
        graph.extendParentsOnAdd = true;

        mxGuide.prototype.isEnabledForEvent = function(evt)
        {
            return !mxEvent.isAltDown(evt);
        };
        graph.getSelectionModel().addListener(mxEvent.CHANGE, function(model, evt){
            graph.container.focus();
            var cell = graph.getSelectionCell();
            me.showProperties(cell);
            if(graph){
                var pro = me.updateProcess(graph);
//                console.log(Ext.encode(me.process))
                console.log((me.process))
            }
        });
        
        var keyHandler = new mxKeyHandler(graph);
        //command+z
        keyHandler.bindKey(90, function(evt)
        {
            editor.execute('undo');
        });
        //command+y
        keyHandler.bindKey(89, function(evt)
        {
            editor.execute('redo');
        });
        //fn+lelete
        keyHandler.bindKey(46, function(evt)
        {
            editor.execute('delete');
        });
        //command+c
        keyHandler.bindKey(67, function(evt)
        {
            editor.execute('copy');
        });
        //command+v
        keyHandler.bindKey(86, function(evt)
        {
            editor.execute('paste');
        });
        //command+x
        keyHandler.bindKey(88, function(evt)
        {
            editor.execute('cut');
        });
        
        
//        graph.isCellEditable = function(cell){
//            return !this.getModel().isEdge(cell);
//        };
       
        
        var mxConnectionHandlerInsertEdge = mxConnectionHandler.prototype.insertEdge;
        mxConnectionHandler.prototype.insertEdge = function(parent, id, value, source, target, style){
            if(!target) return source;
            return mxConnectionHandlerInsertEdge.apply(this, arguments);
        };
        var  validateConnection=mxConnectionHandler.prototype.validateConnection;
        mxConnectionHandler.prototype.validateConnection=function(source, target){
            if(source && target && target.edges){
                var sid=source.id;
                for(var i=0;i<target.edges.length;i++){
                    var ttarget=target.edges[i].target;
                    if(!ttarget || sid==ttarget.id){
                        return source;
                    }
                }
            }
            if(source && source.edges && target){
                var tid=target.id;
                for(var i=0;i<source.edges.length;i++){
                    var ttarget=source.edges[i].target;
                    if(!ttarget || tid==ttarget.id){
                        return source;
                    }
                }
            }
            if(!target) return source;
            return (source && target && (mxUtils.isNode(source.value) && mxUtils.isNode(target.value)) && (source.value.getAttribute('type') == 'startEvent') && (target.value.getAttribute('type') == 'startEvent'))?source:validateConnection.apply(this, arguments);
        };
       
        
        
        graph.convertValueToString = function(cell){
//            return mxUtils.isNode(cell.value)?cell.getAttribute('label', ''):'';
            return 'sdfsdf';
        };
        
        graph.getLabel=function(cell){
            return cell?(mxUtils.isNode(cell.value)?cell.getAttribute('value', ''):(cell.isEdge()?cell.value:'')):'';
        };
        graph.panningHandler.factoryMethod = function(menu, cell, evt)
        {
            var selected = !graph.isSelectionEmpty();
            menu.addItem('撤销', null, function(){
                editor.execute('undo');
            },null,'undo');
            menu.addSeparator();
            menu.addItem('剪切', null, function(){
                editor.execute('cut');
            },null,'cut',selected);
            menu.addItem('复制', null, function(){
                editor.execute('copy');
            },null,'copy',selected);
            menu.addItem('粘贴', null, function(){
                editor.execute('paste');
            },null,'paste');
            menu.addSeparator();
            menu.addItem('删除', null, function(){
                editor.execute('delete');
            },null,'delete',selected);
            menu.addSeparator();
            menu.addItem('编辑', null, function(){
                graph.startEditing();
            },null,'edit',selected);
        };

        var getTooltipForCell = graph.getTooltipForCell;
        graph.getTooltipForCell = function(cell)
        {
            if (graph.getModel().isEdge(cell))
            {
                var src = this.getLabel(this.getModel().getTerminal(cell, true));
                var trg = this.getLabel(this.getModel().getTerminal(cell, false));

                return src + ' ' + cell.value.nodeName + ' ' +  trg;
            }
            return getTooltipForCell.apply(this, arguments);
        };
        var cellLabelChanged = graph.cellLabelChanged;
        graph.cellLabelChanged = function(cell, newValue, autoSize){
            if (mxUtils.isNode(cell.value)){
                var pos = newValue.indexOf(' ');
                var value = (pos > 0) ? newValue.substring(0,
                    pos) : newValue;
                var elt = cell.value.cloneNode(true);
                elt.setAttribute('value', value);
                newValue = elt;
                autoSize = false;
            }
            
            cellLabelChanged.apply(this, arguments);
        };
        
        graph.getEditingValue = function(cell) {
            return mxUtils.isNode(cell.value)?cell.getAttribute('value', ''):'';
        };
        graph.flipEdge = function(edge){
            if (edge != null){
                var state = this.view.getState(edge);
                var style = (state != null) ? state.style : this.getCellStyle(edge);
                if (style != null){
                    var elbow = mxUtils.getValue(style, mxConstants.STYLE_ELBOW,
                        mxConstants.ELBOW_HORIZONTAL);
                    var value = (elbow == mxConstants.ELBOW_HORIZONTAL) ?
                        mxConstants.ELBOW_VERTICAL : mxConstants.ELBOW_HORIZONTAL;
                    this.setCellStyles(mxConstants.STYLE_ELBOW, value, [edge]);
                }
            }
        };
        var moveCells= mxGraph.prototype.moveCells;
        mxGraph.prototype.moveCells = function(cells, dx, dy, clone, target1, evt){
            if(cells && cells.length>0){
                var cell=cells[0];
                if(cell && cell.value && mxUtils.isNode(cell.value) && cell.value.getAttribute('type')=='boundaryEvent') {
                    var target = cell.getParent();
                    if (target && target.value && mxUtils.isNode(target.value)) {
                        cells = [cell];
                        return cells;
                    }
                }
            }
            return moveCells.apply(this,arguments);
        };
        var oldResizable = graph.isCellResizable;
        graph.isCellResizable = function(cell)
        {
            if(cell && cell.value && mxUtils.isNode(cell.value) && cell.value.getAttribute('type')=='boundaryEvent'){
                return false;
            }
            return oldResizable.apply(this, arguments);
        };
        graph.init(dom);
        if (mxClient.IS_GC || mxClient.IS_SF){
            graph.container.style.background = '-webkit-gradient(linear, 0% 0%, 100% 0%, from(#FFFFFF), to(#FFFFEE))';
        }
        else if (mxClient.IS_NS){
            graph.container.style.background = '-moz-linear-gradient(left, #FFFFFF, #FFFFEE)';
        }
        else if (mxClient.IS_IE){
            graph.container.style.filter = 'progid:DXImageTransform.Microsoft.Gradient('+
                'StartColorStr=\'#FFFFFF\', EndColorStr=\'#FFFFEE\', GradientType=1)';
        }
        me.tooltip = Ext.create('Ext.tip.ToolTip', {
            target: graph.container,
            html: '',
            listeners: {
                scope: me,
                beforeshow: function () {
                    return (!me.self.isDisableTooltip()) && me.enableShowTip === true;
                },
                hide: function () {
                    me.enableShowTip = false;
                }
            }
        });
        graph.tooltipHandler.show = function (tip, x, y) {
            if (tip != null && tip.length > 0) {
                me.enableShowTip = true;
                me.tooltip.update(tip);
                me.tooltip.showAt([x, y + mxConstants.TOOLTIP_VERTICAL_OFFSET]);
            }
        };

        graph.tooltipHandler.hide = function () {
            me.tooltip.hide();
        };
        graph.setConnectable(true);
        graph.setDropEnabled(true);
        graph.setPanning(true);
        graph.setTooltips(true);
        graph.setMultigraph(false);
        graph.setCellsResizable(true);
        graph.connectionHandler.setCreateTarget(false);
        graph.container.style.cursor = 'default';
        me.setGraph(graph);
    },
    insertVertexTemplate:function(dom){
        var me=this,treepanel=me.down('#navGraphTree');
        me.initGraph(dom);
        var initTreepanel=function(treepanel){
            var view=treepanel.getView()
            view.getStore().each(function(model){
                var node=view.getNode(model);
                if(model.get('leaf')!=false){
                    var stencil=model.get('stencil');
                    me.makeDraggable(node,me.editor.templates[stencil]);
                }
            })
        };
//        initTreepanel(treepanel);
        treepanel.on('itemexpand',function( item,eOpts ){
            initTreepanel(treepanel);
        });
        
        
    },
    makeDraggable:function(treepanel,cells,graphcallback){
        var me=this;
        var cells = [cells];
        cells[0].vertex = true;
        var funct = function(graph, evt, target, x, y){
            cells = graph.getImportableCells(cells);
            if (cells.length > 0){
                var select = null;
                var boundary=mxUtils.isNode(cells[0].value) && cells[0].value.getAttribute('type')=='boundaryEvent';
                var tar=target && mxUtils.isNode(target.value) && (target.value.getAttribute('type')=='subProcess' || target.value.getAttribute('type')=='task');
                if(target==null && boundary){
                    return;
                }
                if(boundary && !tar){
                    return;
                }
                if(target && mxUtils.isNode(target.value) &&(target.value.getAttribute('type')=='task' || target.value.getAttribute('type')=='subProcess')){
                    if(boundary){
                        var xMin=target.geometry.x-cells[0].geometry.width/2;
                        var xMax=target.geometry.x+target.geometry.width-cells[0].geometry.width/2;
                        x=Math.max(x,xMin);
                        x=Math.min(x,xMax);
                        var ymin=target.geometry.y+target.geometry.height-cells[0].geometry.height/2;
                        var ymax=ymin;
                        y=ymax
                        select = graph.importCells(cells, x, y, target);
                        if(select && select.length>0){
                            select[0].setParent(target)
                            graph.scrollCellToVisible(select[0]);
                            graph.setSelectionCells(select);
                        }
                        return;
                    }else{
                        return; 
                    }
                }
                var validDropTarget = (target != null) ?
                    graph.isValidDropTarget(target, cells, evt) : false;
                if (target != null &&
                    !validDropTarget &&
                    graph.getModel().getChildCount(target) == 0 &&
                    graph.getModel().isVertex(target) == cells[0].vertex){
//                    graph.getModel().setStyle(target, cells[0].style);
//                    select = [target];
                    select=null;
                }else{
                    if (target != null &&
                        !validDropTarget){
                        target = null;
                    }

                    // Splits the target edge or inserts into target group
                    if (graph.isSplitEnabled() && graph.isSplitTarget(target, cells, evt)){
                        graph.splitEdge(target, cells, null, x, y);
                        select = cells;
                    }else{
                        cells = graph.getImportableCells(cells);

                        if (cells.length > 0){
                            select = graph.importCells(cells, x, y, target);
                        }
                    }
                }

                if (select != null && select.length > 0){
                    graph.scrollCellToVisible(select[0]);
                    graph.setSelectionCells(select);
                }
            }
        };

        if (mxClient.IS_IE){
            mxEvent.addListener(treepanel, 'dragstart', function(evt)
            {
                evt.returnValue = false;
            });
        }
        var sprite=function(width, height){
            var elt = document.createElement('div');
            elt.style.border = '1px double black';
            elt.style.width = width + 'px';
            elt.style.height = height + 'px';
//            elt.style.backgroundColor = '#ffffff';
//            elt.className = 'mxPopupMenu';
            return elt;
        };

        var ds = mxUtils.makeDraggable(treepanel, me.graph, funct,sprite(cells[0].geometry.width,cells[0].geometry.height),null, null, me.graph.autoscroll, true);
        ds.isGuidesEnabled = function(){
            return me.graph.graphHandler.guidesEnabled;
        };
        ds.createDragElement = mxDragSource.prototype.createDragElement;
    },

    setGraph:function(graph){
        this.graph=graph;
    },
    getGraph:function(){
        return this.graph;
    }
});
