package com.ozstrategy.webapp.command;


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
public class JsonReaderSingleResponse<T> {
  //~ Instance fields --------------------------------------------------------------------------------------------------

  /** DOCUMENT ME! */
  public T data;

  /** DOCUMENT ME! */
  public String message;

  /** DOCUMENT ME! */
  public boolean success;

  //~ Constructors -----------------------------------------------------------------------------------------------------

  /**
   * Creates an un{@link #success}ful JsonReaderResponse with null {@link #data}. This signals the case where the client
   * established a connection with the server, but the server couldn't fulfill it (e.g., user doesn't have proper user
   * credentials).
   */
  public JsonReaderSingleResponse() {
    this.data = null;
    success   = false;
  }


  /**
   * Creates a {@link #success}ful JsonReaderResponse with the provided {@link #data}.
   *
   * @param  data  DOCUMENT ME!
   */
  public JsonReaderSingleResponse(T data) {
    this.data = data;
    success   = true;
  }

  /**
   * Creates a new JsonReaderResponse object.
   *
   * @param  data     Document Me!
   * @param  success  Document Me!
   * @param  message  Document Me!
   */
  public JsonReaderSingleResponse(T data, boolean success, String message) {
    this.data    = data;
    this.success = success;
    this.message = message;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @return  DOCUMENT ME!
   */
  public T getData() {
    return data;
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
  public boolean isSuccess() {
    return success;
  }

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  data  DOCUMENT ME!
   */
  public void setData(T data) {
    this.data = data;
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

  //~ ------------------------------------------------------------------------------------------------------------------

  /**
   * DOCUMENT ME!
   *
   * @param  success  DOCUMENT ME!
   */
  public void setSuccess(boolean success) {
    this.success = success;
  }


  public JsonReaderSingleResponse(T data, boolean success) {
    this.data = data;
    this.success = success;
  }
} // end class JsonReaderResponse
