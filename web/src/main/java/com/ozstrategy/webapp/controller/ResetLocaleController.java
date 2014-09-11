package com.ozstrategy.webapp.controller;

import com.ozstrategy.webapp.command.JsonReaderSingleResponse;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Locale;


/**
 * Created by zhubq on 14-7-14.
 *
 * @author   $author$
 * @version  $Revision$, $Date$
 */
@RequestMapping("resetLocaleController")
@Controller
public class ResetLocaleController extends BaseController {
  //~ Methods ----------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param   localeName  DOCUMENT ME!
   * @param   request     DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  @RequestMapping(value = "resetLocale")
  @ResponseBody
  public JsonReaderSingleResponse resetLocale(String localeName, HttpServletRequest request) {
    boolean result = true;

    if (StringUtils.hasText(localeName)) {
      Locale.setDefault(new Locale(localeName));
    }

    return new JsonReaderSingleResponse(result);
  }
}
