package com.ozstrategy.service.flows.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ozstrategy.Constants;
import com.ozstrategy.dao.flows.ProcessDefInstanceDao;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.dao.flows.TaskDao;
import com.ozstrategy.dao.flows.TaskInstanceDao;
import com.ozstrategy.dao.userrole.UserDao;
import com.ozstrategy.exception.OzException;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessDefInstance;
import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.model.flows.Task;
import com.ozstrategy.model.flows.TaskInstance;
import com.ozstrategy.model.flows.TaskInstanceStatus;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.TaskManager;
import org.activiti.engine.HistoryService;
import org.activiti.engine.ManagementService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.impl.cmd.NeedsActiveTaskCmd;
import org.activiti.engine.impl.context.Context;
import org.activiti.engine.impl.interceptor.Command;
import org.activiti.engine.impl.interceptor.CommandContext;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.impl.persistence.entity.HistoricActivityInstanceEntity;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.persistence.entity.TaskEntity;
import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.task.TaskDefinition;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.ObjectUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/9/14.
 */
@Service("taskManager")
public class TaskManagerImpl implements TaskManager{
    @Autowired
    private TaskDao taskDao;
    @Autowired
    private TaskInstanceDao taskInstanceDao;
    @Autowired
    private ProcessDefInstanceDao processDefInstanceDao;
    @Autowired
    private ProcessElementDao processElementDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private TaskService taskService;
    @Autowired
    private RuntimeService runtimeService;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private ManagementService managementService;
    public List<Task> listCandidateTasks(Map<String, Object> map) {
        return taskDao.listCandidateTasks(map);
    }

    public List<Task> listAssigneeTasks(Map<String, Object> map) {
        return taskDao.listAssigneeTasks(map);
    }

    public List<Task> listReplevyTasks(Map<String, Object> map,Integer start,Integer limit) {
        return taskDao.listReplevyTasks(map,new RowBounds(start,limit));
    }

