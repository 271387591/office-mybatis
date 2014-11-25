package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.ProcessElementForm;
import com.ozstrategy.model.flows.Task;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/9/14.
 */
public interface TaskDao {
    List<Task> listCandidateTasks(Map<String,Object> map);
    Integer listCandidateTasksCount(Map<String,Object> map);
    List<Task> listAssigneeTasks(Map<String,Object> map);
    Integer listAssigneeTasksCount(Map<String,Object> map);
    List<Task> listReplevyTasks(Map<String,Object> map,RowBounds rowBounds);
    Integer listReplevyTasksCount(Map<String,Object> map);
    List<ProcessElementForm> listProcessElementFormByElementId(@Param("elementId")Long elementId);
}
