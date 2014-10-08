package com.ozstrategy.service;

import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.model.flows.ProcessDef;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
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
    RuntimeService runtimeService;
    @Autowired
    RepositoryService repositoryService;
    @Autowired
    TaskService taskService;
    @Autowired
    private IdentityService identityService;
    
    
    @Test
    @Rollback(value = false)
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
    
}
