/**
 * Created with IntelliJ IDEA.
 * User: yongliu
 * Date: 4/17/12
 * Time: 12:09 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.grid.column.RadioColumn', {
  extend:'Ext.grid.column.Column',
  alias:['widget.radiocolumn'],

  isSingle: false, // true:single or false: multiple

  // private
  checkedOnCls:'q-default-checked-on',
  uncheckedCls: 'q-default-checked',

  actionIdRe: new RegExp('q-default-col-ext-gen(\\d+)'),
  
  readOnly: false,

  initComponent: function(){
    var me = this;
    me.callParent(arguments);
  },

  renderer:function (value, metaData, record, rowIndex, colIndex, store, view) {
    var clsClazz = 'q-default-checked{0}';
    clsClazz = Ext.String.format(clsClazz,value ? '-on':'');
    var column = view.getGridColumns()[colIndex];
    var cls = column && column.readOnly ? '{0} {1} {2}' : '{0} {1}';
    if (column && column.readOnly) {
      cls = Ext.String.format(cls, clsClazz, 'q-default-col-' + Ext.id(), 'form-field-readonly');
    } else {
      cls = Ext.String.format(cls, clsClazz, 'q-default-col-' + Ext.id());
    }

    return '<div class="'+cls+'">&#160;</div>';
  },

  processEvent : function(type, view, cell, recordIndex, cellIndex, e){
    var me = this ,
      dataIndex = this.dataIndex,
      match = e.getTarget().className.match(me.actionIdRe);

    if(type == 'click' && match && !me.readOnly){
      var store = view.store;
      var curRecord = store.getAt(recordIndex);
      if(me.isSingle){
        var checkedArray = Ext.query('.q-default-checked-on');
        for(var i= 0,len=checkedArray.length;i<len;i++){
          var item = checkedArray[i];
          if(item && item != null && e.getTarget() != item){
            item = Ext.get(item);
            item.removeCls(me.uncheckedCls);
          }
        }

        if (checkedArray.length > 0) {
          Ext.each(store.data.items, function (rec) {
            if (rec != curRecord)
              rec.set(dataIndex, false);
          });
        }
      }

      var newDefaultVal = !(curRecord.get(dataIndex) || false);
      curRecord.set(dataIndex,newDefaultVal);

    }
    return me.callParent(arguments);
  }
});