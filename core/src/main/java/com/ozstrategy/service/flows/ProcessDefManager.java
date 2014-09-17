package com.ozstrategy.service.flows;

import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessElement;
import com.ozstrategy.model.flows.ProcessFormFiledInstance;

import java.io.IOException;
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
    Long checkNameExist(String name,Long typeId);
    ProcessDef getProcessDefById(Long id);
    void save(ProcessDef processDef);
    void update(ProcessDef processDef, String actRes,String graRes) throws IOException,Exception;
    List<ProcessFormFiledInstance> getDefFormFieldByFormId(Long formId,Long processElementId);
    String getRes(String resId,String resName);
    ProcessElement getProcessElementByTaskKeyAndDefId(Long defId,String taskKey);
}
