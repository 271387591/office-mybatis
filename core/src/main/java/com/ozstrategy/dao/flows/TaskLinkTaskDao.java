package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.TaskLinkTask;
import org.apache.ibatis.annotations.Param;

/**
 * Created by lihao on 10/28/14.
 */
public interface TaskLinkTaskDao {
    void insert(TaskLinkTask taskLinkTask);
    void update(TaskLinkTask taskLinkTask);
    void updateCurrentId(@Param(value = "currentId")String currentId,@Param(value = "id")Long id);
    TaskLinkTask getTaskLinkTaskByCurrentId(String currentId);
}
