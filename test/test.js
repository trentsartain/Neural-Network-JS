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
    });
    describe('average function', function() {
        it('should correctly average numbers in an array', function() {
            assert.equal(5, helpers.average([10, 0]));
        });
    });
});
