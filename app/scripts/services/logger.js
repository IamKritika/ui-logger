'use strict';

/**
 * @ngdoc service
 * @name ui.logger.logger
 * @description
 * # logger
 * Used to provide the Logger instance.
 */

/**
 * @ngdoc service
 * @name ui.logger.loggerProvider
 * @description
 * Used to do initial configuration for the logger Service.
 */

/**
 * @ngdoc method
 * @name SetLevel
 * @methodOf ui.logger.loggerProvider
 * @description
 * Used to set the logger level
 * @param {string} l name of the logging level to be configured. Acceptable values are - 'debug','info','warn','log','error'.
 */

/**
 * @ngdoc method
 * @name SetInterceptor
 * @methodOf ui.logger.loggerProvider
 * @description
 * Used to set interceptor i.e. a callback function which will be called every time log data is generated.
 * @param {function} cb callback function to be called every time log data is generated.
 */

/**
 * @ngdoc method
 * @name DisableConsoleLogging
 * @methodOf ui.logger.loggerProvider
 * @description
 * Used to disable the writing of log data on console.
 * @param {boolean} flag Used to enable or disable console logging.(default - false)
 */

/**
 * @ngdoc method
 * @name SetDefaultName
 * @methodOf ui.logger.loggerProvider
 * @description
 * Used to set the default name for the logger instance.
 * @param {String} name default name to be set for all the logger instances (default value - 'default')
 */

/**
 * @ngdoc method
 * @name getInstance
 * @methodOf ui.logger.logger
 * @description
 * Used to get logger instance.
 * @param {String} name name to be set for the logger instance(default value - 'default')

 */
/**
 * @ngdoc method
 * @name setLog
 * @methodOf ui.logger.logger
 * @description
 * Used to assign an instance of $log to service object, which can be used for console logging if required by user .
 * @param {object} $log instance of logging service.
 */



(function(){
  function SetLevel(l) {
    this.level=l;
    return this;
  }
  function SetInterceptor(cb) {
    if(angular.isFunction(cb)){
      this.callback=cb;
    }
  }
  function DisableConsoleLogging(flag) {
    this._disableConsoleLogging=!!flag;
  }
  function SetDefaultName(name) {
    this._defaultName=name;
  }

  function format() {
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
      var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
      str = str.replace(regEx, arguments[i]);
    }
    return str;
  }
  function LoggerProvider(loggerLevels) {
    this.level=loggerLevels[0] ;
    this.callback=angular.noop;
    this._disableConsoleLogging=false;
    this._defaultName='default';
    var _defaultInstance;
    var _self=this;

    function factory (logUtils) {
      var logPattern='{0}::[{1}]> {2}';
      function getInstance(name){
        if(!name){
          if(_defaultInstance){
            return _defaultInstance;
          }
          name=_self._defaultName;
        }
        var logger={
          name:name,
          level:_self.level,
          setLevel:SetLevel
        };
        for(var k=0;k<loggerLevels.length;k++){
          _resigterLoggers(logger,loggerLevels[k]);
        }
        if(name===_self._defaultName){
          _defaultInstance=logger;
        }
        return logger;
      }
      function SetLog($log){
        this.$log=$log;
      }
      function _resigterLoggers(logger,_level){
        logger[_level]=function(){
          if(logUtils.isEnabled(this,_level)){
            var args=Array.prototype.slice.call(arguments);
            args.unshift(this);
            logUtils.getLogData.apply(null, args).then(function(data){
              if(!_self._disableConsoleLogging){
                service.$log[_level](format(logPattern,data.time,data.name,(data.message+'\n'+data.stackframes)));
              }
              _self.callback.call(null,data);
            });
          }
        };
      }
      var service={
        $setLog:SetLog,
        getInstance:getInstance
      };
      return service;
    }
    // Method for instantiating
    this.$get = ['logUtils',factory];
  }

  LoggerProvider.prototype.setLevel=SetLevel;
  LoggerProvider.prototype.setInterceptor=SetInterceptor;
  LoggerProvider.prototype.disableConsoleLogging=DisableConsoleLogging;
  LoggerProvider.prototype.setDefaultName=SetDefaultName;
  angular.module('ui.logger').provider('logger',['loggerLevels',LoggerProvider]);
})();
