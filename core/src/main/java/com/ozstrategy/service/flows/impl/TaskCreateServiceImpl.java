package com.ozstrategy.service.flows.impl;

import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.model.flows.TaskType;
import com.ozstrategy.service.flows.TaskCreateService;
import org.activiti.engine.delegate.DelegateTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by lihao on 10/24/14.
 */
@Service("taskCreateService")
public class TaskCreateServiceImpl implements TaskCreateService {
    @Autowired
    private ProcessDefDao processDefDao;
    @Autowired
    private ProcessElementDao processElementDao;
    public void notify(DelegateTask delegateTask) {
        ProcessDef def=processDefDao.getProcessDefByActId(delegateTask.getProcessDefinitionId());
//        Map<String,Object> variables = getSignVariable(def, delegateTask);
        
        
        Map<String,Object> variables = new HashMap<String, Object>();
        if(delegateTask.getTaskDefinitionKey().equals("Sign_2"))
            variables.put("signAssignee", Arrays.asList("user", "dep", "hr"));
        if(variables!=null && variables.size()>0){
            delegateTask.setVariables(variables);
        }
    }
    private Map<String,Object> getSignVariable(ProcessDef def,DelegateTask task){
        Map<String,Object> variables=new HashMap<String, Object>();
        ProcessElement processElement=processElementDao.getProcessElementByTaskKeyAndDefId(def.getId(),task.getTaskDefinitionKey());
        if(processElement!=null){
            TaskType taskType=processElement.getTaskType();
            if(taskType!=null && taskType== TaskType.Countersign){
                Map<String,Object> map = processElement.getCountersignMap();
                if(map!=null && map.size()>0){
                    for(String key:map.keySet()){
                        if(key.contains("signAssignee_")){
                            variables.put(key,map.get(key));
                            continue;
                        }
                    }
                }
            }
        }
        return variables;
    }
}