    public Integer listReplevyTasksCount(Map<String, Object> map) {
        return taskDao.listReplevyTasksCount(map);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void claim(String taskId, String username) {
        if(StringUtils.isNotEmpty(taskId) && StringUtils.isNotEmpty(username)){
            taskService.claim(taskId, username);
            
        }
    }
    @Transactional(rollbackFor = Throwable.class)
    public void proxyTask(String taskId, String username,User creator,Map<String,Object> map) {
        if(StringUtils.isNotEmpty(taskId) && StringUtils.isNotEmpty(username)){
            taskService.setAssignee(taskId,username);
            HistoricTaskInstance historicTaskInstance=historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
            saveTaskInstance(creator, historicTaskInstance, map, TaskInstanceStatus.ProxyTask);
        }
    }
    @Transactional(rollbackFor = Throwable.class)
    public void unclaim(String taskId) {
        if(StringUtils.isNotEmpty(taskId)){
            taskService.unclaim(taskId);
        }
    }

    public Map<String, Object> getVariables(String executionId) throws Exception{
        return runtimeService.getVariables(executionId);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void returnTask(String taskId, String taskKey, String sourceActivity,User creator,Map<String,Object> map) throws Exception {
        try{
            JumpActivityCmd jumpActivityCmd=new JumpActivityCmd(taskId,taskKey,sourceActivity);
            managementService.executeCommand(jumpActivityCmd);
            HistoricTaskInstance historicTaskInstance=historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
            saveTaskInstance(creator, historicTaskInstance, map, StringUtils.isEmpty(sourceActivity) ? TaskInstanceStatus.ReturnTaskToStarter : TaskInstanceStatus.ReturnTask);
        }catch (Exception e){
            throw new OzException(Constants.MESSAGE_RETURN_TASK_FAIL);
        }
    }
    @Transactional(rollbackFor = Throwable.class)
    public void replevyTask(String taskId, String taskKey,String sourceActivity, User creator, Map<String, Object> map) throws Exception {
        try{
            taskService.claim(taskId,creator.getUsername());
            JumpActivityCmd jumpActivityCmd=new JumpActivityCmd(taskId,taskKey,sourceActivity);
            managementService.executeCommand(jumpActivityCmd);
            HistoricTaskInstance historicTaskInstance=historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
            saveTaskInstance(creator, historicTaskInstance, map, TaskInstanceStatus.Replevy);
        }catch (Exception e){
            throw new OzException(Constants.MESSAGE_REPLEVY_TASK_FAIL);
        }
    }

    @Transactional(rollbackFor = Throwable.class)
    public void complete(User user,ProcessDef def,String taskId, Map<String, Object> map) throws Exception {
        String formData= ObjectUtils.toString(map.get("formData"));
        Map<String,Object> variables=new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(formData)){
            try {
                variables=new ObjectMapper().readValue(formData,Map.class);
            }catch (IOException e){
            }
        }
        if(StringUtils.isNotEmpty(taskId)){
            org.activiti.engine.task.Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
            if(task==null){
                throw new OzException(Constants.MESSAGE_START_PROCESS_NOT_FOUND_START_TASK);
            }
            checkSignTask(def,task,variables);
            taskService.complete(taskId,variables);
            HistoricTaskInstance historicTaskInstance=historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
            saveTaskInstance(user,historicTaskInstance,map,TaskInstanceStatus.Complete);
        }
    }
    private void checkSignTask(ProcessDef def, org.activiti.engine.task.Task task,Map<String,Object> variables)  throws OzException{
        List<ProcessElement> signTasks=new ArrayList<ProcessElement>();
        ProcessElement processElement=processElementDao.getProcessElementByTaskKeyAndDefId(def.getId(),task.getTaskDefinitionKey());
        if(processElement==null){
            throw new OzException(Constants.MESSAGE_START_PROCESS_NOT_FOUND_START_TASK);
        }
        String nextTask=processElement.getNextTaskKeys();
        if(StringUtils.isNotEmpty(nextTask)){
            String[] nextTasks=nextTask.split(",");
            for(String nextKey:nextTasks){
                ProcessElement next=processElementDao.getSignProcessElementByTaskKeyAndDefId(def.getId(),nextKey);
                if(next!=null){
                    signTasks.add(next);
                }
            }
        }
        if(signTasks.size()>0){
            for(ProcessElement element : signTasks){
                variables.putAll(element.getCountersignMap());
            }
        }
    }

    private void saveTaskInstance(User user,HistoricTaskInstance task,Map<String,Object> map,TaskInstanceStatus status){
        TaskInstance instance=new TaskInstance();
        instance.setCreateDate(new Date());
        instance.setLastUpdateDate(new Date());
        instance.setCreator(user);
        instance.setLastUpdater(user);
        instance.setTaskKey(task.getTaskDefinitionKey());
        instance.setActTaskId(task.getId());
        instance.setName(task.getName());
        instance.setOverdueDate(task.getDueDate());
        instance.setStartDate(task.getStartTime());
        instance.setEndDate(task.getEndTime());
        String assignee=task.getAssignee();
        if(StringUtils.isNotEmpty(assignee)){
            User assign=userDao.getUserByUsername(assignee);
            instance.setAssignee(assign);
        }
        String instanceId=ObjectUtils.toString(map.get("instanceId"));
        if(StringUtils.isNotEmpty(instanceId)){
            ProcessDefInstance defInstance=processDefInstanceDao.getProcessDefInstanceById(Long.parseLong(instanceId));
            instance.setInstance(defInstance);
        }
        String processDefId=ObjectUtils.toString(map.get("processDefId"));
        if(StringUtils.isNotEmpty(processDefId)){
            ProcessElement element=processElementDao.getProcessElementByTaskKeyAndDefId(Long.parseLong(processDefId),task.getTaskDefinitionKey());
            instance.setElement(element);
        }
        instance.setSendEmail(BooleanUtils.toBooleanObject(ObjectUtils.toString(map.get("sendEmail"))));
        instance.setRemarks(ObjectUtils.toString(map.get("remarks")));
        instance.setStatus(status);
        taskInstanceDao.saveTaskInstance(instance);
    }
    private static class JumpActivityCmd implements Command<Object> {
        private String jumpOrigin="jump";
        private String taskKey;
        private String taskId;
        private String sourceActivity;//逐级回退时的目标，多个目标用“,”隔开，
        public JumpActivityCmd(String taskId,String taskKey){
            this.taskId=taskId;
            this.taskKey=taskKey;
        }
        public JumpActivityCmd(String taskId,String taskKey,String sourceActivity){
            this(taskId,taskKey);
            this.sourceActivity=sourceActivity;
        }
        
        public Object execute(CommandContext commandContext) {
            TaskEntity task = commandContext.getTaskEntityManager().findTaskById(taskId);
            ExecutionEntity execution = task.getExecution();
            ProcessDefinitionEntity entity = (ProcessDefinitionEntity)execution.getProcessDefinition();
            ActivityImpl currentAct = entity.findActivity(taskKey);
            if(StringUtils.isNotEmpty(sourceActivity)){
                String[] sourceActivities=sourceActivity.split(",");
                List<String> sourceList=Arrays.asList(sourceActivities);
                List<PvmTransition> transitions = currentAct.getIncomingTransitions();
                if(transitions!=null && transitions.size()>0){
                    for(PvmTransition transition : transitions){
                        ActivityImpl source = (ActivityImpl)transition.getSource();
                        String id = source.getId();
                        if(sourceList.contains(id)){
                            execution.destroyScope(jumpOrigin);
                            execution.executeActivity(source);
                        }
                    }
                }
            }else{
                ActivityImpl initial=entity.getInitial();
                ActivityImpl startTask = (ActivityImpl)initial.getOutgoingTransitions().get(0).getDestination();
                execution.destroyScope(jumpOrigin);
                execution.executeActivity(startTask);
            }
            return execution;
        }
    }

    public static class ReturnTaskCmd extends NeedsActiveTaskCmd<Void> {
        private String taskKey;
        private int turnType;//0表示驳回到发起人，1表示逐级驳回，2表示任务转办
        private String taskAssignee;

        public ReturnTaskCmd(String taskId,String taskKey,int turnType) {
            super(taskId);
            this.taskKey=taskKey;
            this.turnType=turnType;
        }

        @Override
        protected Void execute(CommandContext commandContext, TaskEntity task) {
            ExecutionEntity execution = task.getExecution();
            //删除任务实例,并更新任务相关的历史活动信息
            commandContext.getTaskEntityManager().deleteTask(task, TaskEntity.DELETE_REASON_COMPLETED, false);
            commandContext.getHistoryManager().recordActivityEnd(execution);
            ProcessDefinitionEntity entity = (ProcessDefinitionEntity)execution.getProcessDefinition();
            ActivityImpl destinationActivity = entity.findActivity(taskKey);
            HistoricTaskInstance historyDestinationTask=null;
            if(turnType == 0){
                ActivityImpl initial=entity.getInitial();
                ActivityImpl startTask = (ActivityImpl)initial.getOutgoingTransitions().get(0).getDestination();
                execution.setActivity(startTask);
                historyDestinationTask = getHistoricTaskInstance(task.getProcessInstanceId(),startTask.getId(),task.getProcessDefinitionId());
            }else if(turnType == 1){
                List<PvmTransition> transitions = destinationActivity.getIncomingTransitions();
                if(transitions!=null && transitions.size()>0){
                    for(PvmTransition transition : transitions){
                        ActivityImpl source = (ActivityImpl)transition.getSource();
                        String taskKey = source.getId();
                        historyDestinationTask = getHistoricTaskInstance(task.getProcessInstanceId(),taskKey,task.getProcessDefinitionId());
                        if(historyDestinationTask!=null){
                            execution.setActivity(source);
                            break;
                        }
                    }
                }
            }else if(turnType == 2){
                historyDestinationTask = getHistoricTaskInstance(task.getProcessInstanceId(),taskKey,task.getProcessDefinitionId());
                execution.setActivity(destinationActivity);
            }
            TaskDefinition definition=entity.getTaskDefinitions().get(historyDestinationTask.getTaskDefinitionKey());
            //更新当前流程实例的当前活动节点信息
            //依据历史任务信息 动态创建退回任务实例
            String nextId = Context.getProcessEngineConfiguration().getIdGenerator().getNextId();
            TaskEntity newTask = new TaskEntity();
            newTask.setTaskDefinition(definition);
            newTask.setAssignee(StringUtils.isNotEmpty(taskAssignee)?taskAssignee:historyDestinationTask.getAssignee());
//            newTask.setTaskDefinitionKey(temAct.getId());
            newTask.setCreateTime(new Date());
            newTask.setExecutionId(execution.getId());
            newTask.setProcessDefinitionId(entity.getId());
            newTask.setProcessInstanceId(execution.getProcessInstanceId());
            newTask.setRevision(0);
//            newTask.setPriority(historyDestinationTask.getPriority());
            newTask.setName(historyDestinationTask.getName());
            newTask.setId(nextId);
            //执行插入 此时会创建 运行时的任务实例和历史任务实例记录信息
            newTask.insert(execution);
            newTask.setDescription(historyDestinationTask.getDescription());
//            execution.addTask(newTask);
            HistoricActivityInstanceEntity historicActivityInstance = new HistoricActivityInstanceEntity();
            historicActivityInstance.setActivityId(destinationActivity.getId());
            historicActivityInstance.setActivityName(historyDestinationTask.getAssignee());
            historicActivityInstance.setActivityType(Constants.TASK_USER_TYPE);
            historicActivityInstance.setAssignee(historyDestinationTask.getAssignee());
            historicActivityInstance.setExecutionId(execution.getId());
            historicActivityInstance.setProcessDefinitionId(task.getProcessDefinitionId());
            historicActivityInstance.setProcessInstanceId(task.getProcessInstanceId());
            historicActivityInstance.setStartTime(newTask.getCreateTime());
            historicActivityInstance.setTaskId(nextId);
            //记录一条历史活动实例信息
            commandContext.getHistoricActivityInstanceEntityManager()
                    .insertHistoricActivityInstance(historicActivityInstance);
            return null;
        }
        private HistoricTaskInstance getHistoricTaskInstance(String instanceId,String taskKey,String definitionId){
            List<HistoricTaskInstance> historyTask = Context.getProcessEngineConfiguration().getHistoryService()
                    .createHistoricTaskInstanceQuery().processInstanceId(instanceId).processDefinitionId(definitionId).taskDefinitionKey(taskKey).list();
            return historyTask.size() >= 1 ? historyTask.get(0) : null;//只取一个即可
        }

        public String getTaskAssignee() {
            return taskAssignee;
        }

        public void setTaskAssignee(String taskAssignee) {
            this.taskAssignee = taskAssignee;
        }
    }
}
