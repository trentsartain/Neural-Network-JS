// TODO: JN - fix import when exists
var  Neuron = require('../NetworkModels/Neuron')
const helpers = require('../Helpers/helpers')

// -- Enum --
const TrainingType = {
    'Epoch': 0,
    'MinimumError': 1
}

var Network = class Network {
    // there are two constructors, one with no arguments passed in and one with 5
    constructor(inputSize, hiddenSizes, outputSize, learnRate = null, momentum = null) {
        // error check
        if (!Number.isInteger(inputSize)) {
            throw new Error("inputSize is not an integer");
        }
        if (!Array.isArray(hiddenSizes)) {
            throw new Error("hiddenSizes is not an array");
        }
        if (!Number.isInteger(outputSize)) {
            throw new Error("outputSize is not an integer");
        }
        if (learnRate !== null && typeof learnRate !== 'number') {
            throw new Error("learnRate is not null and not a number");
        }
        if (learnRate !== null && typeof momentum !== 'number') {
            throw new Error("learnRate is not null and not a number");
        }

        // constructor for 0 arguments
        if (arguments.length === 0) {
            this.learnRate = 0;
            this.momentum = 0;
            this.inputLayer = []; // list of Neurons
            this.hiddenLayers = [ [/* Neuron */ ] ]; // list of lists of Neurons
            this.outputLayer = []; // list of Neurons

        }
        // construtor with 5 arguments
        else {
            this.learnRate = learnRate === null ? 0.4 : learnRate;
            this.momentum = momentum === null ? 0.9 : momentum;
            this.inputLayer = []; // list of Neurons
            this.hiddenLayers = [ [/* Neuron */ ] ]; // list of lists of Neurons
            this.outputLayer = []; // list of Neurons

            for (var i = 0; i < inputSize; i++) {
                this.inputLayer.push(new Neuron());
            }

            var firstHiddenLayer = [];
            for (var i = 0; i < hiddenSizes[0]; i++) {
                firstHiddenLayer.push(new Neuron(this.inputLayer));
            }

            this.hiddenLayers.push(firstHiddenLayer);

            for (var i = 1; i < hiddenSizes.length; i++) {
                var hiddenLayer = []; // list of Neurons
                for (var j = 0; j < hiddenSizes[i]; j++) {
                    hiddenLayer.push(new Neuron(this.hiddenLayers[i - 1]));
                }
                this.hiddenLayers.push(hiddenLayer);
            }

            for (var i = 0; i < outputSize; i++) {
                // TODO: can we assume hiddenLayers will always have at least one element in the array?
                var lastIndex = this.hiddenLayers.length - 1;
                this.outputLayer.push(new Neuron(this.hiddenLayers[lastIndex]));
            }
        }


    }
    // end constructor

    train(dataSets, numEpochsOrMinimumError) {
        var numEpochs, minimumError;
        if (!Array.isArray(dataSets)) {
            throw new Error("dataSets is not an array");
        }
        if (typeof numEpochsOrMinimumError !== 'number') {
            throw new Error("numEpochs is not a number");
        }

        if (Number.isInteger(numEpochsOrMinimumError)) {
            numEpochs = numEpochsOrMinimumError;

            for (var i = 0; i < numEpochs; i++) {
                dataSets.forEach((dataSet) => {
                    this.forwardPropagate(dataSet.Values);
                    this.backPropagate(dataSet.Targets);
                })
            }
        }
        // else minimumError
        else {
            minimumError = numEpochsOrMinimumError;
            var error = 1.0;
            var numEpochs = 0;
            // TODO: JN - is Number.MAX_SAFE_INTEGER the JS equivalent of int.MaxValue for our purposes?
            while (error > minimumError && numEpochs < Number.MAX_SAFE_INTEGER) {
                var errors =  []; //new List<double>();
                dataSets.forEach((dataSet) => {
                    this.forwardPropagate(dataSet.values);
                    this.backPropagate(dataSet.targets);
                    errors.push(this.calculateError(dataSet.targets));
                });
                error = helpers.average(errors);
                numEpochs++;
            }
        }

    }

    forwardPropagate(...inputs) {
        var i = 0;
        this.inputLayer.forEach(a => a.value = inputs[i++]);
        this.hiddenLayers.forEach(a => a.forEach(b => b.calculateValue()));
        this.outputLayer.forEach(a => a.calculateValue());
    }

    backPropagate(...targets) {
        var i = 0;
        this.outputLayer.forEach(a => a.calculateGradient(targets[i++]));
        this.hiddenLayers.reverse();
        this.hiddenLayers.forEach(a => a.forEach(b => b.calculateGradient()));
        this.hiddenLayers.forEach(a => a.forEach(b => b.updateWeights(this.learnRate, this.momentum)));
        this.hiddenLayers.reverse();
        this.outputLayer.forEach(a => a.updateWeights(this.learnRate, this.momentum));
    }

    compute(...inputs) {
        this.forwardPropagate(inputs);
        return this.outputLayer.map(a => a.value);
    }

    calculateError(...targets) {
        var i = 0;
        return helpers.sum(this.outputLayer, a => Math.Abs(a.calculateError(targets[i++])));
    }

    // -- Helpers --
    static getRandom()
    {
        // TODO: Trent - is this going to work compared to the C# GetRandom?
        return 2 * Math.random() - 1;
    }
}

