package com.ozstrategy.service.userrole;

import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.RoleFeature;
import com.ozstrategy.model.userrole.SystemView;
import com.ozstrategy.service.GenericManager;

import java.util.List;
import java.util.Set;


public interface RoleManager extends GenericManager<Role, Long> {
 
  List<Role> getAllRoles();

  
  Long getCount(String keyword);

  
  Role getRole(String rolename);

  Role getRole(Long roleId);

  List getRoles(Role role);

  List getRoles(String roleName, Integer start, Integer limit);

  void removeRole(String rolename);

  void removeRole(Long roleId);

  void saveOrUpdateRole(Long id, String name, String displayName, String description, List<Feature> features);
  void saveOrUpdateRole(Role role, List<Feature> features);

  Role saveRole(Role role);

    boolean hasFeature(Set<String> roles, String feature);
    
    SystemView getSystemViewById(Long id);
    List<RoleFeature> getRoleFeature(Long roleId);

} // end interface RoleManager
