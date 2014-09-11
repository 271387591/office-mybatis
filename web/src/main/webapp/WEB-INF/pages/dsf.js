/**
 * Created by lihao on 8/28/14.
 */
var sdf={
    "resourceId": "canvas",
    "properties": {
        "name": "wwwwwww",
        "documentation": "",
        "process_id": "process",
        "process_author": "",
        "process_version": "",
        "process_namespace": "http://www.activiti.org/processdef",
        "executionlisteners": ""
    },
    "stencil": {
        "id": "BPMNDiagram"
    },
    "childShapes": [
        {
            "resourceId": "sid-1B225463-DD6F-476A-87FA-8E5AB9E00E8E",
            "properties": {
                "overrideid": "",
                "name": "",
                "documentation": "",
                "executionlisteners": ""
            },
            "stencil": {
                "id": "EndNoneEvent"
            },
            "childShapes": [

            ],
            "outgoing": [

            ],
            "bounds": {
                "lowerRight": {
                    "x": 360,
                    "y": 199
                },
                "upperLeft": {
                    "x": 332,
                    "y": 171
                }
            },
            "dockers": [

            ]
        },
        {
            "resourceId": "sid-25FC1CFC-9BDF-49A2-85F7-CB5994845C8F",
            "properties": {
                "overrideid": "",
                "name": "",
                "documentation": "",
                "callactivitycalledelement": "",
                "callactivityinparameters": "",
                "callactivityoutparameters": "",
                "asynchronousdefinition": "No",
                "exclusivedefinition": "Yes",
                "executionlisteners": "",
                "looptype": "None",
                "multiinstance_sequential": "Yes",
                "multiinstance_cardinality": "",
                "multiinstance_collection": "",
                "multiinstance_variable": "",
                "multiinstance_condition": "",
                "isforcompensation": "false"
            },
            "stencil": {
                "id": "CallActivity"
            },
            "childShapes": [

            ],
            "outgoing": [
                {
                    "resourceId": "sid-47C62E5E-58BA-49E1-8BF7-D17D169C79A0"
                }
            ],
            "bounds": {
                "lowerRight": {
                    "x": 147,
                    "y": 225
                },
                "upperLeft": {
                    "x": 47,
                    "y": 145
                }
            },
            "dockers": [

            ]
        },
        {
            "resourceId": "sid-47C62E5E-58BA-49E1-8BF7-D17D169C79A0",
            "properties": {
                "overrideid": "",
                "name": "",
                "documentation": "",
                "conditionsequenceflow": "",
                "defaultflow": "None",
                "conditionalflow": "None"
            },
            "stencil": {
                "id": "SequenceFlow"
            },
            "childShapes": [

            ],
            "outgoing": [
                {
                    "resourceId": "sid-1B225463-DD6F-476A-87FA-8E5AB9E00E8E"
                }
            ],
            "bounds": {
                "lowerRight": {
                    "x": 331.3828125,
                    "y": 185
                },
                "upperLeft": {
                    "x": 147.60546875,
                    "y": 185
                }
            },
            "dockers": [
                {
                    "x": 50,
                    "y": 40
                },
                {
                    "x": 14,
                    "y": 14
                }
            ],
            "target": {
                "resourceId": "sid-1B225463-DD6F-476A-87FA-8E5AB9E00E8E"
            }
        }
    ],
    "bounds": {
        "lowerRight": {
            "x": 1485,
            "y": 1050
        },
        "upperLeft": {
            "x": 0,
            "y": 0
        }
    },
    "stencilset": {
        "url": "../stencilsets/bpmn2.0/bpmn2.0.json",
        "namespace": "http://b3mn.org/stencilset/bpmn2.0#"
    },
    "ssextensions": [

    ]
}
