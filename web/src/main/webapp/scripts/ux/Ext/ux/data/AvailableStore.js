/**
 * Created with IntelliJ IDEA.
 * User: wangy
 * Date: 12-8-17
 * Time: PM3:27
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Ext.ux.data.AvailableStore', {
  extend: 'Ext.data.Store',

  remove: function (records, /* private */ isMove) {
    if (!Ext.isArray(records)) {
      records = [records];
    }

    this.callParent(arguments);

    if (records.length > 0) {
      this.fireEvent('batchRemove', this, records)
    }
  }

});