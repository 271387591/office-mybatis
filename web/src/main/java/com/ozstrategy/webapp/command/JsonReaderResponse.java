package com.ozstrategy.webapp.command;

import java.util.ArrayList;
import java.util.Collection;


/**
 * Creates a response that can be consumed by an Ext.data.JsonReader. The client-side Ext.data.JsonReader must have the
 * "root" property set to "data". Note: Ext documentation often uses "rows" for this property, but "data" is more clear.
 * Example Ext.data.JsonReader configuration: { root : 'data' } If the parameterized type has two properties "field1"
 * and "field2", then when an instance of this class is read by the client, it will look like: { data : [ { field1 :
 * 'value', field2 : 'value', }, { field1 : 'value', field2 : 'value', } ], success : true }
 *
 * @param    <T>  Type of Objects that will be converted to Ext.data.Records by the client-side Ext.data.DataReader.
 *
 * @author   <a href="mailto:wangyang@ozstrategy.com">Wangy</a>
 * @version  $Revision$, 10/27/11 4:36 PM
 */
public class JsonReaderResponse<T> {
  //~ Instance fields --------------------------------------------------------------------------------------------------

  /** DOCUMENT ME! */
  public Collection<T> data;

  /** DOCUMENT ME! */
  public ExtraResponseData extraResData;

  /** DOCUMENT ME! */
  public String message;

  /** DOCUMENT ME! */
  public Boolean success;

  /** DOCUMENT ME! */
  public int total = 0;

  //~ Constructors -----------------------------------------------------------------------------------------------------

  /**
   * Creates an un{@link #success}ful JsonReaderResponse with null {@link #data}. This signals the case where the client
   * established a connection with the server, but the server couldn't fulfill it (e.g., user doesn't have proper user
   * credentials).
   */
  public JsonReaderResponse() {
    this.data = null;
    success   = false;
  }


  /**
   * Creates a {@link #success}ful JsonReaderResponse with the provided {@link #data}.
   *
   * @param  data  DOCUMENT ME!
   */
  public JsonReaderResponse(Collection<T> data) {
    this.data = data;
    success   = true;
  }


  /**
   * Creates a new JsonReaderResponse object.
   *
   * @param  extraData  DOCUMENT ME!
   */
  public JsonReaderResponse(ExtraResponseData extraData) {
    this.success      = true;
    this.message      = "";
    this.data         = new ArrayList<T>();
    this.extraResData = extraData;
  }

  /**
   * Creates a new JsonReaderResponse object.
   *
   * @param  data   Document Me!
   * @param  total  Document Me!
   */
  public JsonReaderResponse(Collection<T> data, int total) {
    this.data  = data;
    success    = true;
    this.total = total;
  }

  /**
   * Creates a new JsonReaderResponse object.
   *
   * @param  data     Document Me!
   * @param  success  Document Me!
   * @param  message  Document Me!
   */
  public JsonReaderResponse(Collection<T> data, boolean success, String message) {
    this.data    = data;
    this.success = success;
    this.message = message;
  }

  /**
   * Creates a new JsonReaderResponse object.
   *
   * @param  data     Document Me!
   * @param  message  Document Me!
   * @param  total    Document Me!
   */
  public JsonReaderResponse(Collection<T> data, String message, int total) {
    this.message = message;
    this.total   = total;
    this.data    = data;
  }

  /**
   * Creates a new JsonReaderResponse object.
   *
   * @param  data     Document Me!
   * @param  success  Document Me!
   * @param  total    Document Me!
   * @param  message  Document Me!
   */
  public JsonReaderResponse(Collection<T> data, boolean success, int total, String message) {
    this.data    = data;
    this.success = success;
    this.total   = total;
    this.message = message;
  }

  //~ Methods ----------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param   data  DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public JsonReaderResponse<T> addExtraResponseData(ExtraResponseData data) {
    this.extraResData = data;

    return this;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public Collection<T> getData() {
    return data;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public ExtraResponseData getExtraResData() {
    return extraResData;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public String getMessage() {
    return message;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public int getTotal() {
    if ((data != null) && (total == 0)) {
      return data.size();
    }

    return total;
  }

  
  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  data  DOCUMENT ME!
   */
  public void setData(Collection<T> data) {
    this.data = data;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  extraResData  DOCUMENT ME!
   */
  public void setExtraResData(ExtraResponseData extraResData) {
    this.extraResData = extraResData;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  message  DOCUMENT ME!
   */
  public void setMessage(String message) {
    this.message = message;
  }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  total  DOCUMENT ME!
   */
  public void setTotal(int total) {
    this.total = total;
  }
} // end class JsonReaderResponse
