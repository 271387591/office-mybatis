package com.ozstrategy.webapp.controller;

import com.ozstrategy.model.userrole.Feature;
import com.ozstrategy.model.userrole.RoleFeature;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.userrole.FeatureManager;
import com.ozstrategy.service.userrole.UserManager;
import com.ozstrategy.webapp.command.userrole.UserCommand;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created by IntelliJ IDEA. User: liaodongming Date: 12-3-12 Time: PM2:08 To change this template use File | Settings |
 * File Templates.
 *
 * @author   $author$
 * @version  $Revision$, $Date$
 */
@Controller public class SimpleMVController implements InitializingBean {
  //~ Instance fields --------------------------------------------------------------------------------------------------

  private final transient Log log = LogFactory.getLog(this.getClass());

  @Autowired private UserManager userManager = null;
  @Autowired private FeatureManager featureManager = null;

  //~ Methods ----------------------------------------------------------------------------------------------------------

  /**
   * @see  org.springframework.beans.factory.InitializingBean#afterPropertiesSet()
   */
  @Override public void afterPropertiesSet() throws Exception {
// Assert.notNull(paymentProgramTypeManager);
// Assert.notNull(userManager);
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param   request   DOCUMENT ME!
   * @param   response  DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  @RequestMapping("/dispatcherPage.action")
  public ModelAndView dispatcherPage(HttpServletRequest request, HttpServletResponse response) {
      User user = userManager.getUserByUsername(request.getRemoteUser());
      if(user==null) 
          return new ModelAndView("error");
      String url = user.getDefaultRole().getSystemView().getUrl();
      if(StringUtils.isNotEmpty(url)){
          return new ModelAndView("redirect:"+url);
      }
      return new ModelAndView("error"); 
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param   request   DOCUMENT ME!
   * @param   response  DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  @RequestMapping("/desktopRes.js")
  public ModelAndView getGlobalRes(HttpServletRequest request, HttpServletResponse response) {
    if (log.isDebugEnabled()) {
      log.debug("Enter 'getGlobalRes'...");
    }

    User user = userManager.getUserByUsername(request.getRemoteUser());
     
    if (log.isDebugEnabled()) {
      log.debug("Populated User: + " + user + "...");
    }
      UserCommand command=new UserCommand(user);
      List<Feature> roleFeatures=featureManager.getUserFeaturesByUsername(request.getRemoteUser());
      command=command.populateFeatures(roleFeatures);

    if (log.isDebugEnabled()) {
      log.debug("Populated Command: + " + command + "...");
    }

    return new ModelAndView("res/desktopRes", "command", command);
  }
} // end class SimpleMVController
