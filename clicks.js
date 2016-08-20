angular.module('ClickBait', []);

angular.module('ClickBait')
.directive('clickBait', function(){
    return {
        scope: {
            clicks: '=',
            user: '='
        },
        restrict: 'E',
        replace: true,
        template: ''                                                        +
         '<div>'                                                            +
            '<h1>Hi {{ user }}, click The Buttons!</h1>'                                   +
            '<ul>'                                                          +
             '<click ng-repeat="click in clicks track by $index" click="click"></click>'    +
            '</ul>'                                                         +
            '<red-button></red-button>'                                     +
            '<blue-button></blue-button>'                                     +
         '</div>',
    };
});

angular.module('ClickBait')
.directive('click', function(){
    return {
        scope: {
            click: '='
        },
        restrict: 'E',
        replace: true,
        template: '' +
        '<li>'  +
        ' <p>{{ click.btn }}</p>'       +
        '</li>'
    };
});

angular.module('ClickBait')
.directive('redButton', function(){
    return {
        scope: {
            click: '='
        },
        restrict: 'E',
        replace: true,
        template: '' +
        '<button style="margin: 5px; background: #ff6666;">Click Me!</button>'
    };
});

angular.module('ClickBait')
.directive('blueButton', function(){
    return {
        scope: {
            click: '='
        },
        restrict: 'E',
        replace: true,
        template: '' +
        '<button style="margin: 5px; background: #668cff;">Click Me!</button>'
    };
});