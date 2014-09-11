package com.ozstrategy.dao.system;

import com.ozstrategy.model.system.GlobalType;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/9/14.
 */
public interface GlobalTypeDao {
    List<GlobalType> listGlobalTypes(Map<String,Object> map,RowBounds rowBounds);
    Integer listGlobalTypesCount(Map<String,Object> map);
    List<GlobalType> getGlobalTypeWithoutParent(Map<String,Object> map);
    List<GlobalType> getChild(Long id);
    GlobalType getGlobalTypeById(Long id);
    void save(GlobalType globalType);
    void update(GlobalType globalType);
    void delete(Long id);
    void removeChild(Long parentId);
}
