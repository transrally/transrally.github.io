# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pull targeting the default branch
  pull_request:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - run: npm ci
      - run: npm run-script build
      - name: Archive production artifacts
        uses: actions/upload-artifact@v3
        with:
          name: Static-Site-Assets
          path: public/transrally.github.io/

  # Single deploy job since we're just deploying
  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{steps.deployment.outputs.page_url}}
    steps:
      - uses: actions/download-artifact@master
        with:
          name: Static-Site-Assets
          path: .
      - uses: actions/configure-pages@v1
      - uses: actions/upload-pages-artifact@v1
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@main