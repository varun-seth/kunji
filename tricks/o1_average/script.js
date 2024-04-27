// Parse URL parameters or use defaults
function getConfigFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    // Helper to parse numbers with defaults for invalid/missing values
    const parseNumberParam = (param, defaultValue) => {
        const value = params.get(param);
        if (value === null) return defaultValue;  // Return default if param is missing
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;  // Return default only if parsing fails
    };
    
    return {
        sampleInterval: parseNumberParam('interval', 50),    // ms between samples
        decayFactor: parseNumberParam('alpha', 0.1),      // alpha in the exponential decay
        noiseFactor: parseNumberParam('noise', 1.0),      // standard deviation of Gaussian noise
        maxPoints: parseNumberParam('maxPoints', 1000)      // maximum number of points to display
    };
}

// Update URL with current config
function updateURL(config) {
    const params = new URLSearchParams();
    params.set('interval', config.sampleInterval);
    params.set('alpha', config.decayFactor);
    params.set('noise', config.noiseFactor);
    params.set('maxPoints', config.maxPoints);
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
        this.totalPointsGenerated = 0; // Track total points ever generated
        
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
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            usePointStyle: true,
                            generateLabels: (chart) => {
                                const vis = window.visualizer;
                                if (!vis || vis.rawData.length === 0) return [];
                                
                                // Format numbers to always show 2 decimal places and pad with spaces
                                const formatNumber = (num) => num.toFixed(2).padStart(6, ' ');
                                
                                const currentY = vis.lastCursorY;
                                const weightedAvg = vis.averagedData.length > 0
                                    ? vis.averagedData[vis.averagedData.length - 1].y
                                    : currentY;
                                const error = weightedAvg - currentY;
                                
                                return [
                                    { text: `Current Y:   ${formatNumber(currentY)}`, fillStyle: 'blue', strokeStyle: 'blue' },
                                    { text: `Average:     ${formatNumber(weightedAvg)}`, fillStyle: 'red', strokeStyle: 'red' },
                                    { text: `Error:       ${formatNumber(error)}`, fillStyle: 'gray', strokeStyle: 'gray' },
                                    { text: `Weight:      ${formatNumber(vis.calculator.totalWeight)}`, fillStyle: 'black', strokeStyle: 'black' }
                                ];
                            },
                            padding: 15
                        },
                        onClick: () => {}, // Disable click handling
                    },
                    annotation: {
                        annotations: {
                            currentAverage: {
                                type: 'line',
                                yMin: 0,
                                yMax: 0,
                                borderColor: 'rgba(255, 0, 0, 0.7)',
                                borderWidth: 1
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        display: true,
                        min: 0,
                        max: config.maxPoints,
                        ticks: {
                            maxTicksLimit: 10,
                            callback: function(value) {
                                return Math.round(value);  // Ensure whole numbers
                            }
                        }
                    },
                    y: {
                        display: true,
                        min: 0,
                        max: 100
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
        document.getElementById('maxPointsInput').value = config.maxPoints;

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

        document.getElementById('maxPointsInput').addEventListener('change', (e) => {
            config.maxPoints = parseInt(e.target.value);
            updateURL(config);
            this.trimData();
            
            // Update x-axis scale when maxPoints changes
            const minX = Math.max(0, this.totalPointsGenerated - config.maxPoints);
            const maxX = this.totalPointsGenerated - 1;
            this.chart.options.scales.x.min = minX;
            this.chart.options.scales.x.max = maxX;
            // Ensure ticks stay consistent when maxPoints changes
            this.chart.options.scales.x.ticks.maxTicksLimit = 10;
            this.chart.update();
        });

        // Setup start/stop controls
        document.getElementById('startButton').addEventListener('click', () => this.toggleRecording());

        // Track cursor position
        document.getElementById('timeSeriesChart').addEventListener('mousemove', (e) => {
            const chartArea = this.chart.chartArea;
            const rect = e.target.getBoundingClientRect();
            const y = e.clientY - rect.top;
            
            // Convert to chart coordinates
            this.lastCursorY = this.chart.scales.y.getValueForPixel(y);
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

    trimData() {
        if (this.rawData.length > config.maxPoints) {
            // Remove excess points
            const excess = this.rawData.length - config.maxPoints;
            this.rawData.splice(0, excess);
            this.averagedData.splice(0, excess);
        }
    }

    addDataPoint(value) {
        const timestamp = Date.now();
        const x = this.totalPointsGenerated++;  // Use and increment total count
        
        // Add noise if noiseFactor is non-zero
        const noise = config.noiseFactor * generateGaussianNoise();
        const noisyValue = value + noise;
        
        this.rawData.push({ x, y: noisyValue });
        const avgValue = this.calculator.addValue(noisyValue, timestamp);
        this.averagedData.push({ x, y: avgValue });
        
        // Trim data if it exceeds maxPoints
        this.trimData();

        // Update x-axis scale to show the last maxPoints values
        const minX = Math.max(0, this.totalPointsGenerated - config.maxPoints);
        const maxX = this.totalPointsGenerated - 1;
        this.chart.options.scales.x.min = minX;
        this.chart.options.scales.x.max = maxX;
        
        // Update the horizontal line showing current average
        this.chart.options.plugins.annotation.annotations.currentAverage.yMin = avgValue;
        this.chart.options.plugins.annotation.annotations.currentAverage.yMax = avgValue;

        this.chart.update('none'); // Use 'none' mode for better performance
    }
}

// Initialize when the page loads
window.addEventListener('load', () => {
    window.visualizer = new TimeSeriesVisualizer();
    // Start automatically and update button text
    window.visualizer.toggleRecording();
});
