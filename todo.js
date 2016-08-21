angular.module('TodoToday', []);

angular.module('TodoToday')
.service('Store', function(){
    this.user = 'Moshe';
    this.todoTasks = [];
    this.newTaskTitle = null;

    this.dispatch = function(eventName, eventDetails){
        if (eventName === 'addTodoButtonClicked'){
            this.todoTasks = this.todoTasks.concat([
                { title: this.newTaskTitle }
            ]);
            this.newTaskTitle = null;
        }
        else if (eventName === 'todoTitleInputChanged'){
            this.newTaskTitle = eventDetails.value;
        }
        else {
            throw new Error('An event was fired that the store cannot deal with');
        }
    };
});

angular.module('TodoToday')
.directive('applicationRoot', function(Store){
    return {
        template: '<todo-today todo-tasks="todoTasks()" user="user()" new-task-title="newTaskTitle()""></todo-today>',
        link: function(scope){
            scope.user =   function(){ return Store.user; };
            scope.todoTasks = function(){ return Store.todoTasks; };
            scope.newTaskTitle = function(){ return Store.newTaskTitle; };
        }
    };
});

angular.module('TodoToday')
.directive('todoToday', function(){
    return {
        scope: {
            todoTasks: '=',
            user: '=',
            newTaskTitle: '='
        },
        restrict: 'E',
        replace: true,
        template: ''                                                        +
         '<div>'                                                            +
            '<h1>Hi {{ user }}, click The Buttons!</h1>'                    +
            '<add-task-input new-task-title="newTaskTitle" />'              +
            '<add-task-button></add-task-button>'                           +
            '<ul>'                                                          +
             '<task ng-repeat="task in todoTasks track by $index" task="task"></task>'    +
            '</ul>'                                                         +
         '</div>',
    };
});

angular.module('TodoToday')
.directive('task', function(){
    return {
        scope: {
            task: '='
        },
        restrict: 'E',
        replace: true,
        template: '' +
        '<li>'  +
        ' <p>{{ task.title }}</p>'       +
        '</li>'
    };
});

angular.module('TodoToday')
.directive('addTaskButton', function(Store){
    return {
        scope: {
            task: '='
        },
        restrict: 'E',
        replace: true,
        template: '' +
        '<button ng-click="dispatchClickEventToStore()" style="margin: 5px; background: #ff6666;">Add Task</button>',
        link: function(scope){
            scope.dispatchClickEventToStore = function(){
                Store.dispatch('addTodoButtonClicked')
            };
        }
    };
});

angular.module('TodoToday')
.directive('addTaskInput', function(Store){
    return {
        restrict: 'E',
        scope: { newTaskTitle: '=' },
        replace: true,
        template: '' +
        '<input ng-model="_newTaskTitle" ng-model-options="{getterSetter: true}"/>',
        link: function(scope){
            scope._newTaskTitle = function(proposedTitle){
                if (angular.isUndefined(proposedTitle)){
                    return scope.newTaskTitle;
                }
                else {
                    Store.dispatch('todoTitleInputChanged', { value: proposedTitle })
                }
            };
        }
    };
});

angular.module('TodoToday')
.directive('blueButton', function(Store){
    return {
        scope: {},
        restrict: 'E',
        replace: true,
        template: '' +
        '<button ng-click="dispatchClickEventToStore()" style="margin: 5px; background: #668cff;">Click Me!</button>',
        link: function(scope){
            scope.dispatchClickEventToStore = function(){
                Store.dispatch('addTodoButtonClicked');
            };
        }
    };
});