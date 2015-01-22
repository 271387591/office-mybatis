package com.ozstrategy.dao.userrole;

import com.ozstrategy.dao.GenericDao;
import com.ozstrategy.model.userrole.RoleFeature;

import java.util.List;


public interface RoleFeatureDao extends GenericDao<RoleFeature, Long> {
 
  List<RoleFeature> getRoleFeatureByRoleId(Long roleId);

  void removeAllByRoleId(Long roleId);
}
