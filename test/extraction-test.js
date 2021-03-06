var extraction = require('nodeunit').testCase;
var Codesurgeon = require('../lib/codesurgeon').Codesurgeon;
var vm = require('vm');

module.exports = extraction({

  setUp: function (callback) {
    callback();
  },

  tearDown: function (callback) {
    callback();
  },

  '1. Extract a method by `simple` name.': function (test) {
    var surgeon = new Codesurgeon;

    var sandbox = {};

    surgeon

      //
      // if we want to see logging information or not.
      //
      .configure({ quiet: true })

      //
      // read one, or a couple of files
      //
      .read(__dirname + '/fixture1.js')

      //
      // get one or more methods from the code that we've read in.
      //
      .extract('test5');

    vm.runInNewContext(surgeon.output, sandbox, 'sandbox.vm');
    
    test.ok(sandbox.test5(), 'The function was extracted and executed.')
    
    test.expect(1);
    test.done();
  },
  
  '2. Extract a method by dot notation.': function (test) {
    var surgeon = new Codesurgeon;

    var sandbox = {
      NODEJITSU: {}
    };

    surgeon

      //
      // if we want to see logging information or not.
      //
      .configure({ quiet: true })

      //
      // read one, or a couple of files
      //
      .read(__dirname + '/fixture1.js')

      //
      // get one or more methods from the code that we've read in.
      //
      .extract(
        'NODEJITSU.B', 
        'NODEJITSU.B.prototype.p'
      );

    vm.runInNewContext(surgeon.output, sandbox, 'sandbox.vm');

    test.ok(sandbox.NODEJITSU.B, 'The function was extracted and executed.')
    test.ok(sandbox.NODEJITSU.B.prototype.p, 'The function was extracted and executed.')

    test.expect(2);
    test.done();
  },

  '3. Extract a variable.': function (test) {
    var surgeon = new Codesurgeon;

    var sandbox = {};

    surgeon

      //
      // if we want to see logging information or not.
      //
      .configure({ quiet: true })

      //
      // read one, or a couple of files
      //
      .read(__dirname + '/fixture1.js')

      //
      // get one or more methods from the code that we've read in.
      //
      .extract('test1');

    vm.runInNewContext(surgeon.output, sandbox, 'sandbox.vm');

    test.equal(sandbox.test1, 20, 'The variable was extracted and evaluated correctly.');

    test.expect(1);
    test.done();
  },

  '4. Extract a variable from the result of reading in multiple source files.': function (test) {

    var surgeon = new Codesurgeon;
    var sandbox = {};

    surgeon
      .configure({ quiet: true })
      .read(__dirname + '/fixture1.js', __dirname + '/fixture2.js')
      .extract('test1', 'test12');

    vm.runInNewContext(surgeon.output, sandbox, 'sandbox.vm');

    test.equal(sandbox.test1, 20, 'The variable was extracted and evaluated correctly.');

    test.expect(1);
    test.done();
  },
  
  '5. Extract a variable from the result of reading in multiple source files asyncronously.': function (test) {

    var surgeon = new Codesurgeon;

    var sandbox = { // fake node environment.
      module: { exports: {} },
      exports: {}
    };

    surgeon
      .configure({ quiet: true })
      .read(__dirname + '/fixture1.js', __dirname + '/fixture2.js', function() {

        this.extract('test1', 'test12');
        
        vm.runInNewContext(this.output, sandbox, 'sandbox.vm');

        test.equal(sandbox.test1, 20, 'The variable was extracted and evaluated correctly.');
        test.equal(sandbox.test12(), 12, 'The function was extracted and evaluated correctly.');
        
        test.expect(2);
        test.done();

      })
    ;
  },
  '6. Extract-As for `simple` and dot notated items.': function (test) {

    var surgeon = new Codesurgeon;
    var sandbox = {
      exports: {}
    };

    surgeon
      .configure({ quiet: true })
      .read(__dirname + '/fixture1.js', __dirname + '/fixture2.js')
      .extract(
        'test1',
        ['test12', 'bazz12'],
        ['exports.hello', 'exports.foo']
      );

    vm.runInNewContext(surgeon.output, sandbox, 'sandbox.vm');

    test.equal(sandbox.bazz12(), 12, 'The variable was extracted and evaluated correctly.');
    test.equal(sandbox.exports.foo, 'Hello, World.', 'The variable was extracted and evaluated correctly.');

    test.expect(2);
    test.done();
  }
});

