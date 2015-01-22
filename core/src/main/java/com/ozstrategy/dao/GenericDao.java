package com.ozstrategy.dao;

import java.io.Serializable;

import java.util.List;
import java.util.Map;

public interface GenericDao<T, PK extends Serializable> {

    boolean exists(PK id);

    List<T> findByNamedQuery(String queryName, Map<String, Object> queryParams);

    T get(PK id);

    List<T> getAll();

    List<T> getAllDistinct();

    void remove(PK id);

    T save(T object);

    void saveOrUpdate(T object);

    void remove(T object);


} 
