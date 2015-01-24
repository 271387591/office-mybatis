package com.ozstrategy.service;

import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.dao.flows.TaskInstanceDao;
import com.ozstrategy.dao.userrole.UserDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.TaskInstance;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.MultiInstanceLoopService;
import com.ozstrategy.service.flows.ProcessDefInstanceManager;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.ManagementService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.impl.interceptor.Command;
import org.activiti.engine.impl.interceptor.CommandContext;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.pvm.process.ProcessDefinitionImpl;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.apache.ibatis.session.RowBounds;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

import java.text.MessageFormat;
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
    UserDao userDao;
    @Autowired
    ProcessDefInstanceManager processDefInstanceManager;
    
    
    
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
    @Autowired
    MultiInstanceLoopService multiInstanceLoopService;
    @Autowired
    ManagementService managementService;
    public final static String TASK_COUNTERSIGN_ASSIGNEE="signAssignee_{0}";
    
    
    
    @Test
    @Rollback(value = false)
    public void testRun() throws Exception{
//        ProcessInstance processInstance = runtimeService.startProcessInstanceById("my-processaaaa:1:187504");
        
        
        ProcessDef def=processDefDao.getProcessDefById(2L);
        String actDefId=def.getActDefId();
        String actResId=def.getActResId();
        Map<String,Object> map=new HashMap<String, Object>();
        map.put("name","name1");
        map.put("age",1);
        User user=userDao.getUserByUsername("admin");
        processDefInstanceManager.runStartNoneEventPro(user,def,map);
        
        
        
//        identityService.setAuthenticatedUserId("admin");
//        ProcessInstance instance = runtimeService.startProcessInstanceById(actDefId, map);
//        System.out.println(instance.getId());
//        List<Task> tasks = taskService.createTaskQuery().list();
//        System.out.println(tasks.size());
//        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().deploymentId(actResId).singleResult();
        int i=0;
        
    }
    @Test
    public void testString() throws Exception{
        String str= MessageFormat.format(TASK_COUNTERSIGN_ASSIGNEE,"sdf");
        System.out.println(str);
        
    }
    @Test
    @Rollback(value = false)
    public void testSubTask() throws Exception{
//        JumpActivityCmd jumpActivityCmd=new JumpActivityCmd("187505","Task_1");
//        managementService.executeCommand(jumpActivityCmd);
        
//        TaskServiceImpl taskServiceImpl=(TaskServiceImpl)taskService;
//        taskServiceImpl.getCommandExecutor().execute(jumpActivityCmd);
//        
//        
        List<Task> tasks = taskService.createTaskQuery().taskAssignee("dep").processInstanceId("230005").list();
        for(Task task : tasks){
            Map<String,Object> map=new HashMap<String, Object>();
//            map.put("signAssignee", Arrays.asList("user","dep","hr"));
            taskService.complete(task.getId(), map);
        }
        
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

//        List<HistoricTaskInstance> taskInstances = historyService.createHistoricTaskInstanceQuery().list();
//
//        System.out.println(taskInstances.size());
//        
//        List<HistoricActivityInstance> activityInstances = historyService.createHistoricActivityInstanceQuery().finished().list();
//
//        System.out.println(activityInstances.size());
//
//
//        Map<String,Object> map = runtimeService.getVariables("130001");
//
//        ProcessInstance instance = runtimeService.createProcessInstanceQuery().processInstanceId("130001").singleResult();
//        map=instance.getProcessVariables();
        
        
//        taskService.setAssignee("125024", "user");
//        taskService.unclaim("125024");

//        Task task= taskService.newTask();
//        ProcessDefinition definition=repositoryService.createProcessDefinitionQuery().processDefinitionId("process_1:1:125010").singleResult();
//        RepositoryServiceImpl repositoryService1=(RepositoryServiceImpl)repositoryService;
//        CommandExecutor executor = repositoryService1.getCommandExecutor();
//        ProcessDefinitionEntity entity = executor.execute(new GetDeploymentProcessDefinitionCmd("process_1:1:125010"));
//        ActivityImpl activity = entity.getInitial();

        int i=0;
    }
    
    @Test
    public void testTaskInstance() throws Exception{
        Map<String,Object> map=new HashMap<String, Object>();
        map.put("instanceId",5);
        List<TaskInstance> taskInstances = taskInstanceDao.listTaskInstances(map, RowBounds.DEFAULT);
        int i=0;
    }
    private static class JumpActivityCmd implements Command<Object> {
        private String activityId;
        private String processInstanceId;
        private String jumpOrigin;

        public JumpActivityCmd(String processInstanceId, String activityId) {
            this(processInstanceId, activityId, "jump");
        }

        public JumpActivityCmd(String processInstanceId, String activityId, String jumpOrigin) {
            this.activityId = activityId;
            this.processInstanceId = processInstanceId;
            this.jumpOrigin = jumpOrigin;
        }

        public Object execute(CommandContext commandContext) {

            ExecutionEntity executionEntity = commandContext.getExecutionEntityManager().findExecutionById(processInstanceId);

            executionEntity.destroyScope(jumpOrigin);

            ProcessDefinitionImpl processDefinition = executionEntity.getProcessDefinition();
            ActivityImpl activity = processDefinition.findActivity(activityId);

            executionEntity.executeActivity(activity);

            return executionEntity;
        }
    }
    
    
}
