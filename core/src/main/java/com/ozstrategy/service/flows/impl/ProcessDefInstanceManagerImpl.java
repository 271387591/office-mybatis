package com.ozstrategy.service.flows.impl;

import com.ozstrategy.service.flows.ProcessDefInstanceManager;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by lihao on 9/27/14.
 */
@Service("processDefInstanceManager")
public class ProcessDefInstanceManagerImpl implements ProcessDefInstanceManager {
    @Autowired
    private RuntimeService runtimeService;
    public void run() {
        ProcessInstance instance = runtimeService.createProcessInstanceQuery().singleResult();
    }
}
