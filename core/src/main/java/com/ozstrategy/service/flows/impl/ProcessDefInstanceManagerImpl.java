package com.ozstrategy.service.flows.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ozstrategy.Constants;
import com.ozstrategy.dao.flows.ProcessDefInstanceDao;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.dao.flows.ProcessFileAttachDao;
import com.ozstrategy.dao.flows.TaskInstanceDao;
import com.ozstrategy.dao.flows.TaskLinkTaskDao;
import com.ozstrategy.exception.OzException;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessDefHasType;
import com.ozstrategy.model.flows.ProcessDefInstance;
import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.model.flows.ProcessFileAttach;
import com.ozstrategy.model.flows.TaskInstance;
import com.ozstrategy.model.flows.TaskInstanceStatus;
import com.ozstrategy.model.flows.TaskLinkTask;
import com.ozstrategy.model.flows.TaskType;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessDefInstanceManager;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.ObjectUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 9/27/14.
 */
@Service("processDefInstanceManager")
public class ProcessDefInstanceManagerImpl implements ProcessDefInstanceManager {
    @Autowired
    private RuntimeService runtimeService;
    @Autowired
    private TaskService taskService;
    @Autowired
    private IdentityService identityService;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private ProcessDefInstanceDao processDefInstanceDao;
    @Autowired
    private ProcessElementDao processElementDao;
    @Autowired
    private TaskInstanceDao taskInstanceDao;
    @Autowired
    private ProcessFileAttachDao processFileAttachDao;
    @Autowired
    private TaskLinkTaskDao taskLinkTaskDao;
    
