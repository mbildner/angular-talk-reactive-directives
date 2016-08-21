describe('TodoToday', function(){
    var $compile;
    var $rootScope;

    beforeEach(module('TodoToday'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _Store_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        Store = _Store_;
    }));

    describe('task', function(){
        it('shows the task title in an li', function(){
            var template = '<task task="{title: \'Buy More Milk!\'}"></task>';
            var element = $compile(template)($rootScope)[0];

            // needed for rendering tests
            $rootScope.$digest();

            expect(element.textContent.trim()).toBe('Buy More Milk!');
        });
    });

    describe('addTaskButton', function(){
        it('dispatches an addTodoButtonClicked event when clicked', function(){
            spyOn(Store, 'dispatch');
            var template = '<add-task-button><add-task-button>';

            var element = $compile(template)($rootScope)[0];
            element.click();
            expect(Store.dispatch)
                .toHaveBeenCalledWith('addTodoButtonClicked');
        });
    });
});