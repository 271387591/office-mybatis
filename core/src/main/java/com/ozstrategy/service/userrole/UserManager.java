package com.ozstrategy.service.userrole;

import com.ozstrategy.model.userrole.SystemView;
import com.ozstrategy.model.userrole.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Map;


public interface UserManager extends UserDetailsService {
    List<User> listUsers(Map<String,Object> map, Integer start,Integer limit);
    List<User> listAllUsers(Map<String,Object> map);
    List<User> getUserByRoleId(Long roleId);
    Integer listUsersCount(Map<String,Object> map);
    void deleteUser(Long userId) throws Exception;
    Integer updateUserPassword(Long userId, String oldPassword, String newPassword, boolean admin) throws Exception;
    User getUserById(Long id);
    User getUserByUsername(String username);
    User getUserByEmail(String email);
    User getUserByMobile(String mobile);
    void saveOrUpdate(User user)throws Exception;
    List<SystemView> listSystemView();
    SystemView getSystemViewById(Long id);
} // end interface UserManager
