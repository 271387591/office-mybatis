package com.ozstrategy.service.flows;

import com.ozstrategy.model.flows.ProcessDef;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/10/14.
 */
public interface ProcessDefManager {
    List<ProcessDef> listProcessDefs(Map<String,Object> map,Integer start,Integer limit);
    List<ProcessDef> listAllProcessDefs();
    Integer listProcessDefsCount(Map<String,Object> map);
    void saveOrUpdate(ProcessDef processDef);
    void delete(Long id);
    ProcessDef getProcessDefByName(String name,Long typeId);
}
