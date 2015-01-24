package com.ozstrategy.webapp.util;

import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;

/**
 * Created by IntelliJ IDEA. User: yongliu Date: 3/23/12 Time: 10:57 AM To change this template use File | Settings |
 * File Templates.
 *
 * @author   $author$
 * @version  $Revision$, $Date$
 */
public class DownloadFileUtils {
  //~ Methods ----------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param   extension  DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public static String getContentType(String extension) {
    String ext = extension.toLowerCase();

    if (ext.equals(".xls") || ext.equals(".xlsx")) {
      return "application/vnd.ms-excel; charset=UTF-8";
    } else if (ext.equals(".cvs") || ext.equals(".xlsx")) {
      return "application/ms-excel";
    } else if (ext.equals(".doc") || ext.equals(".docx")) {
      return "application/msword";
    } else if (ext.equals(".txt")) {
      return "text/plain";
    } else if (ext.equals(".pdf")) {
      return "application/pdf";
    } else if (ext.equals(".jpg") || ext.equals(".jpeg")) {
      return "image/jpeg";
    } else if (ext.equals(".ppt")) {
      return "application/vnd.ms-powerpoint";
    } else if (ext.equals(".gif")) {
      return "image/gif";
    }

    return "text/html";
  }

  public static String getFileType(String fileName) {
    String type = "";
    if (fileName == null || "".equals(fileName))
      return type;
    int position = fileName.lastIndexOf(".");
    if (position != -1) {
      type = fileName.substring(position + 1 , fileName.length());
    }
    return type;
  }

  /**
   * 支持在线打开下载
   *
   * @param filePath
   * @param response
   * @param isOnLine
   * @param fname
   * @throws java.io.IOException
   */
  public static void download(String filePath, HttpServletResponse response,
                        boolean isOnLine, String fname) throws IOException {
    System.out.println("filePath:" + filePath);
    File f = new File(filePath);
    if (!f.exists()) {
      response.sendError(404, "File not found!");
      return;
    }
    BufferedInputStream br = new BufferedInputStream(new FileInputStream(f));
    byte[] bs = new byte[1024];
    int len = 0;
    response.reset(); // 非常重要
    if (isOnLine) { // 在线打开方式
      URL u = new URL("file:///" + filePath);
      String contentType = u.openConnection().getContentType();
        response.setCharacterEncoding("UTF-8");
      response.setContentType(contentType);
      response.setHeader("Content-Disposition", "inline;filename="
          + fname);
      // 文件名应该编码成utf-8
    } else {
      // 纯下载方式
        response.setCharacterEncoding("UTF-8");
      response.setContentType("application/x-msdownload");
      response.setHeader("Content-Disposition", "attachment;filename="
          + fname);
    }
    OutputStream out = response.getOutputStream();
    while ((len = br.read(bs)) > 0) {
      out.write(bs, 0, len);
    }
    out.flush();
    out.close();
    br.close();
  }

// 其他的没试过了。你可能要装下pdf的阅读插件。
} // end class FileUtils
