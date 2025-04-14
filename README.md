# Gaussian Mixture Models Tutorial

This is a web-based tutorial on Model-based Clustering with Gaussian Mixture Models. The tutorial provides an interactive learning experience with visualizations and explanations of GMM concepts.

## Features

- Comprehensive introduction to clustering and GMMs
- Interactive visualizations of GMM concepts
- Comparison with K-Means
- Step-by-step implementation in scikit-learn
- Explanation of hyperparameter tuning

## Deployment Options

### 1. Deploy on GitHub Pages

1. Create a new GitHub repository
2. Push the contents of this folder to the repository
3. Go to repository Settings > Pages
4. Select the main branch as the source
5. Your tutorial will be available at `https://[your-username].github.io/[repo-name]/`

### 2. Deploy on Netlify

1. Create an account on [Netlify](https://www.netlify.com/) if you don't have one
2. Click "New site from Git"
3. Connect your GitHub, GitLab, or Bitbucket account
4. Select the repository containing this tutorial
5. Click "Deploy site"

### 3. Deploy on Vercel

1. Create an account on [Vercel](https://vercel.com/) if you don't have one
2. Click "New Project"
3. Import your repository containing this tutorial
4. Click "Deploy"

### 4. Local Deployment

For local deployment or testing, you can use any static file server. For example:

#### Using Python's built-in HTTP server:

```bash
# Navigate to the tutorial directory
cd gmm-tutorial

# Start a simple HTTP server
python -m http.server 8000
```

Then open your browser and go to `http://localhost:8000/`

#### Using Node.js and http-server:

```bash
# Install http-server globally
npm install -g http-server

# Navigate to the tutorial directory
cd gmm-tutorial

# Start the server
http-server -p 8000
```

Then open your browser and go to `http://localhost:8000/`

## Customization

- Modify `index.html` to change the content structure
- Edit `css/styles.css` to customize the appearance
- Update `js/script.js` to modify visualizations or add new interactive elements

## Dependencies

This tutorial uses the following libraries:

- Bootstrap 5.3.0 for layout and styling
- Plotly.js 2.18.2 for interactive visualizations
- KaTeX 0.16.4 for mathematical formula rendering
- D3.js 7.8.2 for data visualization utilities

## License

This tutorial is provided under the MIT License. Feel free to use, modify, and distribute it as needed. 