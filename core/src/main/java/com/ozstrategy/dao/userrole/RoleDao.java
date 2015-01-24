package com.ozstrategy.dao.userrole;

import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.RoleFeature;
import com.ozstrategy.model.userrole.User;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

public interface RoleDao {
    List<Role> listRoles(Map<String,Object> map, RowBounds rowBounds);
    Integer listRolesCount(Map<String,Object> map);
    void saveRole(Role role);
    void updateRole(Role role);
    void removeRoleById(Long id);
    Role getRoleByName(String name);
    Role getRoleById(Long id);
    List<Role> getRoleByUserId(Long userId);
    
} 
