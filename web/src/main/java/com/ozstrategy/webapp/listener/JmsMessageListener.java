package com.ozstrategy.webapp.listener;

import com.ozstrategy.model.system.SystemMessage;
import nl.justobjects.pushlet.core.Dispatcher;
import nl.justobjects.pushlet.core.Event;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.velocity.VelocityEngineUtils;

import java.net.URLEncoder;

/**
 * Created by lihao on 11/6/14.
 */
public class JmsMessageListener {
    @Autowired
    private VelocityEngine velocityEngine;
    public void onMessage(Object message) {
        try{
            if(message instanceof SystemMessage){
                SystemMessage systemMessage=(SystemMessage)message;
                String username=systemMessage.getReceiver().getUsername();
                String html= VelocityEngineUtils.mergeTemplateIntoString(velocityEngine, "systemMessage/systemMessageTemplete.vm", "UTF-8", systemMessage.getContentMap());
                html= URLEncoder.encode(html, "UTF-8");
                Event systemEvent = Event.createDataEvent("/systemMessage?username="+username);
                systemEvent.setField(username, html);
                Dispatcher.getInstance().multicast(systemEvent);
            }
            
        }catch (Exception e){
            e.printStackTrace();
        }
        
    }
}
