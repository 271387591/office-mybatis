package com.ozstrategy.service.userrole;

import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.RoleFeature;

import java.util.List;
import java.util.Map;
import java.util.Set;


public interface RoleManager  {
    List<Role> listRoles(Map<String,Object> map, Integer start,Integer limit);
    List<Role> listAllRoles(Map<String,Object> map);
    Integer listRolesCount(Map<String,Object> map);
    void saveOrUpdate(Role role,List<Feature> features) throws Exception;
    void removeRoleById(Long id);
    Role getRoleByName(String name);
    Role getRoleById(Long id);
    boolean hasFeature(Set<String> roleName,String feature);
    boolean authenticatedContext(Set<String> roleName,String context);
    List<RoleFeature> getRoleFeatureByRoleId(Long roleId);
    List<Role> getRoleByUserId(Long userId);
} 
