package com.ozstrategy.dao.userrole.impl;

import com.ozstrategy.dao.hibernate.GenericDaoHibernate;
import com.ozstrategy.dao.userrole.RoleFeatureDao;
import com.ozstrategy.model.userrole.RoleFeature;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository("roleFeatureDao")
public class RoleFeatureDaoHibernate extends GenericDaoHibernate<RoleFeature, Long> implements RoleFeatureDao {
  
  public RoleFeatureDaoHibernate() {
    super(RoleFeature.class);
  }

  public List<RoleFeature> getRoleFeatureByRoleId(Long roleId) {
    String hql = "FROM RoleFeature u where u.role.id=:rid and u.feature.enabled = 'Y'";

    return getHibernateTemplate().getSession().createQuery(hql).setParameter("rid", roleId).list();

  }

  public void removeAllByRoleId(Long roleId) {
    String hql = "DELETE FROM " + RoleFeature.class.getName() + " u where u.role.id=:rid";
    getHibernateTemplate().getSession().createQuery(hql).setParameter("rid", roleId).executeUpdate();
  }
} // end class RoleFeatureDaoHibernate
