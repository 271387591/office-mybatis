package com.ozstrategy.service.impl;

import com.ozstrategy.dao.userrole.RoleDao;
import com.ozstrategy.dao.userrole.UserDao;
import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.BaseManagerTestCase;
import com.ozstrategy.service.userrole.FeatureManager;
import com.ozstrategy.service.userrole.RoleManager;
import com.ozstrategy.service.userrole.UserManager;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

import java.util.Date;

public class UserManagerImplTest extends BaseManagerTestCase {
    //~ Instance fields ========================================================
    @Autowired
    private UserManager userManager;
    @Autowired
    private RoleManager roleManager;
    @Autowired
    private FeatureManager featureManager;
    
    private UserDao userDao;
    private RoleDao roleDao;

    @Test
    public void testGetUser() throws Exception {
        User user = userManager.getUser("1");
        if(user!=null){
            System.out.println(user.getDefaultRole().getName());
        }
    }
    @Test
    public void testRemoveRole() throws Exception{
        roleManager.removeRole(new Long(3));
    }
    @Test
    public void testSaveFeature() throws Exception{
        Feature feature=new Feature();
        feature.setName("ddddd");
        feature.setCriteria("dd");
        feature.setCreateDate(new Date());
        feature.setDescription("dddd");
        feature.setDisplayName("dddd");
        featureManager.saveOrUpdate(feature);
    }
    
}
