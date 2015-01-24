package com.ozstrategy.exception;

/**
 * Created by lihao on 9/20/14.
 */
public class OzException extends Exception {
    private String key;

    public OzException(String key) {
        super(key);
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}
