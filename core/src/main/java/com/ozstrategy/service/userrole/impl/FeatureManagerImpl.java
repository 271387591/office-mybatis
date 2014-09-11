package com.ozstrategy.service.userrole.impl;

import com.ozstrategy.dao.userrole.FeatureDao;
import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.service.userrole.FeatureManager;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("featureManager")
public class FeatureManagerImpl implements FeatureManager {

    @Autowired 
    private FeatureDao featureDao;


    public List<Feature> listFeatures(Map<String, Object> map, Integer start, Integer limit) {
        return featureDao.listFeatures(map,new RowBounds(start,limit));
    }

    public List<Feature> listAllFeatures(Map<String, Object> map) {
        return featureDao.listFeatures(map,RowBounds.DEFAULT);
    }

    public List<Feature> getFeaturesByRoleId(Long roleId) {
        return featureDao.getFeaturesByRoleId(roleId);
    }

    public List<Feature> getUserFeaturesByUsername(String username) {
        return featureDao.getFeaturesByUsername(username);
    }

    public Integer listFeaturesCount(Map<String, Object> map) {
        return featureDao.listFeaturesCount(map);
    }

    public Feature getFeatureByName(String featureName) {
        return featureDao.getFeatureByName(featureName);
    }

    public Feature getFeatureById(Long id) {
        return featureDao.getFeatureById(id);
    }
} // end class FeatureManagerImpl
