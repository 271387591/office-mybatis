package com.ozstrategy.exception;

/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 10/14/13
 * Time: 1:18 PM
 * To change this template use File | Settings | File Templates.
 */
public class OzActivitiException extends Exception {
    private String msg;
    private int type;
    public OzActivitiException(){
        type=0;
    }

    public OzActivitiException(String s) {
        super(s);
        this.msg=s;
    }
    public OzActivitiException(int type) {
        this.type=type;
    }

    public OzActivitiException(String s, Throwable throwable) {
        super(s, throwable);
        this.msg=s;
    }

    public String getMsg(String str) {
        this.msg=str;
        return msg;
    }

    public int getType() {
        return type;
    }

    private void setMsg(String msg) {
        this.msg = msg;
    }
}
