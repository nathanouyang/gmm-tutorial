// GMM Tutorial JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set Plotly config for dark theme
    const plotlyConfig = {
        responsive: true,
        displayModeBar: false
    };
    
    // Common layout settings for dark theme
    const darkThemeLayout = {
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: {
            color: '#e0e0e0'
        },
        xaxis: {
            gridcolor: '#333333',
            zerolinecolor: '#555555'
        },
        yaxis: {
            gridcolor: '#333333',
            zerolinecolor: '#555555'
        }
    };
    
    // Render math formulas using KaTeX
    renderFormulas();
    
    // Create interactive plots
    createInteractiveGMMExample();
    createComparisonPlots();
    createGMMResultPlot();
    createSoftClusteringPlot();
    
    // Create algorithm walkthrough plots
    createEMProcessPlot();
    createLikelihoodPlot();
    
    // Apply dark theme to all plots
    document.querySelectorAll('.js-plotly-plot').forEach(plot => {
        Plotly.relayout(plot, darkThemeLayout);
    });
});

// Render mathematical formulas using KaTeX
function renderFormulas() {
    // Get all formula display elements
    const formulaElements = document.querySelectorAll('.formula-display');
    
    // Render each formula
    formulaElements.forEach(element => {
        const formulaContent = element.textContent.trim();
        try {
            katex.render(formulaContent, element, { 
                displayMode: true,
                throwOnError: false
            });
        } catch (e) {
            console.error("KaTeX rendering error:", e);
            // Preserve original content if rendering fails
            element.textContent = formulaContent;
        }
    });
}

// Create interactive GMM example
function createInteractiveGMMExample() {
    const dataPlotElement = document.getElementById('interactive-data-plot');
    const emPlotElement = document.getElementById('interactive-em-plot');
    const responsibilitiesPlotElement = document.getElementById('interactive-responsibilities-plot');
    const convergencePlotElement = document.getElementById('interactive-convergence-plot');
    
    // Check if all elements exist
    if (!dataPlotElement || !emPlotElement || !responsibilitiesPlotElement || !convergencePlotElement) return;
    
    // Parameters for the simulation
    let iteration = 0;
    const maxIterations = 10;
    const logLikelihoodHistory = [];
    
    // Initial synthetic data with 3 clusters
    const cluster1 = generateGaussianCluster(80, [-2.5, -1], [[1.0, 0.3], [0.3, 0.8]]);
    const cluster2 = generateGaussianCluster(100, [2, 1.5], [[1.2, -0.5], [-0.5, 1.0]]);
    const cluster3 = generateGaussianCluster(70, [0, -2], [[0.8, 0], [0, 0.8]]);
    
    // Combine data
    const allX = cluster1.x.concat(cluster2.x, cluster3.x);
    const allY = cluster1.y.concat(cluster2.y, cluster3.y);
    const trueLabels = Array(cluster1.x.length).fill(0)
        .concat(Array(cluster2.x.length).fill(1))
        .concat(Array(cluster3.x.length).fill(2));
    
    // GMM parameters
    let weights = [0.33, 0.33, 0.34]; // Initial weights
    let means = [
        [-1.5, -0.5],  // Initial mean for cluster 1 (intentionally offset from true means)
        [1.5, 2],      // Initial mean for cluster 2
        [0.5, -1.5]    // Initial mean for cluster 3
    ];
    let covs = [
        [[1, 0], [0, 1]],  // Initial covariance for cluster 1
        [[1, 0], [0, 1]],  // Initial covariance for cluster 2
        [[1, 0], [0, 1]]   // Initial covariance for cluster 3
    ];
    
    // Calculate initial responsibilities and log-likelihood
    let responsibilities = calculateResponsibilities(allX, allY, weights, means, covs);
    let logLikelihood = calculateLogLikelihood(allX, allY, weights, means, covs);
    logLikelihoodHistory.push(logLikelihood);
    
    // Set up DOM element content
    updateParameterDisplay(iteration, logLikelihood, weights, means);
    
    // Initial data plot
    createDataPlot(dataPlotElement, allX, allY, trueLabels);
    
    // Initial EM plot
    updateEMPlot(emPlotElement, allX, allY, responsibilities, means, covs);
    
    // Initial responsibilities plot
    updateResponsibilitiesPlot(responsibilitiesPlotElement, responsibilities);
    
    // Initial convergence plot
    updateConvergencePlot(convergencePlotElement, logLikelihoodHistory);
    
    // Set up buttons
    const iterateButton = document.getElementById('em-iterate-btn');
    const resetButton = document.getElementById('em-reset-btn');
    
    if (iterateButton && resetButton) {
        iterateButton.addEventListener('click', () => {
            if (iteration < maxIterations) {
                iteration++;
                
                // E-step: Already have responsibilities from previous iteration or initialization
                
                // M-step: Update parameters
                updateParameters(allX, allY, responsibilities, weights, means, covs);
                
                // Calculate new responsibilities and log-likelihood
                responsibilities = calculateResponsibilities(allX, allY, weights, means, covs);
                logLikelihood = calculateLogLikelihood(allX, allY, weights, means, covs);
                logLikelihoodHistory.push(logLikelihood);
                
                // Update displays
                updateParameterDisplay(iteration, logLikelihood, weights, means);
                updateEMPlot(emPlotElement, allX, allY, responsibilities, means, covs);
                updateResponsibilitiesPlot(responsibilitiesPlotElement, responsibilities);
                updateConvergencePlot(convergencePlotElement, logLikelihoodHistory);
                
                // Disable button if reached max iterations
                if (iteration >= maxIterations) {
                    iterateButton.disabled = true;
                }
            }
        });
        
        resetButton.addEventListener('click', () => {
            // Reset all parameters
            iteration = 0;
            weights = [0.33, 0.33, 0.34];
            means = [
                [-1.5, -0.5],
                [1.5, 2],
                [0.5, -1.5]
            ];
            covs = [
                [[1, 0], [0, 1]],
                [[1, 0], [0, 1]],
                [[1, 0], [0, 1]]
            ];
            
            // Reset data
            responsibilities = calculateResponsibilities(allX, allY, weights, means, covs);
            logLikelihood = calculateLogLikelihood(allX, allY, weights, means, covs);
            logLikelihoodHistory.length = 0;
            logLikelihoodHistory.push(logLikelihood);
            
            // Update displays
            updateParameterDisplay(iteration, logLikelihood, weights, means);
            updateEMPlot(emPlotElement, allX, allY, responsibilities, means, covs);
            updateResponsibilitiesPlot(responsibilitiesPlotElement, responsibilities);
            updateConvergencePlot(convergencePlotElement, logLikelihoodHistory);
            
            // Re-enable iterate button
            iterateButton.disabled = false;
        });
    }
}

