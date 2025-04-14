// GMM Tutorial JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Render math formulas using KaTeX
    renderFormulas();
    
    // Create interactive plots
    createSyntheticDataPlot();
    createGaussian2DPlot();
    createComparisonPlots();
    createGMMResultPlot();
    createSoftClusteringPlot();
    createAicBicPlot();
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
    
    // Generate synthetic data (simplified for visualization)
    const cluster1 = generateGaussianCluster(100, [-3, -2], [[1.5, 0.5], [0.5, 1.0]]);
    const cluster2 = generateGaussianCluster(150, [2, 2], [[1.0, -0.7], [-0.7, 2.0]]);
    const cluster3 = generateGaussianCluster(80, [0, -3], [[0.5, 0], [0, 0.5]]);
    
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
                colorscale: 'Viridis',
                size: 8,
                opacity: 0.7
            }
        }
    ];
    
    const layout = {
        title: 'Synthetic Data with 3 Clusters',
        xaxis: { title: 'Feature 1' },
        yaxis: { title: 'Feature 2' },
        margin: { t: 40, r: 20, l: 40, b: 40 },
        hovermode: 'closest',
        showlegend: false
    };
    
    Plotly.newPlot(plotElement, data, layout, {responsive: true});
}

// Create Gaussian 2D plot
function createGaussian2DPlot() {
    const plotElement = document.getElementById('gaussian-2d-plot');
    if (!plotElement) return;
    
    // Generate grid of points
    const n = 50;
    const x = numeric.linspace(-3, 3, n);
    const y = numeric.linspace(-3, 3, n);
    const z = [];
    
    // Mean and covariance for the Gaussian
    const mu = [0, 0];
    const sigma = [[1, 0.5], [0.5, 1]];
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
            colorscale: 'Viridis',
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
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        margin: { t: 40, r: 20, l: 40, b: 40 },
        showlegend: false
    };
    
    Plotly.newPlot(plotElement, data, layout, {responsive: true});
}

// Create comparison plots (K-Means vs GMM)
function createComparisonPlots() {
    // K-Means plot
    const kmeansPlotElement = document.getElementById('kmeans-plot');
    if (kmeansPlotElement) {
        createKMeansPlot(kmeansPlotElement);
    }
    
    // GMM plot
    const gmmPlotElement = document.getElementById('gmm-plot');
    if (gmmPlotElement) {
        createGMMComparisonPlot(gmmPlotElement);
    }
}

// Create K-Means visualization
function createKMeansPlot(element) {
    // Generate synthetic data that clearly shows K-Means limitations
    const cluster1 = generateGaussianCluster(100, [-2, 0], [[0.5, 0], [0, 2.0]]);
    const cluster2 = generateGaussianCluster(100, [2, 0], [[0.5, 0], [0, 2.0]]);
    
    // Combine all data
    const allX = cluster1.x.concat(cluster2.x);
    const allY = cluster1.y.concat(cluster2.y);
    
    // Simulate K-Means clustering with a vertical decision boundary at x=0
    const assignedCluster = allX.map(x => x < 0 ? 0 : 1);
    
    // Create scatter plot with K-Means clusters
    const data = [
        {
            x: allX,
            y: allY,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: assignedCluster,
                colorscale: 'Portland',
                size: 8,
                opacity: 0.7
            }
        },
        // Add vertical decision boundary
        {
            x: [0, 0],
            y: [-5, 5],
            mode: 'lines',
            line: {
                color: 'black',
                width: 2,
                dash: 'dash'
            }
        }
    ];
    
    const layout = {
        title: 'K-Means Clustering',
        xaxis: { title: 'Feature 1', range: [-4, 4] },
        yaxis: { title: 'Feature 2', range: [-4, 4] },
        margin: { t: 40, r: 10, l: 40, b: 40 },
        showlegend: false
    };
    
    Plotly.newPlot(element, data, layout, {responsive: true});
}

// Create GMM comparison visualization
function createGMMComparisonPlot(element) {
    // Use same data as K-Means
    const cluster1 = generateGaussianCluster(100, [-2, 0], [[0.5, 0], [0, 2.0]]);
    const cluster2 = generateGaussianCluster(100, [2, 0], [[0.5, 0], [0, 2.0]]);
    
    // Combine all data
    const allX = cluster1.x.concat(cluster2.x);
    const allY = cluster1.y.concat(cluster2.y);
    
    // Instead of decision boundary, show probability contours
    const xGrid = numeric.linspace(-4, 4, 100);
    const yGrid = numeric.linspace(-4, 4, 100);
    const zGrid = [];
    
    // Create simple GMM manually for visualization
    const means = [[-2, 0], [2, 0]];
    const covars = [[[0.5, 0], [0, 2.0]], [[0.5, 0], [0, 2.0]]];
    const weights = [0.5, 0.5];
    
    // Calculate probabilities on grid
    for (let i = 0; i < xGrid.length; i++) {
        zGrid[i] = [];
        for (let j = 0; j < yGrid.length; j++) {
            // Calculate mixture probability
            let prob = 0;
            for (let k = 0; k < weights.length; k++) {
                prob += weights[k] * gaussianPDF([xGrid[i], yGrid[j]], means[k], covars[k]);
            }
            zGrid[i][j] = prob;
        }
    }
    
    // Create scatter plot with GMM contours
    const data = [
        // Contour plot for GMM probabilities
        {
            z: zGrid,
            x: xGrid,
            y: yGrid,
            type: 'contour',
            colorscale: 'Portland',
            opacity: 0.7,
            showscale: false,
            contours: {
                coloring: 'fill',
                showlabels: false
            }
        },
        // Scatter plot of data
        {
            x: allX,
            y: allY,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: 'rgba(0, 0, 0, 0.6)',
                size: 6
            }
        }
    ];
    
    const layout = {
        title: 'GMM Clustering',
        xaxis: { title: 'Feature 1', range: [-4, 4] },
        yaxis: { title: 'Feature 2', range: [-4, 4] },
        margin: { t: 40, r: 10, l: 40, b: 40 },
        showlegend: false
    };
    
    Plotly.newPlot(element, data, layout, {responsive: true});
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