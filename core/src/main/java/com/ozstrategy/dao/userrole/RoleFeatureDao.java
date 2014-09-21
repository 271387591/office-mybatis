package com.ozstrategy.dao.userrole;

import com.ozstrategy.model.userrole.RoleFeature;

import java.util.List;
import java.util.Map;


public interface RoleFeatureDao{
    void saveRoleFeature(RoleFeature roleFeature);
    void deleteRoleFeature(Map<String,Object> map);
    void removeRoleFeatureByRoleId(Long id);
    void removeRoleFeatureByFeatureId(Long id);
    List<RoleFeature> getRoleFeatureByRoleId(Long roleId);
    
}
