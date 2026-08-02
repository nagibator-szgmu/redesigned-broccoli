import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function audit() {
  const casesDir = path.join(projectRoot, 'src', 'data', 'cases');
  const dataDir = path.join(projectRoot, 'src', 'data');
  
  const diagModule = await import('file://' + path.join(dataDir, 'diagnostics.js'));
  const diagTests = diagModule.DIAGNOSTICS;
  const validDiagIds = new Set(diagTests.map(d => d.id));
  
  const treatModule = await import('file://' + path.join(dataDir, 'treatments.js'));
  const validTreatIds = new Set(Object.keys(treatModule.TREAT_FX));
  // If there's also a TREATMENTS array, we can use that, but keys of TREAT_FX is a good start
  if (treatModule.TREATMENTS) {
     treatModule.TREATMENTS.forEach(t => validTreatIds.add(t.id));
  }
  
  const files = [
    'outpatient.js',
    'stationary.js',
    'emergency/abdominal.js',
    'emergency/cardiac.js',
    'emergency/endocrine.js',
    'emergency/infectious.js',
    'emergency/neuro.js',
    'emergency/respiratory.js',
    'emergency/toxicology.js'
  ];
  
  const issues = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(casesDir, file);
      const module = await import('file://' + filePath);
      const cases = module.default || Object.values(module)[0];
      
      for (const c of cases) {
        const caseName = `Case ${c.id || c.name} (${file})`;
        
        // check needDiag
        if (c.needDiag) {
           c.needDiag.forEach(d => {
             if (!validDiagIds.has(d)) issues.push(`${caseName}: Unknown diagnostic test - ${d}`);
           });
        }
        
        // check needTreat
        if (c.needTreat) {
           c.needTreat.forEach(t => {
             if (!validTreatIds.has(t)) issues.push(`${caseName}: Unknown treatment - ${t}`);
           });
        }
        
        // check wrongTreat
        if (c.wrongTreat) {
           c.wrongTreat.forEach(t => {
             if (!validTreatIds.has(t)) issues.push(`${caseName}: Unknown wrong treatment - ${t}`);
           });
        }
      }
    } catch (e) {
      issues.push(`Error loading ${file}: ${e.message}`);
    }
  }
  
  if (issues.length > 0) {
    console.log("Found medical reference issues:");
    console.log(issues.join('\n'));
  } else {
    console.log("100% validity confirmed for test and treatment references.");
  }
}

audit();
