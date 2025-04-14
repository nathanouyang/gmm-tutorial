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
    createSyntheticDataPlot();
    createGaussian2DPlot();
    createComparisonPlots();
    createGMMResultPlot();
    createSoftClusteringPlot();
    createAicBicPlot();
    
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
    // GMM intro formula
    const gmmIntroFormula = document.getElementById('gmm-intro-formula');
    if (gmmIntroFormula) {
        katex.render(
            "p(\\mathbf{x}) = \\sum_{k=1}^{K} \\pi_k \\mathcal{N}(\\mathbf{x}|\\boldsymbol{\\mu}_k, \\boldsymbol{\\Sigma}_k)",
            gmmIntroFormula,
            { displayMode: true }
        );
    }
    
    // Gaussian PDF formula
    const gaussianPdfFormula = document.getElementById('gaussian-pdf-formula');
    if (gaussianPdfFormula) {
        katex.render(
            "p(\\mathbf{x}|\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma}) = \\frac{1}{(2\\pi)^{d/2}|\\boldsymbol{\\Sigma}|^{1/2}} \\exp\\left(-\\frac{1}{2}(\\mathbf{x} - \\boldsymbol{\\mu})^T \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x} - \\boldsymbol{\\mu})\\right)",
            gaussianPdfFormula,
            { displayMode: true }
        );
    }
    
    // AIC/BIC formula
    const aicBicFormula = document.getElementById('aic-bic-formula');
    if (aicBicFormula) {
        katex.render(
            "\\begin{align} \\text{AIC} &= -2 \\ln(L) + 2k \\\\ \\text{BIC} &= -2 \\ln(L) + k \\ln(n) \\end{align}",
            aicBicFormula,
            { displayMode: true }
        );
    }
}

// Create synthetic data plot
function createSyntheticDataPlot() {
    const plotElement = document.getElementById('synthetic-data-plot');
    if (!plotElement) return;
    
    // Initial parameters
    let cluster1Params = {
        n: 100,
        mean: [-3, -2],
        cov: [[1.5, 0.5], [0.5, 1.0]]
    };
    
    let cluster2Params = {
        n: 150,
        mean: [2, 2],
        cov: [[1.0, -0.7], [-0.7, 2.0]]
    };
    
    let cluster3Params = {
        n: 80,
        mean: [0, -3],
        cov: [[0.5, 0], [0, 0.5]]
    };
    
    // Generate initial data
    updateSyntheticDataPlot(plotElement, cluster1Params, cluster2Params, cluster3Params);
    
    // Create sliders div
    const slidersDiv = document.createElement('div');
    slidersDiv.className = 'sliders-container mt-3';
    plotElement.parentNode.insertBefore(slidersDiv, plotElement.nextSibling);
    
    // Create cluster size sliders
    createSlider(slidersDiv, 'Cluster 1 Size', 20, 200, cluster1Params.n, 10, value => {
        cluster1Params.n = parseInt(value);
        updateSyntheticDataPlot(plotElement, cluster1Params, cluster2Params, cluster3Params);
    });
    
    createSlider(slidersDiv, 'Cluster 2 Size', 20, 200, cluster2Params.n, 10, value => {
        cluster2Params.n = parseInt(value);
        updateSyntheticDataPlot(plotElement, cluster1Params, cluster2Params, cluster3Params);
    });
    
    createSlider(slidersDiv, 'Cluster 3 Size', 20, 200, cluster3Params.n, 10, value => {
        cluster3Params.n = parseInt(value);
        updateSyntheticDataPlot(plotElement, cluster1Params, cluster2Params, cluster3Params);
    });
    
    // Create cluster position sliders
    const positionDiv = document.createElement('div');
    positionDiv.className = 'row mt-3';
    slidersDiv.appendChild(positionDiv);
    
    const cluster1Div = document.createElement('div');
    cluster1Div.className = 'col-md-4';
    cluster1Div.innerHTML = '<h6>Cluster 1 Position</h6>';
    positionDiv.appendChild(cluster1Div);
    
    createSlider(cluster1Div, 'X', -5, 5, cluster1Params.mean[0], 0.5, value => {
        cluster1Params.mean[0] = parseFloat(value);
        updateSyntheticDataPlot(plotElement, cluster1Params, cluster2Params, cluster3Params);
    });
    
    createSlider(cluster1Div, 'Y', -5, 5, cluster1Params.mean[1], 0.5, value => {
        cluster1Params.mean[1] = parseFloat(value);
        updateSyntheticDataPlot(plotElement, cluster1Params, cluster2Params, cluster3Params);
    });
    
    const cluster2Div = document.createElement('div');
    cluster2Div.className = 'col-md-4';
    cluster2Div.innerHTML = '<h6>Cluster 2 Position</h6>';
    positionDiv.appendChild(cluster2Div);
    
    createSlider(cluster2Div, 'X', -5, 5, cluster2Params.mean[0], 0.5, value => {
        cluster2Params.mean[0] = parseFloat(value);
        updateSyntheticDataPlot(plotElement, cluster1Params, cluster2Params, cluster3Params);
    });
    
    createSlider(cluster2Div, 'Y', -5, 5, cluster2Params.mean[1], 0.5, value => {
        cluster2Params.mean[1] = parseFloat(value);
        updateSyntheticDataPlot(plotElement, cluster1Params, cluster2Params, cluster3Params);
    });
    
    const cluster3Div = document.createElement('div');
    cluster3Div.className = 'col-md-4';
    cluster3Div.innerHTML = '<h6>Cluster 3 Position</h6>';
    positionDiv.appendChild(cluster3Div);
    
    createSlider(cluster3Div, 'X', -5, 5, cluster3Params.mean[0], 0.5, value => {
        cluster3Params.mean[0] = parseFloat(value);
        updateSyntheticDataPlot(plotElement, cluster1Params, cluster2Params, cluster3Params);
    });
    
    createSlider(cluster3Div, 'Y', -5, 5, cluster3Params.mean[1], 0.5, value => {
        cluster3Params.mean[1] = parseFloat(value);
        updateSyntheticDataPlot(plotElement, cluster1Params, cluster2Params, cluster3Params);
    });
}

