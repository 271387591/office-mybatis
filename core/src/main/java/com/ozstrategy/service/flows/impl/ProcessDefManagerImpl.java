package com.ozstrategy.service.flows.impl;

import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.service.flows.ProcessDefManager;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/10/14.
 */
@Service("processDefManager")
public class ProcessDefManagerImpl implements ProcessDefManager {
    @Autowired
    private ProcessDefDao processDefDao;
    public List<ProcessDef> listProcessDefs(Map<String, Object> map, Integer start, Integer limit) {
        return processDefDao.listProcessDefs(map,new RowBounds(start,limit));
    }

    public List<ProcessDef> listAllProcessDefs() {
        return processDefDao.listProcessDefs(new HashMap<String, Object>(),RowBounds.DEFAULT);
    }

    public Integer listProcessDefsCount(Map<String, Object> map) {
        return processDefDao.listProcessDefsCount(map);
    }

    public void saveOrUpdate(ProcessDef processDef) {

    }

    public void delete(Long id) {

    }

    public ProcessDef getProcessDefByName(String name, Long typeId) {
        return null;
    }
}
