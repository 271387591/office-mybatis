package com.ozstrategy.service.flows;

import com.ozstrategy.model.flows.ProcessDefInstanceDraft;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/28/14.
 */
public interface ProcessDefInstanceDraftManager {
    List<ProcessDefInstanceDraft> listProcessDefInstanceDrafts(Map<String,Object> map,Integer start,Integer limit);
    Integer listProcessDefInstanceDraftsCount(Map<String,Object> map);
    ProcessDefInstanceDraft getProcessDefInstanceDraftById(Long id);
    void updateProcessDefInstanceDraft(ProcessDefInstanceDraft defInstanceDraft);
    void saveProcessDefInstanceDraft(ProcessDefInstanceDraft defInstanceDraft);
    void deleteProcessDefInstanceDraft(Long id);
}
