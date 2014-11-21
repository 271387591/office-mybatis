package com.ozstrategy.service.flows.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ozstrategy.dao.flows.ProcessDefInstanceDao;
import com.ozstrategy.model.flows.ProcessDefInstance;
import com.ozstrategy.model.system.SystemMessage;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.flows.TaskCreateService;
import com.ozstrategy.service.system.SystemMessageManager;
import com.ozstrategy.service.userrole.UserManager;
import org.activiti.engine.HistoryService;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.task.IdentityLink;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Service;

import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 10/24/14.
 */
@Service("taskCreateService")
public class TaskCreateServiceImpl implements TaskCreateService {
    @Autowired
    private JmsTemplate jmsTemplate;
    @Autowired
    private Destination destination;
    @Autowired
    private SystemMessageManager systemMessageManager;
    @Autowired
    private UserManager userManager;
    @Autowired
    private ProcessDefInstanceDao processDefInstanceDao;
    @Autowired
    private HistoryService historyService;
    public void notify(DelegateTask delegateTask) {
        try{
            String taskName=delegateTask.getName();

            HistoricProcessInstance instance = historyService.createHistoricProcessInstanceQuery().processInstanceId(delegateTask.getProcessInstanceId()).singleResult();
            Date startDate = instance.getStartTime();
            String startTime= DateFormatUtils.format(startDate,"yyyy-MM-dd HH:mm:ss");
            User starterUser=userManager.getUserByUsername(instance.getStartUserId());
            String starter=starterUser!=null?starterUser.getFullName():"";

            ProcessDefInstance processDefInstance = processDefInstanceDao.getProcessDefInstanceByActId(instance.getId());
            String instanceTitle=processDefInstance!=null?processDefInstance.getTitle():"";

            String assignee=delegateTask.getAssignee();
            Set<String> users=new HashSet<String>();
            if(StringUtils.isNotEmpty(assignee)){
                users.add(assignee);
            }
            Set<IdentityLink> candidates= delegateTask.getCandidates();
            if(candidates!=null && candidates.size()>0){
                for(IdentityLink link:candidates){
                    users.add(link.getUserId());
                }
            }
            if(users.size()>0){
                for(String username:users){
                    final SystemMessage message=new SystemMessage();
                    message.setCreateDate(new Date());
                    message.setLastUpdateDate(new Date());
                    User user=userManager.getUserByUsername(username);
                    message.setReceiver(user);
                    Map<String,Object> map=new HashMap<String, Object>();
                    map.put("userFullName",user.getFullName());
                    map.put("taskName",taskName);
                    map.put("starter",starter);
                    map.put("startTime",startTime);
                    map.put("instanceTitle",instanceTitle);
                    String content=new ObjectMapper().writeValueAsString(map);
                    message.setContent(content);
                    systemMessageManager.save(message);
                    jmsTemplate.send(destination,new MessageCreator() {
                        public Message createMessage(Session session) throws JMSException {
                            return session.createObjectMessage(message);
                        }
                    });
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
