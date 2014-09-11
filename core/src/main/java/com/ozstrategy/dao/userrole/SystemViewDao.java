package com.ozstrategy.dao.userrole;

import com.ozstrategy.model.userrole.SystemView;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 9/4/14.
 */
public interface SystemViewDao {
    SystemView getSystemViewById(Long id);
    List<SystemView> listSystemViews(Map<String,Object> map,RowBounds rowBounds);
    Integer listSystemViewsCount(Map<String,Object> map);
}
