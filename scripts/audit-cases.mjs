import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function audit() {
  const casesDir = path.join(projectRoot, 'src', 'data', 'cases');
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
  
  let totalCases = 0;
  const issues = [];
  
  // Quick hack: we can't easily import standard modules if they are not standard ES or have jsx etc,
  // but let's try to dynamically import them.
  for (const file of files) {
    try {
      const filePath = path.join(casesDir, file);
      // Read file and parse out the objects. 
      // Actually dynamic import should work if we add file://
      const module = await import('file://' + filePath);
      const cases = module.default || Object.values(module)[0];
      
      if (!Array.isArray(cases)) {
        issues.push(`File ${file} does not export an array of cases.`);
        continue;
      }
      
      for (const c of cases) {
        totalCases++;
        const caseName = `Case ${c.id || c.name} (${file})`;
        
        // Check vitals
        if (!c.vitals) {
           // Outpatient / stationary might not have vitals? Let's check.
           issues.push(`${caseName}: Missing vitals`);
        } else {
           const { bp, hr, rr, temp, spo2 } = c.vitals;
           if (!bp || !hr || !rr || !temp || !spo2) {
             issues.push(`${caseName}: Incomplete vitals (bp: ${bp}, hr: ${hr}, rr: ${rr}, temp: ${temp}, spo2: ${spo2})`);
           }
        }
        
        // Check deathThresholds
        if (file.includes('emergency')) {
           if (!c.deathThresholds) {
              issues.push(`${caseName}: Missing deathThresholds`);
           }
        }
        
        // Check needDiag / needTreat / wrongTreat
        if (c.needDiag && !Array.isArray(c.needDiag)) issues.push(`${caseName}: needDiag is not an array`);
        if (c.needTreat && !Array.isArray(c.needTreat)) issues.push(`${caseName}: needTreat is not an array`);
        if (c.wrongTreat && !Array.isArray(c.wrongTreat)) issues.push(`${caseName}: wrongTreat is not an array`);
      }
    } catch (e) {
      issues.push(`Error loading ${file}: ${e.message}`);
    }
  }
  
  console.log(`Audited ${totalCases} cases.`);
  if (issues.length > 0) {
    console.log("Found issues:");
    console.log(issues.join('\n'));
  } else {
    console.log("No structural issues found.");
  }
}

audit();
