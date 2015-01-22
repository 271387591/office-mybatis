package com.ozstrategy.service.userrole.impl;

import com.ozstrategy.dao.userrole.UserDao;
import com.ozstrategy.model.userrole.RoleFeature;
import com.ozstrategy.model.userrole.SystemView;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.GenericManagerImpl;
import com.ozstrategy.service.userrole.UserExistsException;
import com.ozstrategy.service.userrole.UserManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("userManager")
public class UserManagerImpl extends GenericManagerImpl<User, Long> implements UserManager {

    @Autowired private PasswordEncoder passwordEncoder;


    private UserDao userDao;

    public Boolean existByUserName(String username) {
      User user = userDao.getUserByUserName(username);
      return user != null;
    }

    public Long getCount(String keyword) {
    return userDao.getCount(keyword);
  }

    public User getUser(String userId) {
    return userDao.get(new Long(userId));
  }

    public User getUserByUsername(String username) throws UsernameNotFoundException {
    return (User) userDao.loadUserByUsername(username);
  }

    public User getUserByEmail(String email) {
        return userDao.getUserByEmail(email);
    }

    public User getUserByMobile(String mobile) {
        return userDao.getUserByMobile(mobile);
    }

    public List<RoleFeature> getUserFeaturesByUsername(String username) {
      return userDao.getUserFeaturesByUsername(username);
    }

    public List<User> getUsers() {
    return userDao.getAllDistinct();
  }

    public List<User> getUsers(String keyword, Integer start, Integer limit) {
        return (List<User>)userDao.getUsers(keyword, start, limit,false);
    }

    public int getUsersCount(String keyword) {
        List<Long> count = (List<Long>) userDao.getUsers(keyword, 0, 1, true);

        if ((count != null) && (count.size() > 0)) {
            return count.get(0).intValue();
        }

        return 0;
    }

    public List<User> getAllUsers(String keyword) {
        return (List<User>)userDao.getUsers(keyword, null, null,false);
    }

    public Integer updateUserPassword(User user, String oldPassword, String newPassword,boolean admin) {
        if(admin){
            user.setPassword(passwordEncoder.encodePassword(newPassword, null));
            userDao.saveOrUpdate(user);
            return 0;
        }
        if (user.getPassword().equals(passwordEncoder.encodePassword(oldPassword, null))){
            user.setPassword(passwordEncoder.encodePassword(newPassword, null));
            userDao.saveOrUpdate(user);
            return 0;
        }
        return 1;
    }

  public void removeUser(String userId) {
    if (log.isDebugEnabled()) {
      log.debug("removing user: " + userId);
    }

    userDao.remove(new Long(userId));
  }

  @Transactional
  public User saveUser(User user) throws UserExistsException {
    if (user.getVersion() == null) {
      // if new user, lowercase userId
      user.setUsername(user.getUsername().toLowerCase());
    }

    // Get and prepare password management-related artifacts
    boolean passwordChanged = false;

    if (passwordEncoder != null) {
      // Check whether we have to encrypt (or re-encrypt) the password
      if (user.getVersion() == null) {
        // New user, always encrypt
        passwordChanged = true;
      } else {
        // Existing user, check password in DB
        String currentPassword = (user.getId() != null) ? userDao.getUserPassword(user.getId())
                                                        : userDao.getUserPassword(user.getUsername());

        if (currentPassword == null) {
          passwordChanged = true;
        } else {
          if (!currentPassword.equals(user.getPassword())) {
            passwordChanged = true;
          }
        }
      }

      // If password was changed (or new user), encrypt it
      if (passwordChanged) {
        user.setPassword(passwordEncoder.encodePassword(user.getPassword(), null));
      }
    } else {
      log.warn("PasswordEncoder not set, skipping password encryption...");
    } // end if-else

    try {
      return userDao.saveUser(user);
    } catch (DataIntegrityViolationException e) {
      // e.printStackTrace();
      log.warn(e.getMessage());
      throw new UserExistsException("User '" + user.getUsername() + "' already exists!");
    } catch (JpaSystemException e) { // needed for JPA

      // e.printStackTrace();
      log.warn(e.getMessage());
      throw new UserExistsException("User '" + user.getUsername() + "' already exists!");
    }
  } // end method saveUser

  public List<User> searchUserByName(String query) {
    if (log.isDebugEnabled()) {
      log.debug("search users " + query);
    }

    return userDao.searchUserByName("username", query);
  }

 
  public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }

  
  @Autowired 
  public void setUserDao(UserDao userDao) {
    super.dao    = userDao;
    this.userDao = userDao;
  }

  public Integer updateUserPassword(User user, Long userId, String oldPassword, String newPassword) {
    if (user.getLastName().contains("管理员")) {
      return 0;
    }

    if (!user.getId().equals(userId)) {
      return 3;
    }

    User u = userDao.get(userId);

    if (!u.getPassword().equals(passwordEncoder.encodePassword(oldPassword, null))) {
      return 1;
    } else if (u.getPassword().equals(passwordEncoder.encodePassword(newPassword, null))) {
      return 2;
    }

    return 0;
  }

    public List<SystemView> listSystemView() {
        return userDao.listSystemView();
    }

    public List<User> getUsers(String keyword, Long orgId, Long posId, Long roleId) {
        
        return userDao.getUsers(keyword,orgId,posId,roleId);
    }

    public void saveOrUpdate(User user) {
        userDao.saveOrUpdate(user);
    }
} // end class UserManagerImpl
