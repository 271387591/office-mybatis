package com.ozstrategy.dao.forms;

import com.ozstrategy.model.forms.FormField;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by lihao on 8/12/14.
 */
public interface FormFieldDao{
    List<FormField> listFormFields(Map<String,Object> map,RowBounds rowBounds);
    Integer listFormFieldsCount(Map<String,Object> map);
    FormField getFormFieldByNameAndFlowFormId(@Param("name")String name, @Param("formId")Long formId);
    FormField getFormFieldById(Long id);
    void deleteByFormId(Long formId);
    void saveFormField(FormField formField);
    void updateFormField(FormField formField);
    List<FormField> getFormFieldByFormId(Long formId);
    
    void deleteChild(Long id);
    
}
