package com.ozstrategy.service.flows.impl;

import com.ozstrategy.dao.flows.TaskInstanceDao;
import com.ozstrategy.model.flows.TaskInstance;
import com.ozstrategy.service.flows.TaskInstanceManager;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/10/14.
 */
@Service("taskInstanceManager")
public class TaskInstanceManagerImpl implements TaskInstanceManager {
    @Autowired
    TaskInstanceDao taskInstanceDao;
    public List<TaskInstance> listTaskInstances(Map<String, Object> map) {
        return taskInstanceDao.listTaskInstances(map, RowBounds.DEFAULT);
    }

    public List<TaskInstance> listTaskInstanceRecord(Map<String, Object> map, Integer start, Integer limit) {
        return taskInstanceDao.listTaskInstances(map,new RowBounds(start,limit));
    }

    public Integer listTaskInstanceRecordCount(Map<String, Object> map) {
        return taskInstanceDao.listTaskInstancesCount(map);
    }
}
