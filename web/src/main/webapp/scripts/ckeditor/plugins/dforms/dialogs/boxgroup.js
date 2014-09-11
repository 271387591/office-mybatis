/**
 * Created by lihao on 8/6/14.
 */
CKEDITOR.dialog.add("boxgroup", function (d) {
    function h(a, b, e, d, c) {
        a = f(a);

        d = d ? d.createElement("OPTION") : document.createElement("OPTION");
        if (a && d && "option" == d.getName())CKEDITOR.env.ie ? (isNaN(parseInt(c, 10)) ? a.$.options.add(d.$) : a.$.options.add(d.$, c), d.$.innerHTML = 0 < b.length ? b : "", d.$.value = e) : (null !== c && c < a.getChildCount() ? a.getChild(0 > c ? 0 : c).insertBeforeMe(d) : a.append(d), d.setText(0 < b.length ? b : ""), d.setValue(e)); else return!1;
        return d
    }
    function s(v,d,m,n,de,t){
        d = d ? d.createElement("INPUT") : document.createElement("INPUT");
        d.setAttribute('value', v);
        d.setAttribute('name', n);
        d.setAttribute('txtlabel', t);
        m?d.setAttribute('type', 'checkbox'):d.setAttribute('type', 'radio');
        de==v?d.setAttribute('checked', 'checked'):'';
        return d;
    }
    function p(a,t,v,d,m,n,de){
        a=f(a);
        var i=s(v,d,m,n,de,t);
        var x=d ? d.createElement("span") : document.createElement("span");
        x.setText(t);
        d = d ? d.createElement("span") : document.createElement("span");
        d.append(i);
        d.append(x);
        a.append(d);
    }

    function m(a) {
        for (var a = f(a), b = g(a), e = a.getChildren().count() - 1; 0 <=
            e; e--)a.getChild(e).$.selected && a.getChild(e).remove();
        i(a, b)
    }

    function n(a, b, e, d) {
        a = f(a);
        if (0 > b)return!1;
        a = a.getChild(b);
        a.setText(e);
        a.setValue(d);
        return a
    }

    function k(a) {
        for (a = f(a); a.getChild(0) && a.getChild(0).remove(););
    }

    function j(a, b, e) {
        var a = f(a), d = g(a);
        if (0 > d)return!1;
        b = d + b;
        b = 0 > b ? 0 : b;
        b = b >= a.getChildCount() ? a.getChildCount() - 1 : b;
        if (d == b)return!1;
        var d = a.getChild(d), c = d.getText(), o = d.getValue();
        d.remove();
        d = h(a, c, o, !e ? null : e, b);
        i(a, b);
        return d
    }

    function g(a) {
        return(a = f(a)) ? a.$.selectedIndex : -1
    }

    function i(a, b) {
        a = f(a);
        if (0 > b)return null;
        var e = a.getChildren().count();
        a.$.selectedIndex = b >= e ? e - 1 : b;
        return a
    }

    function l(a) {
        return(a = f(a)) ? a.getChildren() : !1
    }

    function f(a) {
        return a && a.domId && a.getInputElement().$ ? a.getInputElement() : a && a.$ ? a : !1
    }

    return {
        title: d.lang.dforms.boxgroup.checkboxTitle,
        minWidth: 350,
        minHeight: 140,
        onShow: function () {
            delete this.selectBox;
            this.setupContent("clear");
            var a = this.getParentEditor().getSelection().getSelectedElement();
            if (a && "boxgroup" == a.getName()) {
                this.selectBox =
                    a;
                this.setupContent(a.getName(), a);
                for (var a = l(a), b = 0; b < a.count(); b++)this.setupContent("option", a.getItem(b))
            }
        },
        onOk: function () {
            var a = this.getParentEditor(), b = this.selectBox, e = !b;
            e && (b = a.document.createElement("boxgroup"));
            b.setAttribute('xtype','boxgroup');
            this.commitContent(b);
            if (e && (a.insertElement(b), CKEDITOR.env.ie)) {
                var d = a.getSelection(), c = d.createBookmarks();
                setTimeout(function () {
                    d.selectBookmarks(c)
                }, 0)
            }
        },
        contents: [
            {
                id: "info",
                label: d.lang.dforms.boxgroup.checkboxTitle,
                title: d.lang.dforms.boxgroup.checkboxTitle,
                startupFocus: "txtName",
                elements: [
                    {
                        type: 'hbox',
                        widths: [ '50%', '50%' ],
                        children: [
                            {
                                id: "txtName",
                                type: "text",
                                label: d.lang.common.name, "default": "",
                                accessKey: "N",
                                validate: CKEDITOR.dialog.validate.notEmpty('下拉框名称不能为空'),
                                setup: function (a, b) {
                                    "clear" == a ? this.setValue(this["default"] || "") : "select" == a && this.setValue(b.data("cke-saved-name") || b.getAttribute("name") || "")
                                },
                                commit: function (a) {
//                                a = a.element;
//                                a.setAttribute('name', this.getValue());

                                    this.getValue() ? a.data("cke-saved-name", this.getValue()) : (a.data("cke-saved-name", !1), a.removeAttribute("name"))
                                }
                            },
                            {
                                id: 'txtlabel',
                                type: 'text',
                                validate: CKEDITOR.dialog.validate.notEmpty('标签名称不能为空'),
                                label: d.lang.dforms.dcommon.txtlabel,
                                'default': '',
                                accessKey: 'V',
                                setup: function (a, b) {
                                    a == 'select' && this.setValue(b.getAttribute('txtlabel') || '');
                                },
                                commit: function (data) {
                                    var element = data;
                                    element.setAttribute('txtlabel', this.getValue());
                                }
                            }
                        ]
                    },
                    {
                        id: "txtValue",
                        type: "text",
                        widths: ["25%", "75%"],
                        labelLayout: "horizontal",
                        label: d.lang.dforms.boxgroup.value,
                        style: "width:350px",
                        "default": "",
                        className: "cke_disabled",
                        onLoad: function () {
                            this.getInputElement().setAttribute("readOnly", !0)
                        },
                        setup: function (a, b) {
                            "clear" == a ? this.setValue("") : "option" == a && b.getAttribute("selected") && this.setValue(b.$.value)
                        }
                    },
                    {
                        type: "html",
                        html: "<span>" + CKEDITOR.tools.htmlEncode(d.lang.dforms.boxgroup.opAvail) + "</span>"
                    },
                    {
                        type: "hbox",
                        widths: ["115px", "115px", "100px"],
                        children: [
                            {
                                type: "vbox",
                                children: [
                                    {
                                        id: "txtOptName",
                                        type: "text",
                                        label: d.lang.dforms.boxgroup.opText,
                                        style: "width:115px",
                                        setup: function (a) {
                                            "clear" == a && this.setValue("")
                                        }
                                    },
                                    {
                                        type: "select",
                                        id: "cmbName",
                                        label: "",
                                        title: "",
                                        size: 5,
                                        style: "width:115px;height:75px",
                                        items: [],
                                        validate:CKEDITOR.dialog.validate.notEmpty('至少有一个选项值'),
                                        onChange: function () {
                                            var a = this.getDialog(), b = a.getContentElement("info", "cmbValue"), e = a.getContentElement("info", "txtOptName"), a = a.getContentElement("info", "txtOptValue"), d = g(this);
                                            i(b, d);
                                            e.setValue(this.getValue());
                                            a.setValue(b.getValue())
                                        },
                                        setup: function (a, b) {
                                            "clear" == a ? k(this) : "option" == a && h(this, b.getText(), b.getText(), this.getDialog().getParentEditor().document)
                                        },
                                        commit: function (a) {
                                            var b = this.getDialog(), e = l(this), d = l(b.getContentElement("info", "cmbValue")), c = b.getContentElement("info", "txtValue").getValue();
                                            var n= b.getContentElement('info','txtName').getValue();
                                            var m= b.getContentElement('info','chkMulti').getValue();
                                            var de= b.getContentElement('info','txtValue').getValue();
                                            k(a);
                                            for (var f = 0; f < e.count(); f++) {
                                                var t=e.getItem(f).getValue();
                                                var v=d.getItem(f).getValue();
                                                p(a,t,v,b.getParentEditor().document,m,n,de);
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                type: "vbox",
                                children: [
                                    {
                                        id: "txtOptValue",
                                        type: "text",
                                        label: d.lang.dforms.boxgroup.opValue,
                                        style: "width:115px",
                                        setup: function (a) {
                                            "clear" == a && this.setValue("")
                                        }
                                    },
                                    {
                                        type: "select",
                                        id: "cmbValue",
                                        label: "",
                                        size: 5,
                                        style: "width:115px;height:75px",
                                        items: [],
                                        onChange: function () {
                                            var a = this.getDialog(), b = a.getContentElement("info", "cmbName"), e = a.getContentElement("info", "txtOptName"), a = a.getContentElement("info", "txtOptValue"), d = g(this);
                                            i(b, d);
                                            e.setValue(b.getValue());
                                            a.setValue(this.getValue())
                                        },
                                        setup: function (a, b) {
                                            if ("clear" == a)k(this); else if ("option" ==
                                                a) {
                                                var e = b.getValue();
                                                h(this, e, e, this.getDialog().getParentEditor().document);
                                                "selected" == b.getAttribute("selected") && this.getDialog().getContentElement("info", "txtValue").setValue(e)
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                type: "vbox",
                                padding: 25,
                                children: [
                                    {
                                        type: "button",
                                        id: "btnAdd",
                                        style: "",
                                        label: d.lang.dforms.boxgroup.btnAdd,
                                        title: d.lang.dforms.boxgroup.btnAdd,
                                        style: "width:100%;",
                                        onClick: function () {
                                            var a = this.getDialog();
                                            a.getParentEditor();
                                            var b = a.getContentElement("info", "txtOptName"), e = a.getContentElement("info", "txtOptValue"), d = a.getContentElement("info",
                                                "cmbName"), c = a.getContentElement("info", "cmbValue");
                                            h(d, b.getValue(), b.getValue(), a.getParentEditor().document);
                                            h(c, e.getValue(), e.getValue(), a.getParentEditor().document);
                                            d.setValue(b.getValue());
                                            b.setValue("");
                                            e.setValue("");
                                            
                                            
                                        }
                                    },
                                    {
                                        type: "button",
                                        id: "btnModify",
                                        label: d.lang.dforms.boxgroup.btnModify,
                                        title: d.lang.dforms.boxgroup.btnModify,
                                        style: "width:100%;",
                                        onClick: function () {
                                            var a = this.getDialog(), b = a.getContentElement("info", "txtOptName"), e = a.getContentElement("info", "txtOptValue"), d = a.getContentElement("info", "cmbName"), a = a.getContentElement("info",
                                                "cmbValue"), c = g(d);
                                            0 <= c && (n(d, c, b.getValue(), b.getValue()), n(a, c, e.getValue(), e.getValue()))
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: "hbox",
                        widths: ["40%", "20%", "40%"],
                        children: [
                            {
                                type: "button",
                                id: "btnSetValue",
                                label: d.lang.dforms.boxgroup.btnSetValue,
                                title: d.lang.dforms.boxgroup.btnSetValue,
                                onClick: function () {
                                    var a = this.getDialog(), b = a.getContentElement("info", "cmbValue");
                                    a.getContentElement("info", "txtValue").setValue(b.getValue())
                                }
                            },
                            {
                                type: "button",
                                id: "btnDelete",
                                label: d.lang.dforms.boxgroup.btnDelete,
                                title: d.lang.dforms.boxgroup.btnDelete,
                                onClick: function () {
                                    var a = this.getDialog(), b = a.getContentElement("info", "cmbName"), c = a.getContentElement("info", "cmbValue"), d = a.getContentElement("info", "txtOptName"), a = a.getContentElement("info", "txtOptValue");
                                    m(b);
                                    m(c);
                                    d.setValue("");
                                    a.setValue("")
                                }
                            },
                            {
                                id: "chkMulti",
                                type: "checkbox",
                                label: d.lang.dforms.boxgroup.chkMulti,
                                "default": "",
                                accessKey: "M",
                                value: "checked",
                                setup: function (a, b) {
                                    "select" == a && this.setValue(b.getAttribute("multiple"));
                                    CKEDITOR.env.webkit && this.getElement().getParent().setStyle("vertical-align", "middle")
                                },
                                commit: function (a) {
                                    this.getValue() ? a.setAttribute("multiple", this.getValue()) : a.removeAttribute("multiple")
                                }
                            },
                            {id: "txtisnotnull", type: "checkbox", label: d.lang.dforms.dcommon.notNull, "default": "", accessKey: "M", value: "checked", setup: function (a, b) {
                                if(a=='select'){
                                    var value=b.getAttribute( 'xvtype' );
                                    if(value=='notNull'){
                                        this.setValue(true);
                                    }
                                }
                                CKEDITOR.env.webkit && this.getElement().getParent().setStyle("vertical-align", "middle")
                            }, commit: function (element) {
                                var value = this.getValue();
                                if ( value )
                                    element.setAttribute( 'xvtype','notNull');
                                else
                                    element.setAttribute( 'xvtype','notVal');
                            }}
                        ]
                    }
                ]
            }
        ]
    }
});
