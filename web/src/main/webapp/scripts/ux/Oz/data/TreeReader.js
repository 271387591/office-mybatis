/**
 * Created by IntelliJ IDEA.
 * User: yongliu
 * Date: 12/12/11
 * Time: 5:17 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Oz.data.TreeReader',{
  extend : 'Ext.data.reader.Json',
  alias : 'reader.tree',
  requires : [
    'Ext.data.NodeInterface',
    'Ext.data.Tree'
  ],

  readRecords: function(data) {

        //this has to be before the call to super because we use the meta data in the superclass readRecords
        if (data.metaData) {
            this.onMetaChange(data.metaData);
        }

        /**
         * @deprecated will be removed in Ext JS 5.0. This is just a copy of this.rawData - use that instead
         * @property {Object} jsonData
         */
        this.initNodes(data);
        this.jsonData = data;
        return this.callParent([data]);
    },

  initNodes : function(data){
    var records = data.data;
    this.nodes = [];
    for(var i = 0,len = records.length;i<len;i++){
      var data = records[i];
      var nodes = this.createNode(data) || [];
      for(var j=0;j<nodes.length;j++){
        nodes[j]['questionCode']=nodes[j].text;
        this.nodes.push(nodes[j]);
      }
    }
  },

  createNode : function(data){
    var rs = [],children = data.children,root=[];

    data.children = [];
    rs.push(data);

    for(var i=0,len = children.length;i<len;i++){
      rs.push(children[i]);
    }

    delete root,children;

    return rs;
  },


  extractData: function(root) {
    var recordName = this.record,
      data = [],
      length, i;

    if (recordName) {
      length = root.length;

      if (!length && Ext.isObject(root)) {
        length = 1;
        root = [root];
      }

      for (i = 0; i < length; i++) {
        data[i] = root[i][recordName];
      }
    } else {
      //data = root;
      data = this.nodes;
    }
    return this.callParent([data]);

  }

});