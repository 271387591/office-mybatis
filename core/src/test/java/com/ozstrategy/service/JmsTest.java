package com.ozstrategy.service;

import org.apache.velocity.app.VelocityEngine;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.ui.velocity.VelocityEngineUtils;

import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.Session;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by lihao on 11/6/14.
 */
public class JmsTest extends BaseManagerTestCase {
    @Autowired
    private JmsTemplate jmsTemplate;
    @Autowired
    private Destination destination;
    @Autowired
    private Destination systemMessageDestination;
    @Autowired
    private VelocityEngine velocityEngine;
    @Test
    public void testMessage() throws Exception{
        jmsTemplate.send(destination,new MessageCreator() {
            public Message createMessage(Session session) throws JMSException {
                return session.createTextMessage("1111111");
            }
        });
        jmsTemplate.send(systemMessageDestination,new MessageCreator() {
            public Message createMessage(Session session) throws JMSException {
                session.setMessageListener(new MessageListener() {
                    public void onMessage(Message message) {
                        System.out.println("asffsdf");
                    }
                });
                return session.createTextMessage("222222");
            }
        });
        
        
    }
    @Test
    public void testVe() throws Exception{
        Map<String,Object> map=new HashMap<String, Object>();
        map.put("userFullName","sdf");
        map.put("taskName","dsd");
        map.put("starter","sd");
        map.put("startTime","sdf");
        map.put("instanceTitle","sdfdsfdsf");
        String html= VelocityEngineUtils.mergeTemplateIntoString(velocityEngine, "systemMessage/systemMessageTemplete.vm", "UTF-8", map);
        System.out.println(html);
    }
}
