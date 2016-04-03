'use strict';

/**
 * @ngdoc service
 * @name ui.logger.loggerLevels
 * @description
 * # loggerLevels
 * Constant in the ui.logger.
 * Used to specify various logging levels-
 *
 *
 * 1) DEBUG -	Designates fine-grained informational events that are most useful to debug an application.Should be used write a debug message.
 *
 *
 * 2) INFO	- Designates informational messages that highlight the progress of the application at coarse-grained level.Should be used write a information message.
 *
 *
 * 3) WARN	- Designates potentially harmful situations.Should be used write a warning message.
 *
 *
 * 4) LOG - Should be used write a log message.
 *
 *
 * 5) ERROR - 	Designates error events that might still allow the application to continue running.Should be used write a error message.
 */
angular.module('ui.logger')
  .constant('loggerLevels', ['debug','info','warn','log','error']);
