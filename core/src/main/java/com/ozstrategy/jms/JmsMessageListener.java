package com.ozstrategy.jms;

import org.apache.commons.lang.ObjectUtils;

/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/6/13
 * Time: 2:28 PM
 * To change this template use File | Settings | File Templates.
 */
public class JmsMessageListener {
    public void onMessage(Object message) {
        System.out.println("message==="+ ObjectUtils.toString(message));
//        Event event = Event.createDataEvent("/guoguo/myevent1");

//        event.setField("key1", "Unicast msg");

//        Dispatcher.getInstance().unicast(event, "piero"); // 向ID为piero的用户推送
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
