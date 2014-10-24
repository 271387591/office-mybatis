package com.ozstrategy.service;

import com.ozstrategy.model.flows.ProcessInstanceHistory;
import com.ozstrategy.service.flows.ProcessInstanceHistoryManager;
import org.activiti.bpmn.model.MultiInstanceLoopCharacteristics;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/22/14.
 */
public class ProcessInstanceHistoryManagerTest  extends BaseManagerTestCase {
    
    @Autowired
    private ProcessInstanceHistoryManager processInstanceHistoryManager;
    
    @Test
    public void testList() throws Exception{
        Map<String,Object> map=new HashMap<String, Object>();
        map.put("userId","user");
        List<ProcessInstanceHistory> histories = processInstanceHistoryManager.listProcessInstanceHistories(map, 0, 2);
        int i=0;
    }
    @Test
    public void testMulti() throws Exception{
        MultiInstanceLoopCharacteristics multiInstanceLoopCharacteristics=new MultiInstanceLoopCharacteristics();
    }
}
