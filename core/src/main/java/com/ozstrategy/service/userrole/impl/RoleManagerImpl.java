package com.ozstrategy.service.userrole.impl;

import com.ozstrategy.dao.userrole.RoleDao;
import com.ozstrategy.dao.userrole.RoleFeatureDao;
import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.RoleFeature;
import com.ozstrategy.service.userrole.RoleManager;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;


@Service("roleManager")
public class RoleManagerImpl  implements RoleManager {
  @Autowired
  private RoleDao roleDao;

  @Autowired
  private RoleFeatureDao roleFeatureDao;

    public List<Role> listRoles(Map<String, Object> map, Integer start, Integer limit) {
        return roleDao.listRoles(map,new RowBounds(start,limit));
    }

    public List<Role> listAllRoles(Map<String, Object> map) {
        return roleDao.listRoles(map,RowBounds.DEFAULT);
    }

    public Integer listRolesCount(Map<String, Object> map) {
        return roleDao.listRolesCount(map);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void saveOrUpdate(Role role,List<Feature> features) throws Exception{
        boolean save=true;
        if(role.getId()!=null){
            roleDao.updateRole(role);
            save=false;
        }else {
            roleDao.saveRole(role);
        }
        if(features!=null && features.size()>0){
            if(!save){
                roleFeatureDao.removeRoleFeatureByRoleId(role.getId());
            }
            for(Feature feature : features){
                RoleFeature roleFeature=new RoleFeature();
                roleFeature.setFeature(feature);
                roleFeature.setRole(role);
                roleFeatureDao.saveRoleFeature(roleFeature);
            }
        }
    }

    @Transactional(rollbackFor = Throwable.class)
    public void removeRoleById(Long id) {
        roleFeatureDao.removeRoleFeatureByRoleId(id);
        roleDao.removeRoleById(id);
    }

    public Role getRoleByName(String name) {
        return roleDao.getRoleByName(name);
    }

    public Role getRoleById(Long id) {
        return roleDao.getRoleById(id);
    }

    public boolean hasFeature(Set<String> roleName, String feature) {
        return true;
    }

    public boolean authenticatedContext(Set<String> roleNames,String context) {
        for(String roleName:roleNames){
            Role role = roleDao.getRoleByName(roleName);
            if(role==null){
                return false;
            }
            if(StringUtils.equals(context,role.getSystemView().getContext())){
                return true;
            }
        }
        return false;
    }

    public List<RoleFeature> getRoleFeatureByRoleId(Long roleId) {
        return roleFeatureDao.getRoleFeatureByRoleId(roleId);
    }

    public List<Role> getRoleByUserId(Long userId) {
        return roleDao.getRoleByUserId(userId);
    }
}
