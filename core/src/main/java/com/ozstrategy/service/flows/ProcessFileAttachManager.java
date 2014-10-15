package com.ozstrategy.service.flows;

import com.ozstrategy.model.flows.ProcessFileAttach;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/28/14.
 */
public interface ProcessFileAttachManager {
    List<ProcessFileAttach> listProcessFileAttachs(Map<String,Object> map,Integer start,Integer limit);
    Integer listProcessFileAttachsCount(Map<String,Object> map);
    ProcessFileAttach getProcessFileAttachById(Long id);
    void updateProcessFileAttach(ProcessFileAttach attach);
    void deleteProcessFileAttach(Long id);
    void saveProcessFileAttach(ProcessFileAttach attach);
    List<ProcessFileAttach> getProcessFileAttachByInstanceId(Long instanceId);
}
