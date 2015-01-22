package com.ozstrategy.service.userrole;

import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.service.GenericManager;

import java.util.List;


public interface FeatureManager extends GenericManager<Feature, Long> {
 
  List<Feature> getAllFeatures();

  
  Feature getFeature(Long fid);

  
  List<Feature> getFeaturesOfRole(Long roleId);

  
  List<Feature> listFeatures(String keyword, int start, int limit);

  
  void saveOrUpdate(Feature feature);

    Feature getFeatureByName(String featureName);
} // end interface FeatureManager
