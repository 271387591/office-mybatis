package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.ProcessFileAttach;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/27/14.
 */
public interface ProcessFileAttachDao {
    List<ProcessFileAttach> listProcessFileAttachs(Map<String,Object> map,RowBounds rowBounds);
    Integer listProcessFileAttachsCount(Map<String,Object> map);
    ProcessFileAttach getProcessFileAttachById(Long id);
    void updateProcessFileAttach(ProcessFileAttach attach);
    void deleteProcessFileAttach(Long id);
    void saveProcessFileAttach(ProcessFileAttach attach);
    List<ProcessFileAttach> getProcessFileAttachByInstanceId(Long instanceId);
}
