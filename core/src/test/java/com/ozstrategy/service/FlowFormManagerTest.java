package com.ozstrategy.service;

import com.ozstrategy.model.forms.FlowForm;
import com.ozstrategy.service.forms.FlowFormManager;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

import java.io.File;
import java.util.Date;

/**
 * Created by lihao on 8/8/14.
 */
public class FlowFormManagerTest extends BaseManagerTestCase{
    @Autowired
    FlowFormManager flowFormManager;
    @Test
    @Rollback(value = true)
    public void testSave() throws Exception{
        FlowForm flowForm=new FlowForm();
        flowForm.setName("test");
        flowForm.setDescription("1111");
        flowForm.setDisplayName("test");
        flowForm.setCreateDate(new Date());
        flowForm.setLastUpdateDate(new Date());
        String path=FlowFormManagerTest.class.getClassLoader().getResource("jsoup.txt").getPath();
        String html= FileUtils.readFileToString(new File(path));
        flowForm.setContent(html);
        flowFormManager.saveOrUpdate(flowForm);
    }
}
