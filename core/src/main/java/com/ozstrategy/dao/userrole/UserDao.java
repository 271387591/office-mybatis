package com.ozstrategy.dao.userrole;

import com.ozstrategy.dao.GenericDao;
import com.ozstrategy.model.userrole.RoleFeature;
import com.ozstrategy.model.userrole.SystemView;
import com.ozstrategy.model.userrole.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserDao extends GenericDao<User, Long> {
  
  Long getCount(String keyword);

  User getUserByUserName(String username);
    User getUserByEmail(String email);
    User getUserByMobile(String mobile);

  List<RoleFeature> getUserFeaturesByUsername(String username);

  String getUserPassword(String username);

  String getUserPassword(Long userId);
  List<User> getUsers();
  Object getUsers(String keyWord,Integer start,Integer limit,boolean count);
  List<User> getUsers(String keyword, Integer start, Integer limit);
  @Transactional 
  UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
  User saveUser(User user);
  List<User> searchUserByName(String username, String query);
    List<SystemView> listSystemView();
    List<User> getUserByDefaultRoleId(Long id);
    List<User> getUsers(String keyword, Long orgId, Long posId, Long roleId);
} 
