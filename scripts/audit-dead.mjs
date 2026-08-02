import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function audit() {
  const casesDir = path.join(projectRoot, 'src', 'data', 'cases');
  
  const files = [
    'emergency/cardiac.js',
    'emergency/neuro.js',
    'emergency/respiratory.js',
    'emergency/infectious.js',
    'emergency/endocrine.js',
    'emergency/toxicology.js',
    'emergency/abdominal.js'
  ];
  
  for (const file of files) {
    const filePath = path.join(casesDir, file);
    const module = await import('file://' + filePath);
    const cases = module.default || Object.values(module)[0];
    
    for (const c of cases) {
      let isDead = false;
      const dt = c.deathThresholds || {};
      const sbp = c.vitals.bp ? parseInt(c.vitals.bp.split('/')[0]) : NaN;
      if (!isNaN(sbp) && (dt.sbp != null ? sbp <= dt.sbp : sbp < 50)) isDead = true;
      if (dt.spo2 != null ? c.vitals.spo2 <= dt.spo2 : c.vitals.spo2 < 60) isDead = true;
      if (dt.gcs != null ? c.initialGCS <= dt.gcs : c.initialGCS <= 3) isDead = true;
      
      // For cardiac arrest, HR is 0 and SBP is 0. If dt.sbp is not set, SBP < 50 triggers dead.
      // If HR is 0, is that triggering dead? No hr threshold by default, but sbp is.
      if (c.vitals.bp === '---/---') {
        if (dt.sbp != null ? 0 <= dt.sbp : 0 < 50) isDead = true;
      }
      
      if (isDead) {
        console.log(`Case ${c.id} (${file}) starts DEAD. gcs=${c.initialGCS}, dt.gcs=${dt.gcs}, bp=${c.vitals.bp}, dt.sbp=${dt.sbp}, spo2=${c.vitals.spo2}, dt.spo2=${dt.spo2}`);
      }
    }
  }
}
audit();