// Create data plot for the interactive example
function createDataPlot(element, x, y, labels) {
    const data = [{
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: labels,
            colorscale: 'Viridis',
            size: 8,
            opacity: 0.7
        }
    }];
    
    const layout = {
        title: 'Synthetic Data',
        xaxis: { title: 'Feature 1', range: [-5, 5] },
        yaxis: { title: 'Feature 2', range: [-5, 5] },
        margin: { t: 40, r: 10, l: 40, b: 40 },
        showlegend: false,
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: { color: '#e0e0e0' }
    };
    
    Plotly.newPlot(element, data, layout, {responsive: true});
}

// Update the EM plot
function updateEMPlot(element, x, y, responsibilities, means, covs) {
    // Create cluster assignments based on highest responsibility
    const assignments = responsibilities.map(r => {
        return r.indexOf(Math.max(...r));
    });
    
    // Create ellipses for the covariance matrices
    const ellipses = createGMMEllipses([
        { mean: means[0], cov: covs[0], color: 'rgba(68, 1, 84, 0.7)' },
        { mean: means[1], cov: covs[1], color: 'rgba(59, 82, 139, 0.7)' },
        { mean: means[2], cov: covs[2], color: 'rgba(33, 145, 140, 0.7)' }
    ]);
    
    const data = [
        // Scatter plot of data with assigned clusters
        {
            x: x,
            y: y,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: assignments,
                colorscale: 'Viridis',
                size: 8,
                opacity: 0.7
            },
            name: 'Data points'
        },
        // Cluster means
        {
            x: means.map(m => m[0]),
            y: means.map(m => m[1]),
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: 'red',
                size: 12,
                symbol: 'x',
                line: { width: 2 }
            },
            name: 'Cluster means'
        },
        ...ellipses
    ];
    
    const layout = {
        title: 'GMM Fit',
        xaxis: { title: 'Feature 1', range: [-5, 5] },
        yaxis: { title: 'Feature 2', range: [-5, 5] },
        margin: { t: 40, r: 10, l: 40, b: 40 },
        showlegend: false,
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: { color: '#e0e0e0' }
    };
    
    Plotly.react(element, data, layout, {responsive: true});
}

// Update the responsibilities plot
function updateResponsibilitiesPlot(element, responsibilities) {
    // Pick a subset of points to display their responsibilities
    const numPoints = Math.min(20, responsibilities.length);
    const sampleIndices = Array.from({length: numPoints}, (_, i) => 
        Math.floor(i * responsibilities.length / numPoints));
    
    const data = [
        {
            x: Array.from({length: numPoints}, (_, i) => i),
            y: sampleIndices.map(i => responsibilities[i][0]),
            name: 'Cluster 1',
            type: 'bar',
            marker: { color: 'rgba(68, 1, 84, 0.7)' }
        },
        {
            x: Array.from({length: numPoints}, (_, i) => i),
            y: sampleIndices.map(i => responsibilities[i][1]),
            name: 'Cluster 2',
            type: 'bar',
            marker: { color: 'rgba(59, 82, 139, 0.7)' }
        },
        {
            x: Array.from({length: numPoints}, (_, i) => i),
            y: sampleIndices.map(i => responsibilities[i][2]),
            name: 'Cluster 3',
            type: 'bar',
            marker: { color: 'rgba(33, 145, 140, 0.7)' }
        }
    ];
    
    const layout = {
        title: 'Cluster Responsibilities',
        xaxis: { title: 'Sample Points' },
        yaxis: { title: 'Responsibility', range: [0, 1] },
        margin: { t: 40, r: 10, l: 40, b: 40 },
        barmode: 'stack',
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: { color: '#e0e0e0' }
    };
    
    Plotly.react(element, data, layout, {responsive: true});
}

