'use strict';


/**
 * @ngdoc service
 * @name ui.logger.StackTraceProvider
 * @description
 * The service internally uses stacktrace.js,which uses browsers' Error.stack mechanism to generate stack traces, parses them,
 * enhances them with source maps and uses Promises to return an Array of StackFrames. It basically serves as a wrapper for stacktrace.js and configures options required by the library.
 */
/**
 * @ngdoc method
 * @name SetOptions
 * @methodOf ui.logger.StackTraceProvider
 * @description
 * Configures options required by the library Stacktrace.js
 * @param {object} opts Object which contains the options to be passed to the library
 * @param {function} opts.filter  (optional) Function that takes StackFrame as argument and returns a boolean value .Only stack entries for which filter returns true are included then.Function(StackFrame => Boolean)
 * @param {Object} opts.sourceCache (optional)Used to Pre-populate source cache to avoid network requests.SourceCache object should have key 'URL' with value as source for which StackFrames are required.(String URL => String Source)
 * @param {Boolean} opts.offline (optional) Set to true to prevent all network requests (default: true)
 */
(function(){

  function Provider(){
    var self=this;
    function Service(){
      window.StackTrace.$options=self.options;
      return window.StackTrace;
    }
    this.options={
      offline:true
    };
    this.$get=Service;
  }
  function SetOptions(opts){
    angular.extend(this.options,opts);
  }
  Provider.prototype.setOptions=SetOptions;
  angular.module('ui.logger').provider('StackTrace',[Provider]);
})();

