package com.ozstrategy.dao.userrole;

import com.ozstrategy.model.userrole.User;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

public interface UserDao {

    List<User> listUsers(Map<String,Object> map, RowBounds rowBounds);
    Integer listUsersCount(Map<String,Object> map);
    void saveUser(User user);
    void updateUser(User user);
    List<User> getUserByRoleId(@Param("roleId")Long roleId);
    void enabledUser(Long userId);
    void updateUserPassword(User user);
    User getUserById(Long id);
    User getUserByUsername(String username);
    User getUserByEmail(String email);
    User getUserByMobile(String mobile);
} 