// Update the convergence plot
function updateConvergencePlot(element, logLikelihoodHistory) {
    const data = [{
        x: Array.from({length: logLikelihoodHistory.length}, (_, i) => i),
        y: logLikelihoodHistory,
        mode: 'lines+markers',
        line: { color: '#bb86fc', width: 3 },
        marker: { color: '#03dac6', size: 8 }
    }];
    
    const layout = {
        title: 'Log-Likelihood Convergence',
        xaxis: { title: 'Iteration', tickvals: Array.from({length: logLikelihoodHistory.length}, (_, i) => i) },
        yaxis: { title: 'Log-Likelihood' },
        margin: { t: 40, r: 10, l: 40, b: 40 },
        showlegend: false,
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: { color: '#e0e0e0' }
    };
    
    Plotly.react(element, data, layout, {responsive: true});
}

// Update parameter display in the HTML
function updateParameterDisplay(iteration, logLikelihood, weights, means) {
    document.getElementById('current-iteration').textContent = iteration;
    document.getElementById('current-likelihood').textContent = logLikelihood.toFixed(2);
    
    // Update mixture weights
    const weightsHtml = weights.map((w, i) => 
        `<p>π<sub>${i+1}</sub> = ${w.toFixed(3)}</p>`
    ).join('');
    document.getElementById('mixture-weights').innerHTML = weightsHtml;
    
    // Update mean vectors
    const meansHtml = means.map((m, i) => 
        `<p>μ<sub>${i+1}</sub> = [${m[0].toFixed(2)}, ${m[1].toFixed(2)}]</p>`
    ).join('');
    document.getElementById('mean-vectors').innerHTML = meansHtml;
}

// E-step: Calculate responsibilities
function calculateResponsibilities(x, y, weights, means, covs) {
    const n = x.length;
    const k = weights.length;
    const responsibilities = Array(n).fill().map(() => Array(k).fill(0));
    
    for (let i = 0; i < n; i++) {
        const point = [x[i], y[i]];
        let sum = 0;
        
        // Calculate weighted probabilities
        const weighted_probs = Array(k).fill(0);
        for (let j = 0; j < k; j++) {
            weighted_probs[j] = weights[j] * gaussianPDF(point, means[j], covs[j]);
            sum += weighted_probs[j];
        }
        
        // Normalize to get responsibilities
        for (let j = 0; j < k; j++) {
            responsibilities[i][j] = sum > 0 ? weighted_probs[j] / sum : 1/k;
        }
    }
    
    return responsibilities;
}

// M-step: Update parameters based on responsibilities
function updateParameters(x, y, responsibilities, weights, means, covs) {
    const n = x.length;
    const k = weights.length;
    
    // Initialize component sums (effective number of points)
    const Nk = Array(k).fill(0);
    for (let j = 0; j < k; j++) {
        for (let i = 0; i < n; i++) {
            Nk[j] += responsibilities[i][j];
        }
    }
    
    // Update weights
    for (let j = 0; j < k; j++) {
        weights[j] = Nk[j] / n;
    }
    
    // Update means
    for (let j = 0; j < k; j++) {
        const newMean = [0, 0];
        for (let i = 0; i < n; i++) {
            newMean[0] += responsibilities[i][j] * x[i];
            newMean[1] += responsibilities[i][j] * y[i];
        }
        
        if (Nk[j] > 0) {
            means[j][0] = newMean[0] / Nk[j];
            means[j][1] = newMean[1] / Nk[j];
        }
    }
    
    // Update covariances
    for (let j = 0; j < k; j++) {
        // Initialize covariance matrix to zeros
        const newCov = [[0, 0], [0, 0]];
        
        for (let i = 0; i < n; i++) {
            const dx = x[i] - means[j][0];
            const dy = y[i] - means[j][1];
            
            newCov[0][0] += responsibilities[i][j] * dx * dx;
            newCov[0][1] += responsibilities[i][j] * dx * dy;
            newCov[1][0] += responsibilities[i][j] * dx * dy;
            newCov[1][1] += responsibilities[i][j] * dy * dy;
        }
        
        if (Nk[j] > 0) {
            covs[j][0][0] = newCov[0][0] / Nk[j];
            covs[j][0][1] = newCov[0][1] / Nk[j];
            covs[j][1][0] = newCov[1][0] / Nk[j];
            covs[j][1][1] = newCov[1][1] / Nk[j];
            
            // Add small regularization to avoid singularity
            covs[j][0][0] += 1e-6;
            covs[j][1][1] += 1e-6;
        }
    }
}

// Calculate log-likelihood
function calculateLogLikelihood(x, y, weights, means, covs) {
    const n = x.length;
    let logLikelihood = 0;
    
    for (let i = 0; i < n; i++) {
        const point = [x[i], y[i]];
        let sum = 0;
        
        for (let j = 0; j < weights.length; j++) {
            sum += weights[j] * gaussianPDF(point, means[j], covs[j]);
        }
        
        logLikelihood += Math.log(Math.max(sum, 1e-10));
    }
    
    return logLikelihood;
}

