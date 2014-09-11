Ext.define('FlexCenter.user.model.User',{
  extend: 'Ext.data.Model',
  fields:[
    {name:'id', type:'long'},
    {name:'roleId', type:'long'},
    {name:'unitId', type:'long'},
    'unitName',
    'username',
    'roleName',
    'roleDisplayName',
    'firstName',
    'lastName',
    'password',
      'passwordAffirm',
      'mobile',
      'email',
      'fullName',
      'defaultRoleName',
      'defaultRoleDisplayName',
      'defaultRoleId',
      'gender',
    {name:'createDate',convert:function(v){
        return Ext.util.Format.date(new Date(v), 'Y-m-d H:i:s');
    }},
    {name:'enabled',type:'bool'},
    {name:'accountLocked',type:'bool'},
      'simpleRoles'
  ],
    hasMany: { model: 'FlexCenter.user.model.SimpleRole', name: 'simpleRoles' }
    

});