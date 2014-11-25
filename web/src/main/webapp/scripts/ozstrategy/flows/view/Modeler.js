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
        var store=Ext.create('Ext.data.TreeStore', {
            storeId:'StartEventsStore',
            fields:['text','expanded','children','leaf','stencil'],
            root: {
                expanded: true,
                children: [
                    { text: workFlowRes.modeler.startEvent,expanded: false,iconCls:'start-events', children:[
                        { text: workFlowRes.modeler.startNone, leaf: true,iconCls:'startevent-none',stencil:'StartNoneEvent' }
//                        { text: "时间事件", leaf: true,iconCls:'startevent-timer',stencil:'StartTimerEvent' },
//                        { text: "消息事件", leaf: true,iconCls:'startevent-message',stencil:'StartMessageEvent' },
//                        { text: "错误事件", leaf: true,iconCls:'startevent-error',stencil:'StartErrorEvent' }
                    ] },
                    { text: workFlowRes.modeler.taskEvent,expanded: false, children:[
                        { text: workFlowRes.modeler.userTask, leaf: true,iconCls:'activity-type-user',stencil:'UserTask' }
//                        { text: "Service task", leaf: true,iconCls:'activity-type-service',stencil:'ServiceTask' },
//                        { text: "Script task", leaf: true,iconCls:'activity-type-script',stencil:'ScriptTask' },
//                        { text: "Business rule task", leaf: true,iconCls:'activity-type-business-rule',stencil:'BusinessRule' },
//                        { text: "Receive task", leaf: true,iconCls:'activity-type-receive',stencil:'ReceiveTask' },
//                        { text: "Manual task", leaf: true,iconCls:'activity-type-manual',stencil:'ManualTask' },
//                        { text: "Mail task", leaf: true,iconCls:'activity-type-send',stencil:'MailTask' }
                    ] },
                    { text: workFlowRes.modeler.subProcessTitle,expanded: false, children:[
                        { text: workFlowRes.modeler.subProcess, leaf: true,iconCls:'structural-expanded-subprocess',stencil:'SubProcess'}
//                        { text: "事件子流程", leaf: true,iconCls:'structural-event-subprocess',stencil:'EventSubProcess' },
//                        { text: "Call activity", leaf: true,iconCls:'structural-task',stencil:'CallActivity' }
                    ] },
                    { text: workFlowRes.modeler.getaway,expanded: false, children:[
                        { text: workFlowRes.modeler.exclusive, leaf: true,iconCls:'gateway-exclusive-databased',stencil:'ExclusiveGateway' },
                        { text: workFlowRes.modeler.parallel, leaf: true,iconCls:'gateway-parallel',stencil:'ParallelGateway'  },
                        { text: workFlowRes.modeler.inclusive, leaf: true,iconCls:'gateway-inclusive',stencil:'InclusiveGateway'  }
//                        { text: "Event gateway", leaf: true,iconCls:'gateway-eventbased',stencil:'EventGateway'  }
                    ] },
//                    { text: "Boundary Events",expanded: false, children:[
//                        { text: "Boundary error event", leaf: true,iconCls:'catching-error',stencil:'BoundaryErrorEvent' },
//                        { text: "Boundary timer event", leaf: true,iconCls:'catching-timer',stencil:'BoundaryTimerEvent'  },
//                        { text: "Boundary signal event", leaf: true,iconCls:'catching-signal',stencil:'BoundarySignalEvent'  }
//                    ] },
//                    { text: "Intermediate Catching Events",expanded: false, children:[
//                        { text: "Intermediate timer catching event", leaf: true,iconCls:'intermediate-timer-catching-event',stencil:'CatchTimerEvent' },
//                        { text: "Intermediate signal catching event", leaf: true,iconCls:'intermediate-signal-catching-event',stencil:'CatchSignalEvent' },
//                        { text: "Intermediate message catching event", leaf: true,iconCls:'intermediate-message-catching-event',stencil:'CatchMessageEvent' }
//                    ] },
//                    { text: "Intermediate Throwing Events",expanded: false, children:[
//                        { text: "Intermediate none throwing event", leaf: true,iconCls:'intermediate-none-throwing-event',stencil:'ThrowNoneEvent' },
//                        { text: "Intermediate signal throwing event", leaf: true,iconCls:'intermediate-signal-throwing-event',stencil:'ThrowSignalEvent' }
//                    ] },
                    { text: workFlowRes.modeler.endEvent,expanded: false, children:[
                        { text: workFlowRes.modeler.endNone, leaf: true,iconCls:'end-event',stencil:'EndNoneEvent' }
//                        { text: "错误结束", leaf: true,iconCls:'end-error-event',stencil:'EndErrorEvent' }
                    ] }
                ]
            }
        });
        me.tbar=[
            {
                xtype: 'button',
                text: workFlowRes.modeler.redrawAction,
                iconCls: 'mxGraphRefresh',
                itemId: 'redrawActionId',
                handler:function(btn,evt){
                    me.redraw();
                }
            },'-',
            {
                xtype: 'button',
                text: globalRes.buttons.save,
                iconCls: 'save',
                handler: function(button,evt){
                    me.savefunc();
                }
            },'-',
            {
                xtype: 'button',
                text: globalRes.buttons.remove,
                iconCls: 'mxGraphRemove',
                handler: function(button,evt){
                    me.deletefunc()
                }
            },'-',
            {
                xtype: 'button',
                text: workFlowRes.modeler.undo,
                iconCls: 'undo',
                handler: function(button,evt){
                    me.undo();
                }
            },'-',
            {
                xtype: 'button',
                text: workFlowRes.modeler.redo,
                iconCls: 'redo',
                handler: function(button,evt){
                    me.redo();
                }
            },'-',
            {
                xtype: 'button',
                text:workFlowRes.modeler.selectVertices,
                scope: this,
                handler:function()
                {
                    me.graph.selectVertices();
                }
            },'-',
            {
                xtype: 'button',
                text:workFlowRes.modeler.selectEdges,
                scope: this,
                handler:function()
                {
                    me.graph.selectEdges();
                }
            },'-',
            {
                xtype: 'button',
                text:workFlowRes.modeler.selectAll,
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
                title: workFlowRes.modeler.navGraphTree,
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
                        return (record.get('leaf')==false) ? "grid-navGraphTree" : "";
                    }
                },
                store:store
            },{
                region: 'east',
                title: Ext.String.format(workFlowRes.modeler.graphProperties,me.processRecord.name),
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
                            text:workFlowRes.modeler.zoom,
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
                            tooltip: workFlowRes.modeler.zoomPercent,
                            handler: function(button,evt){
                                Ext.Msg.prompt(workFlowRes.modeler.zoomPercent,workFlowRes.modeler.zoomPercentWrite,function(btn,text){
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
                            tooltip: workFlowRes.modeler.zoomIn,
                            handler: function(button,evt){
                                me.zoomIn();
                            }
                        },'-',
                        {
                            iconCls: 'zoomOut',
                            tooltip: workFlowRes.modeler.zoomOut,
                            handler: function(button,evt){
                                me.zoomOut();
                            }
                        },'-',
                        {
                            iconCls: 'zoomActual',
                            tooltip: workFlowRes.modeler.zoomActual,
                            handler: function(button,evt){
                                me.actualSize();
                            }
                        }
                        ,'->',
                        {
                            xtype:'button',
                            text: workFlowRes.modeler.preview,
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
            process.setAttribute('pid', me.processRecord.id?me.processRecord.id:new Date().getTime());
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
                    fieldLabel: workFlowRes.modeler.processName,
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
                    fieldLabel: workFlowRes.modeler.flowFormName,
                    name:'flowFormName',
                    readOnly:true,
                    value:me.processRecord.flowFormName,
                    readOnlyCls:'x-item-disabled'
                },
                {
                    fieldLabel: workFlowRes.modeler.processCategory,
                    name:'category',
                    readOnly:true,
                    value:me.processRecord.category,
                    readOnlyCls:'x-item-disabled'
                },{
                    xtype:'textareafield',
                    grow: true,
                    fieldLabel:workFlowRes.modeler.processDocumentation,
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
                    fieldLabel: workFlowRes.modeler.name,
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.conditionsequenceflow,
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
                    fieldLabel: workFlowRes.modeler.defaultflow,
                    valueField: 'type',
                    displayField: 'displayText',
                    value:cell.value.getAttribute('defaultflow','None'),
                    name:'defaultflow',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['None', workFlowRes.modeler.defaultflowNone],
                            ['Default', workFlowRes.modeler.defaultflowDefault]
                        ]
                    }),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('defaultflow',newValue);
                            if(newValue == 'Default'){
                                var overlay = new mxCellOverlay(new mxImage('mxgraph/images/connector/list/type.default.png', 11, 11),workFlowRes.modeler.defaultflowDefault,mxConstants.ALIGN_CENTER,mxConstants.ALIGN_MIDDLE);
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
                    fieldLabel: workFlowRes.modeler.conditionalflow,
                    valueField: 'type',
                    displayField: 'displayText',
                    value:cell.value.getAttribute('conditionalflow','None'),
                    name:'conditionalflow',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['None', workFlowRes.modeler.defaultflowNone],
                            ['Conditional', workFlowRes.modeler.conditionalflowConditional]
                        ]
                    }),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('conditionalflow',newValue);
                            if(newValue == 'Conditional'){
                                var overlay = new mxCellOverlay(new mxImage('mxgraph/images/connector/list/type.expression.png', 11, 11),workFlowRes.modeler.defaultflowDefault,mxConstants.ALIGN_CENTER,mxConstants.ALIGN_MIDDLE);
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
                    fieldLabel:workFlowRes.modeler.processDocumentation,
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
                    fieldLabel: workFlowRes.modeler.name,
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.formproperties,
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
                            formId:me.processRecord.flowFormId,
                            defId:me.processRecord.id,
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
                    fieldLabel:workFlowRes.modeler.executionlisteners,
                    hidden:!me.developer,
                    value:cell.value.getAttribute('executionlisteners'),
                    name:'executionlisteners'
                },{
                    name:'documentation',
                    fieldLabel:workFlowRes.modeler.processDocumentation,
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
                    fieldLabel: workFlowRes.modeler.looptype,
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
                    fieldLabel: workFlowRes.modeler.isforcompensation,
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
                    fieldLabel: workFlowRes.modeler.name,
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.formkeydefinition,
                    name: 'formkeydefinition',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('formkeydefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('formkeydefinition',newValue);
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.duedatedefinition,
                    hidden:!me.developer,
                    name: 'duedatedefinition',
                    xtype:'datetimefield',
                    value:cell.value.getAttribute('duedatedefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('duedatedefinition',newValue);
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.prioritydefinition,
                    name: 'prioritydefinition',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('prioritydefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('prioritydefinition',newValue);
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.usertaskassignment,
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
                            Ext.Msg.alert(workFlowRes.modeler.usertaskassignmentTitle,workFlowRes.modeler.usertaskassignmentMsg);
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
                    fieldLabel: workFlowRes.modeler.formproperties,
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
                    fieldLabel: workFlowRes.modeler.countersign,
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
                            Ext.Msg.alert(workFlowRes.modeler.countersign,workFlowRes.modeler.countersignMsg);
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
                    fieldLabel: workFlowRes.modeler.executionlisteners,
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
                    fieldLabel: workFlowRes.modeler.asynchronousdefinition,
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', globalRes.yes],
                            ['No', globalRes.no]
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
                    fieldLabel: workFlowRes.modeler.exclusivedefinition,
                    hidden:!me.developer,
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', globalRes.yes],
                            ['No', globalRes.no]
                        ]
                    }),
                    value:cell.value.getAttribute('exclusivedefinition'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('exclusivedefinition',newValue);
                        }
                    }
                },{
                    fieldLabel:workFlowRes.modeler.executionlisteners,
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
                    fieldLabel:workFlowRes.modeler.processDocumentation,
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
                    fieldLabel: workFlowRes.modeler.looptype,
                    name: 'looptype',
                    hidden:!me.developer,
                    value:cell.value.getAttribute('looptype'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            cell.value.setAttribute('looptype',newValue);
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.name,
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },,{
                    fieldLabel: workFlowRes.modeler.executionlisteners,
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
                    fieldLabel: workFlowRes.modeler.asynchronousdefinition,
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'asynchronousdefinition',
                    value:cell.value.getAttribute('asynchronousdefinition'),
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', globalRes.yes],
                            ['No', globalRes.no]
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
                    fieldLabel: workFlowRes.modeler.exclusivedefinition,
                    valueField: 'type',
                    displayField: 'displayText',
                    name:'exclusivedefinition',
                    store: Ext.create('Ext.data.ArrayStore', {
                        fields: ['type', 'displayText'],
                        data: [
                            ['Yes', globalRes.yes],
                            ['No', globalRes.no]
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
                    fieldLabel:workFlowRes.modeler.processDocumentation,
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
                    fieldLabel: workFlowRes.modeler.name,
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
                    fieldLabel:workFlowRes.modeler.processDocumentation,
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
                    fieldLabel: workFlowRes.modeler.name,
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
                    fieldLabel: workFlowRes.modeler.errorref,
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
                    fieldLabel:workFlowRes.modeler.processDocumentation,
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
                    fieldLabel: workFlowRes.modeler.name,
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.timerdurationdefinition,
                    name: 'timerdurationdefinition',
                    listeners:{
                        blur:function( f, The, eOpts ){
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.timerdatedefinition,
                    name: 'timerdatedefinition',
                    listeners:{
                        blur:function( f, The, eOpts ){
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.timercycledefinition,
                    name: 'timercycledefinition',
                    listeners:{
                        blur:function( f, The, eOpts ){
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:workFlowRes.modeler.processDocumentation,
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                        }
                    }
                }]
        });
        
        return form;
    },
    BoundarySignalEvent:function(cell){
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
                    name:'overrideid'
                },
                {
                    fieldLabel: workFlowRes.modeler.name,
                    name: 'name',
                    listeners:{
                        blur:function( f, The, eOpts ){
                            me.graph.cellLabelChanged(cell,form.getForm().getValues().name);
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.signalref,
                    name: 'signalref',
                    listeners:{
                        blur:function( f, The, eOpts ){
                        }
                    }
                },{
                    name:'documentation',
                    fieldLabel:workFlowRes.modeler.processDocumentation,
                    xtype:'textareafield',
                    grow: true,
                    listeners:{
                        blur:function( f, The, eOpts ){
                        }
                    }
                }]
        });
       
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
                    fieldLabel: workFlowRes.modeler.name,
                    name: 'name',
                    value:cell.value.getAttribute('name'),
                    listeners:{
                        change:function(combo, newValue, oldValue,eOpts ){
                            me.graph.cellLabelChanged(cell,newValue);
                            cell.value.setAttribute('name',newValue);
                        }
                    }
                },{
                    fieldLabel: workFlowRes.modeler.executionlisteners,
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
                    fieldLabel:workFlowRes.modeler.processDocumentation,
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
                var nodeName=cell.value.nodeName,name=cell.value.getAttribute('name'),title=name?((workFlowRes.modeler.nodeAtt+'（')+name+')'):workFlowRes.modeler.nodeAtt;
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