// Helper function to create a slider
function createSlider(container, label, min, max, value, step, onChange) {
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-item mb-2';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = `${label}: ${value}`;
    labelElement.className = 'form-label';
    
    const sliderElement = document.createElement('input');
    sliderElement.type = 'range';
    sliderElement.className = 'form-range';
    sliderElement.min = min;
    sliderElement.max = max;
    sliderElement.step = step;
    sliderElement.value = value;
    
    sliderElement.addEventListener('input', e => {
        labelElement.textContent = `${label}: ${e.target.value}`;
        onChange(e.target.value);
    });
    
    sliderContainer.appendChild(labelElement);
    sliderContainer.appendChild(sliderElement);
    container.appendChild(sliderContainer);
    
    return sliderElement;
}

// Create comparison plots (K-Means vs GMM)
function createComparisonPlots() {
    // K-Means plot
    const kmeansPlotElement = document.getElementById('kmeans-plot');
    const gmmPlotElement = document.getElementById('gmm-plot');
    
    if (!kmeansPlotElement || !gmmPlotElement) return;
    
    // Initial parameters for the comparison data
    let comparisonParams = {
        cluster1: {
            n: 100,
            mean: [-2, 0],
            cov: [[0.5, 0], [0, 2.0]]
        },
        cluster2: {
            n: 100, 
            mean: [2, 0],
            cov: [[0.5, 0], [0, 2.0]]
        }
    };
    
    // Create plots with initial parameters
    updateComparisonPlots(kmeansPlotElement, gmmPlotElement, comparisonParams);
    
    // Create sliders div
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'sliders-container mt-3';
    kmeansPlotElement.parentNode.parentNode.parentNode.insertBefore(
        controlsDiv, 
        kmeansPlotElement.parentNode.parentNode.nextSibling
    );
    
    // Create slider for cluster separation
    createSlider(controlsDiv, 'Cluster Separation', 2, 6, 4, 0.5, value => {
        const separation = parseFloat(value);
        comparisonParams.cluster1.mean = [-separation/2, 0];
        comparisonParams.cluster2.mean = [separation/2, 0];
        updateComparisonPlots(kmeansPlotElement, gmmPlotElement, comparisonParams);
    });
    
    // Create slider for vertical stretch
    createSlider(controlsDiv, 'Vertical Stretch', 0.5, 5, 2.0, 0.5, value => {
        const stretch = parseFloat(value);
        comparisonParams.cluster1.cov = [[0.5, 0], [0, stretch]];
        comparisonParams.cluster2.cov = [[0.5, 0], [0, stretch]];
        updateComparisonPlots(kmeansPlotElement, gmmPlotElement, comparisonParams);
    });
    
    // Create slider for rotation
    createSlider(controlsDiv, 'Cluster Rotation', 0, 90, 0, 15, value => {
        const angle = parseFloat(value) * Math.PI / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // Rotate the covariance matrices
        const baseCov = [[0.5, 0], [0, comparisonParams.cluster1.cov[1][1]]];
        comparisonParams.cluster1.cov = rotateCovarianceMatrix(baseCov, angle);
        comparisonParams.cluster2.cov = rotateCovarianceMatrix(baseCov, angle);
        
        updateComparisonPlots(kmeansPlotElement, gmmPlotElement, comparisonParams);
    });
}

// Helper function to rotate a covariance matrix
function rotateCovarianceMatrix(cov, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotMatrix = [[cos, -sin], [sin, cos]];
    
    // Apply rotation: R * Σ * R^T
    // First compute R * Σ
    const temp = [
        [rotMatrix[0][0] * cov[0][0] + rotMatrix[0][1] * cov[1][0], 
         rotMatrix[0][0] * cov[0][1] + rotMatrix[0][1] * cov[1][1]],
        [rotMatrix[1][0] * cov[0][0] + rotMatrix[1][1] * cov[1][0],
         rotMatrix[1][0] * cov[0][1] + rotMatrix[1][1] * cov[1][1]]
    ];
    
    // Then compute (R * Σ) * R^T
    return [
        [temp[0][0] * rotMatrix[0][0] + temp[0][1] * rotMatrix[0][1],
         temp[0][0] * rotMatrix[1][0] + temp[0][1] * rotMatrix[1][1]],
        [temp[1][0] * rotMatrix[0][0] + temp[1][1] * rotMatrix[0][1],
         temp[1][0] * rotMatrix[1][0] + temp[1][1] * rotMatrix[1][1]]
    ];
}