    @Transactional(rollbackFor = Throwable.class)
    public void runStartNoneEventPro(User user, ProcessDef def,Map<String,Object> map) throws OzException,Exception{
        String username=user.getUsername();
        String actDefId=def.getActDefId();
        String formData= ObjectUtils.toString(map.get("formData"));
        Map<String,Object> variables=new HashMap<String, Object>();
        if(StringUtils.isNotEmpty(formData)){
            try {
                variables=new ObjectMapper().readValue(formData,Map.class);
            }catch (IOException e){
            }
        }
        ProcessInstance instance=null;
        try{
            identityService.setAuthenticatedUserId(username);
            instance = runtimeService.startProcessInstanceById(actDefId, new HashMap<String, Object>());
        }finally {
            identityService.setAuthenticatedUserId(null);
        }
        if(instance==null){
            throw new OzException(Constants.MESSAGE_START_PROCESS_FAIL);
        }
        Task task = taskService.createTaskQuery().processDefinitionId(instance.getProcessDefinitionId()).processInstanceId(instance.getProcessInstanceId()).singleResult();
        if(task==null){
            throw new OzException(Constants.MESSAGE_START_PROCESS_NOT_FOUND_START_TASK);
        }
        if(StringUtils.isEmpty(task.getAssignee())){
            taskService.addCandidateUser(task.getId(),username);
            taskService.claim(task.getId(),username);
        }else{
            task.setAssignee(username);
        }
        if(def.getHasType()== ProcessDefHasType.HasSign){
            Set<ProcessElement> elements=def.getElements();
            if(elements!=null && elements.size()>0){
                for (ProcessElement element : elements){
                    if(element.getTaskType()== TaskType.Countersign){
                        Map<String,Object> signMap=element.getCountersignMap();
                        for(String key:signMap.keySet()){
                            if(key.contains("signAssignee_")){
                                List<String> list=(List<String>)signMap.get(key);
                                for(int i=0;i<list.size();i++){
                                    String item=list.get(i);
                                    if(item.contains("${")){
                                        list.set(i,username);
                                        break;
                                    }
                                }
                                variables.put(key,list);
                            }
                        }
                    }
                }
            }
        }
        //save ProcessDefInstance
        ProcessDefInstance defInstance=new ProcessDefInstance();
        defInstance.setActInstanceId(instance.getProcessInstanceId());
        defInstance.setProcessDef(def);
        defInstance.setStartDate(new Date());
        defInstance.setCreateDate(new Date());
        defInstance.setCreator(user);
        defInstance.setLastUpdateDate(new Date());
        defInstance.setLastUpdater(user);
        defInstance.setVersion(def.getVersion());
        defInstance.setName(def.getName());
        defInstance.setTitle(ObjectUtils.toString(map.get("title")));
        processDefInstanceDao.saveProcessDefInstance(defInstance);
        String fileAttaches=ObjectUtils.toString(map.get("fileAttaches"));
        if(StringUtils.isNotEmpty(fileAttaches)){
            String[] fileAttacheIds=fileAttaches.split(",");
            for(String fileAttacheId:fileAttacheIds){
                ProcessFileAttach processFileAttach = processFileAttachDao.getProcessFileAttachById(Long.parseLong(fileAttacheId));
                if(processFileAttach!=null){
                    processFileAttach.setInstance(defInstance);
                    processFileAttach.setLastUpdateDate(new Date());
                    processFileAttach.setLastUpdater(user);
                    processFileAttach.setActInstanceId(instance.getProcessInstanceId());
                    processFileAttachDao.updateProcessFileAttach(processFileAttach);
                }
            }
        }
//        List<ProcessElement> signTasks=new ArrayList<ProcessElement>();
//        ProcessElement processElement=processElementDao.getProcessElementByTaskKeyAndDefId(def.getId(),task.getTaskDefinitionKey());
//        if(processElement==null){
//            throw new OzException(Constants.MESSAGE_START_PROCESS_NOT_FOUND_START_TASK);
//        }
//        String nextTask=processElement.getNextTaskKeys();
//        if(StringUtils.isNotEmpty(nextTask)){
//            String[] nextTasks=nextTask.split(",");
//            for(String nextKey:nextTasks){
//                ProcessElement next=processElementDao.getSignProcessElementByTaskKeyAndDefId(def.getId(),nextKey);
//                if(next!=null){
//                    signTasks.add(next);
//                }
//            }
//        }
//        if(signTasks.size()>0){
//            for(ProcessElement element : signTasks){
//                variables.putAll(element.getCountersignMap());
//            }
//        }
        
        taskService.complete(task.getId(),variables);
        //save TaskLinkTask
        List<Task> currentTasks=taskService.createTaskQuery().processDefinitionId(instance.getProcessDefinitionId()).processInstanceId(instance.getProcessInstanceId()).list();
        if(currentTasks!=null && currentTasks.size()>0){
            for(Task currentTask : currentTasks){
                TaskLinkTask taskLinkTask=new TaskLinkTask();
                taskLinkTask.setCreateDate(new Date());
                taskLinkTask.setLastUpdateDate(new Date());
                taskLinkTask.setFromTaskAssignee(username);
                taskLinkTask.setFromTaskKey(task.getTaskDefinitionKey());
                taskLinkTask.setActInstanceId(instance.getProcessInstanceId());
                taskLinkTask.setCurrentTaskId(currentTask.getId());
                taskLinkTask.setCurrentTaskKey(currentTask.getTaskDefinitionKey());
                taskLinkTask.setFromTaskType(TaskType.Starter);
                taskLinkTask.setFromTaskId(task.getId());
                taskLinkTaskDao.insert(taskLinkTask);
            }
        }
        
        //save TaskInstance
        List<HistoricActivityInstance> taskInstances=historyService.createHistoricActivityInstanceQuery().processInstanceId(instance.getProcessInstanceId()).finished().list();
        if(taskInstances!=null && taskInstances.size()>0){
            for(HistoricActivityInstance historicTaskInstance:taskInstances){
                TaskInstance taskInstance=new TaskInstance();
                taskInstance.setSendEmail(BooleanUtils.toBooleanObject(ObjectUtils.toString(map.get("sendEmail"))));
                taskInstance.setRemarks(ObjectUtils.toString(map.get("remarks")));
                taskInstance.setStartDate(historicTaskInstance.getStartTime());
                taskInstance.setEndDate(historicTaskInstance.getEndTime());
                taskInstance.setName(historicTaskInstance.getActivityName());
                taskInstance.setAssignee(user);
                taskInstance.setInstance(defInstance);
                taskInstance.setTaskKey(historicTaskInstance.getActivityId());
                taskInstance.setActTaskId(historicTaskInstance.getId());
                taskInstance.setProcessDef(def);
                ProcessElement element=processElementDao.getProcessElementByTaskKeyAndDefId(def.getId(),historicTaskInstance.getActivityId());
                taskInstance.setElement(element);
                taskInstance.setCreator(user);
                taskInstance.setLastUpdater(user);
                taskInstance.setCreateDate(new Date());
                taskInstance.setLastUpdateDate(new Date());
                taskInstance.setStatus(TaskInstanceStatus.Starter);
                taskInstanceDao.saveTaskInstance(taskInstance);
            }
        }
//        List<HistoricActivityInstance> activityInstances = historyService.createHistoricActivityInstanceQuery().processInstanceId(instance.getProcessInstanceId()).finished().list();
//        if(activityInstances!=null && activityInstances.size()>0){
//            for(HistoricActivityInstance activityInstance : activityInstances){
//                TaskInstance taskInstance=new TaskInstance();
//                taskInstance.setSendEmail(BooleanUtils.toBooleanObject(ObjectUtils.toString(map.get("sendEmail"))));
//                taskInstance.setRemarks(ObjectUtils.toString(map.get("remarks")));
//                taskInstance.setStartDate(activityInstance.getStartTime());
//                taskInstance.setEndDate(activityInstance.getEndTime());
//                taskInstance.setName(activityInstance.getActivityName());
//                taskInstance.setAssignee(user);
//                taskInstance.setInstance(defInstance);
//                taskInstance.setTaskKey(activityInstance.getActivityId());
//                taskInstance.setActTaskId(activityInstance.getTaskId());
//                ProcessElement element=processElementDao.getProcessElementByTaskKeyAndDefId(def.getId(),activityInstance.getActivityId());
//                taskInstance.setElement(element);
//                taskInstance.setCreator(user);
//                taskInstance.setLastUpdater(user);
//                taskInstance.setCreateDate(new Date());
//                taskInstance.setLastUpdateDate(new Date());
//                taskInstance.setStatus(TaskInstanceStatus.Starter.name());
//                taskInstanceDao.saveTaskInstance(taskInstance);
//                
//            }
//        }
    }

    public ProcessDefInstance getProcessDefInstanceById(Long id) {
        return processDefInstanceDao.getProcessDefInstanceById(id);
    }
}