// Update synthetic data plot
function updateSyntheticDataPlot(element, cluster1Params, cluster2Params, cluster3Params) {
    // Generate synthetic data for each cluster
    const cluster1 = generateGaussianCluster(
        cluster1Params.n, 
        cluster1Params.mean, 
        cluster1Params.cov
    );
    
    const cluster2 = generateGaussianCluster(
        cluster2Params.n, 
        cluster2Params.mean, 
        cluster2Params.cov
    );
    
    const cluster3 = generateGaussianCluster(
        cluster3Params.n, 
        cluster3Params.mean, 
        cluster3Params.cov
    );
    
    // Combine all data
    const allX = cluster1.x.concat(cluster2.x, cluster3.x);
    const allY = cluster1.y.concat(cluster2.y, cluster3.y);
    const allColors = Array(cluster1.x.length).fill(0)
        .concat(Array(cluster2.x.length).fill(1))
        .concat(Array(cluster3.x.length).fill(2));
    
    // Create scatter plot
    const data = [
        {
            x: allX,
            y: allY,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: allColors,
                colorscale: 'Plasma',
                size: 8,
                opacity: 0.8
            }
        }
    ];
    
    const layout = {
        title: 'Synthetic Data with 3 Clusters',
        xaxis: { title: 'Feature 1', range: [-8, 8], gridcolor: '#333333', zerolinecolor: '#555555' },
        yaxis: { title: 'Feature 2', range: [-8, 8], gridcolor: '#333333', zerolinecolor: '#555555' },
        margin: { t: 40, r: 20, l: 40, b: 40 },
        hovermode: 'closest',
        showlegend: false,
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: {
            color: '#e0e0e0'
        }
    };
    
    Plotly.react(element, data, layout, {responsive: true});
}

