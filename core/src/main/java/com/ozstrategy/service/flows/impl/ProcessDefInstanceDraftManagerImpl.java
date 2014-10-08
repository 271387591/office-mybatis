package com.ozstrategy.service.flows.impl;

import com.ozstrategy.dao.flows.ProcessDefInstanceDraftDao;
import com.ozstrategy.model.flows.ProcessDefInstanceDraft;
import com.ozstrategy.service.flows.ProcessDefInstanceDraftManager;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/28/14.
 */
@Service("processDefInstanceDraftManager")
public class ProcessDefInstanceDraftManagerImpl implements ProcessDefInstanceDraftManager {
    @Autowired
    ProcessDefInstanceDraftDao processDefInstanceDraftDao;
    
    public List<ProcessDefInstanceDraft> listProcessDefInstanceDrafts(Map<String, Object> map, Integer start, Integer limit) {
        return processDefInstanceDraftDao.listProcessDefInstanceDrafts(map,new RowBounds(start,limit));
    }

    public Integer listProcessDefInstanceDraftsCount(Map<String, Object> map) {
        return processDefInstanceDraftDao.listProcessDefInstanceDraftsCount(map);
    }

    public ProcessDefInstanceDraft getProcessDefInstanceDraftById(Long id) {
        return processDefInstanceDraftDao.getProcessDefInstanceDraftById(id);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void updateProcessDefInstanceDraft(ProcessDefInstanceDraft defInstanceDraft) {
        processDefInstanceDraftDao.updateProcessDefInstanceDraft(defInstanceDraft);

    }

    @Transactional(rollbackFor = Throwable.class)
    public void saveProcessDefInstanceDraft(ProcessDefInstanceDraft defInstanceDraft) {
        processDefInstanceDraftDao.saveProcessDefInstanceDraft(defInstanceDraft);

    }

    @Transactional(rollbackFor = Throwable.class)
    public void deleteProcessDefInstanceDraft(Long id) {
        processDefInstanceDraftDao.deleteProcessDefInstanceDraft(id);
    }
}
