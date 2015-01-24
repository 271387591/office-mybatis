package com.ozstrategy.service.forms.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ozstrategy.dao.forms.FlowFormDao;
import com.ozstrategy.dao.forms.FormFieldDao;
import com.ozstrategy.model.forms.FlowForm;
import com.ozstrategy.model.forms.FormField;
import com.ozstrategy.service.forms.FlowFormManager;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by lihao on 8/8/14.
 */
@Service("flowFormManager")
public class FlowFormManagerImpl implements FlowFormManager {
    @Autowired
    private FlowFormDao flowFormDao;
    @Autowired
    private FormFieldDao formFieldDao;

    @Transactional(rollbackFor = Throwable.class)
    public void saveOrUpdate(FlowForm flowForm,String jsonHtml) throws Exception{
        String html=flowForm.getContent();
        if(StringUtils.isNotEmpty(html)){
            if(flowForm.getId()!=null){
                Set<FormField> formFields=flowForm.getFields();
                if(formFields!=null && formFields.size()>0){
                    for(FormField formField : formFields){
                        formFieldDao.deleteChild(formField.getId());
                    }
                }
                formFieldDao.deleteByFormId(flowForm.getId());
            }
            if(flowForm.getId()==null){
                flowFormDao.saveFlowForm(flowForm);
            }else{
                flowFormDao.updateFlowForm(flowForm);
            }
            if(StringUtils.isNotEmpty(jsonHtml)){
                ObjectMapper objectMapper=new ObjectMapper();
                try{
                    List<Map<String,Object>> fieldList = objectMapper.readValue(jsonHtml, List.class);
                    saveField(fieldList,null,flowForm);
                }catch (IOException e){
                    throw e;
                } catch (Exception e) {
                    throw e;
                }
            }
        }
    }
   

    public List<FlowForm> listAll(Map<String,Object> map) {
          return flowFormDao.listFlowForms(map, RowBounds.DEFAULT);
    }

    public List<FlowForm> listFlowForms(Map<String,Object> map, Integer start, Integer limit) {
        return flowFormDao.listFlowForms(map,new RowBounds(start,limit));
    }

    public Integer listFlowFormsCount(Map<String,Object> map) {
        return  flowFormDao.listFlowFormsCount(map);
    }

    public FlowForm getFlowFormById(Long id) {
        return flowFormDao.getFlowFormById(id);
    }

    public FlowForm getNoCascadeFlowFormById(Long id) {
        return flowFormDao.getNoCascadeFlowFormById(id);
    }

    public FlowForm getFlowFormByName(String name) {
        List<FlowForm> list = flowFormDao.getFlowFormByName(name);
        if(list!=null && list.size()>0)
            return list.get(0);
        return null;
    }
    private void deleteFlowForm(FlowForm flowForm){
        Set<FormField> formFields=flowForm.getFields();
        if(formFields!=null && formFields.size()>0){
            for(FormField formField : formFields){
                formFieldDao.deleteChild(formField.getId());
            }
        }
        formFieldDao.deleteByFormId(flowForm.getId());
        flowFormDao.deleteFlowForm(flowForm.getId());
    }
    @Transactional(rollbackFor = Throwable.class)
    public void multiRemove(String[] ids) {
        for(String id : ids){
            if(NumberUtils.isNumber(id)){
                FlowForm flowForm=flowFormDao.getFlowFormById(Long.parseLong(id));
                if(flowForm!=null){
                    deleteFlowForm(flowForm);
                }
            }
        }
    }
    @Transactional(rollbackFor = Throwable.class)
    public void publish(String[] ids) {
        for(String id : ids){
            if(NumberUtils.isNumber(id)){
                publish(Long.parseLong(id));
            }
        }
    }
    private void publish(Long id){
        flowFormDao.publish(id);
    }

    public List<FormField> getDefFormFieldByFormId(Long formId) {
        return formFieldDao.getFormFieldByFormId(formId);
    }

    public void saveField(List<Map<String,Object>> fieldList,FormField parent,FlowForm flowForm) throws Exception{
        for(Map<String,Object> map : fieldList){
            FormField formField=new FormField();
            BeanUtils.populate(formField, map);
            formField.setParent(parent);
            formField.setFlowForm(flowForm);
            formFieldDao.saveFormField(formField);
            if(map.get("children")!=null){
                List<Map<String,Object>> list=(List<Map<String,Object>>)map.get("children");
                saveField(list, formField,flowForm);
            }
        }
    }
}
