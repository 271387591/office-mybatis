package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.ProcessDef;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/9/14.
 */
public interface ProcessDefDao {
    List<ProcessDef> listProcessDefs(Map<String,Object> map,RowBounds rowBounds);
    List<ProcessDef> getProcessDefByName(String name);
    Integer listProcessDefsCount(Map<String,Object> map);
    ProcessDef getProcessDefById(Long id);
    ProcessDef getProcessDefByActId(String actId);
    ProcessDef getProcessDefByModelId(String modelId);
    ProcessDef getProcessDefByDepId(String depId);
    void saveProcessDef(ProcessDef processDef);
    void updateProcessDef(ProcessDef processDef);
    void deleteProcessDef(ProcessDef processDef);
    void removeChild(Long parentId);
}
