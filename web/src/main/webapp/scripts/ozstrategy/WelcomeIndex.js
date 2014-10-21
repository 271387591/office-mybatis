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
        'FlexCenter.flows.view.ProcessDefinitionView',
        'FlexCenter.flows.view.ProcessDefInstanceDraftView'
    ],
    itemId:'welcomeindex',
    initComponent: function() {
        var me=this;
        var data=[
            {"title": "我的流程", parentUrl:('#'+me.itemId),"items": [
                {"thumb": basePath+"images/workflowManager.png",url:'#processDefinitionView', "description": "11111", "title": "Ext JS 4 - The Most Advanced JavaScript Framework for Web Apps", "id": "22863837", "name": "22863837"},
                {"thumb": "http://b.vimeocdn.com/ts/110/118/110118333_200.jpg",url:'#processDefInstanceDraftView', "description": "22222", "title": "Introducing Ext JS 4", "id": "17666102", "name": "17666102"},
//                {"thumb": "http://b.vimeocdn.com/ts/166/239/166239450_200.jpg", "description": "33333", "title": "What's New in Ext JS 4 Webinar", "id": "25264626", "name": "25264626"}
            ]}
        ];
        var thumbList= Ext.create('Oz.app.ThumbList', {
            commentType: "video",
            itemTpl: [
                '<dd ext:url="{url}"><div class="thumb"><img src="{thumb}"/></div>',
                '<div><h4>{title}',
                '</h4><p>{[values.description.substr(0,80)]}...</p></div>',
                '</dd>'
            ],
            data: data
        });
        this.mon(thumbList,'urlclick',function(url,parentUrl){
            var apptabs = Ext.ComponentQuery.query('#apptabs')[0];
            apptabs.addTab(panel,parentUrl);
        });
        this.items = [
            thumbList
        ];
        
        
        this.callParent(arguments);
    }
});