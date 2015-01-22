package com.ozstrategy.webapp.security;

import com.ozstrategy.dao.userrole.UserDao;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: liuqian
 * Date: 13-7-3
 * Time: PM3:07
 * To change this template use File | Settings | File Templates.
 */
public class WebAuthenticationSuccessLoggerHandler implements AuthenticationSuccessHandler {
  private UserDao userDao;
//  @Override
  public void onAuthenticationSuccess(HttpServletRequest request,
                                      HttpServletResponse response, Authentication authentication)
    throws IOException, ServletException {
//    java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authCollection = authentication.getAuthorities();
      response.sendRedirect("dispatcherPage.action");
//      User user = (User)authentication.getPrincipal();
//    if (user == null) {
//      return;
//    }
//      if(user.isAdmin()){
//          
//          return;
//      }
//      LoginCommand command=new LoginCommand(user);
//      JsonReaderSingleResponse<LoginCommand> jsonReaderSingleResponse=new JsonReaderSingleResponse<LoginCommand>(command);
//      String result=new ObjectMapper().writeValueAsString(jsonReaderSingleResponse);
//      response.getWriter().print(result);
  }

  public void setUserDao(UserDao userDao) {
    this.userDao = userDao;
  }
}
