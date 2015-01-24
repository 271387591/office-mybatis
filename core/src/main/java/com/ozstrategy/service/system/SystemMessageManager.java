package com.ozstrategy.service.system;

import com.ozstrategy.model.system.SystemMessage;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 11/6/14.
 */
public interface SystemMessageManager {
    List<SystemMessage> listSystemMessages(Map<String,Object> map, Integer start,Integer limit);
    Integer listSystemMessagesCount(Map<String,Object> map);
    void update(SystemMessage message);
    void delete(Long id);
    void deleteByCreateDate(Date date);
    void save(SystemMessage message);
    void multiRemove(Set<Long> ids);
}
