describe('Testing the cc-select-box directive with null value support', function() {
    var $scope,
        vm,
        $element,
        element,
        select,
        valueElement,
        pleaseChooseElement;

    beforeEach(module('sdk.directives.ccSelectBox'));

    beforeEach(inject(function($rootScope, $compile) {
        $scope = $rootScope.$new();

        vm = $scope.vm = {};

        vm.data =   [
                        'test',
                        'foo'
                    ];

        vm.selectedValue = null;
        vm.chooseText = 'choose';
        vm.propertyName = 'test property';

        $element = angular.element(
            '<div>' +
                '<cc-select-box' +
                    ' ng-model="vm.selectedValue" ' +
                    ' choose-text="vm.chooseText" ' +
                    ' property-name="vm.propertyName" ' +
                    ' data="vm.data"> ' +
                ' </cc-select-box> ' +
            '</div>');

        $compile($element)($scope);
        $scope.$digest();

        element = $element[0];
        var displayValues = element.querySelectorAll('.cc-select-box__display-value');
        valueElement = displayValues[0];
        pleaseChooseElement = displayValues[1];
        select = element.querySelector('select');
    }));

    it('it should have the null value preselected', function() {
        expect(select.value).toBe('');
        expect(vm.selectedValue).toBe(null);
        expect(valueElement.innerHTML).toBe('');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('');
    });

    it('it should select the second according to model change', function() {
        expect(select.value).toBe('');
        expect(vm.selectedValue).toBe(null);
        expect(valueElement.innerHTML).toBe('');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('');

        $scope.$apply(function(){
            $scope.vm.selectedValue = 'foo';
        });

        expect(select.value).toBe('1');
        expect(valueElement.innerHTML).toBe('foo');
        expect(vm.selectedValue).toBe('foo');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    });

    it('it should select the null value if the selected one disappears', function() {
        $scope.$apply(function(){
            $scope.vm.selectedValue = 'test';
        });

        expect(select.value).toBe('0');
        expect(valueElement.innerHTML).toBe('test');
        expect(vm.selectedValue).toBe('test');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');

        $scope.$apply(function(){
            $scope.vm.data.splice(0,1);
        });

        expect(select.value).toBe('');
        expect(valueElement.innerHTML).toBe('');
        expect(vm.selectedValue).toBe(null);
        expect(angular.element(pleaseChooseElement).css('display')).toBe('');
    });

    it('it should update model on change', function() {
        expect(select.value).toBe('');
        expect(vm.selectedValue).toBe(null);
        expect(valueElement.innerHTML).toBe('');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('');

        select.value = '1';
        browserTrigger(select, 'change');

        expect(select.value).toBe('1');
        expect(valueElement.innerHTML).toBe('foo');
        expect(vm.selectedValue).toBe('foo');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    });
});

describe('Testing the cc-select-box directive without null value support', function() {
    var $scope,
        vm,
        $element,
        element,
        select,
        valueElement,
        pleaseChooseElement;

    beforeEach(module('sdk.directives.ccSelectBox'));

    beforeEach(inject(function($rootScope, $compile) {
        $scope = $rootScope.$new();

        vm = $scope.vm = {};

        vm.data =   [
                        'test',
                        'foo'
                    ];

        vm.selectedValue = null;
        vm.chooseText = 'choose';
        vm.propertyName = 'test property';

        $element = angular.element(
            '<div>' +
                '<cc-select-box' +
                    ' ng-model="vm.selectedValue" ' +
                    ' choose-text="vm.chooseText" ' +
                    ' property-name="vm.propertyName" ' +
                    ' omit-null ' +
                    ' data="vm.data"> ' +
                ' </cc-select-box> ' +
            '</div>');

        $compile($element)($scope);
        $scope.$digest();

        element = $element[0];
        var displayValues = element.querySelectorAll('.cc-select-box__display-value');
        valueElement = displayValues[0];
        pleaseChooseElement = displayValues[1];
        select = element.querySelector('select');
    }));

    it('it should have the first one preselected', function() {
        expect(select.value).toBe('0');
        expect(vm.selectedValue).toBe('test');
        expect(valueElement.innerHTML).toBe('test');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    });

    it('it should select the second according to model change', function() {
        expect(select.value).toBe('0');
        expect(vm.selectedValue).toBe('test');
        expect(valueElement.innerHTML).toBe('test');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');

        $scope.$apply(function(){
            $scope.vm.selectedValue = 'foo';
        });

        expect(select.value).toBe('1');
        expect(valueElement.innerHTML).toBe('foo');
        expect(vm.selectedValue).toBe('foo');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    });

    //what should happen if none exist anymore and we don't have null value support?
    it('it should select the first value if the selected one disappears', function() {
        $scope.$apply(function(){
            $scope.vm.selectedValue = 'test';
        });

        expect(select.value).toBe('0');
        expect(valueElement.innerHTML).toBe('test');
        expect(vm.selectedValue).toBe('test');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');

        $scope.$apply(function(){
            $scope.vm.data.splice(0,1);
        });

        expect(select.value).toBe('0');
        expect(valueElement.innerHTML).toBe('foo');
        expect(vm.selectedValue).toBe('foo');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    });

    it('it should update model on change', function() {
        expect(select.value).toBe('0');
        expect(vm.selectedValue).toBe('test');
        expect(valueElement.innerHTML).toBe('test');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');

        select.value = '1';
        browserTrigger(select, 'change');

        expect(select.value).toBe('1');
        expect(valueElement.innerHTML).toBe('foo');
        expect(vm.selectedValue).toBe('foo');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    });
});

