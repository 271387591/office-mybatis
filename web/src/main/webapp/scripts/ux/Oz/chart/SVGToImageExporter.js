/**
 * Created by IntelliJ IDEA.
 * User: Swhite
 * Date: 12-5-10
 */
Ext.define('Oz.chart.SVGToImageExporter', {
  singleton:true,

  statics:(function () {
    var exportTypes = {
        "image/png":1,
        "image/jpeg":1
      },
      init = function (config) {

        if (config.hasOwnProperty('width')) {
          width = config['width'];
        }

        if (config.hasOwnProperty('height')) {
          height = config['height'];
        }

        if (config.hasOwnProperty('fileName') && config['fileName']) {
          fileName = config['fileName'];
        } else {
          fileName = 'Chart';
        }

        if (config.hasOwnProperty('type') && exportTypes[config['type']]) {
          type = config['type'];
        } else {
          return false;
        }

        // if all the elements were set up before
        // we don't need to reset their values and reappend them to the form
        if (formEl && svgEl && leftSvgEl && rightSvgEl && typeEl && widthEl && heightEl) {
          return true;
        }

        formEl = formEl || Ext.get(document.createElement('form'));

        svgEl = svgEl || Ext.get(document.createElement('input'));
        svgEl.set({
          name:'svg',
          type:'hidden'
        });

        leftSvgEl = leftSvgEl || Ext.get(document.createElement('input'));
        leftSvgEl.set({
          name:'leftSvg',
          type:'hidden'
        });

        rightSvgEl = rightSvgEl || Ext.get(document.createElement('input'));
        rightSvgEl.set({
          name:'rightSvg',
          type:'hidden'
        });

        typeEl = typeEl || Ext.get(document.createElement('input'));
        typeEl.set({
          name:'type',
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

        formEl.appendChild(svgEl);
        formEl.appendChild(leftSvgEl);
        formEl.appendChild(rightSvgEl);
        formEl.appendChild(typeEl);
        formEl.appendChild(fileNameEl);
        formEl.appendChild(widthEl);
        formEl.appendChild(heightEl);

        Ext.getBody().appendChild(formEl);

        return true;
      },
      process = function (leftSurface, rightSurface) {

        widthEl.set({
          value:width || leftSurface.width
        });

        heightEl.set({
          value:height || leftSurface.height
        });

        if (type) {
          typeEl.set({
            value:type
          });
        }

        if (fileName) {
          fileName = fileName.replace(/[\/,:,\s]/g, '-');
          fileNameEl.set({
            value:fileName
          });
        }

        if (rightSurface) {

          var leftSvgString = Ext.draw.engine.SvgExporter.self.generate({}, leftSurface);
          leftSvgEl.set({
            value:leftSvgString
          });

          var rightSvgString = Ext.draw.engine.SvgExporter.self.generate({}, rightSurface);
          rightSvgEl.set({
            value:rightSvgString
          });

          formEl.set({
            action:basePath+'data/SVGToImageExporter.do',
            method:'POST'
          });
        } else {

          var svgString = Ext.draw.engine.SvgExporter.self.generate({}, leftSurface);
          svgEl.set({
            value:svgString
          });

          formEl.set({
            action:basePath+'data/SVGToImage.do',
            method:'POST'
          });
        }

        formEl.dom.submit();

      },
      formEl, typeEl, svgEl, leftSvgEl, rightSvgEl, widthEl, heightEl, fileName, type, fileNameEl, width, height;

    return {
      generate:function (config, leftSurface, rightSurface) {
        if (init(config)) {
          if (leftSurface)
            process(leftSurface, rightSurface);
        } else {
          return false;
        }
      }
    };
  }())

});
