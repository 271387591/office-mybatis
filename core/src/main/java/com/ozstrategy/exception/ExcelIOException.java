package com.ozstrategy.exception;

/**
 * Created by IntelliJ IDEA.
 * User: kangpan
 * Date: 29/3/12
 * Time: 10:15 AM
 * To change this template use File | Settings | File Templates.
 */
public class ExcelIOException extends Exception{

  private static final long serialVersionUID = -7067340354881575389L;

  //~ Constructors -----------------------------------------------------------------------------------------------------

  public ExcelIOException(){}

  public ExcelIOException(String s) {
    super(s);
  }

  public ExcelIOException(String s, Throwable throwable) {
    super(s, throwable);
  }
}
