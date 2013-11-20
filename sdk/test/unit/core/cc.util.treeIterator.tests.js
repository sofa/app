test('can loop the children of categories using tree algorithms', function() {

    var categories = {
        'label': 'parent',
        'children': [{
            'label': 'child 1',
            'children': [{
                'label': 'grandchild 1'
            }, {
                'label': 'grandchild 2'
            }, {
                'label': 'grandchild 3'
            }]
        }, {
            'label': 'child 2',
            'children': [{
                'label': 'grandchild 4'
            }, {
                'label': 'grandchild 5'
            }]
        }]
    };

    var results, iterator;


    iterator = new cc.util.TreeIterator(categories, 'children');

    results = [];

    iterator.iterateChildren(function(category, parent) {
        results.push({
            category:category,
            parent:parent
        });
    });

    ok(results[0].category.label === 'parent', 'iterator matches expected output');
    ok(results[0].parent === undefined, 'iterator matches expected output');

    ok(results[1].category.label === 'child 1', 'iterator matches expected output');
    ok(results[1].parent === categories, 'iterator matches expected output');

    ok(results[2].category.label === 'grandchild 1', 'iterator matches expected output');
    ok(results[2].parent === categories.children[0], 'iterator matches expected output');

    ok(results[3].category.label === 'grandchild 2', 'iterator matches expected output');
    ok(results[3].parent === categories.children[0], 'iterator matches expected output');

    ok(results[results.length - 1].category.label === 'grandchild 5', 'iterator matches expected output');
    ok(results[results.length - 1].parent === categories.children[1], 'iterator matches expected output');

});