package com.ozstrategy.dao.userrole.impl;

import com.ozstrategy.dao.hibernate.GenericDaoHibernate;
import com.ozstrategy.dao.userrole.RoleDao;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.SystemView;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;


@Repository("roleDao")
public class RoleDaoHibernate extends GenericDaoHibernate<Role, Long> implements RoleDao {
 
  public RoleDaoHibernate() {
    super(Role.class);
  }

  public void flush() {
    getHibernateTemplate().getSession().flush();
  }

  public List<Role> getAllRoles() {
    String hql = "from Role r where 1=1 order by r.createDate";

    return getHibernateTemplate().getSession().createQuery(hql).list();
  }
  public Long getCount(String keyword) {
    String hql = "";

    if (StringUtils.isBlank(keyword)) {
      hql = "select count(*) FROM Role r where 1=1";

      return (Long) getHibernateTemplate().getSession().createQuery(hql).uniqueResult();
    } else {
      String condition = "%" + keyword + "%";
      hql = "select count(*) FROM Role r where 1=1 and (r.name like ? or r.description like ? or r.displayName like ?)";

      return (Long) getHibernateTemplate().getSession().createQuery(hql).setParameter(0, condition).setParameter(1,
          condition).setParameter(2,condition).uniqueResult();
    }
  }
  public Role getRoleByName(String rolename) {
    List roles = getHibernateTemplate().find("from Role where name=?", rolename);

    if (roles.isEmpty()) {
      return null;
    } else {
      return (Role) roles.get(0);
    }
  }

  public List<Role> getRoles(String roleName, Integer start, Integer limit) {
    String hql = "";

    if (StringUtils.isBlank(roleName)) {
      hql = "FROM Role r where 1=1 order by r.createDate";

      return getHibernateTemplate().getSession().createQuery(hql).setFirstResult(start).setMaxResults(limit).list();
    } else {
      String condition = "%" + roleName + "%";
      hql = "FROM Role r where 1=1 and (r.name like ? or r.description like ? or r.displayName like ?) order by r.createDate";

      return getHibernateTemplate().getSession().createQuery(hql).setParameter(0, condition).setParameter(1, condition).setParameter(2,condition)
        .setFirstResult(start).setMaxResults(limit).list();
    }

  }

  public void removeRole(String rolename) {
    Object role = getRoleByName(rolename);
    getHibernateTemplate().delete(role);
  }

    public void removeRole(Role role) {
        getHibernateTemplate().delete(role);
    }

    public int removeUserRoleByRoleId(Long id) {
        String hql="delete from UserRole where roleId=?";
        return getHibernateTemplate().getSession().createSQLQuery(hql).setParameter(0,id).executeUpdate();
    }

    public void saveRole(Role role) {
    getHibernateTemplate().save(role);
  }

    public boolean hasFeature(Set<String> roles, String featureName) {
        if ((roles != null) && (roles.size() > 0)) {
            List list = getSession().createQuery(
                    "select roleFeature from RoleFeature roleFeature, Role role, Feature feature where roleFeature.role = role "
                            + "and roleFeature.feature = feature and feature.featureName = :featureName and role.name in (:roleNames)")
                    .setParameter("featureName", featureName).setParameterList("roleNames", roles).list();

            if ((list != null) && (list.size() > 0)) {
                return true;
            }
        }

        return false;
    }

    public SystemView getSystemViewById(Long id) {
        List<SystemView> list=getHibernateTemplate().find("from SystemView v where v.id=?",id);
        if(list!=null && list.size()>0){
            return list.get(0);
        }
        return null;
    }

    
} // end class RoleDaoHibernate
