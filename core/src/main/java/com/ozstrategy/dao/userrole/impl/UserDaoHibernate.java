package com.ozstrategy.dao.userrole.impl;

import com.ozstrategy.dao.hibernate.GenericDaoHibernate;
import com.ozstrategy.dao.userrole.UserDao;
import com.ozstrategy.model.userrole.RoleFeature;
import com.ozstrategy.model.userrole.SystemView;
import com.ozstrategy.model.userrole.User;
import org.apache.commons.lang.StringUtils;
import org.hibernate.Session;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository("userDao")
public class UserDaoHibernate extends GenericDaoHibernate<User, Long> implements UserDao, UserDetailsService {
  public UserDaoHibernate() {
    super(User.class);
  }
  public Long getCount(String keyword) {
    Session session = getHibernateTemplate().getSession();

    if (StringUtils.isBlank(keyword)) {
      String hql = "select count(*) from User";

      return (Long) session.createQuery(hql).uniqueResult();
    } else {
      String hql       = "select count(*) from User u where u.username like ? or u.firstName like ?";
      String condition = "%" + keyword + "%";

      return (Long) session.createQuery(hql).setParameter(0, condition).setParameter(1, condition).uniqueResult();
    }
  }
  public User getUserByUserName(String username) {
    List<User> users = getHibernateTemplate().find("from User where upper(username)=?", username.toUpperCase());

    if (users!=null && users.size() > 0) {
      return users.get(0);
    } else {
      return null;
    }
  }

    public User getUserByEmail(String email) {
        List<User> users = getHibernateTemplate().find("from User v where v.email=?", email);

        if (users!=null && users.size() > 0) {
            return users.get(0);
        } else {
            return null;
        }
    }

    public User getUserByMobile(String mobile) {
        List<User> users = getHibernateTemplate().find("from User v where v.mobile=?", mobile);

        if (users!=null && users.size() > 0) {
            return users.get(0);
        } else {
            return null;
        }
    }

    public List<RoleFeature> getUserFeaturesByUsername(String username) {
        return getHibernateTemplate().find(
            "select distinct rf from Role r, User u, RoleFeature rf left join fetch rf.feature "
            + "where r in elements(u.roles) and u.username = ? and rf.role = r and rf.feature.enabled = 'Y'",
            username);
  }

  public String getUserPassword(String username) {
      if(StringUtils.isNotEmpty(username)){
          List<User> list=getHibernateTemplate().find("from User v where v.username='"+username+"'");
          if(list!=null && list.size()>0){
              return list.get(0).getPassword();
          }
      }
      return null;
  }
  public String getUserPassword(Long userId) {
      if(userId==null)return null;
      User user = get(userId);
      if(user!=null){
          return user.getPassword();
      }
      return null;
//    JdbcTemplate jdbcTemplate = new JdbcTemplate(SessionFactoryUtils.getDataSource(getSessionFactory()));
//    Table        table        = AnnotationUtils.findAnnotation(User.class, Table.class);
//
//    return jdbcTemplate.queryForObject(
//        "select password from " + table.name() + " where id=?", String.class, userId);
  }
  public List<User> getUsers() {
    return getHibernateTemplate().find("from User u order by u.createDate asc");
  }

    public Object getUsers(String keyWord,Integer start,Integer limit,boolean count) {
        
        String hql = "from User v where 1=1 ";

        if (count) {
            hql = "select count(*) from User v where 1=1 ";
        }

        if (StringUtils.isNotEmpty(keyWord)) {
            hql += " and (v.username like '%" + keyWord + "%' or v.firstName like '%"+keyWord+"%' or v.lastName like '%"+keyWord+"%')";
        }

        if (!count) {
            hql += " order by v.createDate desc";
        }
        if(start==null || limit==null){
            return getHibernateTemplate().getSession().createQuery(hql).list();
        }
        return getHibernateTemplate().getSession().createQuery(hql).setMaxResults(limit).setFirstResult(start).list();
    }
   public List<User> getUsers(String keyword, Integer start, Integer limit) {
    if (StringUtils.isBlank(keyword)) {
      String hql = "from User a order by a.createDate asc";

      return getHibernateTemplate().getSession().createQuery(hql).setFirstResult(start).setMaxResults(limit).list();
    } else {
      String hql       = "from User a where a.username like ? or a.firstName like ? order by a.createDate asc";
      String condition = "%" + keyword + "%";

      return getHibernateTemplate().getSession().createQuery(hql).setParameter(0, condition).setParameter(1, condition)
        .setFirstResult(start).setMaxResults(limit).list();
    }
  }
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    List users = getHibernateTemplate().find("from User where upper(username)=?", username.toUpperCase());
      if(users!=null && users.size()>0){
          return (UserDetails)users.get(0);
      }else{
          users=getHibernateTemplate().find("from User where mobile=?", username.toUpperCase()); 
      }
      if(users==null || users.size()<1){
          users=getHibernateTemplate().find("from User where email=?", username.toUpperCase());
      }
    if ((users == null) || users.isEmpty()) {
      throw new UsernameNotFoundException("user '" + username + "' not found...");
    } else {
      return (UserDetails) users.get(0);
    }
  }

  public User save(User user) {
    return this.saveUser(user);
  }

  public User saveUser(User user) {
    if (log.isDebugEnabled()) {
      log.debug("user's id: " + user.getId());
    }

    getHibernateTemplate().saveOrUpdate(user);

    getHibernateTemplate().flush();

    return user;
  }

  public List<User> searchUserByName(String username, String query) {
    if (query != null) {
      return getHibernateTemplate().find("from User u where u.username like '%" + query
          + "%' order by u.createDate asc");
    }

    return new ArrayList<User>();
  }

    public List<SystemView> listSystemView() {
        return getHibernateTemplate().find("from SystemView v where v.enabled='Y'");
    }
    public List<User> getUserByDefaultRoleId(Long id) {
        String hql="from User v where v.defaultRole.id=?";
        return getHibernateTemplate().find(hql,id);
    }

    public List<User> getUsers(String keyword, Long orgId, Long posId, Long roleId) {
        StringBuffer hql = new StringBuffer();
        if (orgId != null) {
            hql.append("select u from User u, UserOrg uo where uo.user.id = u.id and u.enabled = true and uo.org.id = " + orgId);
        } else if (posId != null) {
            hql.append("select u from User u, UserPosition up where up.user.id = u.id  and u.enabled = true and up.position.posId = " + posId);
        } else if (roleId != null) {
            hql.append("select u from User u left join u.roles r where u.enabled = true and r.id = " + roleId);
        } else {
            hql.append("select u from User u where u.enabled = true");
        }
        if (StringUtils.isNotEmpty(keyword)) {
            hql.append(" and (u.firstName like '%" + keyword + "%' or u.username like '%" + keyword + "%' or u.lastName like '"+keyword+"') ");
        }
        return getHibernateTemplate().getSession().createQuery(hql.toString()).list();
    }
} 
