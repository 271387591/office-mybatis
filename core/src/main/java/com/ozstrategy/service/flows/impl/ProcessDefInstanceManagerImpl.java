package com.ozstrategy.service.flows.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ozstrategy.Constants;
import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.dao.flows.ProcessDefInstanceDao;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.dao.flows.ProcessFileAttachDao;
import com.ozstrategy.dao.flows.TaskInstanceDao;
import com.ozstrategy.exception.OzException;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessDefInstance;
import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.model.flows.ProcessFileAttach;
import com.ozstrategy.model.flows.TaskInstance;
import com.ozstrategy.model.flows.TaskInstanceStatus;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessDefInstanceManager;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricTaskInstance;
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

/**
 * Created by lihao on 9/27/14.
 */
@Service("processDefInstanceManager")
public class ProcessDefInstanceManagerImpl implements ProcessDefInstanceManager {
    @Autowired
    ProcessDefDao processDefDao;
    @Autowired
    RuntimeService runtimeService;
    @Autowired
    RepositoryService repositoryService;
    @Autowired
    TaskService taskService;
    @Autowired
    IdentityService identityService;
    @Autowired
    HistoryService historyService;
    @Autowired
    ProcessDefInstanceDao processDefInstanceDao;
    @Autowired
    ProcessElementDao processElementDao;
    @Autowired
    TaskInstanceDao taskInstanceDao;
    @Autowired
    ProcessFileAttachDao processFileAttachDao;
    
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
        identityService.setAuthenticatedUserId(username);
        ProcessInstance instance = runtimeService.startProcessInstanceById(actDefId, new HashMap<String, Object>());
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
        taskService.complete(task.getId(),variables);
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
        List<HistoricTaskInstance> taskInstances=historyService.createHistoricTaskInstanceQuery().processInstanceId(instance.getProcessInstanceId()).finished().list();
        if(taskInstances!=null && taskInstances.size()>0){
            for(HistoricTaskInstance historicTaskInstance:taskInstances){
                TaskInstance taskInstance=new TaskInstance();
                taskInstance.setSendEmail(BooleanUtils.toBooleanObject(ObjectUtils.toString(map.get("sendEmail"))));
                taskInstance.setRemarks(ObjectUtils.toString(map.get("remarks")));
                taskInstance.setStartDate(historicTaskInstance.getStartTime());
                taskInstance.setEndDate(historicTaskInstance.getEndTime());
                taskInstance.setName(historicTaskInstance.getName());
                taskInstance.setAssignee(user);
                taskInstance.setInstance(defInstance);
                taskInstance.setTaskKey(historicTaskInstance.getTaskDefinitionKey());
                taskInstance.setActTaskId(historicTaskInstance.getId());
                ProcessElement element=processElementDao.getProcessElementByTaskKeyAndDefId(def.getId(),historicTaskInstance.getTaskDefinitionKey());
                taskInstance.setElement(element);
                taskInstance.setCreator(user);
                taskInstance.setLastUpdater(user);
                taskInstance.setCreateDate(new Date());
                taskInstance.setLastUpdateDate(new Date());
                taskInstance.setStatus(TaskInstanceStatus.Starter.name());
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
