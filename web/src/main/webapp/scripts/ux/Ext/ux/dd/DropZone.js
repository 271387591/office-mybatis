/**
 * Created by IntelliJ IDEA.
 * User: yongliu
 * Date: 12/14/11
 * Time: 1:06 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.dd.DropZone', {
  extend: 'Ext.dd.DropZone',

  //If the mouse is over a target node, return that node. This is
  //provided as the "target" parameter in all "onNodeXXXX" node event handling functions
  getTargetFromEvent: function (e) {
    return e.getTarget('.x-grid-row');
  },

  //On entry into a target node, highlight that node.
  onNodeEnter: function (target, dd, e, data) {
    Ext.fly(target).addCls('drop-target-hover');
  },

  //On exit from a target node, unhighlight that node.
  onNodeOut: function (target, dd, e, data) {
    Ext.fly(target).removeCls('drop-target-hover');
  }
});