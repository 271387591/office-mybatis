/**
 * Created with IntelliJ IDEA.
 * User: lihao
 * Date: 9/24/13
 * Time: 1:20 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.activiti.model.ProcessDefinition',{
    extend: 'Ext.data.Model',
    fields:[
        'id',
        'name',
        'key',
        'category',
        'version',
        'deploymentId',
        'deploymentTime',
        'suspended',
        'modelId',
        'formDataId',
        'formDataKey'
    ]
});
