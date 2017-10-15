
/* Properties 
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
        this.Id = 0; /* TODO - lt: how to generate a Guid here? */
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
    CalculateValue() {
        const inputSynapsesValueSum = sum(this.InputSynapses, synapse => synapse.Weight * synapse.InputNeuron.Value);
        this.Value = Sigmoid.Output(inputSynapsesSum + this.Bias);
        return this.Value;
    }

    CalculateError(target) {
        return target - this.Value;
    }

    CalculateGradient(target = null) {
        if (target === null) {
            const outputSynapsesGradientSum = sum(this.OutputSynapses, synapse => synapse.Weight * synapse.OutputNeuron.Gradient);
            this.Gradient = outputSynapsesGradientSum * Sigmoid.Derivative(this.Value);
        } else {
            this.Gradient = this.CalculateError(target.Value) * Sigmoid.Derivative(this.Value);
        }

        return this.Gradient;
    }

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