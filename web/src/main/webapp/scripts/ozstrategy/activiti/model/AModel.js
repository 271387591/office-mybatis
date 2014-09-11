/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 8/28/13
 * Time: 10:54 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.model.AModel',{
    extend: 'Ext.data.Model',
    fields:[
         'id',
         'name',
         'key',
         'category',
         'version',
         'metaInfo',
         'deploymentId',
         'createDate',
         'diagramHtml',
        'diagramMapHtml',
        'formId',
        'formName',
        'authorityUserName',
        'authorityUserFullName',
        'authorityDeptId',
        'authorityDeptName',
        'authorityRoleId',
        'authorityRoleName'
    ]
});
