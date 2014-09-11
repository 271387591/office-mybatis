package com.ozstrategy.webapp.command;

import org.apache.commons.lang.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;


public class QueryFilter {

    private Map<String,Object> map;
	public QueryFilter(HttpServletRequest httpservletrequest){
        map=new HashMap<String, Object>();
		Enumeration enumeration = httpservletrequest.getParameterNames();
		do{
			if (!enumeration.hasMoreElements())
				break;
			String property = (String)enumeration.nextElement();
			if (property.startsWith("Q_")){
				String value = httpservletrequest.getParameter(property);
                if(StringUtils.isNotEmpty(value)){
                    addParas(property, value);
                }
			}

		} while (true);
        String start = httpservletrequest.getParameter("start");
        String limit = httpservletrequest.getParameter("limit");
        int start_integer=0,limit_integer=25;
        if (StringUtils.isNotEmpty(start)){
            start_integer = new Integer(start);
            addParas("start",start_integer);
        }
        if (StringUtils.isNotEmpty(limit)){
            limit_integer = new Integer(limit);
            addParas("limit",limit_integer);
        }
	}

	public void addParas(String property, Object value) {
        map.put(property,value);
	}
    public Map<String,Object> map(){
        return map;
    }
}
