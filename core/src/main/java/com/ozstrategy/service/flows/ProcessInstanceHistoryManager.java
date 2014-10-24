package com.ozstrategy.service.flows;

import com.ozstrategy.model.flows.ProcessInstanceHistory;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/22/14.
 */
public interface ProcessInstanceHistoryManager {
    List<ProcessInstanceHistory> listProcessInstanceHistories(Map<String,Object> map,Integer start,Integer limit);
    Integer listProcessInstanceHistoriesCount(Map<String,Object> map);
}
