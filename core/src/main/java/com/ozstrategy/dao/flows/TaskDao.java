package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.Task;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/9/14.
 */
public interface TaskDao {
    List<Task> listCandidateTasks(Map<String,Object> map);
    List<Task> listAssigneeTasks(Map<String,Object> map);
}
