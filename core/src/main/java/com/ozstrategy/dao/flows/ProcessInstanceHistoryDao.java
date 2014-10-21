package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.ProcessInstanceHistory;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/22/14.
 */
public interface ProcessInstanceHistoryDao {
    List<ProcessInstanceHistory> listProcessInstanceHistories(Map<String,Object> map,RowBounds rowBounds);
    Integer listProcessInstanceHistoriesCount(Map<String,Object> map);
}
