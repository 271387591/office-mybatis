package com.ozstrategy.service;

import com.ozstrategy.dao.flows.ProcessDefDao;
import com.ozstrategy.dao.forms.FlowFormDao;
import com.ozstrategy.dao.forms.FormFieldDao;
import com.ozstrategy.dao.system.GlobalTypeDao;
import com.ozstrategy.model.flows.ProcessDef;
import com.ozstrategy.model.forms.FlowForm;
import com.ozstrategy.model.forms.FormField;
import com.ozstrategy.model.system.GlobalType;
import com.ozstrategy.model.userrole.Address;
import com.ozstrategy.model.userrole.Role;
import com.ozstrategy.model.userrole.User;
import com.ozstrategy.service.forms.FlowFormManager;
import com.ozstrategy.service.userrole.UserManager;
import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.session.RowBounds;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.test.annotation.Rollback;

import java.io.File;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserManagerTest extends BaseManagerTestCase {
    private Log log = LogFactory.getLog(UserManagerTest.class);
    @Autowired
    private UserManager userManager;
    @Autowired
    private FlowFormManager flowFormManager;
    @Autowired
    FlowFormDao flowFormDao;
    @Autowired
    FormFieldDao formFieldDao;
    @Autowired
    GlobalTypeDao globalTypeDao;
    @Autowired
    ProcessDefDao processDefDao;
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    
    
    
    @Test
    public void testPas() throws Exception{
        String psw="52726a2dc6e8a969d3d5c858c89da1706ac8021b603bda8d";
        String str =  passwordEncoder.encodePassword("tomcat", null);
//        psw="536c0b339345616c1b33caf454454d8b8a190d6c";
        
        System.out.println("str1==="+passwordEncoder.isPasswordValid(psw,"tomcat",null));
        System.out.println("str2==="+str);
    }

    @Test
    public void testGetUser() throws Exception {
        
        Map<String,Object> map=new HashMap<String, Object>();
//        map.put("username","admin");
        long begin = System.nanoTime();
        List<User> users1=userManager.listUsers(map, 0, 200);
        if(users1!=null && users1.size()>0){
            for(User user1 : users1){
                System.out.println(user1.getUsername());
            }
        }
        Integer count=userManager.listUsersCount(map);
        System.out.println("count=="+count);
//        long end = System.nanoTime() - begin;
//        System.out.println("count :" + end);
//        begin = System.nanoTime();
//        List<User> users2=userManager.getUsers(map);
//        if(users2!=null && users2.size()>0){
//            for(User user1 : users2){
//                System.out.println(user1.getUsername());
//            }
//        }
//        end = System.nanoTime() - begin;
//        System.out.println("count :" + end);
//        begin = System.nanoTime();
//        List<User> users3=userManager.getUsers(map);
//        if(users3!=null && users3.size()>0){
//            for(User user1 : users3){
//                System.out.println(user1.getUsername());
//            }
//        }
//        end = System.nanoTime() - begin;
//        System.out.println("count :" + end);
        
        
        
    }
    @Test
    public void testqueryUsers() throws Exception {
        Map<String,Object> map=new HashMap<String, Object>();
        map.put("catKey","Workflow");
        map.put("typeId","");
        List<ProcessDef> processDefs=processDefDao.listProcessDefs(map,RowBounds.DEFAULT);
        List<GlobalType> list = globalTypeDao.listGlobalTypes(map, RowBounds.DEFAULT);
        GlobalType globalType = globalTypeDao.getGlobalTypeById(1L);
        globalType.setDepth(2);
        globalType.setLastUpdateDate(new Date());
        globalTypeDao.update(globalType);
        List<FlowForm> flowForms = flowFormDao.listFlowForms(new HashMap<String, Object>(), RowBounds.DEFAULT);
//        
//        if(flowForms!=null && flowForms.size()>0){
//            for(FlowForm flowForm : flowForms){
//                System.out.println(flowForm.getName());
//            }
//        }
//        FlowForm flowForm=flowFormDao.getFlowFormById(23L);
//        System.out.println(flowForm.getFields().size());
        int i=0;
    }
    @Test
    public void testgetFormFieldById() throws Exception {
        FormField formField=formFieldDao.getFormFieldById(136L);
        
        List<FlowForm> flowForms = flowFormDao.listFlowForms(new HashMap<String, Object>(), RowBounds.DEFAULT);
        
        if(flowForms!=null && flowForms.size()>0){
            for(FlowForm flowForm : flowForms){
                System.out.println(flowForm.getName());
            }
        }
    }
    
    @Test
    @Rollback(value = false)
    public void testgetFormFieldByFormId() throws Exception {
       String path=UserManagerTest.class.getClassLoader().getResource("jsoup1.txt").getPath();
        String html= FileUtils.readFileToString(new File(path));
        FlowForm flowForm=new FlowForm();
        flowForm.setName("sdjflkjdslfkjdsljfl");
        flowForm.setContent(html);
        flowForm.setEnabled(true);
        flowForm.setCreateDate(new Date());
//        flowFormManager.saveOrUpdate(flowForm);
//        Document document = Jsoup.parse(html);
////        Elements elements =  document.select("table[xtype=table]").select("textarea[xtype=textareafield]").not("table[xtype=detailGrid]:has(textarea[xtype=textareafield])");
////        Elements elements =  document.select("table[xtype=detailGrid]:not(textarea[xtype=textareafield])");//.select("textarea[xtype=textareafield]").not("table[xtype=detailGrid]:has(textarea[xtype=textareafield])");
//        Elements tables= document.select("table[xtype=table]");
//        Iterator<Element> tableIterator=tables.iterator();
//        while (tableIterator.hasNext()){
//            Element table=tableIterator.next();
//            Elements elements =  table.select("table[index=1] > tbody > tr > td > textarea[xtype=textareafield]");//.select("textarea[xtype=textareafield]").not("table[xtype=detailGrid]:has(textarea[xtype=textareafield])");
//            Iterator<Element> iterator =  elements.iterator();
//            while (iterator.hasNext()){
//                Element element=iterator.next();
//                System.out.println("name=="+element.attributes().get("name"));
//                System.out.println("txtlabel=="+element.attributes().get("txtlabel"));
//                System.out.println("xtype==="+element.attributes().get("xtype"));
//                System.out.println("html=="+element.outerHtml());
//            }
//        }
    }
    
    
    @Test
    public void testgetUserById() throws Exception {
       User user=userManager.getUserById(1L);
        if(user!=null){
            System.out.println("22=" + user.getDefaultRole().getName());
        }
    }
    
    
    @Test
    @Rollback(value = false)
    public void testinsertUser() throws Exception {
        User user1=new User();
        user1.setCreateDate(new Date());
        user1.setEnabled(true);
        user1.setUsername("admin44444");
        Address address=new Address();
        address.setAddress("address");
        address.setCity("city");
        address.setCountry("Country");
        Role role=new Role();
        role.setId(-2L);
        user1.setDefaultRole(role);
        user1.setAddress(address);
        userManager.saveOrUpdate(user1);
        System.out.println(user1.getId());
//        Map<String,Object> map=new HashMap<String, Object>();
//        map.put("username","浩");
//        List<User> users=userManager.queryUsers(map,0, 2);
//        if(users!=null && users.size()>0){
//            for(User user1 : users){
//                System.out.println(user1.getUsername());
//            }
//        }
    }
    
    

    
}
