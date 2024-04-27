// Parse URL parameters or use defaults
function getConfigFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        sampleInterval: parseInt(params.get('interval')) || 50,    // ms between samples
        decayFactor: parseFloat(params.get('alpha')) || 0.1,      // alpha in the exponential decay
        noiseFactor: parseFloat(params.get('noise')) || 1.0       // standard deviation of Gaussian noise
    };
}

// Update URL with current config
function updateURL(config) {
    const params = new URLSearchParams();
    params.set('interval', config.sampleInterval);
    params.set('alpha', config.decayFactor);
    params.set('noise', config.noiseFactor);
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
}

let config = getConfigFromURL();

// Box-Muller transform for generating normal random variables
function generateGaussianNoise() {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z;
}

class WeightedAverageCalculator {
    constructor(decayFactor) {
        this.alpha = decayFactor;
        this.lastTimestamp = Date.now();
        this.totalWeight = 0;
        this.weightedAverage = 0;
    }

    addValue(value, timestamp) {
        const timeDiff = (timestamp - this.lastTimestamp) / 1000; // Convert to seconds
        
        // Update total weight with decay
        this.totalWeight = this.totalWeight * Math.exp(-this.alpha * timeDiff) + 1;
        
        // Update weighted average
        this.weightedAverage = ((this.totalWeight - 1) * this.weightedAverage + value) / this.totalWeight;
        
        this.lastTimestamp = timestamp;
        return this.weightedAverage;
    }
}

// Chart and data management
class TimeSeriesVisualizer {
    constructor() {
        this.rawData = [];
        this.averagedData = [];
        this.labels = [];
        this.isRunning = false;
        this.lastCursorY = 50; // Default value in the middle
        this.calculator = new WeightedAverageCalculator(config.decayFactor);
        this.dataGenerationInterval = null;
        
        this.setupChart();
        this.setupControls();
    }

    setupChart() {
        const ctx = document.getElementById('timeSeriesChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: [{
                    label: 'Raw Values',
                    data: this.rawData,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 81, 255, 0.7)',
                    borderWidth: 0,
                    pointRadius: 4,
                    showLine: false
                }, {
                    label: 'Weighted Average',
                    data: this.averagedData,
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        type: 'linear',
                        display: true
                    },
                    y: {
                        display: true,
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    annotation: {
                        annotations: {
                            currentAverage: {
                                type: 'dotted',
                                yMin: 0,
                                yMax: 0,
                                borderColor: 'rgba(255, 0, 0, 0.7)',
                                borderWidth: 1
                            }
                        }
                    }
                }
            }
        });
    }

    setupControls() {
        // Setup configuration controls
        document.getElementById('intervalInput').value = config.sampleInterval;
        document.getElementById('alphaInput').value = config.decayFactor;
        document.getElementById('noiseInput').value = config.noiseFactor;

        document.getElementById('intervalInput').addEventListener('change', (e) => {
            config.sampleInterval = parseInt(e.target.value);
            updateURL(config);
            if (this.isRunning) {
                this.stopDataGeneration();
                this.startDataGeneration();
            }
        });

        document.getElementById('alphaInput').addEventListener('change', (e) => {
            config.decayFactor = parseFloat(e.target.value);
            updateURL(config);
            this.calculator = new WeightedAverageCalculator(config.decayFactor);
        });

        document.getElementById('noiseInput').addEventListener('change', (e) => {
            config.noiseFactor = parseFloat(e.target.value);
            updateURL(config);
        });

        // Setup start/stop controls
        document.getElementById('startButton').addEventListener('click', () => this.toggleRecording());

        // Track cursor position
        document.getElementById('chartContainer').addEventListener('mousemove', (e) => {
            const rect = e.target.getBoundingClientRect();
            this.lastCursorY = 100 * (1 - (e.clientY - rect.top) / rect.height);
        });
    }

    startDataGeneration() {
        this.dataGenerationInterval = setInterval(() => {
            this.addDataPoint(this.lastCursorY);
        }, config.sampleInterval);
    }

    stopDataGeneration() {
        if (this.dataGenerationInterval) {
            clearInterval(this.dataGenerationInterval);
            this.dataGenerationInterval = null;
        }
    }

    toggleRecording() {
        this.isRunning = !this.isRunning;
        document.getElementById('startButton').textContent = this.isRunning ? 'Pause' : 'Start';
        
        if (this.isRunning) {
            this.startDataGeneration();
        } else {
            this.stopDataGeneration();
        }
    }

    addDataPoint(value) {
        const timestamp = Date.now();
        const x = this.rawData.length;
        
        // Add noise if noiseFactor is non-zero
        const noise = config.noiseFactor * generateGaussianNoise();
        const noisyValue = value + noise;
        
        this.rawData.push({ x, y: noisyValue });
        const avgValue = this.calculator.addValue(noisyValue, timestamp);
        this.averagedData.push({ x, y: avgValue });
        
        // Update the horizontal line showing current average
        this.chart.options.plugins.annotation.annotations.currentAverage.yMin = avgValue;
        this.chart.options.plugins.annotation.annotations.currentAverage.yMax = avgValue;

        this.chart.update();
    }
}

// Initialize when the page loads
window.addEventListener('load', () => {
    window.visualizer = new TimeSeriesVisualizer();
    // Start automatically and update button text
    window.visualizer.toggleRecording();
});
