/**
 * Created with IntelliJ IDEA.
 * User: zhangjushuo
 * Date: 13-10-17
 * Time: 下午3:58
 * To change this template use File | Settings | File Templates.
 */
(function(){
    function k(a) {
        var d = this.editor, b = a.document, c = b.body;
        (a = b.getElementById("cke_actscrpt")) && a.parentNode.removeChild(a);
        (a = b.getElementById("cke_shimscrpt")) && a.parentNode.removeChild(a);
        CKEDITOR.env.gecko && (c.contentEditable = !1, 2E4 > CKEDITOR.env.version && (c.innerHTML = c.innerHTML.replace(/^.*<\!-- cke-content-start --\>/, ""), setTimeout(function () {
            var a = new CKEDITOR.dom.range(new CKEDITOR.dom.document(b));
            a.setStart(new CKEDITOR.dom.node(c), 0);
            d.getSelection().selectRanges([a])
        }, 0)));
        c.contentEditable = !0;
        CKEDITOR.env.ie && (c.hideFocus = !0, c.disabled = !0, c.removeAttribute("disabled"));
        delete this._.isLoadingData;
        this.$ = c;
        b = new CKEDITOR.dom.document(b);
        this.setup();
        CKEDITOR.env.ie && (b.getDocumentElement().addClass(b.$.compatMode), d.config.enterMode != CKEDITOR.ENTER_P && b.on("selectionchange", function () {
            var a = b.getBody(), c = d.getSelection(), e = c && c.getRanges()[0];
            e && (a.getHtml().match(/^<p>&nbsp;<\/p>$/i) && e.startContainer.equals(a)) && setTimeout(function () {
                e = d.getSelection().getRanges()[0];
                if (!e.startContainer.equals("body")) {
                    a.getFirst().remove(1);
                    e.moveToElementEditEnd(a);
                    e.select()
                }
            }, 0)
        }));
        try {
            d.document.$.execCommand("2D-position", !1, !0)
        } catch (e) {
        }
        try {
            d.document.$.execCommand("enableInlineTableEditing", !1, !d.config.disableNativeTableHandles)
        } catch (g) {
        }
        if (d.config.disableObjectResizing)try {
            this.getDocument().$.execCommand("enableObjectResizing", !1, !1)
        } catch (f) {
            this.attachListener(this, CKEDITOR.env.ie ? "resizestart" : "resize", function (a) {
                a.data.preventDefault()
            })
        }
        (CKEDITOR.env.gecko || CKEDITOR.env.ie && "CSS1Compat" == d.document.$.compatMode) &&
        this.attachListener(this, "keydown", function (a) {
            var b = a.data.getKeystroke();
            if (b == 33 || b == 34)if (CKEDITOR.env.ie)setTimeout(function () {
                d.getSelection().scrollIntoView()
            }, 0); else if (d.window.$.innerHeight > this.$.offsetHeight) {
                var c = d.createRange();
                c[b == 33 ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
                c.select();
                a.data.preventDefault()
            }
        });
        CKEDITOR.env.ie && this.attachListener(b, "blur", function () {
            try {
                b.$.selection.empty()
            } catch (a) {
            }
        });
        d.document.getElementsByTag("title").getItem(0).data("cke-title",
            d.document.$.title);
        CKEDITOR.env.ie && (d.document.$.title = this._.docTitle);
        CKEDITOR.tools.setTimeout(function () {
            d.fire("contentDom");
            if (this._.isPendingFocus) {
                d.focus();
                this._.isPendingFocus = false
            }
            setTimeout(function () {
                d.fire("dataReady")
            }, 0);
            CKEDITOR.env.ie && setTimeout(function () {
                if (d.document) {
                    var a = d.document.$.body;
                    a.runtimeStyle.marginBottom = "0px";
                    a.runtimeStyle.marginBottom = ""
                }
            }, 1E3)
        }, 0, this)
    }

    function l() {
        var a = [];
        if (8 <= CKEDITOR.document.$.documentMode) {
            a.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
            var d = [], b;
            for (b in CKEDITOR.dtd.$removeEmpty)d.push("html.CSS1Compat " + b + "[contenteditable=false]");
            a.push(d.join(",") + "{display:inline-block}")
        } else CKEDITOR.env.gecko && (a.push("html{height:100% !important}"), a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}"));
        a.push("html{cursor:text;*cursor:auto}");
        a.push("img,input,textarea{cursor:default}");
        return a.join("\n")
    }

    CKEDITOR.plugins.add("wysiwygarea", {init: function (a) {
        a.config.fullPage && a.addFeature({allowedContent: "html head title; style [media,type]; body (*)[id]; meta link [*]",
            requiredContent: "body"});
        a.addMode("wysiwyg", function (d) {
            function b(b) {
                b && b.removeListener();
                a.editable(new j(a, e.$.contentWindow.document.body));
                a.setData(a.getData(1), d);
            }

            var c = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "") + "document.close();", c = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(c) + "}())" : "", e = CKEDITOR.dom.element.createFromHtml('<iframe src="' + c + '" frameBorder="0"></iframe>');
            e.setStyles({width: "100%",
                height: "100%"});
            e.addClass("cke_wysiwyg_frame cke_reset");
            var g = a.ui.space("contents");
            g.append(e);
            if (c = CKEDITOR.env.ie || CKEDITOR.env.gecko)e.on("load", b);
            var f = a.title, h = a.lang.common.editorHelp;
            f && (CKEDITOR.env.ie && (f += ", " + h), e.setAttribute("title", f));
            var f = CKEDITOR.tools.getNextId(), i = CKEDITOR.dom.element.createFromHtml('<span id="' + f + '" class="cke_voice_label">' + h + "</span>");
            g.append(i, 1);
            a.on("beforeModeUnload", function (a) {
                a.removeListener();
                i.remove()
            });
            e.setAttributes({"aria-describedby": f,
                tabIndex: a.tabIndex, allowTransparency: "true"});
            !c && b();
            CKEDITOR.env.webkit && (c = function () {
                g.setStyle("width", "100%");
                e.hide();
                e.setSize("width", g.getSize("width"));
                g.removeStyle("width");
                e.show()
            }, e.setCustomData("onResize", c), CKEDITOR.document.getWindow().on("resize", c));
            a.fire("ariaWidget", e)
        })
    }});
    var j = CKEDITOR.tools.createClass({$: function (a) {
        this.base.apply(this, arguments);
        this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function (a) {
            CKEDITOR.tools.setTimeout(k, 0, this, a)
        }, this);
        this._.docTitle =
            this.getWindow().getFrame().getAttribute("title")
    }, base: CKEDITOR.editable, proto: {setData: function (a, d) {
        var cloneA = a;
        var b = this.editor;
        if (d)this.setHtml(a), b.fire("dataReady"); else {
            this._.isLoadingData = !0;
            b._.dataStore = {id: 1};
            var c = b.config, e = c.fullPage, g = c.docType, f = CKEDITOR.tools.buildStyleHtml(l()).replace(/<style>/, '<style data-cke-temp="1">');
            e || (f += CKEDITOR.tools.buildStyleHtml(b.config.contentsCss));
            var h = c.baseHref ? '<base href="' + c.baseHref + '" data-cke-temp="1" />' : "";
            e && (a = a.replace(/<!DOCTYPE[^>]*>/i,
                function (a) {
                    b.docType = g = a;
                    return""
                }).replace(/<\?xml\s[^\?]*\?>/i, function (a) {
                    b.xmlDeclaration = a;
                    return""
                }));
            b.dataProcessor && (a = b.dataProcessor.toHtml(a));
            e ? (/<body[\s|>]/.test(a) || (a = "<body>" + a), /<html[\s|>]/.test(a) || (a = "<html>" + a + "</html>"), /<head[\s|>]/.test(a) ? /<title[\s|>]/.test(a) || (a = a.replace(/<head[^>]*>/, "$&<title></title>")) : a = a.replace(/<html[^>]*>/, "$&<head><title></title></head>"), h && (a = a.replace(/<head>/, "$&" + h)), a = a.replace(/<\/head\s*>/, f + "$&"), a = g + a) : a = c.docType + '<html dir="' +
                c.contentsLangDirection + '" lang="' + (c.contentsLanguage || b.langCode) + '"><head><title>' + this._.docTitle + "</title>" + h + f + "</head><body" + (c.bodyId ? ' id="' + c.bodyId + '"' : "") + (c.bodyClass ? ' class="' + c.bodyClass + '"' : "") + ">" + a + "</body></html>";
            CKEDITOR.env.gecko && (a = a.replace(/<body/, '<body contenteditable="true" '), 2E4 > CKEDITOR.env.version && (a = a.replace(/<body[^>]*>/, "$&<\!-- cke-content-start --\>")));
            c = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" +
                this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "<\/script>";
            CKEDITOR.env.ie && 9 > CKEDITOR.env.version && (c += '<script id="cke_shimscrpt">(function(){var e="abbr,article,aside,audio,bdi,canvas,data,datalist,details,figcaption,figure,footer,header,hgroup,mark,meter,nav,output,progress,section,summary,time,video".split(","),i=e.length;while(i--){document.createElement(e[i])}})()<\/script>');
            a = a.replace(/(?=\s*<\/(:?head)>)/,
                c);
            this.clearCustomData();
            this.clearListeners();
            b.fire("contentDomUnload");
            var i = this.getDocument();
            try {
                i.write(a);
                var parentNode = i.$.body;
//                console.log(i);
//                console.log(i.$);
                if(parentNode != null){
                    while (parentNode.firstChild) {
                        var oldNode = parentNode.removeChild(parentNode.firstChild);
                        oldNode = null;
                    }
                    parentNode.innerHTML = cloneA;
                }else{
                    var html = i.$.childNodes[1];
                    var cloneHead = html.childNodes[0].cloneNode(true);
//                    console.log(cloneHead);
                    while (html.firstChild) {
                        var oldNode = html.removeChild(html.firstChild);
                        oldNode = null;
                    }
                    html.appendChild(cloneHead);
//                    var body = document.createElement('body');
//                    body.appendChild(cloneA);
//                    html.appendChild(body);
//                    html.innerHTML = cloneHead;
                    var body = document.createElement('body');
                    body.innerHTML = cloneA;
                    html.appendChild(body);
//                    console.log(body);
//                    console.log(i.$.childNodes[1]);
                }
            } catch (j) {
                console.log(j);
                setTimeout(function () {
                    i.write(a)
                }, 0)
            }
        }
    }, getData: function (a) {
        if (a)return this.getHtml();
        var a = this.editor, d = a.config, b = d.fullPage, c = b && a.docType, e = b && a.xmlDeclaration, g = this.getDocument(), b = b ? g.getDocumentElement().getOuterHtml() : g.getBody().getHtml();
        CKEDITOR.env.gecko && d.enterMode != CKEDITOR.ENTER_BR && (b = b.replace(/<br>(?=\s*(:?$|<\/body>))/, ""));
        a.dataProcessor && (b = a.dataProcessor.toDataFormat(b));
        e && (b = e + "\n" + b);
        c && (b = c + "\n" + b);
        return b
    }, focus: function () {
        this._.isLoadingData ? this._.isPendingFocus = !0 : j.baseProto.focus.call(this)
    }, detach: function () {
        var a = this.editor, d = a.document, b = a.window.getFrame();
        j.baseProto.detach.call(this);
        this.clearCustomData();
        d.getDocumentElement().clearCustomData();
        b.clearCustomData();
        CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
        (d = b.removeCustomData("onResize")) && d.removeListener();
        a.fire("contentDomUnload");
        b.remove()
    }}})
})();
