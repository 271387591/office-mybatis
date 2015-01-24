package com.ozstrategy.service.flows.impl;

import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.service.flows.TaskCompleteService;
import org.activiti.engine.delegate.DelegateTask;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/24/14.
 */
@Service("taskCompleteService")
public class TaskCompleteServiceImpl implements TaskCompleteService {
    @Autowired
    private ProcessDefDao processDefDao;
    @Autowired
    private ProcessElementDao processElementDao;

    public void notify(DelegateTask delegateTask) {
        ProcessDef def=processDefDao.getProcessDefByActId(delegateTask.getProcessDefinitionId());
        Map<String,Object> variables = checkSignTask(def, delegateTask);
        Object variable = delegateTask.getVariable("signAssignee_"+delegateTask.getTaskDefinitionKey());
        if(variables!=null && variables.size()>0 && variable==null){
            delegateTask.setVariables(variables);
        }
    }
    private Map<String,Object> checkSignTask(ProcessDef def, DelegateTask task){
        Map<String,Object> variables=new HashMap<String, Object>();
        List<ProcessElement> signTasks=new ArrayList<ProcessElement>();
        ProcessElement processElement=processElementDao.getProcessElementByTaskKeyAndDefId(def.getId(),task.getTaskDefinitionKey());
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
                Map<String,Object> map = element.getCountersignMap();
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
