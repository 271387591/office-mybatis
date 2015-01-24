package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.TaskInstance;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/9/14.
 */
public interface TaskInstanceDao {
    List<TaskInstance> listTaskInstances(Map<String,Object> map,RowBounds rowBounds);
    Integer listTaskInstancesCount(Map<String,Object> map);
    void saveTaskInstance(TaskInstance taskInstance);
    void deleteTaskInstance(Long id);
}