// Update both comparison plots with new parameters
function updateComparisonPlots(kmeansElement, gmmElement, params) {
    // Generate synthetic data
    const cluster1 = generateGaussianCluster(
        params.cluster1.n,
        params.cluster1.mean,
        params.cluster1.cov
    );
    
    const cluster2 = generateGaussianCluster(
        params.cluster2.n,
        params.cluster2.mean,
        params.cluster2.cov
    );
    
    // Combine data
    const allX = cluster1.x.concat(cluster2.x);
    const allY = cluster1.y.concat(cluster2.y);
    const trueLabels = Array(cluster1.x.length).fill(0).concat(Array(cluster2.x.length).fill(1));
    
    // K-Means plot (simple vertical decision boundary at x=0)
    const kmeansLabels = allX.map(x => x < 0 ? 0 : 1);
    
    // Calculate decision boundary for K-Means
    const kmeansData = [
        {
            x: allX,
            y: allY,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: kmeansLabels,
                colorscale: 'Plasma',
                size: 8,
                opacity: 0.8
            }
        },
        // Add vertical decision boundary
        {
            x: [0, 0],
            y: [-5, 5],
            mode: 'lines',
            line: {
                color: '#e0e0e0',
                width: 2,
                dash: 'dash'
            }
        }
    ];
    
    const kmeansLayout = {
        title: 'K-Means Clustering',
        xaxis: { title: 'Feature 1', range: [-5, 5], gridcolor: '#333333', zerolinecolor: '#555555' },
        yaxis: { title: 'Feature 2', range: [-5, 5], gridcolor: '#333333', zerolinecolor: '#555555' },
        margin: { t: 40, r: 10, l: 40, b: 40 },
        showlegend: false,
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: {
            color: '#e0e0e0'
        }
    };
    
    Plotly.react(kmeansElement, kmeansData, kmeansLayout, {responsive: true});
    
    // GMM Plot
    const means = [params.cluster1.mean, params.cluster2.mean];
    const covars = [params.cluster1.cov, params.cluster2.cov];
    const weights = [0.5, 0.5];
    
    // Calculate decision boundary for GMM (probability contours)
    const xGrid = numeric.linspace(-5, 5, 100);
    const yGrid = numeric.linspace(-5, 5, 100);
    const zGrid = [];
    
    // Calculate GMM probabilities on grid
    for (let i = 0; i < xGrid.length; i++) {
        zGrid[i] = [];
        for (let j = 0; j < yGrid.length; j++) {
            // Calculate Gaussian probabilities
            const prob1 = weights[0] * gaussianPDF([xGrid[i], yGrid[j]], means[0], covars[0]);
            const prob2 = weights[1] * gaussianPDF([xGrid[i], yGrid[j]], means[1], covars[1]);
            
            // Assign higher probability cluster
            zGrid[i][j] = prob1 > prob2 ? 0 : 1;
        }
    }
    
    // Create GMM plot with contours
    const gmmData = [
        // Probability contours
        {
            z: zGrid,
            x: xGrid,
            y: yGrid,
            type: 'contour',
            colorscale: 'Plasma',
            showscale: false,
            contours: {
                start: 0,
                end: 1,
                size: 1,
                coloring: 'heatmap'
            },
            opacity: 0.5,
            hoverinfo: 'none'
        },
        // Data points
        {
            x: allX,
            y: allY,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: trueLabels,
                colorscale: 'Plasma',
                size: 8,
                opacity: 0.8
            }
        }
    ];
    
    const gmmLayout = {
        title: 'GMM Clustering',
        xaxis: { title: 'Feature 1', range: [-5, 5], gridcolor: '#333333', zerolinecolor: '#555555' },
        yaxis: { title: 'Feature 2', range: [-5, 5], gridcolor: '#333333', zerolinecolor: '#555555' },
        margin: { t: 40, r: 10, l: 40, b: 40 },
        showlegend: false,
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: {
            color: '#e0e0e0'
        }
    };
    
    Plotly.react(gmmElement, gmmData, gmmLayout, {responsive: true});
}

// Create GMM result plot
function createGMMResultPlot() {
    const plotElement = document.getElementById('gmm-result-plot');
    if (!plotElement) return;
    
    // Generate synthetic data (simplified for visualization)
    const cluster1 = generateGaussianCluster(80, [-3, -2], [[1.5, 0.5], [0.5, 1.0]]);
    const cluster2 = generateGaussianCluster(120, [2, 2], [[1.0, -0.7], [-0.7, 2.0]]);
    const cluster3 = generateGaussianCluster(60, [0, -3], [[0.5, 0], [0, 0.5]]);
    
    // Combine all data
    const allX = cluster1.x.concat(cluster2.x, cluster3.x);
    const allY = cluster1.y.concat(cluster2.y, cluster3.y);
    
    // Assign colors based on most likely component - we'd normally use the GMM's predict method
    // For visualization, we'll use the original clusters
    const allColors = Array(cluster1.x.length).fill(0)
        .concat(Array(cluster2.x.length).fill(1))
        .concat(Array(cluster3.x.length).fill(2));
    
    // Create GMM ellipses
    const ellipses = createGMMEllipses([
        { mean: [-3, -2], cov: [[1.5, 0.5], [0.5, 1.0]], color: 'rgba(86, 65, 255, 0.7)' },
        { mean: [2, 2], cov: [[1.0, -0.7], [-0.7, 2.0]], color: 'rgba(65, 255, 86, 0.7)' },
        { mean: [0, -3], cov: [[0.5, 0], [0, 0.5]], color: 'rgba(255, 166, 65, 0.7)' }
    ]);
    
    // Create scatter plot with GMM ellipses
    const data = [
        // Scatter plot of data
        {
            x: allX,
            y: allY,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: allColors,
                colorscale: 'Viridis',
                size: 8,
                opacity: 0.7
            },
            name: 'Data points'
        },
        ...ellipses
    ];
    
    const layout = {
        title: 'GMM Clustering Result',
        xaxis: { title: 'Feature 1', range: [-6, 6] },
        yaxis: { title: 'Feature 2', range: [-6, 6] },
        margin: { t: 40, r: 10, l: 40, b: 40 },
        showlegend: true
    };
    
    Plotly.newPlot(plotElement, data, layout, {responsive: true});
}

