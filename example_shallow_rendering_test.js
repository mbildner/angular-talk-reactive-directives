describe('TodoToday', function(){
    var $compile;
    var $rootScope;
    var Store;
    var DirectiveDefinitionService;

    beforeEach(module('TodoToday'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _Store_, _DirectiveDefinitionService_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        Store = _Store_;
        DirectiveDefinitionService = _DirectiveDefinitionService_;

        DirectiveDefinitionService.addTaskInput = {
            restrict: 'E',
            replace: true,
            template: '<div id="add_task_input_stub"></div>'
        };

        DirectiveDefinitionService.addTaskButton = {
            restrict: 'E',
            replace: true,
            template: '<div id="add_task_button_stub"></div>'
        };

        DirectiveDefinitionService.task = {
            restrict: 'E',
            replace: true,
            template: '<div id="task_stub"></div>'
        };
    }));

    describe('Shallow rendering a directive', function(){
        it('gives us a hook to stub out our directives', function(){
            var template = '<todo-today user="\'Moshe\'"></todo-today>';
            var element = $compile(template)($rootScope)[0];

            // needed for rendering tests
            $rootScope.$digest();

            expect(element.textContent.trim())
                .toBe('Hi Moshe, click The Buttons!');

            expect(element.innerHTML)
                .toContain('id="add_task_button_stub');

            expect(element.innerHTML)
                .toContain('id="add_task_input_stub');
        });
    });
});