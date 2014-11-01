package com.ozstrategy.service;

import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.dao.flows.ProcessElementFormDao;
import com.ozstrategy.dao.userrole.UserDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.ProcessDefManager;
import com.ozstrategy.service.flows.TaskManager;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

import java.util.HashMap;

/**
 * Created by lihao on 10/29/14.
 */
public class TaskManagerTest extends BaseManagerTestCase  {
    @Autowired
    ProcessDefManager processDefManager;
    @Autowired
    ProcessElementFormDao processElementFormDao;
    @Autowired
    ProcessElementDao processElementDao;
    @Autowired
    ProcessDefDao processDefDao;
    @Autowired
    TaskManager taskManager;
    

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
    UserDao userDao;
    @Test
    @Rollback(value = false)
    public void testCali() throws Exception{
        taskService.claim("252502","dep");
    }
    @Test
    @Rollback(value = false)
    public void testComp() throws Exception{
        User user=userDao.getUserByUsername("admin");
        ProcessDef def=processDefDao.getProcessDefById(2L);
        taskManager.complete(user,def,"250002", new HashMap<String, Object>());
    }
    
    @Test
    @Rollback(value = false)
    public void testTurnback() throws Exception{
        User user=userDao.getUserByUsername("dep");
        taskManager.returnTask("247511","T_4","247507",user,new HashMap<String, Object>());
    }
    @Test
    @Rollback(value = false)
    public void testTurnbackStart() throws Exception{
        User user=userDao.getUserByUsername("dep");
        taskManager.returnTask("252502","T_4",null,user,new HashMap<String, Object>());
    }
    
    
}
