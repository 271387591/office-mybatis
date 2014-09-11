package com.ozstrategy.webapp.filter;

import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Repository;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: liuqian
 * Date: 13-10-14
 * Time: AM11:46
 * To change this template use File | Settings | File Templates.
 */
@Repository
public class LoggedFilter implements Filter {

  public void init(FilterConfig filterConfig) throws ServletException {
  }

  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

    HttpServletRequest req = (HttpServletRequest)request;
    HttpServletResponse res = (HttpServletResponse)response;
    String username = null;
    try{
      SecurityContextImpl securityContextImpl = (SecurityContextImpl) req.getSession().getAttribute("SPRING_SECURITY_CONTEXT");
      username = securityContextImpl.getAuthentication().getName()  ;
    }  catch (NullPointerException e){
    }
    if (req.getHeader("x-requested-with") != null
      && req.getHeader("x-requested-with")
      .equalsIgnoreCase("XMLHttpRequest")) {
      if(username == null)   {
//         ((HttpServletResponse)response).setStatus(500,"sessiontimeout");
//        System.out.println("timeout");
        res.addHeader("sessionstatus", "timeout");
        res.setHeader("sessionstatus", "timeout");
      }  else {
       chain.doFilter(request,response);
      }
//      if(((HttpServletRequest)request).getSession().isNew())  {
////        ((HttpServletResponse)response).setStatus(500,"sessiontimeout");
//        System.out.println("timeout");
//        res.addHeader("sessionstatus", "timeout");
//      }  else {
//        chain.doFilter(request,response);
//      }
    } else{
      chain.doFilter(request, response);
    }

  }

  public void destroy() {
  }

}
