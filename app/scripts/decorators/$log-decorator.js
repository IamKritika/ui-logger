'use strict';

/**
 * @ngdoc function
 * @name ui.logger.decorator:Log
 * @description
 * # Log
 * Decorator for the angularJS $log (service for logging). The service decorator intercepts the
 * creation of a $log service, allowing it to modify the behavior of the inbuilt service methods (log(),info(),warn(),error(),debug()).
 */
angular.module('ui.logger')
  .config(function ($provide) {
    $provide.decorator('$log', ['$delegate', 'logger','loggerLevels','logUtils', function ($delegate, logger,loggerLevels,logUtils) {

      var log={};
      logger.$setLog($delegate);
      logUtils.$defaultLogger($delegate);
      var defaultLogger=logger.getInstance();
      loggerLevels.forEach(function(level){
        log[level]=function () {
          if(logUtils.isEnabled(defaultLogger,level)) {
            defaultLogger[level].apply(defaultLogger, arguments);
          }
        };
      });
      return log;
    }]);
  });
