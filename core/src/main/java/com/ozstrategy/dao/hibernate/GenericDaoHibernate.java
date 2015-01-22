package com.ozstrategy.dao.hibernate;

import com.ozstrategy.dao.GenericDao;
import com.ozstrategy.orm.HibernateTemplate;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.orm.ObjectRetrievalFailureException;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;


public class GenericDaoHibernate<T, PK extends Serializable> implements GenericDao<T, PK> {
    protected final Log log = LogFactory.getLog(getClass());
    private HibernateTemplate hibernateTemplate;
    private Class<T> persistentClass;
    private SessionFactory sessionFactory;

    public GenericDaoHibernate(final Class<T> persistentClass) {
        this.persistentClass = persistentClass;
    }

    public GenericDaoHibernate(final Class<T> persistentClass, SessionFactory sessionFactory) {
        this.persistentClass = persistentClass;
        this.sessionFactory = sessionFactory;
        this.hibernateTemplate = new HibernateTemplate(sessionFactory);
    }

    @SuppressWarnings("unchecked")
    public boolean exists(PK id) {
        T entity = (T) hibernateTemplate.get(this.persistentClass, id);

        return entity != null;
    }

    @SuppressWarnings("unchecked")
    public List<T> findByNamedQuery(String queryName, Map<String, Object> queryParams) {
        String[] params = new String[queryParams.size()];
        Object[] values = new Object[queryParams.size()];

        int index = 0;

        for (String s : queryParams.keySet()) {
            params[index] = s;
            values[index++] = queryParams.get(s);
        }

        return hibernateTemplate.findByNamedQueryAndNamedParam(queryName, params, values);
    }

    @SuppressWarnings("unchecked")
    public T get(PK id) {
        T entity = (T) hibernateTemplate.get(this.persistentClass, id);

        if (entity == null) {
            log.warn("Uh oh, '" + this.persistentClass + "' object with id '" + id + "' not found...");
            throw new ObjectRetrievalFailureException(this.persistentClass, id);
        }

        return entity;
    }

    @SuppressWarnings("unchecked")
    public List<T> getAll() {
        return hibernateTemplate.loadAll(this.persistentClass);
    }

    @SuppressWarnings("unchecked")
    public List<T> getAllDistinct() {
        Collection result = new LinkedHashSet(getAll());

        return new ArrayList(result);
    }

    public HibernateTemplate getHibernateTemplate() {
        return this.hibernateTemplate;
    }

    public SessionFactory getSessionFactory() {
        return this.sessionFactory;
    }

    public void remove(PK id) {
        hibernateTemplate.delete(this.get(id));
    }

    @SuppressWarnings("unchecked")
    public T save(T object) {
        return (T) hibernateTemplate.save(object);
    }

    public void saveOrUpdate(T object) {
        hibernateTemplate.saveOrUpdate(object);
    }

    public void remove(T object) {
        hibernateTemplate.delete(object);
    }

    @Autowired
    @Required
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
        this.hibernateTemplate = new HibernateTemplate(sessionFactory);
    }

    protected Session getSession() {
        return this.hibernateTemplate.getSession();
    }
} 
