package com.ozstrategy.service.flows.impl;

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
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessDefInstanceManager;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public void runStartNoneEventPro(User user, ProcessDef def,TaskInstance taskInstance,Map<String,Object> map) throws OzException,Exception{
        String username=user.getUsername();
        String actDefId=def.getActDefId();
        identityService.setAuthenticatedUserId(username);
        ProcessInstance instance = runtimeService.startProcessInstanceById(actDefId, map);
        if(instance==null){
            throw new OzException(Constants.MESSAGE_START_PROCESS_FAIL);
        }
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
        processDefInstanceDao.saveProcessDefInstance(defInstance);

        List<HistoricActivityInstance> activityInstances = historyService.createHistoricActivityInstanceQuery().finished().list();
        if(activityInstances!=null && activityInstances.size()>0){
            for(HistoricActivityInstance activityInstance : activityInstances){
                taskInstance.setStartDate(activityInstance.getStartTime());
                taskInstance.setEndDate(activityInstance.getEndTime());
                taskInstance.setName(activityInstance.getActivityName());
                taskInstance.setAssignee(user);
                taskInstance.setInstance(defInstance);
                taskInstance.setTaskKey(activityInstance.getActivityId());
                ProcessElement element=processElementDao.getProcessElementByTaskKeyAndDefId(def.getId(),activityInstance.getActivityId());
                taskInstance.setElement(element);
                taskInstance.setCreator(user);
                taskInstance.setLastUpdater(user);
                taskInstance.setCreateDate(new Date());
                taskInstance.setLastUpdateDate(new Date());
                taskInstanceDao.saveTaskInstance(taskInstance);
            }
        }
        Set<ProcessFileAttach> fileAttaches=taskInstance.getFileAttaches();
        if(fileAttaches!=null && fileAttaches.size()>0){
            for(ProcessFileAttach fileAttach : fileAttaches){
                fileAttach.setInstance(taskInstance);
                fileAttach.setLastUpdateDate(new Date());
                fileAttach.setLastUpdater(user);
                processFileAttachDao.updateProcessFileAttach(fileAttach);
            }
        }
    }
}
