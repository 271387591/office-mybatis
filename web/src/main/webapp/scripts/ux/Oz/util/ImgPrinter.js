/**
 * Created by IntelliJ IDEA.
 * User: Swhite
 * Date: 12-5-14
 */

Ext.define("Oz.util.ImgPrinter", {

  requires:'Ext.XTemplate',

  statics:{

    appendInfoTpl:'',
    appendInfoTplData:null,

    print:function (config) {

      this.win = window.open('', 'Printer');

      this.win.document.body.innerHTML = "";

      this.win.document.writeln(this.loadingHtml());
      this.win.document.close();

      var exportTypes = {
        "image/png":1,
        "image/jpeg":1
      }

      if (config.hasOwnProperty('appendInfoTpl')) {
        this.appendInfoTpl = config['appendInfoTpl'];
      } else {
        this.appendInfoTpl = '';
      }

      if (config.hasOwnProperty('appendInfoTplData')) {
        this.appendInfoTplData = config['appendInfoTplData'];
      } else {
        this.appendInfoTplData = null;
      }

      var leftSurface;
      if (config.hasOwnProperty('leftSurface')) {
        leftSurface = config['leftSurface'];
      }

      var rightSurface;
      if (config.hasOwnProperty('rightSurface')) {
        rightSurface = config['rightSurface'];
      }

      var width;
      if (config.hasOwnProperty('width')) {
        width = config['width'];
      } else {
        width = leftSurface.width;
      }

      var height;
      if (config.hasOwnProperty('height')) {
        height = config['height'];
      } else {
        height = leftSurface.height;
      }

      var fileName;
      if (config.hasOwnProperty('fileName') && config['fileName']) {
        fileName = config['fileName'];
        fileName = fileName.replace(/[\/,:,\s]/g, '-');
      } else {
        fileName = 'Chart';
      }

      var type;
      if (config.hasOwnProperty('type') && exportTypes[config['type']]) {
        type = config['type'];
      } else {
        return false;
      }

      this.process(leftSurface, rightSurface, width, height, fileName, type);
    },

    process:function (leftSurface, rightSurface, width, height, fileName, type) {
      var me = this;
      if (rightSurface) {

        var leftSvgString = Ext.draw.engine.SvgExporter.self.generate({}, leftSurface);
        var rightSvgString = Ext.draw.engine.SvgExporter.self.generate({}, rightSurface);

        svgToImageController.TwoSVGToImagePrinter(
          fileName,
          leftSvgString,
          rightSvgString,
          type,
          width,
          height,
          {
            callback:function (result) {
              if (result.success) {
                try {
                  me.printerCallBack(result.message);
                } catch (e) {
                  console.log(e);
                }
              }
            }
          }
        )

      } else {

        var svgString = Ext.draw.engine.SvgExporter.self.generate({}, leftSurface);

        svgToImageController.SVGToImagePrinter(
          fileName,
          svgString,
          type,
          width,
          height,
          {
            callback:function (result) {
              if (result.success) {
                try {
                  me.printerCallBack(result.message);
                } catch (e) {
                  console.log(e);
                }
              }
            }
          }
        )

      }

    },

    printerCallBack:function (message) {

      var style = '@media print{#noprint{display:none;}body{margin:0px;padding:0px;} .fixedMenuBar {border: #99bce8 solid 1px;background-color: #DBE6F4;}'
      var btnPrint = '<button type="button" onclick="window.print(true);">Print</button> <button type="button" onclick="javascript:window.close();">Close</button><hr />';

      var appendInfo = '';
      if (this.appendInfoTpl && this.appendInfoTplData) {
        appendInfo = Ext.create('Ext.XTemplate', this.appendInfoTpl).apply(this.appendInfoTplData);
      }

      var htmlMarkup = [
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
        '<html>',
        '<head>',
        '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
        '<style type="text/css">',
        '{style}',
        '</style>',
        '<title>Chart Printer</title>',
        '</head>',
        '<body>',
        '<div id="noprint" >{btnPrint}</div>',
        '<div style="text-align: center;">' + appendInfo + '</div>',
        '<center><img src="{imgPath}" ></center>',
        '</body>',
        '</html>'
      ];

      var html = Ext.create('Ext.XTemplate', htmlMarkup).apply({
        style:style,
        btnPrint:btnPrint,
        basePath:basePath,
        imgPath:basePath + message
      })

//      var left = eval(screen.width - 800) / 2;
//      var top = eval(screen.height - 500) / 2;

      win = this.win;
//      var win = window.open('', 'Printer', 'height=500, width=800, top=' + top + ', left=' + left + ',location=no, resizable=no, menubar=no, scrollbars=no,toolbars=no');

      win.document.body.innerHTML = "";

      win.document.writeln(html);
      win.document.close();

      if ((this.windowObj != null) && (!win.opener))
        win.opener = this.windowObj;
      win.focus();

      win.document.body.onbeforeunload = function () {
        svgToImageController.deleteImg(message);
      }

      win.imgPath = message;

    },

    loadingHtml:function () {
      var loadingHtml = [
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
        '<html>',
        '<head>',
        '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
        '<style type="text/css">',
        '#warp {',
        'position: absolute;',
        'width:800px;',
        'height:100px;',
        'left:50%;',
        'top:50%;',
        'margin-left:-400px;',
        'margin-top:-50px;',
        '}',
        '</style>',
        '<title> Loading... </title>',
        '</head>',
        '<body>',
        '<div id="warp"><img src="' + basePath + '/scripts/flexcenter/css/images/printerLoading.gif"></div>',
        '</body>',
        '</html>'
      ];

      return Ext.create('Ext.XTemplate', loadingHtml).html;
      ;
    }

  }
});
