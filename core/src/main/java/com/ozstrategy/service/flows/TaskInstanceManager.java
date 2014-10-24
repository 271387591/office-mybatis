package com.ozstrategy.service.flows;

import com.ozstrategy.model.flows.TaskInstance;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/10/14.
 */
public interface TaskInstanceManager {
    List<TaskInstance> listTaskInstances(Map<String,Object> map);
    List<TaskInstance> listTaskInstanceRecord(Map<String,Object> map,Integer start,Integer limit);
    Integer listTaskInstanceRecordCount(Map<String,Object> map);
    
}
