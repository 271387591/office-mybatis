package com.ozstrategy.dao.userrole;

import com.ozstrategy.model.userrole.Feature;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;


public interface FeatureDao{
    List<Feature> listFeatures(Map<String,Object> map, RowBounds rowBounds);
    List<Feature> getFeaturesByRoleId(Long roleId);
    List<Feature> getFeaturesByUsername(String username);
    List<Feature> getFeaturesByUserId(Long userId);
    Integer listFeaturesCount(Map<String,Object> map);
    Feature getFeatureByName(String featureName);
    Feature getFeatureById(Long id);
} 
