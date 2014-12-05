/**
 * Created by lihao on 10/20/14.
 */
Ext.define('FlexCenter.WelcomeIndex', {
    extend: 'Ext.container.Container',
    alias: 'widget.welcomeindex',
//    layout:'fit',
    autoScroll:true,
    requires: [
        'Oz.app.ThumbList',
        'FlexCenter.system.view.SystemMessageView'
    ],
    itemId:'welcomeindex',
    initComponent: function() {
        var me=this;
        var data=[
            {"title": "系统消息", parentUrl:('#'+me.itemId),"items": [
                {thumb: basePath+"images/flow_chart.png",url:'#systemMessageView',widget:'systemMessageView', description: workFlowRes.flowIndex.processDefinitionViewDec, title: '系统消息'},

            ]}
        ];
        var thumbList= Ext.create('Oz.app.ThumbList', {
            groupData:false,
            itemTpl: [
                '<dd ext:url="{url}" ext:widget="{widget}" ext:comments="{comments}"><div class="thumb"><img src="{thumb}"/></div>',
                '<div><h4>{title}',
                '</h4><p>{[values.description.substr(0,80)]}</p></div>',
                '</dd>'
            ],
            data: data
        });
        this.mon(thumbList,'urlclick',function(widget,url,parentUrl){
            var apptabs = Ext.ComponentQuery.query('#apptabs')[0];
            apptabs.addTab(widget,url.substr(1),parentUrl);
        });
        me.items = [
            thumbList
        ];
//        me.html='<h3>暂无信息,请查看流程模块</h3>';
        
        
        this.callParent(arguments);
    }
});