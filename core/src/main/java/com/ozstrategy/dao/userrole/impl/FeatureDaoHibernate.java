package com.ozstrategy.dao.userrole.impl;

import com.ozstrategy.dao.hibernate.GenericDaoHibernate;
import com.ozstrategy.dao.userrole.FeatureDao;
import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.model.userrole.RoleFeature;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository("featureDao")
public class FeatureDaoHibernate extends GenericDaoHibernate<Feature, Long> implements FeatureDao {
  
  public FeatureDaoHibernate() {
    super(Feature.class);
  }

  
  public List<Feature> getAllFeatures() {
    String hql = "from Feature f where f.enabled='Y'";

    return getHibernateTemplate().getSession().createQuery(hql).list();
  }
  public List<Feature> getFeaturesOfRole(Long roleId) {
    String hql = "select u.feature FROM " + RoleFeature.class.getName()
      + " u where u.role.id=:rid and u.feature.enabled='Y'";

    return getHibernateTemplate().getSession().createQuery(hql).setParameter("rid", roleId).list();
  }

  public List<Feature> listFeatures(String keyword, int start, int limit) {
    if (StringUtils.isBlank(keyword)) {
      String hql = "from Feature a where a.enabled = 'Y' order by a.createDate asc";

      return getHibernateTemplate().getSession().createQuery(hql).setFirstResult(start).setMaxResults(limit).list();
    } else {
      String hql       =
        "from Feature a where a.featureName like ? or a.description like ? and a.enabled = 'Y' order by a.createDate asc";
      String condition = "%" + keyword + "%";

      return getHibernateTemplate().getSession().createQuery(hql).setParameter(0, condition).setParameter(1, condition)
        .setFirstResult(start).setMaxResults(limit).list();
    }
  }

    public Feature getFeatureByName(String featureName) {
        List<Feature> features=getHibernateTemplate().find("from Feature v where v.name=?",featureName);
        if(features!=null && features.size()>0){
            return features.get(0);
        }
        return null;
    }
} // end class FeatureDaoHibernate
