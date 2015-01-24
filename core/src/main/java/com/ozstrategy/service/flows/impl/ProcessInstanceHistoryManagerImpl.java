package com.ozstrategy.service.flows.impl;

import com.ozstrategy.dao.flows.ProcessInstanceHistoryDao;
import com.ozstrategy.model.flows.ProcessInstanceHistory;
import com.ozstrategy.service.flows.ProcessInstanceHistoryManager;
import org.activiti.engine.HistoryService;
import org.activiti.engine.history.HistoricVariableInstance;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 10/22/14.
 */
@Service("processInstanceHistoryManager")
public class ProcessInstanceHistoryManagerImpl implements ProcessInstanceHistoryManager {
    @Autowired
    private ProcessInstanceHistoryDao processInstanceHistoryDao;
    @Autowired
    private HistoryService historyService;
    public List<ProcessInstanceHistory> listProcessInstanceHistories(Map<String, Object> map, Integer start, Integer limit) {
        return processInstanceHistoryDao.listProcessInstanceHistories(map,new RowBounds(start,limit));
    }

    public Integer listProcessInstanceHistoriesCount(Map<String, Object> map) {
        return processInstanceHistoryDao.listProcessInstanceHistoriesCount(map);
    }

    public Map<String, Object> getHisVariables(String actInstanceId) {
        Map<String,Object> map=new HashMap<String, Object>();
        List<HistoricVariableInstance> variableInstances= historyService.createHistoricVariableInstanceQuery().processInstanceId(actInstanceId).list();
        if(variableInstances!=null && variableInstances.size()>0){
            for(HistoricVariableInstance variableInstance:variableInstances){
                map.put(variableInstance.getVariableName(),variableInstance.getValue());
            }
        }
        return map;
    }
}
