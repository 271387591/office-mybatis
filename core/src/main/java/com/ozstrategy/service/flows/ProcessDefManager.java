package com.ozstrategy.service.flows;

import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.flows.ProcessElement;
import org.activiti.engine.ActivitiObjectNotFoundException;

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
    void delete(ProcessDef def);
    ProcessDef getProcessDefByName(String name,Long typeId);
    Long checkNameExist(String name,Long typeId);
    ProcessDef getProcessDefById(Long id);
    ProcessDef getProcessDefByActDefId(String actDefId);
    
    void save(ProcessDef processDef);
    void update(ProcessDef processDef,String graRes) throws IOException,Exception;
    String getRes(String resId,String resName,String taskKey)throws IOException,ActivitiObjectNotFoundException;
    ProcessElement getProcessElementByTaskKeyAndDefId(Long defId,String taskKey);
    
    void deployed(ProcessDef processDef) throws Exception;
    
    void authorizationProcessDef(ProcessDef def) throws Exception;
    void disAuthorization(ProcessDef def) throws Exception;

    List<ProcessDef> getProcessDefinition(Map<String,Object> map,Integer start,Integer limit);
    Integer getProcessDefinitionCount(Map<String,Object> map);
    
    Boolean checkProcessUseRole(Long roleId);
    Boolean checkProcessAuthorization(Long defId);
    Boolean checkProcessRunning(String actDefId);
    List<ProcessDef> getProcessDefByFormId(Long formId);
}
