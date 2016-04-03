
# ui-logger
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Build Status](https://travis-ci.org/angular-libs/ui-logger.svg?branch=master)](https://travis-ci.org/angular-libs/ui-logger)
[![Dependency Status](https://gemnasium.com/angular-libs/ui-logger.svg)](https://gemnasium.com/angular-libs/ui-logger)
[![codecov.io](https://codecov.io/github/angular-libs/ui-logger/coverage.svg?branch=master)](https://codecov.io/github/angular-libs/ui-logger?branch=master)
<a href="https://codeclimate.com/github/angular-libs/ui-logger"><img src="https://codeclimate.com/github/angular-libs/ui-logger/badges/gpa.svg" /></a>
[![Coverage Status](https://coveralls.io/repos/angular-libs/ui-logger/badge.svg?branch=master&service=github)](https://coveralls.io/github/angular-libs/ui-logger?branch=master)
[![Bower version](https://badge.fury.io/bo/ui-logger.svg)](https://badge.fury.io/bo/ui-logger)
[![Issue Stats](http://issuestats.com/github/angular-libs/ui-logger/badge/pr?style=flat-square)](http://issuestats.com/github/angular-libs/ui-logger)
[![Issue Stats](http://issuestats.com/github/angular-libs/ui-logger/badge/issue)](http://issuestats.com/github/angular-libs/ui-logger)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/angular-libs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/a1ec55d3234241f283c9da7ff8a9a21b)](https://www.codacy.com/app/kuldeepkeshwar/ui-logger)

-![codecov.io](https://codecov.io/github/angular-libs/ui-logger/branch.svg?branch=master)

[![ReviewNinja](https://app.review.ninja/48887836/badge)](https://app.review.ninja/angular-libs/ui-logger)
[![SensioLabsInsight](https://insight.sensiolabs.com/projects/d8729aca-bb23-4d29-a543-c04a64a5976e/big.png)](https://insight.sensiolabs.com/projects/d8729aca-bb23-4d29-a543-c04a64a5976e)
## simple logger in angular js

#Installing
#### Bower
```javascript
    bower install ng-ui-logger
    <script src="bower_components/ui-logger/dist/scripts/ui-logger.js"></script>
    
    Add `ui.logger` to your list of dependencies.
    
    angular.module('test',['ui.logger'])
    
```
#### CDN

##### You can use rawgit.com's cdn url to access the files in the Bower repository. These files are hosted by MaxCDN. Just alter the version as you need.

* https://rawgit.com/angular-libs/ui-logger/master/dist/scripts/ui-logger.js
* https://rawgit.com/angular-libs/ui-logger/master/dist/scripts/ui-logger.min.js

#### Usage

`ui.logger` module can be used to obtain the log data ( logger instance name,time,url,errorMessage,stackframes) for the exceptions occurring in your angular application.The module provides multiple options to easily accomplish front-end logging for different use cases.Given below are some basic examples to get one started with using `ui.logger` module -



**(1)** First of all, Include `ui.logger` as a dependency to your module. Further wrap the code that can generate exception in a `try block`  and you can carry out the logging process in `catch block`. The module extends the functionality of `$log` service of AngularJs and helps you write the informative log data corresponding to the exception on console using `$log` service. Use `$log` methods like debug(),info(),warn(),log(),error() depending on the severity of error.

```javascript
angular.module('test',['ui.logger']).run(['$log', function testRun($log){
  try{
    throw new TypeError('error ...!!!');
  }catch(err){
    $log.debug(err);
  }
}]);
```


**(2)** `$log` service should be used only if basic logging with one global default instance of logger serves your purpose.You can create a new instance of logger using `getInstance()` method of `logger` service of `ui.logger`. If you wish to give the instance a particular name, pass the same as an argument to the `getInstance()` method. If nothing is passed as an argument , an instance with 'default' as its name is created.Once you get an instance of the logger , its logging level can be set by calling the instance's `setLevel()` method.You just need to pass the desirable logging level as an argument to the `setLevel()` method.

```javascript
angular.module('test',['ui.logger']).run(['logger', function testRun(logger){
  var logger_Instance=logger.getInstance('application_logger'); //application_logger will be set as name of the logger instance
  logger_Instance.setLevel('debug');
  try{
    throw new TypeError('error ...!!!');
  }catch(err){
   logger_Instance.debug(err);
  }
}]);
```


**(3)** If a configuration needs to be done for all the logger instances, you can use provider of `logger` service i.e `loggerProvider`. One can set the logging level for all the instance using the `setLevel()` method of `loggerProvider`. Acceptable values of logger levels are 'debug','info','warn','log','error'. All the levels above your choosen logger level are automatically enabled. Say if you set 'info' as your debug level , it will automatically enable 'info','warn','log','warn' levels and disable 'debug' level. So if try to call debug() method with your instance, you will not get any results.

```javascript
angular.module('test',['ui.logger']).config(['loggerProvider', function(loggerProvider){
  loggerProvider.setLevel('info');
}]);
angular.module('test',['ui.logger']).run(['logger', function testRun(logger){
  var logger_Instance=logger.getInstance('application_logger');
  try{
    throw new TypeError('error ...!!!');
  }catch(err){
   logger_Instance.warn(err);
   // "logger_Instance.debug(err);" using this statement will not give you any output.  
  }
}]);
```



**(4)** You can use,store or manipulate generated log data by defining a callback function which does the manipulations for you.Pass this callback function as an argument to the `setInterceptor()` method of the `loggerProvider`. This function will then get called everytime an exception occurs with the generated 'log data'.You can use this callback function to push the log data to a server. 

```javascript
angular.module('test',['ui.logger']).config(['loggerProvider', function(loggerProvider){
  loggerProvider.setLevel('info');
  loggerProvider.setInterceptor(function(data){
    console.log(data);
  });
}]);
angular.module('test',['ui.logger']).run(['logger', function testRun(logger){
 var logger_Instance=logger.getInstance();
  try{
    throw new TypeError('error ...!!!');
  }catch(err){
   logger_Instance.info(err);
  }
}]);
```


**(5)** The logger instance by default writes the log data on the console and call the callback function(if specified). If you don't want to print the log data on the console , use `disableConsoleLogging()` method of `loggerProvider`. Pass 'true' as an argument to the method 
to disable the console logging.If console logging is disabled only the callback function will be called everytime log data is generated for an exception.

```javascript
angular.module('test',['ui.logger']).config(['loggerProvider', function(loggerProvider){
  loggerProvider.setLevel('info');
  loggerProvider.setInterceptor(function(data){
    console.log(data);
  });
  loggerProvider.disableConsoleLogging(true);
}]);
angular.module('test',['ui.logger']).run(['logger', function testRun(logger){
 var logger_Instance=logger.getInstance();
  try{
    throw new TypeError('error ...!!!');
  }catch(err){
   logger_Instance.info(err);
  }
}]);
```

**(6)** You can have multiple instances of logger as well in a single angular application. Or even having a global instance for entire application and local instances for different services, controllers is also possible.

```javascript
angular.module('test',['ui.logger']).config(['loggerProvider', function(loggerProvider){
  loggerProvider.setLevel('info');
  loggerProvider.setInterceptor(function(data){
    console.log(data);
  });
  loggerProvider.disableConsoleLogging(true);
}]);
angular.module('test',['ui.logger']).run(['logger','$rootScope', function testRun(logger,$rootScope){
 $rootScope.loggerInstance=logger.getInstance('application_logger');
  try{
    throw new TypeError('error ...!!!');
  }catch(err){
   $rootScope.loggerInstance.info(err);
  }
}]);
angular.module('test',['ui.logger']) .controller('TestCtrl', function ($scope,logger,$rootScope) {
var loggerControllerInstance=logger.getInstance('controller_logger');
loggerControllerInstance.info(loggerControllerInstance=== $rootScope.loggerInstance);
try{
    throw new TypeError(' new error ...!!!');
  }catch(err){
   $rootScope.loggerInstance.info(err);
  }

});

```


[![Analytics](https://ga-beacon.appspot.com/UA-71806888-3/ui-logger/)](https://github.com/angular-libs/ui-logger)



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/angular-libs/ui-logger/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

