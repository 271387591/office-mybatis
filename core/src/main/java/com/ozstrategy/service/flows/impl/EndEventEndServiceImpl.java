package com.ozstrategy.service.flows.impl;

import com.ozstrategy.dao.flows.ProcessDefInstanceDao;
import com.ozstrategy.dao.flows.ProcessElementDao;
import com.ozstrategy.dao.flows.TaskInstanceDao;
import com.ozstrategy.model.flows.ProcessDefInstance;
import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.model.flows.TaskInstance;
import com.ozstrategy.service.flows.EndEventEndService;
import org.activiti.engine.delegate.DelegateExecution;
import org.apache.commons.lang.ObjectUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * Created by lihao on 11/1/14.
 */
@Service("endEventEndService")
public class EndEventEndServiceImpl implements EndEventEndService {
    @Autowired
    private TaskInstanceDao taskInstanceDao;
    @Autowired
    private ProcessDefInstanceDao processDefInstanceDao;
    @Autowired
    private ProcessElementDao processElementDao;
    
    @Transactional(rollbackFor = Throwable.class)
    public void notify(DelegateExecution execution) throws Exception {
        TaskInstance instance=new TaskInstance();
        instance.setCreateDate(new Date());
        instance.setLastUpdateDate(new Date());
        instance.setTaskKey(execution.getCurrentActivityId());
        instance.setName(execution.getCurrentActivityName());
        instance.setStartDate(new Date());
        instance.setEndDate(new Date());
        ProcessDefInstance defInstance=processDefInstanceDao.getProcessDefInstanceByActId(execution.getProcessInstanceId());
        instance.setInstance(defInstance);
        ProcessElement element=processElementDao.getProcessElementByTaskKeyAndActDefId(execution.getProcessDefinitionId(),execution.getCurrentActivityId());
        instance.setElement(element);
        taskInstanceDao.saveTaskInstance(instance);
    }
}
