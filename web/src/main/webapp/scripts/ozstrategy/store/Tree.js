/**
 * Created by IntelliJ IDEA.
 * User: yongliu
 * Date: 12/12/11
 * Time: 2:44 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.store.Tree',{
  extend : 'Ext.data.TreeStore',
  alias : 'store.tree',

  constructor: function(config) {
    Ext.apply(this, config);
    this.callParent();
  },

  /**
     * Sets the root node for this store.  See also the {@link #root} config option.
     * @param {Ext.data.Model/Ext.data.NodeInterface/Object} root
     * @return {Ext.data.NodeInterface} The new root
     */
    setRootNode: function(root) {
        var me = this;

        root = root || {};
        if (!root.isNode) {
            // create a default rootNode and create internal data struct.
            Ext.applyIf(root, {
                id: me.defaultRootId,
                text: 'Root',
                allowDrag: false
            });
            root = Ext.ModelManager.create(root, me.model);
        }
        Ext.data.NodeInterface.decorate(root);

        // Because we have decorated the model with new fields,
        // we need to build new extactor functions on the reader.
        me.getProxy().getReader().buildExtractors(true);

        // When we add the root to the tree, it will automaticaly get the NodeInterface
        me.tree.setRootNode(root);

        // If the user has set expanded: true on the root, we want to call the expand function
        if (!root.isLoaded() && (me.autoLoad === true || root.isExpanded())) {
          me.load({
            node: root,
            params : me.baseParams
          });
        }

        return root;
    }
});