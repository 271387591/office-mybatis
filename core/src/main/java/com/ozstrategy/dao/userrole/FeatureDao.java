package com.ozstrategy.dao.userrole;

import com.ozstrategy.dao.GenericDao;
import com.ozstrategy.model.userrole.Feature;

import java.util.List;


public interface FeatureDao extends GenericDao<Feature, Long> {
  
  List<Feature> getAllFeatures();

  
  List<Feature> getFeaturesOfRole(Long roleId);

  
  List<Feature> listFeatures(String keyword, int start, int limit);
    Feature getFeatureByName(String featureName);
} // end interface FeatureDao
