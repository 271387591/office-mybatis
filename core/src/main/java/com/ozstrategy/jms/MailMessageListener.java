package com.ozstrategy.jms;

import com.ozstrategy.service.MailEngine;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/6/13
 * Time: 2:28 PM
 * To change this template use File | Settings | File Templates.
 */
public class MailMessageListener {
    static final int TRY=3;
    @Autowired
    private MailEngine mailEngine;
    public void onMessage(Object message) {
//        try {
//            if(message instanceof MailBody){
//                MailBody body=(MailBody)message;
//                int tryTo=0;
//                while (tryTo<TRY){
//                    boolean ret = mailEngine.send(body);
//                    tryTo++;
//                    if(ret){
//                        break;
//                    }
//                }
//            }else if(message instanceof String){
//                System.out.println(message.toString());
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
    }
}
