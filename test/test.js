var assert = require('assert');
const helpers = require('../NeuralNetwork/Helpers/helpers')

describe('Array', function() {
    describe('sum function', function() {
        it('should correctly sum numbers in an array', function() {
            assert.equal(6, helpers.sum([1,2,3]));
        });
        it('should correctly sum numbers in an array', function() {
            assert.equal(10, helpers.sum([-1,0,9, 2]));
        });
        it('should correctly sum numbers resulting from a transform func applied to the array', function() {
          assert.equal(10, helpers.sum([{a: -3}, {a: 0}, {a: 11}, {a: 2}], x => x.a));
      });
    });
    describe('average function', function() {
        it('should correctly average numbers in an array', function() {
            assert.equal(5, helpers.average([10, 0]));
        });
    });
});
