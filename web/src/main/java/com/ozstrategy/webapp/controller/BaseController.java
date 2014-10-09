package com.ozstrategy.webapp.controller;

import com.ozstrategy.webapp.Constants;
import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang.time.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.util.Collections;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Created by lihao on 7/4/14.
 */
@Controller
public class BaseController {
    protected final transient Log logger = LogFactory.getLog(getClass());
    @Autowired
    private ApplicationContext context;
    protected static final List emptyData= Collections.EMPTY_LIST;
    
    public String getMessage(String key,HttpServletRequest request) {
        return context.getMessage(key, null, request.getLocale());
    }
    public String getMessage(String key, Object[] args) {
        return context.getMessage(key, args, Locale.getDefault());
    }
    public String getMessage(String key, Locale locale) {
        return context.getMessage(key, null, locale);
    }
    public String getMessage(String key, Object[] args, Locale locale) {
        return context.getMessage(key, args, locale);
    }
    public String getZhMessage(String key) {
        return context.getMessage(key, null, Locale.SIMPLIFIED_CHINESE);
    }
    public String getZhMessage(String key,Object[] args) {
        return context.getMessage(key, args, Locale.SIMPLIFIED_CHINESE);
    }
    public Map<String,Object> requestMap(HttpServletRequest request){
        Map<String,Object> map=new HashMap<String, Object>();
        Enumeration enumeration = request.getParameterNames();
        do{
            if (!enumeration.hasMoreElements())
                break;
            String property = (String)enumeration.nextElement();
            if(StringUtils.isNotEmpty(property)){
                String value = request.getParameter(property);
                map.put(property,value);
            }
        } while (true);
        if(StringUtils.isEmpty(request.getParameter("limit"))){
            map.put("limit", Constants.LIMIT);
        }
        
        return map;
    }
    public Integer initLimit(String limit){
        if(NumberUtils.isNumber(limit)){
            return parseInteger(limit);
        }
        return  Constants.LIMIT;
    }
    public Boolean checkIsEmpty(String filed){
        if(StringUtils.isEmpty(filed)){
            return Boolean.TRUE;
        }
        return Boolean.FALSE;
    }
    public Boolean checkIsNotNumber(String filed){
        if(NumberUtils.isNumber(filed)){
            return Boolean.FALSE;
        }
        return Boolean.TRUE;
    }
    public String formatDateYMD(Date date){
        return DateFormatUtils.format(date, Constants.YMD);
    }
    public String formatDateYMDHMS(Date date){
        return DateFormatUtils.format(date, Constants.YMDHMS);
    }
    public Date parseDate(String str){
        try {
            Date date = DateUtils.parseDate(str,new String[]{Constants.YMD, Constants.YMDHMS});
            return date;
        } catch (ParseException e) {
        }
        return null;
    }
    public Long parseLong(String filed){
        if(NumberUtils.isNumber(filed))
            return Long.parseLong(filed);
        return null;
    }
    public Integer parseInteger(String filed){
        if(NumberUtils.isNumber(filed))
            return Integer.parseInt(filed);
        return null;
    }
    public Short parseShort(String filed){
        if(NumberUtils.isNumber(filed))
            return Short.parseShort(filed);
        return null;
    }
    public Double parseDouble(String filed){
        if(NumberUtils.isNumber(filed))
            return Double.parseDouble(filed);
        return null;
    }
    public Boolean parseBoolean(String filed){
        if(StringUtils.isNotEmpty(filed)){
            return BooleanUtils.toBooleanObject(filed);
        }
        return null;
    }
    
    public void ajax(String str,boolean result,HttpServletResponse response){
        try{
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().write("{\"communicate\":"+str+",\"result\":\""+result+"\"}");
        }catch(IOException e){
            logger.error(e.getMessage(),e);
        }
    }
}
