package com.ozstrategy.service.userrole.impl;

import com.ozstrategy.dao.userrole.SystemViewDao;
import com.ozstrategy.dao.userrole.UserDao;
import com.ozstrategy.dao.userrole.UserRoleDao;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.SystemView;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.userrole.UserManager;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service("userManager")
public class UserManagerImpl implements UserManager {

    @Autowired 
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserDao userDao;
    @Autowired
    private UserRoleDao userRoleDao;
    @Autowired
    private SystemViewDao systemViewDao;
    

    public List<User> listUsers(Map<String, Object> map, Integer start, Integer limit) {
        
        return userDao.listUsers(map,new RowBounds(start,limit));
    }

    public List<User> listAllUsers(Map<String, Object> map) {
        return userDao.listUsers(map,RowBounds.DEFAULT);
    }

    public List<User> getUserByRoleId(Long roleId) {
        return userDao.getUserByRoleId(roleId);
    }

    public Integer listUsersCount(Map<String, Object> map) {
        return userDao.listUsersCount(map);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void deleteUser(Long userId) throws Exception{
        userDao.enabledUser(userId);
    }

    @Transactional(rollbackFor = Throwable.class)
    public Integer updateUserPassword(Long userId, String oldPassword, String newPassword, boolean admin)  throws Exception{
        User user=userDao.getUserById(userId);
        String password=user.getPassword();
        if(admin){
            user.setPassword(passwordEncoder.encodePassword(newPassword,null));
            userDao.updateUserPassword(user);
            return 0;
        }else{
            if(!password.equals(passwordEncoder.encodePassword(oldPassword,null))){
                return 1;
            }
            user.setPassword(passwordEncoder.encodePassword(newPassword,null));
            userDao.updateUserPassword(user);
        }
        return 0;
    }

    public User getUserById(Long id) {
        return userDao.getUserById(id);
    }

    public User getUserByUsername(String username) {
        return userDao.getUserByUsername(username);
    }

    public User getUserByEmail(String email) {
        return userDao.getUserByEmail(email);
    }

    public User getUserByMobile(String mobile) {
        return userDao.getUserByMobile(mobile);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void saveOrUpdate(User user) throws Exception{
        boolean save=true;
        if(user.getId()!=null){
            userDao.updateUser(user);
            save=false;
        }else{
            String password=user.getPassword();
            if(StringUtils.isNotEmpty(password)){
                user.setPassword(passwordEncoder.encodePassword(user.getPassword(), null));
            }
            userDao.saveUser(user);
        }
        Set<Role> roleSet=user.getRoles();
        if(roleSet!=null && roleSet.size()>0){
            if(!save){
                userRoleDao.removeUserRoleByUserId(user.getId());
            }
            for(Role role : roleSet){
                Map<String,Object> map=new HashMap<String, Object>();
                map.put("userId",user.getId());
                map.put("roleId",role.getId());
                userRoleDao.saveUserRole(map);
            }
        }
    }

    public List<SystemView> listSystemView() {
        return systemViewDao.listSystemViews(new HashMap<String, Object>(),RowBounds.DEFAULT);
    }

    public SystemView getSystemViewById(Long id) {
        return systemViewDao.getSystemViewById(id);
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userDao.getUserByUsername(username);
    }
} 
