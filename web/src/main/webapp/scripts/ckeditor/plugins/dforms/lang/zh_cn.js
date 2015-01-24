//自定义表单 中文
CKEDITOR.plugins.setLang( 'dforms', 'zh_cn',
{
    checkboxAndRadio:{
        value:'值',
        opAvail: '可选项',
        opText: '选项文本',
        opValue: '选项值',
        btnAdd: '添加', 
        btnModify: '修改', 
        btnUp: '上移', 
        btnDown: '下移', 
        btnSetValue: '设为初始选定', 
        btnDelete: '删除',
        chkMulti: '允许多选'
        
    },
    boxgroup:{
        title:'单选/复选',
        value:'值',
        opAvail: '可选项',
        opText: '选项文本',
        opValue: '选项值',
        btnAdd: '添加', 
        btnModify: '修改', 
        btnUp: '上移', 
        btnDown: '下移', 
        btnSetValue: '设为初始选定', 
        btnDelete: '删除',
        chkMulti: '允许多选',
        checkboxTitle: '复选/单选框属性', 
        radioTitle: '单选按钮属性', 
        value: '选定值', 
        selected: '已勾选'
        
    },
    
	
	dcommon:{
        notVal:'无',
        validate:'验证类型',
        notNull:'不为空',
        number:'只为数字',
        email:'电子邮件',
        mobile:'手机号码',
        idCard:'身份证号',
        validateNumber:'^[0-9]{1,20}$',
        validateEmail:'\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*',
        validateMobile:'1[3|5|7|8|][0-9]{9}',
        validateIdCard:'(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)',
        validatetextlable:'标签名称不能为空',
        validatename:'文本框名称不能为空',
        validategroupbox:'至少有一个选项值',
	  txtlabel:'标签名称',
	  validateEmpty:'不能为空',
	  dTextField:'单行文本框',
	  dTextArea:'多行文本框',
	  dCheckbox:'复选框',
	  dRadio:'单选按钮',
      boxGroup:'单选/复选器',
	  userSelector:'人员选择器',
	  depSelector:'部门选择器',
	  posSelector:'岗位选择器',
	  dateField:'时间选择器',
	  dHiddenField:'隐藏域',
	  dSelect:'实体绑定',
	  ckeditor:'Ckeditor',
	  officeeditor:'Office编辑器',
	  fileattach:'附件',
	  grid:'明细表',
	  commoneditor:'意见编辑器',
	  diccombo:'数字字典',
	  colNameValidate:'必需由数字，字母，下划线组成，且下划线不能在最前或最后'
	},
	dtextfield :
	{
		datatype:'数据类型',
		typeVarchar:'字符',
		typeNumber:'数字',
		typeBigInt:'长整型',
		typeSmallInt:'短整型',
		typeDouble:'双精度浮点型',
		typeInt:'整型',
		typeFloat:'单精度浮点型',
		typeDecimal:'decimal型',
		dataformat:'验证表达式',
		txtisprimary:'主键',
		txtisnotnull:'不为空',
		dateformat:'日期格式'
	},
	dtextarea:{
		
		
	},
	userselector:{
		title:'人员选择器属性',
		issingle:'单选'
	},
	datefield:{
		title:'时间选择器属性',
		datetype:'时间格式',
		istoday:'默认当天'
	},
	depselector:{
		title:'部门选择器属性'
	},
	posselector:{
		title:'岗位选择器属性'
	},
	dselect:{
		title:'菜单/列表属性'
	},
	dhiddenfield:{
		title:'隐藏域属性'
	},
	ckeditor:{
		title:'Ckeditor属性'
	},
	officeeditor:{
		title:'OFFICE编辑器属性'
	},
	fileattach:{
		title:'附件属性'
	},
	grid:{
		title:'表单明细',
        description:'描述',
		tablename:'子表数据库表名',
		detailgrid:'明细列表（不选为明细表单）'
	},
	griddelete:{
		title:'删除明细'
	},
	commoneditor:{
		title:'意见编辑器属性'
	},
	diccombo:{
		title:'数字字典属性',
		itemName:'实体'
	}
});