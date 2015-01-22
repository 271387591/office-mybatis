package com.ozstrategy.service.userrole.impl;

import com.ozstrategy.dao.userrole.FeatureDao;
import com.ozstrategy.dao.userrole.RoleDao;
import com.ozstrategy.dao.userrole.RoleFeatureDao;
import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.RoleFeature;
import com.ozstrategy.service.GenericManagerImpl;
import com.ozstrategy.service.userrole.FeatureManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("featureManager")
public class FeatureManagerImpl extends GenericManagerImpl<Feature, Long> implements FeatureManager {

  @Autowired 
  private FeatureDao featureDao;
    @Autowired 
  private RoleDao roleDao;
    @Autowired 
  private RoleFeatureDao roleFeatureDao;
    
    

  public List<Feature> getAllFeatures() {
    return featureDao.getAllFeatures();
  }

  public Feature getFeature(Long fid) {
    return featureDao.get(fid);
  }

  public List<Feature> getFeaturesOfRole(Long roleId) {
    return featureDao.getFeaturesOfRole(roleId);
  }

  public List<Feature> listFeatures(String keyword, int start, int limit) {
    return featureDao.listFeatures(keyword, start, limit);
  }
 @Transactional 
 public void saveOrUpdate(Feature feature) {
     if(feature.getId()==null){
         Role role = roleDao.getRoleByName("ROLE_ADMIN");
         featureDao.saveOrUpdate(feature);
         RoleFeature roleFeature=new RoleFeature();
         roleFeature.setRole(role);
         roleFeature.setFeature(feature);
         roleFeatureDao.saveOrUpdate(roleFeature);
         return;
     }
     featureDao.saveOrUpdate(feature);
     
  }

    public Feature getFeatureByName(String featureName) {
        return null;
    }


} // end class FeatureManagerImpl
