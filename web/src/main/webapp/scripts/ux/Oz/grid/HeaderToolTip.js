/**
 * Created with IntelliJ IDEA.
 * User: weitang
 * Date: 12-12-10
 * Time: PM2:19
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.grid.HeaderToolTip', {
  alias: 'plugin.headertooltip',
  init : function(grid) {
    var headerCt = grid.headerCt;
    grid.headerCt.on("afterrender", function(g) {
      grid.tip = Ext.create('Ext.tip.ToolTip', {
        target: headerCt.el,
        delegate: ".x-column-header",
        trackMouse: true,
        renderTo: Ext.getBody(),
        listeners: {
          beforeshow: function(tip) {
            var c = headerCt.down('gridcolumn[id=' + tip.triggerElement.id  +']');
            if (c  && c.tooltip)
              tip.update(c.tooltip);
            else
              return false;
          }
        }
      });
    });
  }
});