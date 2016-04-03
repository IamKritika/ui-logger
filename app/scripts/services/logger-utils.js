'use strict';

/**
 * @ngdoc service
 * @name ui.logger.logUtils
 * @description
 * # loggerUtils
 * Service in the ui.logger.
 */
/**
 * @ngdoc method
 * @name $defaultLogger
 * @methodOf ui.logger.logUtils
 * @description
 * Used to assign an instance of $log to service object, which can be used for console logging .
 * @param {object} logger instance of logging service
 * @returns {Object} returns logger instance
 */
/**
 * @ngdoc method
 * @name isEnabled
 * @methodOf ui.logger.logUtils
 * @description
 * Checks if a particular logger level is enabled or not.
 * @param {object} logger instance of logger.
 * @param {string} type the logger level which is to checked
 * @returns {Boolean} returns true if logger level is enabled
 */
/**
 * @ngdoc method
 * @name getLogData
 * @methodOf ui.logger.logUtils
 * @description
 * Used to generate the log data corresponding to error or exceptions.
 * @param {object} logger instance of logger.
 * @param {object} exception the exception object corresponding to which log are to be generated
 * @returns {Object} returns log information object containing name,time,url,message and stackframe corresponding to exception.
 */
angular.module('ui.logger')
  .service('logUtils', function (StackTrace, $window,loggerLevels,$injector,sourceMapUtil) {
    var $defaultLogger;
    function errback(err) {
      $defaultLogger.warn("Error server-side logging failed");
      $defaultLogger.log(err.message);
    }
    function log(logger,exception) {
      var errorMessage = exception.toString();
      var eventLogDateTime = moment().format('LLL');
      var $q;
      if(!(exception instanceof Error)){
        $q=$injector.get('$q');
        return $q.resolve({
          name:logger.name,
          time:eventLogDateTime,
          url: $window.location.href,
          message: errorMessage
        });
      }else{
        $q=$injector.get('$q');

        return StackTrace.fromError(exception,StackTrace.$options).then(function(stackframes){
          var _promises=[];
          for(var a=0;a<stackframes.length;a++){
            _promises.push(sourceMapUtil.getOriginalLocation(stackframes[a]));
          }
          return $q.all(_promises).then(function(results){
            var stringifiedStack = results.map(function(sf) {
              return sf.toString();
            });//.join('\n');
            return {
              name:logger.name,
              time:eventLogDateTime,
              url: $window.location.href,
              message: errorMessage,
              stackframes: stringifiedStack
            };
          });

        }).catch(errback);
      }

    }
    function isEnabled(logger,type){
      if(logger.level){
        var loggerLevelIndex=loggerLevels.indexOf(logger.level);
        var loggerMethodIndex=loggerLevels.indexOf(type);
        if(loggerLevelIndex!==-1){
          if(loggerLevelIndex<=loggerMethodIndex){
            return true;
          }
        }
      }
      return false;
    }
    function set$defaultLogger(logger){
      if(logger){
        $defaultLogger=logger;
      }
      return $defaultLogger;
    }
    return {
      getLogData:log,
      $defaultLogger:set$defaultLogger,
      isEnabled:isEnabled
    };
  });
