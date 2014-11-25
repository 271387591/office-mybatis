/**
 * Created by IntelliJ IDEA.
 * User: rojer
 * Date: 11-06-02
 * Time: 10:42 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.grid.feature.Detail', {
			/* Begin Definitions */
			extend: 'Ext.grid.feature.Feature',
			alias: 'feature.detail',

			/* End Definitions */
			detailCls: 'detail',
			tplDetail: [],
			startingDetail: globalRes.startingDetail,

			detailDock: 'bottom',
			detailPadding: 5,
			detailHeight: 100,

			// doesn't handle grid body events
			hasFeatureEvent: false,

			constructor: function (config) {
				var me = this;
				config = config || {};
				Ext.apply(me, config);
				me.fields = [];
			},

			init: function (grid) {
				var me = this,
						sm = grid.getSelectionModel();

				if (grid.rendered) {
					// create detail toolbar
					me.createDetail(grid);
				} else {
					me.mon(grid, 'afterrender', function () {
						// create detail toolbar
						me.createDetail(grid);
					}, me)
				}

				this.mon(sm, 'selectionchange', function (sm, rs) {
					if (rs.length) {
						me.detail.update(rs[0].data);
					}
					else {
						me.detail.update(me.startingDetail);
					}
				});
			},

			createDetail: function (grid) {
				var me = this, detail;
				detail = me.detail = Ext.create('Ext.panel.Panel', {
					region: 'center',
					autoScroll: true,
					baseCls: me.detailCls,
					padding: me.detailPadding,
					tpl: me.tplDetail,
					html: me.startingDetail
				});

				grid.addDocked(Ext.create('Ext.toolbar.Toolbar', {
							dock: me.detailDock,
							height: me.detailHeight,
							layout: 'border',
							items: detail
						}
				));
			},

			getGridPanel: function () {
				return this.view;
			},

			/**
			 * @private
			 * Handler called by the grid 'beforedestroy' event
			 */
			onDestroy: function () {
				var me = this;
				Ext.destroyMembers(me, 'detail');
				me.clearListeners();
			}
		}
);
