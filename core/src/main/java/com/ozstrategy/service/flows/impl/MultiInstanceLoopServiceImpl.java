package com.ozstrategy.service.flows.impl;

import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.service.flows.MultiInstanceLoopService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.task.Task;
import org.apache.commons.lang.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Created by lihao on 10/22/14.
 */
@Service("multiInstanceLoopService")
public class MultiInstanceLoopServiceImpl implements MultiInstanceLoopService {
    @Autowired
    private ProcessElementDao processElementDao;
    @Autowired
    private TaskService taskService;
    public static final String signType_pix="signType";
    public static final String num_pix="num";
    public boolean canComplete(Execution execution, Integer nrOfInstances, Integer nrOfActiveInstances, Integer nrOfCompletedInstances, Integer loopCounter) {
        Task task=taskService.createTaskQuery().processInstanceId(execution.getProcessInstanceId()).executionId(execution.getId()).singleResult();
        if(task==null)return false;
        ProcessElement processElement=processElementDao.getProcessElementByTaskKeyAndActDefId(task.getProcessDefinitionId(),task.getTaskDefinitionKey());
        if(processElement==null)return false;
        Map<String,Object> map=processElement.getCountersignMap();
        Integer signType=null;
        BigDecimal num=null;
        if(map!=null && map.size()>0){
            for(String key:map.keySet()){
                if(key.contains(signType_pix)){
                    signType=Integer.valueOf(ObjectUtils.toString(map.get(key)));
                }else if(key.contains(num_pix)){
                    num=new BigDecimal(ObjectUtils.toString(map.get(key)));
                }
            }
        }
        if(signType==null || num==null)return false;
        if(signType==1){
            return nrOfCompletedInstances>=num.intValue();
        }else if(signType==2){
            BigDecimal nrOfInstancesDec=new BigDecimal(nrOfInstances);
            BigDecimal nrOfCompletedInstancesDec=new BigDecimal(nrOfCompletedInstances);
            BigDecimal completedDiv = nrOfCompletedInstancesDec.divide(nrOfInstancesDec,2);
            BigDecimal targetDiv=num.divide(new BigDecimal(100),2);
            return completedDiv.floatValue()>targetDiv.floatValue();
        }
        return Boolean.FALSE;
    }
}
