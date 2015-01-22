package com.ozstrategy.dao.userrole;

import com.ozstrategy.dao.GenericDao;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.SystemView;

import java.util.List;
import java.util.Set;

public interface RoleDao extends GenericDao<Role, Long> {
  //~ Methods ----------------------------------------------------------------------------------------------------------

  void flush();

  List<Role> getAllRoles();

  Long getCount(String keyword);

  Role getRoleByName(String rolename);

  List<Role> getRoles(String roleName, Integer start, Integer limit);

  void removeRole(String rolename);
    
  void removeRole(Role role);
    int removeUserRoleByRoleId(Long id);

  void saveRole(Role role);

    boolean hasFeature(Set<String> roles, String feature);
    SystemView getSystemViewById(Long id);
    


} // end interface RoleDao
