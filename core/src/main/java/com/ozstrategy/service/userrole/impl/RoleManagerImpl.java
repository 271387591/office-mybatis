package com.ozstrategy.service.userrole.impl;

import com.ozstrategy.dao.userrole.RoleDao;
import com.ozstrategy.dao.userrole.RoleFeatureDao;
import com.ozstrategy.dao.userrole.UserDao;
import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.RoleFeature;
import com.ozstrategy.model.userrole.SystemView;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.GenericManagerImpl;
import com.ozstrategy.service.userrole.RoleManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Set;


@Service("roleManager")
public class RoleManagerImpl extends GenericManagerImpl<Role, Long> implements RoleManager {
  @Autowired 
  RoleDao roleDao;

  @Autowired 
  RoleFeatureDao roleFeatureDao;
  @Autowired
  UserDao userDao;

  @Autowired public RoleManagerImpl(RoleDao roleDao) {
    super(roleDao);
    this.roleDao = roleDao;
  }

  
  public List<Role> getAllRoles() {
    return roleDao.getAllRoles();
  }

  public Long getCount(String keyword) {
    return roleDao.getCount(keyword);
  }

  public Role getRole(String rolename) {
    return roleDao.getRoleByName(rolename);
  }

  public Role getRole(Long roleId) {
    return dao.get(roleId);
  }

  public List<Role> getRoles(Role role) {
    return dao.getAll();
  }

  public List<Role> getRoles(String roleName, Integer start, Integer limit) {
    return roleDao.getRoles(roleName, start, limit);

  }
  public void removeRole(String rolename) {
    roleDao.removeRole(rolename);
  }

  @Transactional 
  public void removeRole(Long roleId) {
    List<RoleFeature> roleFeatures = roleFeatureDao.getRoleFeatureByRoleId(roleId);

    for (RoleFeature rf : roleFeatures) {
      roleFeatureDao.remove(rf.getId());
    }
      List<User> users=userDao.getUserByDefaultRoleId(roleId);
      if(users!=null && users.size()>0){
          for(User user : users){
              user.setDefaultRole(null);
              userDao.saveOrUpdate(user);
          }
      }
      roleDao.removeUserRoleByRoleId(roleId);
//      Role role=roleDao.get(roleId);
//      Set<User> users1=role.getUsers();
//      if(users1!=null && users1.size()>0){
//          for(User user : users1){
//              user.getRoles().remove(role);
//              userDao.saveOrUpdate(user);
//          }
//      }
      roleDao.remove(roleId);
  }

  @Transactional 
  public void saveOrUpdateRole(Long id, String name, String displayName, String description,
    List<Feature> features) {
    Date now  = new Date();
    Role role = null;

    // update
    if (id != null) {
      // update role
      role = roleDao.get(id);
      role.setName(name);
      role.setDisplayName(displayName);
      role.setDescription(description);
      role.setLastUpdateDate(now);
      roleDao.save(role);

// roleDao.flush();
      // first remove all roleFeature
      roleFeatureDao.removeAllByRoleId(id);
    }
    // save
    else {
      // save role
      role = new Role();
      role.setName(name);
      role.setDisplayName(displayName);
      role.setDescription(description);
      role.setCreateDate(now);
      roleDao.saveRole(role);
// roleDao.flush();
    }

    // save roleFeature
    for (Feature feature : features) {
      RoleFeature rf = new RoleFeature();
      rf.setCreateDate(now);
      rf.setRole(role);
      rf.setFeature(feature);
      log.error("feachture = " + feature.getId());
      roleFeatureDao.saveOrUpdate(rf);
    }
  } // end method saveOrUpdateRole

    @Transactional
    public void saveOrUpdateRole(Role role, List<Feature> features) {
        if(role.getId()!=null){
            roleFeatureDao.removeAllByRoleId(role.getId());
        }
        roleDao.saveOrUpdate(role);
        for (Feature feature : features) {
            RoleFeature rf = new RoleFeature();
            rf.setCreateDate(new Date());
            rf.setRole(role);
            rf.setFeature(feature);
            roleFeatureDao.saveOrUpdate(rf);
        }
        
    }

    public Role saveRole(Role role) {
    return dao.save(role);
  }

    public boolean hasFeature(Set<String> roles, String feature) {
        return roleDao.hasFeature(roles, feature);
    }

    public SystemView getSystemViewById(Long id) {
        return roleDao.getSystemViewById(id);
    }

    public List<RoleFeature> getRoleFeature(Long roleId) {
        return roleFeatureDao.getRoleFeatureByRoleId(roleId);
    }
} // end class RoleManagerImpl
