#!/usr/bin/env node

/**
 * Performance benchmark for LaTeX to HTML engines
 */

const fs = require('fs');
const { performance } = require('perf_hooks');

// Node.js engine
const LatexToHtmlEngine = require('./engine.js');

function runBenchmark() {
    console.log('🚀 LaTeX to HTML Engine Performance Benchmark\n');
    
    const inputFile = 'index.tex';
    const iterations = 1000;
    
    if (!fs.existsSync(inputFile)) {
        console.error(`❌ File ${inputFile} not found`);
        return;
    }
    
    // Node.js Engine Test
    console.log('📊 Testing Node.js Engine...');
    const nodeEngine = new LatexToHtmlEngine();
    
    const nodeStart = performance.now();
    for (let i = 0; i < iterations; i++) {
        nodeEngine.generateHtml(inputFile);
    }
    const nodeEnd = performance.now();
    const nodeTime = nodeEnd - nodeStart;
    
    console.log(`✅ Node.js: ${iterations} conversions in ${nodeTime.toFixed(2)}ms`);
    console.log(`⚡ Node.js: ${(nodeTime / iterations).toFixed(3)}ms per conversion`);
    console.log(`🔥 Node.js: ${(iterations / nodeTime * 1000).toFixed(0)} conversions/second`);
    
    // Memory usage
    const memUsage = process.memoryUsage();
    console.log(`💾 Memory: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    
    // File size comparison
    const nodeEngineSize = fs.statSync('engine.js').size;
    console.log(`📦 Engine size: ${nodeEngineSize} bytes (${(nodeEngineSize / 1024).toFixed(1)}KB)`);
    
    console.log('\n🎯 Results:');
    console.log(`- Ultra lightweight Node.js engine`);
    console.log(`- Zero dependencies`);
    console.log(`- Fast performance`);
    console.log(`- Minified CSS/JS for maximum speed`);
}

if (require.main === module) {
    runBenchmark();
}