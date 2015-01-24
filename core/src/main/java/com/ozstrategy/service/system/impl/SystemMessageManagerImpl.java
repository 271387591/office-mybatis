package com.ozstrategy.service.system.impl;

import com.ozstrategy.dao.system.SystemMessageDao;
import com.ozstrategy.model.system.SystemMessage;
import com.ozstrategy.service.system.SystemMessageManager;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 11/6/14.
 */
@Service("systemMessageManager")
public class SystemMessageManagerImpl implements SystemMessageManager {
    @Autowired
    private SystemMessageDao systemMessageDao;


    public List<SystemMessage> listSystemMessages(Map<String, Object> map, Integer start, Integer limit) {
        return systemMessageDao.listSystemMessages(map,new RowBounds(start,limit));
    }

    public Integer listSystemMessagesCount(Map<String, Object> map) {
        return systemMessageDao.listSystemMessagesCount(map);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void update(SystemMessage message) {
        systemMessageDao.update(message);

    }

    public void delete(Long id) {
        systemMessageDao.delete(id);

    }

    @Transactional(rollbackFor = Throwable.class)
    public void deleteByCreateDate(Date date) {
        systemMessageDao.deleteByCreateDate(date);

    }

    public void save(SystemMessage message) {
        systemMessageDao.save(message);

    }

    @Transactional(rollbackFor = Throwable.class)
    public void multiRemove(Set<Long> ids) {
        if(ids!=null && ids.size()>0){
            for(Long id : ids){
                delete(id);
            }
        }
    }
}
