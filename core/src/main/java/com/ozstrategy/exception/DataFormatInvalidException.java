package com.ozstrategy.exception;

/**
 * Created by IntelliJ IDEA.
 * User: kangpan
 * Date: 29/3/12
 * Time: 10:21 AM
 * To change this template use File | Settings | File Templates.
 */
public class DataFormatInvalidException extends Exception{
  //~ Constructors -----------------------------------------------------------------------------------------------------
  public DataFormatInvalidException(){}
  
  public DataFormatInvalidException(String s) {
    super(s);
  }

  public DataFormatInvalidException(String s, Throwable throwable) {
    super(s, throwable);
  }

}
