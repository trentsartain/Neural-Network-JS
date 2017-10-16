const uuidv4 = require('uuid/v4');
const Network = require('./Network');
const Synapse = require('./Synapse');
const Sigmoid = require('./Sigmoid');

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

const sum = (arr, transform = x => x) => arr.reduce((acc, curr) => {
    return acc + transform(curr);
}, 0);


class Neuron {
  /* optionally takes an array of Neurons */
    constructor(inputNeurons = null) {
        this.Id = uuidv4();
        this.InputSynapses = [];
        this.OutputSynapses = [];
        this.Bias = Network.GetRandom();
        this.BiasDelta = 0;
        this.Gradient = 0;
        this.Value = 0;

        if (inputNeurons != null) {
            inputNeurons.forEach(inputNeuron => {
                const synapse = new Synapse(inputNeuron, this);
                inputNeuron.OutputSynapses.Add(synapse);
                this.InputSynapses.Add(synapse);   
            });
        }
    }

    //Values & Weights
    //public virtual double CalculateValue()
    CalculateValue() {
        const inputSynapsesValueSum = sum(this.InputSynapses, synapse => synapse.Weight * synapse.InputNeuron.Value);
        this.Value = Sigmoid.Output(inputSynapsesValueSum + this.Bias);
        return this.Value;
    }

    //public double CalculateError(double target)
    CalculateError(target) {
        return target - this.Value;
    }

    //public double CalculateGradient(double? target = null)
    CalculateGradient(target = null) {
        if (target === null) {
            const outputSynapsesGradientSum = sum(this.OutputSynapses, synapse => synapse.Weight * synapse.OutputNeuron.Gradient);
            this.Gradient = outputSynapsesGradientSum * Sigmoid.Derivative(this.Value);
        } else {
            this.Gradient = this.CalculateError(target) * Sigmoid.Derivative(this.Value);
        }

        return this.Gradient;
    }

    //public void UpdateWeights(double learnRate, double momentum)
    UpdateWeights(learnRate, momentum) {
        let prevDelta = this.BiasDelta;
        this.BiasDelta = learnRate * this.Gradient;
        this.Bias += this.BiasDelta + momentum * prevDelta;

        this.InputSynapses.forEach(synapse => {
            prevDelta = synapse.WeightDelta;
            synapse.WeightDelta = learnRate * this.Gradient * synapse.InputNeuron.Value;
            synapse.Weight += synapse.WeightDelta + momentum * prevDelta;
        });
    }

}
