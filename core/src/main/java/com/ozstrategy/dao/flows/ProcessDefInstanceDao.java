package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.ProcessDefInstance;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/30/14.
 */
public interface ProcessDefInstanceDao {
    List<ProcessDefInstance> listProcessDefInstances(Map<String,Object> map,RowBounds rowBounds);
    Integer listProcessDefInstancesCount(Map<String,Object> map);
    void saveProcessDefInstance(ProcessDefInstance instance);
    void deleteProcessDefInstance(Long id);
    ProcessDefInstance getProcessDefInstanceById(Long id);
}
