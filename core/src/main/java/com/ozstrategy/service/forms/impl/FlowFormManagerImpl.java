package com.ozstrategy.service.forms.impl;

import com.ozstrategy.dao.forms.FlowFormDao;
import com.ozstrategy.dao.forms.FormFieldDao;
import com.ozstrategy.model.forms.FlowForm;
import com.ozstrategy.model.forms.FormField;
import com.ozstrategy.service.forms.FlowFormManager;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Iterator;
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
    
    @Transactional
    public void saveOrUpdate(FlowForm flowForm) {
        String html=flowForm.getContent();
        if(StringUtils.isNotEmpty(html)){
            if(flowForm.getId()!=null){
                formFieldDao.deleteByFormId(flowForm.getId());
                Set<FlowForm> flowFormSet=flowForm.getChildren();
                if(flowFormSet!=null && flowFormSet.size()>0){
                    for(FlowForm child:flowFormSet){
                        formFieldDao.deleteByFormId(child.getId());
                    }
                    flowFormDao.removeChild(flowForm.getId());
                }
            }
            
            Document document = Jsoup.parse(html);
            String[] selectors={"input[xtype=textfield]",
                    "textarea[xtype=textareafield]",
                    "input[xtype=datefield]",
                    "select[xtype=combo]",
                    "boxgroup[xtype=boxgroup]",
                    "input[xtype=userselector]",
                    "input[xtype=depselector]",
                    "input[xtype=posselector]"};
            List<FormField> formFields=new ArrayList<FormField>();
            Elements tables = document.select("table[xtype=table]");
            Iterator<Element> tableIterator =  tables.iterator();
            while (tableIterator.hasNext()){
                Element table=tableIterator.next();
                
                for(String selector:selectors){
                    List<FormField> fields=parseElements(document,"table",selector,false);
                    formFields.addAll(fields);
                }
                flowFormDao.saveFlowForm(flowForm);
                if(formFields.size()>0){
                    for(FormField formField : formFields){
                        formField.setFlowForm(flowForm);
                        formFieldDao.saveFormField(formField);
                    }
                    flowForm.getFields().clear();
                    flowForm.getFields().addAll(formFields);
                }
//                flowFormDao.saveFlowForm(flowForm);
                List<FlowForm> children=new ArrayList<FlowForm>();
                Elements details = table.select("table[xtype=detailGrid]");
                Iterator<Element> iterator =  details.iterator();
                while (iterator.hasNext()){
                    Element detail=iterator.next();
                    String name=detail.attributes().get("name");
                    String displayName=detail.attributes().get("txtlabel");
                    String description=detail.attributes().get("description");
                    String content=detail.outerHtml();
                    FlowForm detailForm=detailForm=new FlowForm();
                    detailForm.setDescription(description);
                    detailForm.setContent(content);
                    detailForm.setName(name);
                    detailForm.setDisplayName(displayName);
                    detailForm.setParent(flowForm);
                    List<FormField> detailFormFields=new ArrayList<FormField>();
                    for(String selector:selectors){
                        List<FormField> detailFields=parseElements(document,name, selector,true);
                        detailFormFields.addAll(detailFields);
                    }
                    flowFormDao.saveFlowForm(detailForm);
                    if(detailFormFields.size()>0){
                        for(FormField detailFormField : detailFormFields){
                            detailFormField.setFlowForm(detailForm);
                            formFieldDao.saveFormField(detailFormField);
                        }
                        detailForm.getFields().clear();
                        detailForm.getFields().addAll(detailFormFields);
                    }
                    children.add(detailForm);
                }
                flowForm.getChildren().clear();
                flowForm.getChildren().addAll(children);
                List<FormField> childFormFields=new ArrayList<FormField>();
                if(children.size()>0){
                    for(FlowForm child : children){
                        FormField childFormField=new FormField();
                        childFormField.setName(child.getName());
                        childFormField.setLabel(child.getDisplayName());
                        childFormField.setFlowForm(flowForm);
                        childFormField.setHtml(child.getContent());
                        childFormField.setXtype(FormField.detailGrid);
                        formFieldDao.saveFormField(childFormField);
                        childFormFields.add(childFormField);
                    }
                }
                if(childFormFields.size()>0){
                    flowForm.getFields().addAll(childFormFields);
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

    private void remove(Long id) {
        FlowForm flowForm = flowFormDao.getFlowFormById(id);
        if(flowForm!=null){
            flowForm.setEnabled(Boolean.FALSE);
            flowFormDao.updateFlowForm(flowForm);
            Set<FlowForm> children=flowForm.getChildren();
            if(children!=null && children.size()>0){
                for(FlowForm child : children){
                    child.setEnabled(Boolean.FALSE);
                    flowFormDao.updateFlowForm(child);
                }
            }
        }
    }
    @Transactional
    public void multiRemove(String[] ids) {
        for(String id : ids){
            if(NumberUtils.isNumber(id)){
                remove(Long.parseLong(id));
            }
        }
        
    }

    private List<FormField> parseElements(Document document,String table,String selector,boolean detail){
        Elements elements =  document.select("table[name="+table+"] > tbody > tr > td > "+selector);
        if(!detail){
            elements =  document.select("table[xtype="+table+"] > tbody > tr > td > "+selector);
        }
        
        Iterator<Element> iterator =  elements.iterator();
        List<FormField> formFields=new ArrayList<FormField>();
        while (iterator.hasNext()){
            Element element=iterator.next();
            FormField formField=new FormField();
            String name=element.attributes().get("name");
            String label=element.attributes().get("txtlabel");
            String xtype=element.attributes().get("xtype");
            String html=element.outerHtml();
            formField.setName(name);
            formField.setLabel(label);
            formField.setXtype(xtype);
            formField.setHtml(html);
            formFields.add(formField);
        }
        return formFields;
    }
}