// Create soft clustering visualization
function createSoftClusteringPlot() {
    const plotElement = document.getElementById('soft-clustering-plot');
    if (!plotElement) return;
    
    // Generate synthetic data with overlapping clusters
    const cluster1 = generateGaussianCluster(70, [-1, 0], [[1.0, 0], [0, 1.0]]);
    const cluster2 = generateGaussianCluster(70, [1, 0], [[1.0, 0], [0, 1.0]]);
    
    // Combine all data
    const allX = cluster1.x.concat(cluster2.x);
    const allY = cluster1.y.concat(cluster2.y);
    
    // Calculate membership probabilities based on distance to centers
    const probabilities = [];
    for (let i = 0; i < allX.length; i++) {
        const x = allX[i];
        const y = allY[i];
        
        const d1 = Math.sqrt(Math.pow(x - (-1), 2) + Math.pow(y - 0, 2));
        const d2 = Math.sqrt(Math.pow(x - 1, 2) + Math.pow(y - 0, 2));
        
        const p1 = Math.exp(-d1) / (Math.exp(-d1) + Math.exp(-d2));
        probabilities.push(p1);
    }
    
    // Create scatter plot with probability-based coloring
    const data = [
        {
            x: allX,
            y: allY,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: probabilities,
                colorscale: 'Portland',
                size: 10,
                colorbar: {
                    title: 'Probability of Cluster 1',
                    titleside: 'right'
                }
            }
        }
    ];
    
    const layout = {
        title: 'Soft Clustering Probabilities',
        xaxis: { title: 'Feature 1', range: [-3, 3] },
        yaxis: { title: 'Feature 2', range: [-3, 3] },
        margin: { t: 40, r: 20, l: 40, b: 40 },
        showlegend: false
    };
    
    Plotly.newPlot(plotElement, data, layout, {responsive: true});
}

// Helper function to create GMM ellipses for visualization
function createGMMEllipses(clusters) {
    const ellipses = [];
    
    clusters.forEach((cluster, i) => {
        // Calculate eigenvalues and eigenvectors for the covariance matrix
        const { eigVals, eigVecs } = getEigenVectors(cluster.cov);
        
        // Scale eigenvectors for 95% confidence interval (2 standard deviations)
        const scale = 2;
        const scaledEigVals = eigVals.map(val => Math.sqrt(val) * scale);
        
        // Generate ellipse points
        const t = numeric.linspace(0, 2 * Math.PI, 100);
        const ellipseX = [];
        const ellipseY = [];
        
        for (let j = 0; j < t.length; j++) {
            const x = scaledEigVals[0] * Math.cos(t[j]);
            const y = scaledEigVals[1] * Math.sin(t[j]);
            
            // Rotate according to eigenvectors
            const rotX = eigVecs[0][0] * x + eigVecs[0][1] * y;
            const rotY = eigVecs[1][0] * x + eigVecs[1][1] * y;
            
            // Translate to mean
            ellipseX.push(rotX + cluster.mean[0]);
            ellipseY.push(rotY + cluster.mean[1]);
        }
        
        // Add to plot data
        ellipses.push({
            x: ellipseX,
            y: ellipseY,
            mode: 'lines',
            line: {
                color: cluster.color,
                width: 2
            },
            name: `Cluster ${i+1}`
        });
    });
    
    return ellipses;
}

// Helper function to generate random Gaussian cluster
function generateGaussianCluster(n, mean, cov) {
    // Naive implementation for visualization purposes
    const x = [];
    const y = [];
    
    // From eigendecomposition of covariance matrix
    const { eigVals, eigVecs } = getEigenVectors(cov);
    const scaledEigVals = eigVals.map(Math.sqrt);
    
    for (let i = 0; i < n; i++) {
        // Generate standard normal variates
        const u1 = Math.random();
        const u2 = Math.random();
        const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        
        // Scale by eigenvalues
        const pc1 = scaledEigVals[0] * z1;
        const pc2 = scaledEigVals[1] * z2;
        
        // Rotate according to eigenvectors and add mean
        const xi = eigVecs[0][0] * pc1 + eigVecs[0][1] * pc2 + mean[0];
        const yi = eigVecs[1][0] * pc1 + eigVecs[1][1] * pc2 + mean[1];
        
        x.push(xi);
        y.push(yi);
    }
    
    return { x, y };
}

// Helper function to compute eigenvalues and eigenvectors of a 2x2 matrix
function getEigenVectors(cov) {
    const a = cov[0][0];
    const b = cov[0][1];
    const c = cov[1][0];
    const d = cov[1][1];
    
    // Compute eigenvalues
    const trace = a + d;
    const det = a * d - b * c;
    const discriminant = Math.sqrt(trace * trace - 4 * det);
    
    const lambda1 = (trace + discriminant) / 2;
    const lambda2 = (trace - discriminant) / 2;
    
    // Compute eigenvectors
    let v1x, v1y, v2x, v2y;
    
    if (b !== 0) {
        v1x = lambda1 - d;
        v1y = c;
        v2x = lambda2 - d;
        v2y = c;
    } else if (c !== 0) {
        v1x = b;
        v1y = lambda1 - a;
        v2x = b;
        v2y = lambda2 - a;
    } else {
        // Diagonal matrix, eigenvectors are [1,0] and [0,1]
        v1x = 1;
        v1y = 0;
        v2x = 0;
        v2y = 1;
    }
    
    // Normalize eigenvectors
    const norm1 = Math.sqrt(v1x * v1x + v1y * v1y);
    const norm2 = Math.sqrt(v2x * v2x + v2y * v2y);
    
    v1x /= norm1;
    v1y /= norm1;
    v2x /= norm2;
    v2y /= norm2;
    
    return {
        eigVals: [lambda1, lambda2],
        eigVecs: [[v1x, v2x], [v1y, v2y]]
    };
}

