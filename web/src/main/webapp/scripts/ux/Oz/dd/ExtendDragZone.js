/**
 * Created by IntelliJ IDEA.
 * User: yongliu
 * Date: 12/14/11
 * Time: 12:43 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.dd.ExtendDragZone',{
    extend: 'Ext.dd.DragZone',
    containerScroll: false,

    dragText : '{0} selected row{1}',
    dragOverText : '{0} selected row{1},{2} {3}{4} skiped.',

    constructor: function(config) {
        var me = this;

        Ext.apply(me, config);

        // Create a ddGroup unless one has been configured.
        // User configuration of ddGroups allows users to specify which
        // DD instances can interact with each other. Using one
        // based on the id of the View would isolate it and mean it can only
        // interact with a DropZone on the same View also using a generated ID.
//    if (!me.ddGroup) {
//      me.ddGroup = 'view-dd-zone-' + me.view.id;
//    }

        // Ext.dd.DragDrop instances are keyed by the ID of their encapsulating element.
        // So a View's DragZone cannot use the View's main element because the DropZone must use that
        // because the DropZone may need to scroll on hover at a scrolling boundary, and it is the View's
        // main element which handles scrolling.
        // We use the View's parent element to drag from. Ideally, we would use the internal structure, but that
        // is transient; DataView's recreate the internal structure dynamically as data changes.
        // TODO: Ext 5.0 DragDrop must allow multiple DD objects to share the same element.
        me.callParent([me.view.el.dom.parentNode]);

        me.ddel = Ext.get(document.createElement('div'));
        me.ddel.addCls(Ext.baseCSSPrefix + 'grid-dd-wrap');
        me.ddel.addCls('drag-text-width');
    },

    init: function(id, sGroup, config) {
        this.initTarget(id, sGroup, config);
        this.view.mon(this.view, {
            itemmousedown: this.onItemMouseDown,
            scope: this
        });
    },

    onItemMouseDown: function(view, record, item, index, e) {
        if (!this.isPreventDrag(e, record, item, index)) {
            this.handleMouseDown(e);

            // If we want to allow dragging of multi-selections, then veto the following handlers (which, in the absence of ctrlKey, would deselect)
            // if the mousedowned record is selected
            if (view.getSelectionModel().selectionMode == 'MULTI' && !e.ctrlKey && view.getSelectionModel().isSelected(record)) {
                return false;
            }
        }
    },

    // private template method
    isPreventDrag: function(e) {
        return false;
    },

    getDragData: function(e) {
        var view = this.view,
            item = e.getTarget(view.getItemSelector()),
            record, selectionModel, records;

        if (item) {
            record = view.getRecord(item);
            selectionModel = view.getSelectionModel();
            records = selectionModel.getSelection();
            return {
                copy: this.view.copy || (this.view.allowCopy && e.ctrlKey),
                event: new Ext.EventObjectImpl(e),
                view: view,
                ddel: this.ddel,
                item: item,
                records: records,
                fromPosition: Ext.fly(item).getXY()
            };
        }
    },

    onInitDrag: function(x, y) {
        var me = this,
            data = me.dragData,
            view = data.view,
            selectionModel = view.getSelectionModel(),
            record = view.getRecord(data.item),
            e = data.event;

        // Update the selection to match what would have been selected if the user had
        // done a full click on the target node rather than starting a drag from it
        if (!selectionModel.isSelected(record) || e.hasModifier()) {
            selectionModel.selectWithEvent(record, e, true);
        }
        data.records = selectionModel.getSelection();

        me.ddel.update(me.getDragText());
        me.proxy.update(me.ddel.dom);
        me.onStartDrag(x, y);
        return true;
    },

    getDragText: function() {
        var count = this.dragData.records.length;
        return Ext.String.format(this.dragText, count, count == 1 ? '' : 's');
    },

    getAgentDragEnterText: function() {
        var count = this.dragData.records.length;
        var realData = [];
        Ext.each(this.dragData.records, function(record){
            if (record.get('type') == "agent") {
                realData.push(record);
            }
        })
        var length = this.dragData.records.length - realData.length;
        if(length == 0){
            return Ext.String.format(this.dragText, count, count == 1 ? '' : 's');
        }
        return Ext.String.format(this.dragOverText, count, count == 1 ? '' : 's',length,'role',length == 1 ? '' : 's');
    },
    getAgencyDragEnterText: function() {
        var count = this.dragData.records.length;
        var realData = [];
        Ext.each(this.dragData.records, function(record){
            if (record.get('type') == "agency") {
                realData.push(record);
            }
        })
        var length = this.dragData.records.length - realData.length;
        if(length == 0){
            return Ext.String.format(this.dragText, count, count == 1 ? '' : 's');
        }
        return Ext.String.format(this.dragOverText, count, count == 1 ? '' : 's',length,'agent',length == 1 ? '' : 's');
    },

    getRepairXY : function(e, data){
        return data ? data.fromPosition : false;
    },
    onDragEnter: function(e, id){
        var me = this;
        var view  = this.view;
        var agentViewId = view.up().up().down('#agent').getView().id,
            agencyViewId = view.up().up().down('#agency').getView().id,
            selectedViewId = view.id;
        if(id === selectedViewId){
            me.ddel.update(me.getDragText());
        }else if(id === agentViewId){
            me.ddel.update(me.getAgentDragEnterText());
        }else if(id === agencyViewId){
            me.ddel.update(me.getAgencyDragEnterText());
        }
        
       
    }

});