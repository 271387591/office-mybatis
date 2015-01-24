package com.ozstrategy.service.userrole;

import com.ozstrategy.model.userrole.Feature;

import java.util.List;
import java.util.Map;


public interface FeatureManager {
    List<Feature> listFeatures(Map<String,Object> map, Integer start,Integer limit);
    List<Feature> listAllFeatures(Map<String,Object> map);
    List<Feature> getFeaturesByRoleId(Long roleId);
    List<Feature> getUserFeaturesByUsername(String username);
    Integer listFeaturesCount(Map<String,Object> map);
    Feature getFeatureByName(String featureName);
    Feature getFeatureById(Long id);
} 
