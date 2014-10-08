package com.ozstrategy.dao.flows;

import com.ozstrategy.model.flows.ProcessDefInstanceDraft;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/27/14.
 */
public interface ProcessDefInstanceDraftDao {
    List<ProcessDefInstanceDraft> listProcessDefInstanceDrafts(Map<String,Object> map,RowBounds rowBounds);
    Integer listProcessDefInstanceDraftsCount(Map<String,Object> map);
    ProcessDefInstanceDraft getProcessDefInstanceDraftById(Long id);
    void updateProcessDefInstanceDraft(ProcessDefInstanceDraft defInstanceDraft);
    void saveProcessDefInstanceDraft(ProcessDefInstanceDraft defInstanceDraft);
    void deleteProcessDefInstanceDraft(Long id);
}
