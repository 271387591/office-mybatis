package com.ozstrategy.dao.system;

import com.ozstrategy.model.system.SystemMessage;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 11/6/14.
 */
public interface SystemMessageDao {
    List<SystemMessage> listSystemMessages(Map<String,Object> map,RowBounds rowBounds);
    Integer listSystemMessagesCount(Map<String,Object> map);
    void update(SystemMessage message);
    void delete(Long id);
    void deleteByCreateDate(@Param("date")Date date);
    void save(SystemMessage message);
}
