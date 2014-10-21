package com.ozstrategy.service;

import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.dao.flows.TaskInstanceDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.TaskInstance;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.impl.RepositoryServiceImpl;
import org.activiti.engine.impl.cmd.GetDeploymentProcessDefinitionCmd;
import org.activiti.engine.impl.interceptor.CommandExecutor;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.apache.ibatis.session.RowBounds;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/30/14.
 */
public class ProcessDefInstanceManagerTest extends BaseManagerTestCase  {
    @Autowired
    ProcessDefDao processDefDao;
    @Autowired
    TaskInstanceDao taskInstanceDao;
    
    @Autowired
    RuntimeService runtimeService;
    @Autowired
    RepositoryService repositoryService;
    @Autowired
    TaskService taskService;
    @Autowired
    private IdentityService identityService;
    @Autowired
    HistoryService historyService;
    
    
    @Test
    @Rollback(value = true)
    public void testRun() throws Exception{
        ProcessDef def=processDefDao.getProcessDefById(1L);
        String actDefId=def.getActDefId();
        String actResId=def.getActResId();
        Map<String,Object> map=new HashMap<String, Object>();
        map.put("name","name1");
        map.put("age",1);
        identityService.setAuthenticatedUserId("admin");
        ProcessInstance instance = runtimeService.startProcessInstanceById(actDefId, map);
        System.out.println(instance.getId());
        List<Task> tasks = taskService.createTaskQuery().list();
        System.out.println(tasks.size());
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().deploymentId(actResId).singleResult();
        int i=0;
        
    }
    @Test
    @Rollback(value = false)
    public void testTask() throws Exception{
        
        List<Task> tasks = taskService.createTaskQuery().taskCandidateUser("dep").list();
        System.out.println(tasks.size());
        tasks = taskService.createTaskQuery().taskCandidateUser("hr").list();
        System.out.println(tasks.size());
        for(Task task : tasks){
            task.getTaskLocalVariables();
        }

        List<HistoricTaskInstance> taskInstances = historyService.createHistoricTaskInstanceQuery().list();

        System.out.println(taskInstances.size());
        
        List<HistoricActivityInstance> activityInstances = historyService.createHistoricActivityInstanceQuery().finished().list();

        System.out.println(activityInstances.size());


        Map<String,Object> map = runtimeService.getVariables("130001");

        ProcessInstance instance = runtimeService.createProcessInstanceQuery().processInstanceId("130001").singleResult();
        map=instance.getProcessVariables();
        
        
//        taskService.setAssignee("125024", "user");
//        taskService.unclaim("125024");

//        Task task= taskService.newTask();
//        ProcessDefinition definition=repositoryService.createProcessDefinitionQuery().processDefinitionId("process_1:1:125010").singleResult();
        RepositoryServiceImpl repositoryService1=(RepositoryServiceImpl)repositoryService;
        CommandExecutor executor = repositoryService1.getCommandExecutor();
        ProcessDefinitionEntity entity = executor.execute(new GetDeploymentProcessDefinitionCmd("process_1:1:125010"));
        ActivityImpl activity = entity.getInitial();

        int i=0;
    }
    
    @Test
    public void testTaskInstance() throws Exception{
        Map<String,Object> map=new HashMap<String, Object>();
        map.put("instanceId",5);
        List<TaskInstance> taskInstances = taskInstanceDao.listTaskInstances(map, RowBounds.DEFAULT);
        int i=0;
    }
    
    
}
