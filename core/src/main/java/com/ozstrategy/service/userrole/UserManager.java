package com.ozstrategy.service.userrole;

import com.ozstrategy.dao.userrole.UserDao;
import com.ozstrategy.model.userrole.RoleFeature;
import com.ozstrategy.model.userrole.SystemView;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.GenericManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;



public interface UserManager extends GenericManager<User, Long> {
  
  Boolean existByUserName(String username);

  
  Long getCount(String keyword);

  
  User getUser(String userId);

  
  User getUserByUsername(String username) throws UsernameNotFoundException;
    
    User getUserByEmail(String email);
    User getUserByMobile(String mobile);
   
  List<RoleFeature> getUserFeaturesByUsername(String username);

  
  List<User> getUsers();

  
  List<User> getUsers(String keyword, Integer start, Integer limit);
    int getUsersCount(String keyword);
    List<User> getAllUsers(String keyword);
    Integer updateUserPassword(User user,String oldPassword,String newPassword,boolean admin);
    
  void removeUser(String userId);

  
  User saveUser(User user) throws UserExistsException;

  
  List<User> searchUserByName(String query);

 
  void setUserDao(UserDao userDao);

  
  Integer updateUserPassword(User user, Long userId, String oldPassword, String newPassword);
    
    List<SystemView> listSystemView();

    List<User> getUsers(String keyword, Long orgId, Long posId, Long roleId);
    
    void saveOrUpdate(User user);
} // end interface UserManager
