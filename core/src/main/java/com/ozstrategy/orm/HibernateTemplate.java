package com.ozstrategy.orm;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.JDBCException;
import org.hibernate.Query;
import org.hibernate.ReplicationMode;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Example;
import org.hibernate.exception.GenericJDBCException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.jdbc.support.SQLExceptionTranslator;
import org.springframework.jdbc.support.SQLStateSQLExceptionTranslator;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate4.SessionFactoryUtils;
import org.springframework.util.Assert;

import java.io.Serializable;
import java.sql.SQLException;
import java.util.Collection;
import java.util.List;

public class HibernateTemplate {
    protected final Log logger = LogFactory.getLog(getClass());
    private SQLExceptionTranslator defaultJdbcExceptionTranslator;

    private SessionFactory sessionFactory;

    public HibernateTemplate() {
    }

    public HibernateTemplate(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public static SQLExceptionTranslator newJdbcExceptionTranslator(SessionFactory sessionFactory) {
        return new SQLStateSQLExceptionTranslator();
    }

    public void clear() throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) {
                session.clear();

                return null;
            }
        });
    }

    public boolean contains(final Object entity) throws DataAccessException {
        return execute(new HibernateCallback<Boolean>() {
            public Boolean doInHibernate(Session session) {
                return session.contains(entity);
            }
        });
    }

    public DataAccessException convertHibernateAccessException(HibernateException ex) {
        if ((getDefaultJdbcExceptionTranslator() != null) && (ex instanceof JDBCException)) {
            return convertJdbcAccessException((JDBCException) ex, getDefaultJdbcExceptionTranslator());
        } else if (GenericJDBCException.class.equals(ex.getClass())) {
            return convertJdbcAccessException((GenericJDBCException) ex, getDefaultJdbcExceptionTranslator());
        }

        return SessionFactoryUtils.convertHibernateAccessException(ex);
    }

    public void delete(final Object entity) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.delete(entity);

                return null;
            }
        });
    }

    public void delete(final String entityName, final Object entity) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.delete(entityName, entity);

                return null;
            }
        });
    }

    public void deleteAll(final Collection entities) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                for (Object entity : entities) {
                    session.delete(entity);
                }

                return null;
            }
        });
    }

    public void evict(final Object entity) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.evict(entity);

                return null;
            }
        });
    }

    public <T> T execute(HibernateCallback<T> action) throws DataAccessException {
        return doExecute(action);
    }

    public List executeFind(HibernateCallback<?> action) throws DataAccessException {
        Object result = doExecute(action);

        if ((result != null) && !(result instanceof List)) {
            throw new InvalidDataAccessApiUsageException(
                    "Result object returned from HibernateCallback isn't a List: [" + result + "]");
        }

        return (List) result;
    }

    public List find(String queryString) throws DataAccessException {
        return find(queryString, (Object[]) null);
    }

    public List find(String queryString, Object value) throws DataAccessException {
        return find(queryString, new Object[]{value});
    }

    public List find(final String queryString, final Object... values) throws DataAccessException {
        return execute(new HibernateCallback<List>() {
            public List doInHibernate(Session session) throws HibernateException {
                Query queryObject = session.createQuery(queryString);

                if (values != null) {
                    for (int i = 0; i < values.length; i++) {
                        queryObject.setParameter(i, values[i]);
                    }
                }

                return queryObject.list();
            }
        });
    }

    public List findByCriteria(DetachedCriteria criteria) throws DataAccessException {
        return findByCriteria(criteria, -1, -1);
    }

    public List findByCriteria(final DetachedCriteria criteria, final int firstResult, final int maxResults)
            throws DataAccessException {
        Assert.notNull(criteria, "DetachedCriteria must not be null");

        return execute(new HibernateCallback<List>() {
            public List doInHibernate(Session session) throws HibernateException {
                Criteria executableCriteria = criteria.getExecutableCriteria(session);

                if (firstResult >= 0) {
                    executableCriteria.setFirstResult(firstResult);
                }

                if (maxResults > 0) {
                    executableCriteria.setMaxResults(maxResults);
                }

                return executableCriteria.list();
            }
        });
    }

    public List findByExample(Object exampleEntity) throws DataAccessException {
        return findByExample(null, exampleEntity, -1, -1);
    }

    public List findByExample(String entityName, Object exampleEntity) throws DataAccessException {
        return findByExample(entityName, exampleEntity, -1, -1);
    }

    public List findByExample(Object exampleEntity, int firstResult, int maxResults) throws DataAccessException {
        return findByExample(null, exampleEntity, firstResult, maxResults);
    }

    public List findByExample(final String entityName, final Object exampleEntity, final int firstResult,
                              final int maxResults) throws DataAccessException {
        Assert.notNull(exampleEntity, "Example entity must not be null");

        return execute(new HibernateCallback<List>() {
            public List doInHibernate(Session session) throws HibernateException {
                Criteria executableCriteria = ((entityName != null) ? session.createCriteria(entityName)
                        : session.createCriteria(exampleEntity.getClass()));
                executableCriteria.add(Example.create(exampleEntity));

                if (firstResult >= 0) {
                    executableCriteria.setFirstResult(firstResult);
                }

                if (maxResults > 0) {
                    executableCriteria.setMaxResults(maxResults);
                }

                return executableCriteria.list();
            }
        });
    }

    public List findByNamedParam(String queryString, String paramName, Object value) throws DataAccessException {
        return findByNamedParam(queryString, new String[]{paramName}, new Object[]{value});
    }

    public List findByNamedParam(final String queryString, final String[] paramNames, final Object[] values)
            throws DataAccessException {
        if (paramNames.length != values.length) {
            throw new IllegalArgumentException("Length of paramNames array must match length of values array");
        }

        return execute(new HibernateCallback<List>() {
            public List doInHibernate(Session session) throws HibernateException {
                Query queryObject = session.createQuery(queryString);

                if (values != null) {
                    for (int i = 0; i < values.length; i++) {
                        applyNamedParameterToQuery(queryObject, paramNames[i], values[i]);
                    }
                }

                return queryObject.list();
            }
        });
    }

    public List findByNamedQuery(String queryName) throws DataAccessException {
        return findByNamedQuery(queryName, (Object[]) null);
    }

    public List findByNamedQuery(String queryName, Object value) throws DataAccessException {
        return findByNamedQuery(queryName, new Object[]{value});
    }

    public List findByNamedQuery(final String queryName, final Object... values) throws DataAccessException {
        return execute(new HibernateCallback<List>() {
            public List doInHibernate(Session session) throws HibernateException {
                Query queryObject = session.getNamedQuery(queryName);

                if (values != null) {
                    for (int i = 0; i < values.length; i++) {
                        queryObject.setParameter(i, values[i]);
                    }
                }

                return queryObject.list();
            }
        });
    }

    public List findByNamedQueryAndNamedParam(String queryName, String paramName, Object value)
            throws DataAccessException {
        return findByNamedQueryAndNamedParam(queryName, new String[]{paramName}, new Object[]{value});
    }

    public List findByNamedQueryAndNamedParam(final String queryName, final String[] paramNames, final Object[] values)
            throws DataAccessException {
        if ((paramNames != null) && (values != null) && (paramNames.length != values.length)) {
            throw new IllegalArgumentException("Length of paramNames array must match length of values array");
        }

        return execute(new HibernateCallback<List>() {
            public List doInHibernate(Session session) throws HibernateException {
                Query queryObject = session.getNamedQuery(queryName);

                if (values != null) {
                    for (int i = 0; i < values.length; i++) {
                        applyNamedParameterToQuery(queryObject, paramNames[i], values[i]);
                    }
                }

                return queryObject.list();
            }
        });
    }

    public List findByNamedQueryAndValueBean(final String queryName, final Object valueBean) throws DataAccessException {
        return execute(new HibernateCallback<List>() {
            public List doInHibernate(Session session) throws HibernateException {
                Query queryObject = session.getNamedQuery(queryName);
                queryObject.setProperties(valueBean);

                return queryObject.list();
            }
        });
    }

    public List findByValueBean(final String queryString, final Object valueBean) throws DataAccessException {
        return execute(new HibernateCallback<List>() {
            public List doInHibernate(Session session) throws HibernateException {
                Query queryObject = session.createQuery(queryString);
                queryObject.setProperties(valueBean);

                return queryObject.list();
            }
        });
    }

    public void flush() throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.flush();

                return null;
            }
        });
    }

    public <T> T get(final Class<T> entityClass, final Serializable id) throws DataAccessException {
        return execute(new HibernateCallback<T>() {
            @SuppressWarnings("unchecked")
            public T doInHibernate(Session session) throws HibernateException {
                return (T) session.get(entityClass, id);
            }
        });
    }

    public Object get(final String entityName, final Serializable id) throws DataAccessException {
        return execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                return session.get(entityName, id);
            }
        });
    }

    public Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public <T> T load(final Class<T> entityClass, final Serializable id) throws DataAccessException {
        return execute(new HibernateCallback<T>() {
            @SuppressWarnings("unchecked")
            public T doInHibernate(Session session) throws HibernateException {
                return (T) session.load(entityClass, id);
            }
        });
    }

    public Object load(final String entityName, final Serializable id) throws DataAccessException {
        return execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                return session.load(entityName, id);
            }
        });
    }

    public void load(final Object entity, final Serializable id) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.load(entity, id);

                return null;
            }
        });
    }

    public <T> List<T> loadAll(final Class<T> entityClass) throws DataAccessException {
        return execute(new HibernateCallback<List<T>>() {
            @SuppressWarnings("unchecked")
            public List<T> doInHibernate(Session session) throws HibernateException {
                Criteria criteria = session.createCriteria(entityClass);
                criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);

                return criteria.list();
            }
        });
    }

    public <T> T merge(final T entity) throws DataAccessException {
        return execute(new HibernateCallback<T>() {
            @SuppressWarnings("unchecked")
            public T doInHibernate(Session session) throws HibernateException {
                return (T) session.merge(entity);
            }
        });
    }

    public <T> T merge(final String entityName, final T entity) throws DataAccessException {
        return execute(new HibernateCallback<T>() {
            @SuppressWarnings("unchecked")
            public T doInHibernate(Session session) throws HibernateException {
                return (T) session.merge(entityName, entity);
            }
        });
    }

    public void persist(final Object entity) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.persist(entity);

                return null;
            }
        });
    }

    public void persist(final String entityName, final Object entity) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.persist(entityName, entity);

                return null;
            }
        });
    }

    public void refresh(final Object entity) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.refresh(entity);

                return null;
            }
        });
    }

    public void replicate(final Object entity, final ReplicationMode replicationMode) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.replicate(entity, replicationMode);

                return null;
            }
        });
    }

    public void replicate(final String entityName, final Object entity, final ReplicationMode replicationMode)
            throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.replicate(entityName, entity, replicationMode);

                return null;
            }
        });
    }

    public Serializable save(final Object entity) throws DataAccessException {
        return execute(new HibernateCallback<Serializable>() {
            public Serializable doInHibernate(Session session) throws HibernateException {
                return session.save(entity);
            }
        });
    }

    public Serializable save(final String entityName, final Object entity) throws DataAccessException {
        return execute(new HibernateCallback<Serializable>() {
            public Serializable doInHibernate(Session session) throws HibernateException {
                return session.save(entityName, entity);
            }
        });
    }

    public void saveOrUpdate(final Object entity) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.saveOrUpdate(entity);

                return null;
            }
        });
    }

    public void saveOrUpdate(final String entityName, final Object entity) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.saveOrUpdate(entityName, entity);

                return null;
            }
        });
    }

    public void saveOrUpdateAll(final Collection entities) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                for (Object entity : entities) {
                    session.saveOrUpdate(entity);
                }

                return null;
            }
        });
    }

    public void update(final Object entity) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.update(entity);

                return null;
            }
        });
    }

    public void update(final String entityName, final Object entity) throws DataAccessException {
        execute(new HibernateCallback<Object>() {
            public Object doInHibernate(Session session) throws HibernateException {
                session.update(entityName, entity);

                return null;
            }
        });
    }

    protected void applyNamedParameterToQuery(Query queryObject, String paramName, Object value)
            throws HibernateException {
        if (value instanceof Collection) {
            queryObject.setParameterList(paramName, (Collection) value);
        } else if (value instanceof Object[]) {
            queryObject.setParameterList(paramName, (Object[]) value);
        } else {
            queryObject.setParameter(paramName, value);
        }
    }

    protected DataAccessException convertJdbcAccessException(SQLException ex) {
        SQLExceptionTranslator translator = getDefaultJdbcExceptionTranslator();

        return translator.translate("Hibernate-related JDBC operation", null, ex);
    }

    protected DataAccessException convertJdbcAccessException(JDBCException ex, SQLExceptionTranslator translator) {
        return translator.translate("Hibernate operation: " + ex.getMessage(), ex.getSQL(), ex.getSQLException());
    }

    protected <T> T doExecute(HibernateCallback<T> action) throws DataAccessException {
        Assert.notNull(action, "Callback object must not be null");

        try {
            T result = action.doInHibernate(getSession());

            return result;
        } catch (HibernateException ex) {
            throw convertHibernateAccessException(ex);
        } catch (SQLException ex) {
            throw convertJdbcAccessException(ex);
        } catch (RuntimeException ex) {
            // Callback code threw application exception...
            throw ex;
        }
    }

    protected synchronized SQLExceptionTranslator getDefaultJdbcExceptionTranslator() {
        if (this.defaultJdbcExceptionTranslator == null) {
            this.defaultJdbcExceptionTranslator = new SQLStateSQLExceptionTranslator();
        }

        return this.defaultJdbcExceptionTranslator;
    }
} 