describe('Testing the cc-select-box directive with complex objects and without null support', function() {
    var $scope,
        vm,
        $element,
        element,
        select,
        valueElement,
        pleaseChooseElement;

    beforeEach(module('sdk.directives.ccSelectBox'));

    beforeEach(inject(function($rootScope, $compile) {
        $scope = $rootScope.$new();

        vm = $scope.vm = {};

        vm.data =   [
                        { title: 'test' },
                        { title: 'foo' }
                    ];

        vm.selectedValue = null;
        vm.chooseText = 'choose';
        vm.propertyName = 'test property';

        $element = angular.element(
            '<div>' +
                '<cc-select-box' +
                    ' ng-model="vm.selectedValue" ' +
                    ' choose-text="vm.chooseText" ' +
                    ' property-name="vm.propertyName" ' +
                    ' omit-null ' +
                    ' display-value-exp="\'title\'" ' +
                    ' data="vm.data"> ' +
                ' </cc-select-box> ' +
            '</div>');

        $compile($element)($scope);
        $scope.$digest();

        element = $element[0];
        var displayValues = element.querySelectorAll('.cc-select-box__display-value');
        valueElement = displayValues[0];
        pleaseChooseElement = displayValues[1];
        select = element.querySelector('select');
    }));

    it('it should have the first one preselected', function() {
        expect(select.value).toBe('0');
        expect(vm.selectedValue).toBe(vm.data[0]);
        expect(valueElement.innerHTML).toBe('test');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    });

    it('it should select the second according to model change', function() {
        expect(select.value).toBe('0');
        expect(vm.selectedValue).toBe(vm.data[0]);
        expect(valueElement.innerHTML).toBe('test');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');

        $scope.$apply(function(){
            $scope.vm.selectedValue = vm.data[1];
        });

        expect(select.value).toBe('1');
        expect(vm.selectedValue).toBe(vm.data[1]);
        expect(valueElement.innerHTML).toBe('foo');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    });

    //what should happen if none exist anymore and we don't have null value support?
    it('it should select the first value if the selected one disappears', function() {
        expect(select.value).toBe('0');
        expect(valueElement.innerHTML).toBe('test');
        expect(vm.selectedValue).toBe(vm.data[0]);
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');

        $scope.$apply(function(){
            $scope.vm.data.splice(0,1);
        });

        expect(select.value).toBe('0');
        expect(valueElement.innerHTML).toBe('foo');
        expect(vm.selectedValue).toBe(vm.data[0]);
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    });


    // it('it should set itself to the first value of a new dataset if dataset is changed', function() {
    //     expect(select.value).toBe('0');
    //     expect(valueElement.innerHTML).toBe('test');
    //     expect(vm.selectedValue).toBe(vm.data[0]);
    //     expect(angular.element(pleaseChooseElement).css('display')).toBe('none');

    //     $scope.$apply(function(){
    //         $scope.vm.data = [];
    //     });

    //     $scope.$apply(function(){
    //         $scope.vm.data =    [
    //                                 { title: 'a' },
    //                                 { title: 'b' }
    //                             ];
    //     });

    //     expect(select.value).toBe('0');
    //     expect(valueElement.innerHTML).toBe('a');
    //     expect(vm.selectedValue).toBe($scope.vm.data[0]);
    //     expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    // });

    it('it should restore the selected value if the dataset is updated with equal values', function() {
        $scope.$apply(function(){
            $scope.vm.selectedValue = vm.data[1];
        });

        expect(select.value).toBe('1');
        expect(vm.selectedValue).toBe(vm.data[1]);
        expect(valueElement.innerHTML).toBe('foo');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');

        $scope.$apply(function(){
            $scope.vm.data =    [
                                    { title: 'test' },
                                    { title: 'foo' }
                                ];
        });

        expect(select.value).toBe('1');
        expect(vm.selectedValue).toBe(vm.data[1]);
        expect(valueElement.innerHTML).toBe('foo');
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    });

    it('it should update model on change', function() {
        expect(select.value).toBe('0');
        expect(valueElement.innerHTML).toBe('test');
        expect(vm.selectedValue).toBe(vm.data[0]);
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');

        select.value = '1';
        browserTrigger(select, 'change');

        expect(select.value).toBe('1');
        expect(valueElement.innerHTML).toBe('foo');
        expect(vm.selectedValue).toBe(vm.data[1]);
        expect(angular.element(pleaseChooseElement).css('display')).toBe('none');
    });
});