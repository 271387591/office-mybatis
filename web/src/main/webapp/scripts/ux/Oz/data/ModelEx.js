/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-01
 * Time: 1:59 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.data.ModelEx', {
    extend: 'Ext.data.Model',

    requires: [
      'Ext.data.Model'
    ],

    setExtraParam: function (name, value){
      this.proxy.extraParams = this.proxy.extraParams || {};
      this.proxy.extraParams[name] = value;
      this.proxy.applyEncoding(this.proxy.extraParams);
    }
  }
);
