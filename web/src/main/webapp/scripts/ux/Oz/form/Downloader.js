/**
 * Created by lihao on 3/17/14.
 */
/**
 * @class App.util.Downloader
 * @singleton
 *
 * @example
 * <pre>
 * App.util.Downloader.get({
 *      url: 'http://example.com/download?filename=test.txt',
 *      params: {
 *          param1: 'value1'
 *      }
 * });
 * </pre>
 *
 */
Ext.define('Oz.form.Downloader',{

    /**
     * Singleton class
     * @type {Boolean}
     */
//    extend:'Ext.Base',
    singleton: true,

    downloadFrame : null,

    downloadForm: null,

    /**
     * Get/Download from url
     * @param config
     */
    get: function (config){
        var me = this,
            body = Ext.getBody();
        config = config || {};

        /**
         * Support for String config as url
         */
        if(Ext.isString(config)){
            config = {
                url: config
            };
        }


        me.downloadFrame = body.createChild({
            tag: 'iframe',
            cls: 'x-hidden',
            id: 'app-upload-frame',
            name: 'uploadframe'
        });

        me.downloadForm = body.createChild({
            tag: 'form',
            cls: 'x-hidden',
            id: 'app-upload-form',
            target: config.target || 'app-upload-frame'
        });




        Ext.Ajax.request({
            url: config.url || '.',
            params: config.params || {},
            form: me.downloadForm,
            isUpload: true,
            scope: me,
            success: me.handleException,
            failure: me.handleException
        });
    },

    handleException: function(response,options){
        var me = this,
        result = Ext.decode(response.responseText,true);
        if(result){
            Ext.Msg.alert('Message',result['message']);
        }else{
            Ext.Msg.alert('Message',' An unknown Error occurred while downloading.');
        }
    }

});
