package com.ozstrategy.service.flows;

import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.Task;
import com.ozstrategy.model.userrole.User;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/9/14.
 */
public interface TaskManager {
    List<Task> listCandidateTasks(Map<String,Object> map);
    List<Task> listAssigneeTasks(Map<String,Object> map);
    List<Task> listReplevyTasks(Map<String,Object> map,Integer start,Integer limit);
    Integer listReplevyTasksCount(Map<String,Object> map);
    void claim(String taskId, String username);
    void proxyTask(String taskId, String username,User creator,Map<String,Object> map);
    void unclaim(String taskId);
    Map<String,Object> getVariables(String executionId)throws Exception;
    void returnTask(String taskId, String taskKey, String sourceActivity, User creator,Map<String,Object> map) throws Exception;
    void replevyTask(String taskId, String taskKey,String sourceActivity, User creator,Map<String,Object> map) throws Exception;
    void complete(User user,ProcessDef def,String taskId, Map<String, Object> map) throws Exception;
}