// Helper function for multivariate Gaussian PDF
function gaussianPDF(x, mean, cov) {
    const dim = mean.length;
    const xMinusMu = [x[0] - mean[0], x[1] - mean[1]];
    
    // Calculate determinant
    const det = cov[0][0] * cov[1][1] - cov[0][1] * cov[1][0];
    
    // Calculate inverse
    const invCov = [
        [cov[1][1] / det, -cov[0][1] / det],
        [-cov[1][0] / det, cov[0][0] / det]
    ];
    
    // Calculate Mahalanobis distance squared
    const mahalanobis = 
        xMinusMu[0] * (invCov[0][0] * xMinusMu[0] + invCov[0][1] * xMinusMu[1]) +
        xMinusMu[1] * (invCov[1][0] * xMinusMu[0] + invCov[1][1] * xMinusMu[1]);
    
    // Calculate normalization constant
    const norm = 1 / (2 * Math.PI * Math.sqrt(det));
    
    // Return PDF value
    return norm * Math.exp(-0.5 * mahalanobis);
}

// Define numeric library for linear space functionality
const numeric = {
    linspace: function(start, end, n) {
        const result = new Array(n);
        const step = (end - start) / (n - 1);
        for (let i = 0; i < n; i++) {
            result[i] = start + i * step;
        }
        return result;
    }
};

// Create EM process visualization
function createEMProcessPlot() {
    const plotElement = document.getElementById('em-process-plot');
    if (!plotElement) return;
    
    // Generate synthetic data for demonstration
    const cluster1 = generateGaussianCluster(100, [-2, -2], [[1, 0], [0, 1]]);
    const cluster2 = generateGaussianCluster(100, [0, 2], [[1, 0.5], [0.5, 1]]);
    const cluster3 = generateGaussianCluster(100, [3, 0], [[1, -0.7], [-0.7, 1]]);
    
    // Combine data
    const allX = cluster1.x.concat(cluster2.x, cluster3.x);
    const allY = cluster1.y.concat(cluster2.y, cluster3.y);
    const trueLabels = Array(cluster1.x.length).fill(0)
        .concat(Array(cluster2.x.length).fill(1))
        .concat(Array(cluster3.x.length).fill(2));
    
    // Simulated EM iterations
    // These represent the evolution of means and covariances over iterations
    const iterations = [
        // Initial state (K-means initialization)
        {
            means: [[-1.8, -1.5], [0.2, 1.8], [2.8, 0.2]],
            covs: [
                [[1, 0], [0, 1]],
                [[1, 0], [0, 1]],
                [[1, 0], [0, 1]]
            ]
        },
        // After iteration 1
        {
            means: [[-1.9, -1.7], [0.1, 1.9], [2.9, 0.1]],
            covs: [
                [[1.2, 0.1], [0.1, 1.1]],
                [[1.1, 0.3], [0.3, 1.2]],
                [[1.0, -0.4], [-0.4, 1.3]]
            ]
        },
        // After iteration 2
        {
            means: [[-2.0, -1.9], [0.0, 2.0], [3.0, 0.0]],
            covs: [
                [[1.0, 0.0], [0.0, 1.0]],
                [[1.0, 0.5], [0.5, 1.0]],
                [[1.0, -0.6], [-0.6, 1.5]]
            ]
        },
        // Final iteration (converged)
        {
            means: [[-2.0, -2.0], [0.0, 2.0], [3.0, 0.0]],
            covs: [
                [[1.0, 0.0], [0.0, 1.0]],
                [[1.0, 0.5], [0.5, 1.0]],
                [[1.0, -0.7], [-0.7, 1.0]]
            ]
        }
    ];
    
    // Prepare frames for animation
    const frames = iterations.map((iteration, i) => {
        // Create ellipses for the current iteration
        const ellipsesData = [];
        
        // Add ellipses for each cluster
        for (let k = 0; k < iteration.means.length; k++) {
            const clusterColor = k === 0 ? 'rgba(186, 134, 252, 0.5)' : 
                                k === 1 ? 'rgba(3, 218, 198, 0.5)' : 
                                         'rgba(255, 186, 108, 0.5)';
            
            const cluster = {
                mean: iteration.means[k],
                cov: iteration.covs[k],
                color: clusterColor
            };
            
            // Generate ellipse
            const ellipse = createClusterEllipse(cluster);
            ellipsesData.push(ellipse);
        }
        
        // Combine data points with ellipses for this iteration
        return {
            name: `iteration-${i}`,
            data: [
                // Data points
                {
                    x: allX,
                    y: allY,
                    mode: 'markers',
                    type: 'scatter',
                    marker: {
                        color: trueLabels,
                        colorscale: 'Plasma',
                        size: 8,
                        opacity: 0.7
                    },
                    name: 'Data Points'
                },
                // Means
                {
                    x: iteration.means.map(m => m[0]),
                    y: iteration.means.map(m => m[1]),
                    mode: 'markers',
                    type: 'scatter',
                    marker: {
                        color: '#bb86fc',
                        size: 12,
                        symbol: 'x',
                        line: {
                            width: 2,
                            color: '#03dac6'
                        }
                    },
                    name: 'Cluster Means'
                },
                // Ellipses for each cluster
                ...ellipsesData
            ]
        };
    });
    
    // Create the initial plot with the first frame
    const data = frames[0].data;
    
    const layout = {
        title: 'EM Algorithm Progress',
        xaxis: { 
            title: 'Feature 1', 
            range: [-5, 5],
            gridcolor: '#333333',
            zerolinecolor: '#555555'
        },
        yaxis: { 
            title: 'Feature 2', 
            range: [-5, 5],
            gridcolor: '#333333',
            zerolinecolor: '#555555'
        },
        margin: { t: 40, r: 20, l: 40, b: 40 },
        showlegend: false,
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: {
            color: '#e0e0e0'
        },
        updatemenus: [{
            type: 'buttons',
            showactive: false,
            y: 0,
            x: 0.1,
            xanchor: 'right',
            yanchor: 'top',
            pad: {t: 60, r: 20},
            buttons: [{
                label: 'Play',
                method: 'animate',
                args: [null, {
                    fromcurrent: true,
                    frame: {duration: 500, redraw: true},
                    transition: {duration: 500}
                }]
            }, {
                label: 'Pause',
                method: 'animate',
                args: [[null], {
                    mode: 'immediate',
                    transition: {duration: 0},
                    frame: {duration: 0, redraw: false}
                }]
            }]
        }],
        sliders: [{
            active: 0,
            steps: frames.map((frame, i) => ({
                label: `Iteration ${i}`,
                method: 'animate',
                args: [[`iteration-${i}`], {
                    mode: 'immediate',
                    transition: {duration: 300},
                    frame: {duration: 300, redraw: true}
                }]
            })),
            x: 0.1,
            y: 0,
            len: 0.9,
            xanchor: 'left',
            yanchor: 'top',
            pad: {t: 50, b: 10},
            currentvalue: {
                visible: true,
                prefix: 'Iteration: ',
                xanchor: 'right',
                font: {size: 14, color: '#e0e0e0'}
            },
            transition: {duration: 300}
        }]
    };
    
    // Create the plot with animation capabilities
    Plotly.newPlot(plotElement, data, layout, {responsive: true})
        .then(function() {
            // Add the frames for animation
            Plotly.addFrames(plotElement, frames.map((frame, i) => ({
                name: `iteration-${i}`,
                data: frame.data
            })));
        });
}

