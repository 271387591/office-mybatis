package com.ozstrategy.util;

import com.ozstrategy.Constants;
import org.apache.commons.lang.StringUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.text.MessageFormat;

/**
 * Created by lihao on 5/8/14.
 *
 * @author   $author$
 * @version  $Revision$, $Date$
 */
public class JDBCUtils {
  //~ Instance fields --------------------------------------------------------------------------------------------------

    
    private final static String  Oracle="Oracle";
  private String       dbIp;
  private String       dbName;
  private String       dbPort;
  private String       dbType;
  private JdbcTemplate jdbcTemplate;
  private String       password;
  private String       username;

  //~ Constructors -----------------------------------------------------------------------------------------------------

  /**
   * Creates a new JDBCUtils object.
   *
   * @param  dbName    DOCUMENT ME!
   * @param  username  DOCUMENT ME!
   * @param  password  DOCUMENT ME!
   * @param  dbType    DOCUMENT ME!
   */
  public JDBCUtils(String dbName, String username, String password, String dbType) {
    this.dbName   = dbName;
    this.username = username;
    this.password = password;
    this.dbType   = dbType;
  }

  /**
   * Creates a new JDBCUtils object.
   *
   * @param  dbIp      DOCUMENT ME!
   * @param  dbName    DOCUMENT ME!
   * @param  dbPort    DOCUMENT ME!
   * @param  password  DOCUMENT ME!
   * @param  username  DOCUMENT ME!
   * @param  dbType    DOCUMENT ME!
   */
  public JDBCUtils(String dbIp, String dbName, String dbPort, String password, String username, String dbType) {
    this.dbIp     = dbIp;
    this.dbName   = dbName;
    this.dbPort   = dbPort;
    this.password = password;
    this.username = username;
    this.dbType   = dbType;
  }

  //~ Methods ----------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public DataSource getDataSource() {
    return new DriverManagerDataSource(getUrl(), username, password);
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public JdbcTemplate getJdbcTemplate() {
    jdbcTemplate = new JdbcTemplate(getDataSource());

    return jdbcTemplate;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  private String getDriverClassName() {
    if (StringUtils.equals(Oracle, dbType)) {
      return Constants.JdbcDriver_oracle;
    } else {
      return Constants.JdbcDriver_mysql;
    }
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * Creates a new JDBCUtils object.
   *
   * @return  creates a new JDBCUtils object.
   */
  private String getUrl() {
    if (StringUtils.equals(Oracle, dbType)) {
      String ip   = StringUtils.isNotEmpty(dbIp) ? dbIp : "127.0.0.1";
      String port = StringUtils.isNotEmpty(dbPort) ? dbPort : "1158";

      return MessageFormat.format(Constants.JdbcUrl_oralce, ip, port, dbName);
    } else {
      String ip   = StringUtils.isNotEmpty(dbIp) ? dbIp : "127.0.0.1";
      String port = StringUtils.isNotEmpty(dbPort) ? dbPort : "3306";

      return MessageFormat.format(Constants.JdbcUrl_mysql, ip, port, dbName);

    }

  } // end method getUrl
} // end class JDBCUtils
