// TODO: JN - fix import when exists
import {Neuron} from 'Neuron';

// -- Enum --
const TrainingType = {
    'Epoch': 0,
    'MinimumError': 1
}

var Network = class Network {
    constructor(inputSize, hiddenSizes, outputSize, learnRate = null, momentum = null) {
        // error check
        if (typeof inputSize !== 'number') {
            // TODO: could also check if it's an int
            throw new Error("inputSize is not a number");
        }
        if (!Array.isArray(hiddenSizes)) {
            throw new Error("hiddenSizes is not an array");
        }
        if (typeof outputSize !== 'number') {
            // TODO: could also check if it's an int
            throw new Error("outputSize is not a number");
        }
        if (learnRate !== null && typeof learnRate !== 'number') {
            throw new Error("learnRate is not null and not a number");
        }
        if (learnRate !== null && typeof momentum !== 'number') {
            throw new Error("learnRate is not null and not a number");
        }

        // check learnRate is double
        if (arguments.length === 0) {
            this.learnRate = 0;
            this.momentum = 0;
            this.inputLayer = []; // list of Neurons
            this.hiddenLayers = []; // list of lists of Neurons
            this.outputLayer = []; // list of Neurons

        }
        else {
            this.learnRate = learnRate === null ? 0.4 : learnRate;
            this.momentum = momentum === null ? 0.9 : momentum;
            this.inputLayer = []; // list of Neurons
            this.hiddenLayers = []; // list of lists of Neurons
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
                var lastIndex = this.hiddenLayers.length - 1;
                this.outputLayer.push(new Neuron(this.hiddenLayers[lastIndex]));
            }
        }


    }

    // end constructor
}