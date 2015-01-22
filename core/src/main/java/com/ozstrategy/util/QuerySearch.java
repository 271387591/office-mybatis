package com.ozstrategy.util;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Query;
import org.hibernate.Session;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 7/17/13
 * Time: 11:35 AM
 * To change this template use File | Settings | File Templates.
 * 简单的单表搜索查询工具
 */
public class QuerySearch {
    public static final Log logger = LogFactory.getLog(QuerySearch.class);
    private List<QueryField> commands;
    private Map<String,Object> map;
    private Map<String,Object> namedMap = new HashMap<String, Object>();
    private Map<String,String> sortMap = new HashMap<String, String>();
    private String hql;
    private String sort;
    private String dir;
    public QuerySearch(String baseHql,Map<String,Object> map){
        this.commands=new ArrayList<QueryField>();
        this.hql=baseHql;
        this.map=map;
    }
    private Query query(Session session,boolean page){
        if(map!=null){
            for(Iterator<Map.Entry<String,Object>> it=map.entrySet().iterator();it.hasNext();){
                Map.Entry<String,Object> entry=it.next();
                String key=entry.getKey();
                Object value=entry.getValue();
                addFilter(key,value);
            }
        }
        String hql=hql();
        if(sortMap.size()>0){
            hql+=" order by ";
            for(Iterator<Map.Entry<String,String>> it=sortMap.entrySet().iterator();it.hasNext();){
                Map.Entry<String,String> entry=it.next();
                String key=entry.getKey();
                String value=entry.getValue();
                hql+= key+" "+value+",";
            }
            hql=hql.substring(0,hql.length()-1);
        }
        Query query =session.createQuery(hql);
        query=query(query,namedMap);
        if(page){
            Integer start=Integer.parseInt(map.get("start").toString());
            Integer limit=Integer.parseInt(map.get("limit").toString());
            query.setFirstResult(start).setMaxResults(limit);
        }
        return query;
    }
    public Query pageQuery(Session session){
        return query(session,true);
    }
    public Query query(Session session){
        return query(session,false);
    }
    public QuerySearch addSort(String sort,String dir){
        if(StringUtils.isNotEmpty(sort)){
            if(StringUtils.isNotEmpty(dir)){
                this.sortMap.put(sort,dir);
            }else{
                this.sortMap.put(sort,"ASC");
            }
        }
        return this;
    }
    private String hql(){
        String tm_baseHql=hql;
        if(commands!=null && commands.size()>0){
            for(QueryField field:commands){
                String getHql=field.getPartHql();
                tm_baseHql+=getHql;
            }
        }
        hql=tm_baseHql;
        return tm_baseHql;
    }
    public Query query(Query query,Map<String,Object> map){
        String[] names=query.getNamedParameters();
        if(names!=null){
            for(String key:names){
                Object value=map.get(key);
                if(key.contains("LK")){
                    value="%"+value+"%";
                }else if(key.contains("LLK")){
                    value="%"+value;
                }else if(key.contains("RLK")){
                    value=value+"%";
                }
                if(value!=null){
                    query.setParameter(key,value);
                }
            }
        }
        return query;
    }
    public void addFilter(String property, Object value) {
        String as[] = property.split("[_]");
        if (as != null && as.length == 4) {
            /*Q_S_title_LK*/
            Object obj=convertObject(as[1],value.toString());
            namedMap.put(property.replaceAll("\\.","_"),obj);
            QueryField queryField = new QueryField(property.replaceAll("\\.","_"), as[2], as[3]);
            commands.add(queryField);
        }  else if(as != null && as.length == 2){
            /*Q_title*/
//            QueryField queryField = new QueryField(property.replaceAll("\\.","_"), as[1],as[2],value);
//            commands.add(queryField);
            namedMap.put(property.replaceAll("\\.","_"),value);
            QueryField queryField = new QueryField(property.replaceAll("\\.","_"), as[1],"EQ");
            commands.add(queryField);
        }else{
            namedMap.put(property,value);
        }
    }
    private static Object convertObject(String s, String s1){
        if (StringUtils.isEmpty(s1))
            return null;
        Object obj = null;
        try{
            if ("S".equals(s))
                obj = s1;
            else if ("L".equals(s))
                obj = new Long(s1);
            else if ("N".equals(s))
                obj = new Integer(s1);
            else if ("BD".equals(s))
                obj = new BigDecimal(s1);
            else if ("FT".equals(s))
                obj = new Float(s1);
            else if ("SN".equals(s))
                obj = new Short(s1);
            else if ("BT".equals(s1))
                obj=new Byte(s1);
            else if ("BL".equals(s))
                obj= new Boolean(s1);
            else if ("D".equals(s))
                obj = DateUtils.parseDate(s1, new String[]{"yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss"});
            else {
                obj = s1;
            }
        }catch (Exception exception){
        }
        return obj;
    }

    public List<QueryField> getCommands() {
        return commands;
    }

    public void setCommands(List<QueryField> commands) {
        this.commands = commands;
    }

    public Map<String, Object> getMap() {
        return map;
    }

    public void setMap(Map<String, Object> map) {
        this.map = map;
    }

    public String getHql() {
        return hql;
    }

    public void setHql(String hql) {
        this.hql = hql;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getDir() {
        return dir;
    }

    public void setDir(String dir) {
        this.dir = dir;
    }
}
