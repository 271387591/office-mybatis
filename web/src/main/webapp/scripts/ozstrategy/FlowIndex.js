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
        'FlexCenter.flows.view.ApplyProcessHistoryView',
        'FlexCenter.flows.view.TaskRecordView'
    ],
    initComponent: function() {
        var me=this;
        var taskCount=2;
        var data=[
            {"title": "", parentUrl:('#'+me.itemId),"items": [
                {"thumb": basePath+"images/flow_chart.png",url:'#processDefinitionView',widget:'processDefinitionView', "description": "在这里，您可以填写流程申请和表单数据并发起新流程。", "title": "新建流程"},
                {"thumb": basePath+"images/task_recurring.png",url:'#taskView',widget:'taskView', "description": "显示当前需要您处理的任务。</br>您目前有<font color='red'>"+taskCount+"</font>条任务需要处理。", "title": "代办事项 ",comments:taskCount},
                {"thumb": basePath+"images/draft.png",url:'#processDefInstanceDraftView',widget:'processDefInstanceDraftView', "description": "将填写好的流程申请单存为草稿，需要时可直接发起流程。", "title": "草稿箱"},
                {"thumb": basePath+"images/replay.png",url:'#replevyTaskView',widget:'replevyTaskView', "description": "可以追回当前还未签收的任务，如当前任务为会签状态则不能追回。", "title": "任务追回"},
                {"thumb": basePath+"images/presentation.png",url:'#applyProcessHistoryView',widget:'applyProcessHistoryView', "description": "显示您所申请的流程列表。", "title": "流程申请记录"},
                {"thumb": basePath+"images/scheduled_tasks.png",url:'#taskRecordView',widget:'taskRecordView', "description": "显示您所有执行过得任务。", "title": "任务执行记录"},
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