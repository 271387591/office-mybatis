/**
 * Created by .
 * User: liaodongming
 * Date: 11-11-10
 * Time: AM10:12
 * To change this template use File | Settings | File Templates.
 */
Ext.define('FlexCenter.Constants', {

    statics: {

        USER_OA_MENU: [
            {
                id: '1',
                text: '下属工作日志',
                iconCls: 'down-diary-icon',
//                widget: 'mySubUserDiaryView',
//                widgetItemId: 'mySubUserDiaryView',
                leaf: true
            },
            {
                id: '2',
                text: '我的消息',
                iconCls: 'icon-message',
//                widget: 'messageView',
//                widgetItemId: 'messageView',
                leaf: true
            },
            {
                id: '3',
                text: '我的日志',
                iconCls: 'diary-icon',
                leaf: true
//                widget: 'diaryView',
//                widgetItemId: 'diaryView'
            },
            {
                id: '4',
                text: '个人文档',
                iconCls: 'icon-document',
//                widget: 'userDocView',
//                widgetItemId: 'userDocView',
                leaf: true
            },
//      {
//        id: '4',
//        text: '我的待办事项',
//        iconCls: 'icon-flowWait',
////        widget: 'taskView',
////        widgetItemId: 'taskView',
//        leaf: true
//      },
            {
                id: '5',
                text: '工作计划',
                iconCls: 'plan-icon',
//                widget: 'workPlanView',
//                widgetItemId: 'workPlanView',
                leaf: true
            },
            {
                id: '6',
                text: '我的附件',
                leaf: true,
                iconCls: 'icon-fileAttach'
//                widget: 'userFileView',
//                widgetItemId: 'userFileView'
            },
            {
                id: '7',
                text: '我的邮箱',
                iconCls: 'email-icon',
//                widget: 'mailView',
//                widgetItemId: 'mailView',
                leaf: true
            },
            {
                id: '8',
                text: '我的通讯录',
                iconCls: 'contact-icon',
//                widget: 'phoneView',
//                widgetItemId: 'phoneView',
                leaf: true
            },
            {
                id: '9',
                text: '新闻查看',
                iconCls: 'menu-news',
                widget: 'newsClientView',
                widgetItemId: 'newsClientView',
                leaf: true
            },
            {
                id: '10',
                text: '公告查看',
                iconCls: 'icon-announcement',
//                widget: 'noticeClientView',
//                widgetItemId: 'noticeClientView',
                leaf: true
            },
            {
                id: '11',
                text: '报表查看',
                iconCls: 'icon-report',
                leaf: true
            },
            {
                id: '12',
                text: '规章制度',
                iconCls: 'icon-regulation',
//                widget: 'regulationsView',
//                widgetItemId: 'regulationsView',
                leaf: true
            },
            {
                id: '13',
                text: '公司信息',
//                widget: 'companyInfoView',
                iconCls: 'icon-company',
//                widgetItemId: 'companyInfoView',
                leaf: true
            }
        ],
        USER_WORKFLOW_MENU: [
            {
                id: '1',
                text: '新建流程',
                widget: 'processDefinitionView',
                iconCls: 'btn-newFlow',
                widgetItemId: 'processDefinitionView',
                config: {
                    closable: true
                },
                leaf: true
            },
            {
                id: '2',
                text: '待办事项',
                iconCls: 'icon-flowWait',
                widget: 'taskView',
                widgetItemId: 'taskView',
                leaf: true
            },
            {
                id: '3',
                text: '我的申请流程',
                widget: 'applyProcessView',
                widgetItemId: 'applyProcessView',
                leaf: true
            },
            {
                id: '4',
                text: '任务追回',
                widget: 'clawBackTaskView',
                widgetItemId: 'clawBackTaskView',
                leaf: true
            },
{
                id: '5',
                text: '草稿箱',
                widget: 'processDefInstanceDraftView',
                widgetItemId: 'processDefInstanceDraftView',
                leaf: true
            }


        ],
        GLOBAL_TYPE_KEY: [
            {id: '1', key: 'Workflow', text: '流程分类', leaf: true}
//            {id: '2', key: 'News', text: '新闻分类', leaf: true},
//            {id: '3', key: 'FileAttach', text: '附件分类', leaf: true},
//            {id: '4', key: 'WorkPlan', text: '工作计划分类', leaf: true} ,
//            {id: '5', key: 'Administrative', text: '固定资产分类', leaf: true}   ,
//            {id: '6', key: 'OfficeSupplies', text: '办公用品分类', leaf: true},
//            {id: '7', key: 'Book', text: '图书分类', leaf: true}
        ],
        DICTIONARY_TYPE_KEY: [
//      {key:'Gender',name:'性别'},
            {id: '1', key: 'Degree', text: '学历', leaf: true},
            {id: '2', key: 'Major', text: '专业', leaf: true},
            {id: '3', key: 'MaritalStatus', text: '婚姻状况', leaf: true},
            {id: '4', key: 'Country', text: '国家', leaf: true},
            {id: '5', key: 'Province', text: '省份', leaf: true},
            {id: '6', key: 'City', text: '城市', leaf: true},
            {id: '7', key: 'District', text: '区/县', leaf: true},
            {id: '8', key: 'Organization', text: '组织分类', leaf: true},
            {id: '9', key: 'Political', text: '政治面貌', leaf: true},
            {id: '10', key: 'Nationality', text: '民族', leaf: true},
            {id: '11', key: 'Religion', text: '宗教', leaf: true},
            {id: '12', key: 'archStoragePeriod', text: '案卷保管期限', leaf: true},
            {id: '13', key: 'archRollOpenType', text: '案卷开放形式', leaf: true},
            {id: '14', key: 'fileStoragePeriod', text: '文件保管期限', leaf: true},
            {id: '15', key: 'fileOpenType', text: '文件开放形式', leaf: true},
            {id: '16', key: 'fileSecretLevel', text: '文件密级', leaf: true},
            {id: '17', key: 'archFondOpenType', text: '全宗开放形式', leaf: true}
        ],

        ARCH_OA_MENU: [
            {
                id: '1',
                text: '全宗管理',
                iconCls: 'btn-archFond',
//                widget: 'archFondManagerView',
//                widgetItemId: 'archFondManagerView',
                leaf: true
            },
            {
                id: '2',
                text: '案卷管理',
                iconCls: 'btn-archRoll',
//                widget: 'archRollManagerView',
//                widgetItemId: 'archRollManagerView',
                leaf: true
            },
            {
                id: '3',
                text: '卷內文件管理',
                iconCls: 'btn-rollFile',
//                widget: 'archRollFileManagerView',
//                widgetItemId: 'archRollFileManagerView',
                leaf: true
            },
            {
                id: '4',
                text: '归档文件管理',
                iconCls: 'btn-tidyFile',
//                widget: 'tidyFileManagerView',
//                widgetItemId: 'tidyFileManagerView',
                leaf: true
            },
            {
                id: '5',
                text: '档案统计',
                iconCls: 'btn-archSat',
                leaf: false,
                widget: '',
                widgetItemId: '',
                expanded: true,
                children: [
                    {
                        id: '6',
                        text: '年度统计',
                        iconCls: 'btn-archYearReport',
//                        widget: 'archYearReportView',
//                        widgetItemId: 'archYearReportView',
                        leaf: true
                    },
                    {
                        id: '7',
                        text: '案卷统计',
                        iconCls: 'btn-archRollReport',
//                        widget: 'archRollReportView',
//                        widgetItemId: 'archRollReportView',
                        leaf: true
                    },
                    {
                        id: '8',
                        text: '文件统计',
                        iconCls: 'btn-archFileReport',
//                        widget: 'archRollFileReportView',
//                        widgetItemId: 'archRollFileReportView',
                        leaf: true
                    }
                ]
            }
        ]
    }
});