// Create Gaussian 2D plot
function createGaussian2DPlot() {
    const plotElement = document.getElementById('gaussian-2d-plot');
    if (!plotElement) return;
    
    // Initial parameters
    let mu = [0, 0];
    let sigma = [[1, 0.5], [0.5, 1]];
    
    // Create plot with initial values
    updateGaussian2DPlot(plotElement, mu, sigma);
    
    // Create sliders div
    const slidersDiv = document.createElement('div');
    slidersDiv.className = 'sliders-container mt-3';
    plotElement.parentNode.insertBefore(slidersDiv, plotElement.nextSibling);
    
    // Create mean sliders
    const muXSlider = createSlider(slidersDiv, 'Mean X', -2, 2, mu[0], 0.1, value => {
        mu[0] = parseFloat(value);
        updateGaussian2DPlot(plotElement, mu, sigma);
    });
    
    const muYSlider = createSlider(slidersDiv, 'Mean Y', -2, 2, mu[1], 0.1, value => {
        mu[1] = parseFloat(value);
        updateGaussian2DPlot(plotElement, mu, sigma);
    });
    
    // Create covariance sliders
    const sigmaXXSlider = createSlider(slidersDiv, 'Var X', 0.1, 3, sigma[0][0], 0.1, value => {
        sigma[0][0] = parseFloat(value);
        updateGaussian2DPlot(plotElement, mu, sigma);
    });
    
    const sigmaYYSlider = createSlider(slidersDiv, 'Var Y', 0.1, 3, sigma[1][1], 0.1, value => {
        sigma[1][1] = parseFloat(value);
        updateGaussian2DPlot(plotElement, mu, sigma);
    });
    
    const sigmaXYSlider = createSlider(slidersDiv, 'Cov XY', -1, 1, sigma[0][1], 0.1, value => {
        sigma[0][1] = parseFloat(value);
        sigma[1][0] = parseFloat(value); // Keep symmetric
        updateGaussian2DPlot(plotElement, mu, sigma);
    });
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

// Update Gaussian 2D plot with new parameters
function updateGaussian2DPlot(element, mu, sigma) {
    // Generate grid of points
    const n = 50;
    const x = numeric.linspace(-5, 5, n);
    const y = numeric.linspace(-5, 5, n);
    const z = [];
    
    const sigmaDet = sigma[0][0] * sigma[1][1] - sigma[0][1] * sigma[1][0];
    const sigmaInv = [
        [sigma[1][1] / sigmaDet, -sigma[0][1] / sigmaDet],
        [-sigma[1][0] / sigmaDet, sigma[0][0] / sigmaDet]
    ];
    
    // Calculate PDF values
    for (let i = 0; i < n; i++) {
        z[i] = [];
        for (let j = 0; j < n; j++) {
            const xDiff = [x[i] - mu[0], y[j] - mu[1]];
            const exponent = -(
                xDiff[0] * (sigmaInv[0][0] * xDiff[0] + sigmaInv[0][1] * xDiff[1]) +
                xDiff[1] * (sigmaInv[1][0] * xDiff[0] + sigmaInv[1][1] * xDiff[1])
            ) / 2;
            const coef = 1 / (2 * Math.PI * Math.sqrt(sigmaDet));
            z[i][j] = coef * Math.exp(exponent);
        }
    }
    
    // Create contour plot
    const data = [
        {
            z: z,
            x: x,
            y: y,
            type: 'contour',
            colorscale: 'Plasma',
            contours: {
                coloring: 'heatmap',
                showlabels: true,
                labelfont: {
                    size: 10,
                    color: 'white',
                }
            }
        }
    ];
    
    const layout = {
        title: '2D Gaussian Distribution',
        xaxis: { title: 'x', range: [-5, 5] },
        yaxis: { title: 'y', range: [-5, 5] },
        margin: { t: 40, r: 20, l: 40, b: 40 },
        showlegend: false,
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: {
            color: '#e0e0e0'
        }
    };
    
    Plotly.react(element, data, layout, {responsive: true});
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

// Create AIC/BIC visualization
function createAicBicPlot() {
    const plotElement = document.getElementById('aic-bic-plot');
    if (!plotElement) return;
    
    // Simulate AIC/BIC values for different numbers of components
    const components = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    // Simulate values with minimum at the correct number of components (3)
    const aic = [
        850, 700, 580, 590, 610, 625, 645, 670, 700
    ];
    
    const bic = [
        860, 720, 610, 630, 660, 685, 715, 750, 790
    ];
    
    // Create line plot
    const data = [
        {
            x: components,
            y: aic,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'AIC',
            line: {
                color: 'blue',
                width: 2
            },
            marker: {
                size: 8
            }
        },
        {
            x: components,
            y: bic,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'BIC',
            line: {
                color: 'red',
                width: 2
            },
            marker: {
                size: 8
            }
        },
        // Add vertical line at optimal value
        {
            x: [3, 3],
            y: [Math.min(...aic, ...bic) - 50, Math.max(...aic, ...bic) + 50],
            mode: 'lines',
            line: {
                color: 'green',
                width: 2,
                dash: 'dash'
            },
            showlegend: false
        }
    ];
    
    const layout = {
        title: 'AIC and BIC vs. Number of Components',
        xaxis: { 
            title: 'Number of Components',
            tickvals: components
        },
        yaxis: { title: 'Information Criterion Value' },
        margin: { t: 40, r: 20, l: 40, b: 40 },
        legend: {
            x: 0.7,
            y: 0.9
        }
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
        const ellipses = createGMMEllipses({
            means: iteration.means,
            covariances: iteration.covs
        });
        
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
                ...ellipses
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