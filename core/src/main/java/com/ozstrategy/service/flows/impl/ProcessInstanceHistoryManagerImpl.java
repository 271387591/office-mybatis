package com.ozstrategy.service.flows.impl;

import com.ozstrategy.dao.flows.ProcessInstanceHistoryDao;
import com.ozstrategy.model.flows.ProcessInstanceHistory;
import com.ozstrategy.service.flows.ProcessInstanceHistoryManager;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/22/14.
 */
@Service("processInstanceHistoryManager")
public class ProcessInstanceHistoryManagerImpl implements ProcessInstanceHistoryManager {
    @Autowired
    private ProcessInstanceHistoryDao processInstanceHistoryDao;
    public List<ProcessInstanceHistory> listProcessInstanceHistories(Map<String, Object> map, Integer start, Integer limit) {
        return processInstanceHistoryDao.listProcessInstanceHistories(map,new RowBounds(start,limit));
    }

    public Integer listProcessInstanceHistoriesCount(Map<String, Object> map) {
        return processInstanceHistoryDao.listProcessInstanceHistoriesCount(map);
    }
}
