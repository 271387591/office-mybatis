/**
 * Created by lihao on 10/20/14.
 */
Ext.define('FlexCenter.FlowIndex', {
    extend: 'Ext.container.Container',
    alias: 'widget.flowIndex',
    autoScroll:true,
    itemId:'flowIndex',
    requires: [
        'Oz.app.ThumbList',
        'FlexCenter.flows.view.ProcessDefinitionView',
        'FlexCenter.flows.view.TaskView',
        'FlexCenter.flows.view.ProcessDefInstanceDraftView',
        'FlexCenter.flows.view.ReplevyTaskView',
        'FlexCenter.flows.view.ApplyProcessHistoryView'
    ],
    initComponent: function() {
        var me=this;
        var taskCount=2;
        var data=[
            {"title": "", parentUrl:('#'+me.itemId),"items": [
                {thumb: basePath+"images/flow_chart.png",url:'#processDefinitionView',widget:'processDefinitionView', description: workFlowRes.flowIndex.processDefinitionViewDec, title: workFlowRes.flowIndex.processDefinitionViewTitle},
                {thumb: basePath+"images/task_recurring.png",url:'#taskView',widget:'taskView', description: Ext.String.format(workFlowRes.flowIndex.taskViewDec,taskCount), title: workFlowRes.flowIndex.taskViewTitle,comments:taskCount},
                {thumb: basePath+"images/draft.png",url:'#processDefInstanceDraftView',widget:'processDefInstanceDraftView', description: workFlowRes.flowIndex.processDefInstanceDraftViewDec, title: workFlowRes.flowIndex.processDefInstanceDraftViewTitle},
                {thumb: basePath+"images/replay.png",url:'#replevyTaskView',widget:'replevyTaskView', description: workFlowRes.flowIndex.replevyTaskViewDec, title: workFlowRes.flowIndex.replevyTaskViewTitle},
                {thumb: basePath+"images/presentation.png",url:'#applyProcessHistoryView',widget:'applyProcessHistoryView', description: workFlowRes.flowIndex.applyProcessHistoryViewDec, title: workFlowRes.flowIndex.applyProcessHistoryViewTitle},
//                {"thumb": basePath+"images/scheduled_tasks.png",url:'#taskRecordView',widget:'taskRecordView', "description": "显示您所有执行过得任务。", "title": "任务执行记录"},
//                {"thumb": "http://b.vimeocdn.com/ts/166/239/166239450_200.jpg", "description": "33333", "title": "What's New in Ext JS 4 Webinar", "id": "25264626", "name": "25264626"}
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
        
        this.callParent(arguments);
    }
});