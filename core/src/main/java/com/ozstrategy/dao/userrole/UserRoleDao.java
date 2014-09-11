package com.ozstrategy.dao.userrole;

import java.util.Map;

/**
 * Created by lihao on 9/4/14.
 */
public interface UserRoleDao {
    void saveUserRole(Map<String,Object> map);
    void deleteUserRole(Map<String,Object> map);
    void removeUserRoleByRoleId(Long id);
    void removeUserRoleByUserId(Long id);
}