// Helper function to create a single cluster ellipse
function createClusterEllipse(cluster) {
    // Calculate eigenvalues and eigenvectors for the covariance matrix
    const { eigVals, eigVecs } = getEigenVectors(cluster.cov);
    
    // Scale eigenvectors for 95% confidence interval (2 standard deviations)
    const scale = 2;
    const scaledEigVals = eigVals.map(val => Math.sqrt(val) * scale);
    
    // Generate ellipse points
    const t = numeric.linspace(0, 2 * Math.PI, 100);
    const ellipseX = [];
    const ellipseY = [];
    
    for (let j = 0; j < t.length; j++) {
        const x = scaledEigVals[0] * Math.cos(t[j]);
        const y = scaledEigVals[1] * Math.sin(t[j]);
        
        // Rotate according to eigenvectors
        const rotX = eigVecs[0][0] * x + eigVecs[0][1] * y;
        const rotY = eigVecs[1][0] * x + eigVecs[1][1] * y;
        
        // Translate to mean
        ellipseX.push(rotX + cluster.mean[0]);
        ellipseY.push(rotY + cluster.mean[1]);
    }
    
    // Return the ellipse trace for plotting
    return {
        x: ellipseX,
        y: ellipseY,
        mode: 'lines',
        type: 'scatter',
        line: {
            color: cluster.color,
            width: 2
        },
        name: `Cluster Covariance`
    };
}

// Create log-likelihood convergence plot
function createLikelihoodPlot() {
    const plotElement = document.getElementById('likelihood-plot');
    if (!plotElement) return;
    
    // Simulated log-likelihood values across iterations
    // These would increase monotonically as the EM algorithm converges
    const iterations = Array.from({length: 10}, (_, i) => i);
    const logLikelihood = [
        -1200,   // Initial value
        -950,    // After iteration 1
        -850,    // After iteration 2
        -800,    // ...
        -780,
        -770,
        -765,
        -763,
        -762,    // Almost converged
        -761.5   // Final value
    ];
    
    const trace = {
        x: iterations,
        y: logLikelihood,
        mode: 'lines+markers',
        line: {
            color: '#bb86fc',
            width: 3
        },
        marker: {
            color: '#03dac6',
            size: 10
        }
    };
    
    const layout = {
        title: 'Log-Likelihood Convergence',
        xaxis: {
            title: 'Iteration',
            gridcolor: '#333333',
            zerolinecolor: '#555555'
        },
        yaxis: {
            title: 'Log-Likelihood',
            gridcolor: '#333333',
            zerolinecolor: '#555555'
        },
        margin: { t: 40, r: 20, l: 50, b: 40 },
        showlegend: false,
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: {
            color: '#e0e0e0'
        }
    };
    
    Plotly.newPlot(plotElement, [trace], layout, {responsive: true});
} 