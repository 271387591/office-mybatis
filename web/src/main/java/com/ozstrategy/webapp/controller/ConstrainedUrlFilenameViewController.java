package com.ozstrategy.webapp.controller;


import org.springframework.web.servlet.mvc.UrlFilenameViewController;

import javax.servlet.http.HttpServletRequest;


/**
 * Created by IntelliJ IDEA. User: Rojer Luo Date: Feb 25, 2010 Time: 1:56:38 PM To change this template use File |
 * Settings | File Templates.
 *
 * @author   $author$
 * @version  $Revision$, $Date$
 */
public class ConstrainedUrlFilenameViewController extends UrlFilenameViewController {
  //~ Instance fields --------------------------------------------------------------------------------------------------

  private boolean stripExtension = true;

  //~ Methods ----------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  stripExtension  DOCUMENT ME!
   */
  public void setStripExtension(boolean stripExtension) {
    this.stripExtension = stripExtension;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * Extract a URL path from the given request, suitable for view name extraction.
   *
   * @param   request  current HTTP request
   *
   * @return  the URL to use for view name extraction
   */
  @Override protected String extractOperableUrl(HttpServletRequest request) {
    return getUrlPathHelper().getLookupPathForRequest(request);
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * Override to make stripExtension configurable.
   *
   * @param   uri  DOCUMENT ME!
   *
   * @return  override to make stripExtension configurable.
   */
  @Override protected String extractViewNameFromUrlPath(String uri) {
    int start = ((uri.charAt(0) == '/') ? 1 : 0);
    int end   = uri.length();

    if (stripExtension) {
      int lastIndex = uri.lastIndexOf(".");
      end = ((lastIndex < 0) ? uri.length() : lastIndex);
    }

    return uri.substring(start, end);
  }
} // end class ConstrainedUrlFilenameViewController
