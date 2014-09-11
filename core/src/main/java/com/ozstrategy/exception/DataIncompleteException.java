package com.ozstrategy.exception;

/**
 * Created by IntelliJ IDEA.
 * User: kangpan
 * Date: 29/3/12
 * Time: 10:20 AM
 * To change this template use File | Settings | File Templates.
 */
public class DataIncompleteException extends Exception{
 //~ Constructors -----------------------------------------------------------------------------------------------------

  public DataIncompleteException(){}

  public DataIncompleteException(String s) {
      super(s);
    }

    public DataIncompleteException(String s, Throwable throwable) {
      super(s, throwable);
    }

}
