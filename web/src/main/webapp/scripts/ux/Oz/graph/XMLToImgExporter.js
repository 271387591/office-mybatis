/**
 * Created by IntelliJ IDEA.
 * User: Swhite
 * Date: 12-5-18
 */
Ext.define('Oz.graph.XMLToImgExporter', {
  singleton:true,
  statics:(function () {
    var init = function (config) {

        if (config.hasOwnProperty('fileName') && config['fileName']) {
          fileName = config['fileName'];
        } else {
          fileName = 'mxGraph';
        }

        // if all the elements were set up before
        // we don't need to reset their values and reappend them to the form
        if (formEl && xmlEl && fileNameEl && widthEl && heightEl) {
          return true;
        }

        formEl = formEl || Ext.get(document.createElement('form'));

        xmlEl = xmlEl || Ext.get(document.createElement('input'));
        xmlEl.set({
          name:'xml',
          type:'hidden'
        });

        fileNameEl = fileNameEl || Ext.get(document.createElement('input'));
        fileNameEl.set({
          name:'fileName',
          type:'hidden'
        });

        widthEl = widthEl || Ext.get(document.createElement('input'));
        widthEl.set({
          name:'width',
          type:'hidden'
        });

        heightEl = heightEl || Ext.get(document.createElement('input'));
        heightEl.set({
          name:'height',
          type:'hidden'
        });

        formEl.appendChild(xmlEl);
        formEl.appendChild(fileNameEl);
        formEl.appendChild(widthEl);
        formEl.appendChild(heightEl);

        formEl.set({
          action:'mxGraphExporter.do',
          method:'POST'
        });

        Ext.getBody().appendChild(formEl);

        return true;
      },
      process = function (graph) {

        if (fileName) {
          fileName = fileName.replace(/[\/,:,\s]/g, '-');
          fileNameEl.set({
            value:fileName
          });
        }

        var xmlDoc = mxUtils.createXmlDocument();
        var root = xmlDoc.createElement('output');
        xmlDoc.appendChild(root);
        var xmlCanvas = new mxXmlCanvas2D(root);
        var imgExport = new mxImageExport();
        imgExport.includeOverlays = true;
        imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);

        var bounds = graph.getGraphBounds();
        var w = Math.round(bounds.x + bounds.width + 4);
        var h = Math.round(bounds.y + bounds.height + 4);

        var xml = mxUtils.getXml(root);

        xmlEl.set({
          value:xml
        });

        widthEl.set({
          value:w
        });

        heightEl.set({
          value:h
        });

        formEl.dom.submit();

      },
      formEl, xmlEl, widthEl, heightEl, fileName, fileNameEl;

    return {
      generate:function (config,graph) {
        if (init(config)) {
          if (graph)
            process(graph);
        } else {
          return false;
        }
      }
    };
  }())

});
