package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.ProcessFormFiledInstance;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/9/14.
 */
public interface ProcessFormFiledInstanceDao {
    List<ProcessFormFiledInstance> listProcessFormFiledInstances(Map<String,Object> map,RowBounds rowBounds);
    List<ProcessFormFiledInstance> getProcessFormFiledInstancesByEid(Long elementId);
    Integer listProcessFormFiledInstancesCount(Map<String,Object> map);
    ProcessFormFiledInstance getProcessFormFiledInstanceById(Long id);
    void saveProcessFormFiledInstance(ProcessFormFiledInstance ProcessFormFiledInstance);
    void updateProcessFormFiledInstance(ProcessFormFiledInstance ProcessFormFiledInstance);
    void deleteProcessFormFiledInstance(Long id);
    void deleteProcessFormFiledInstanceByElementId(Long elementId);
    void deleteProcessFormFiledInstanceByDefId(Long defId);
}
