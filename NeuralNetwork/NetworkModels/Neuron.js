const uuidv4 = require('uuid/v4');
const Network = require('./Network');
const Synapse = require('./Synapse');
const Sigmoid = require('./Sigmoid');
const helpers = require('../Helpers/helpers');

const {sum} = helpers;

/* 
    Neuron Class Properties: 
    public Guid Id { get; set; }
    public List<Synapse> InputSynapses { get; set; }
    public List<Synapse> OutputSynapses { get; set; }
    public double Bias { get; set; }
    public double BiasDelta { get; set; }
    public double Gradient { get; set; }
    public double Value { get; set; }
*/

class Neuron {
  /* optionally takes an array of Neurons */
    constructor(inputNeurons = null) {
        this.id = uuidv4();
        this.inputSynapses = [];
        this.outputSynapses = [];
        this.bias = Network.getRandom();
        this.biasDelta = 0;
        this.gradient = 0;
        this.value = 0;

        if (inputNeurons != null) {
            inputNeurons.forEach(inputNeuron => {
                const synapse = new Synapse(inputNeuron, this);
                inputNeuron.outputSynapses.Add(synapse);
                this.inputSynapses.Add(synapse);   
            });
        }
    }

    //Values & Weights
    //public virtual double calculateValue()
    calculateValue() {
        const inputSynapsesValueSum = sum(this.inputSynapses, synapse => synapse.weight * synapse.inputNeuron.value);
        this.value = Sigmoid.output(inputSynapsesValueSum + this.bias);
        return this.value;
    }

    //public double calculateError(double target)
    calculateError(target) {
        return target - this.value;
    }

    //public double calculateGradient(double? target = null)
    calculateGradient(target = null) {
        if (target === null) {
            const outputSynapsesGradientSum = sum(this.outputSynapses, synapse => synapse.weight * synapse.outputNeuron.gradient);
            this.gradient = outputSynapsesGradientSum * Sigmoid.derivative(this.value);
        } else {
            this.gradient = this.calculateError(target) * Sigmoid.derivative(this.value);
        }

        return this.gradient;
    }

    //public void updateWeights(double learnRate, double momentum)
    updateWeights(learnRate, momentum) {
        let prevDelta = this.biasDelta;
        this.biasDelta = learnRate * this.gradient;
        this.bias += this.biasDelta + momentum * prevDelta;

        this.inputSynapses.forEach(synapse => {
            prevDelta = synapse.weightDelta;
            synapse.weightDelta = learnRate * this.gradient * synapse.inputNeuron.value;
            synapse.weight += synapse.weightDelta + momentum * prevDelta;
        });
    }

}
