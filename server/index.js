import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import si from 'systeminformation';
import { scanPorts } from './scanner.js';
import { killProcess } from './killer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API: Get active ports & telemetry
app.get('/api/ports', async (req, res) => {
  try {
    const ports = await scanPorts();

    // Summary counts
    const summary = {
      total: ports.length,
      safe: ports.filter(p => p.status === 'safe').length,
      caution: ports.filter(p => p.status === 'caution').length,
      danger: ports.filter(p => p.status === 'danger').length,
      timestamp: new Date().toISOString()
    };

    res.json({ success: true, summary, ports });
  } catch (err) {
    console.error('Error scanning ports:', err);
    res.status(500).json({ success: false, error: err.message, ports: [] });
  }
});

// API: Get live system metrics (CPU load, RAM, Uptime)
app.get('/api/system', async (req, res) => {
  try {
    const [mem, currentLoad, osInfo, time] = await Promise.all([
      si.mem(),
      si.currentLoad(),
      si.osInfo(),
      si.time()
    ]);

    const totalMemGB = (mem.total / (1024 ** 3)).toFixed(1);
    const usedMemGB = (mem.active / (1024 ** 3)).toFixed(1);
    const memPercent = Math.round((mem.active / mem.total) * 100);
    const cpuLoad = Math.round(currentLoad.currentLoad);

    res.json({
      success: true,
      system: {
        hostname: osInfo.hostname,
        platform: osInfo.platform,
        distro: osInfo.distro,
        arch: osInfo.arch,
        uptimeSeconds: Math.floor(time.uptime),
        cpuLoadPercent: cpuLoad,
        totalMemGB,
        usedMemGB,
        memPercent
      }
    });
  } catch (err) {
    console.error('Error fetching system stats:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Terminate process on port / PID
app.post('/api/kill', async (req, res) => {
  const { pid, port, signal } = req.body;

  if (!pid) {
    return res.status(400).json({ success: false, error: 'PID is required to kill process' });
  }

  try {
    const result = await killProcess(pid, signal || 'SIGTERM');
    res.json({
      success: true,
      message: `Process PID ${pid} ${port ? `on port :${port}` : ''} terminated successfully`,
      result
    });
  } catch (err) {
    console.error(`Failed to kill process PID ${pid}:`, err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend build if dist folder exists
const distPath = path.join(rootDir, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family: monospace; padding: 2rem; background: #0a0a0f; color: #00ff88; min-height: 100vh;">
        <h2>⚡ portFree Server Running on Port ${PORT}</h2>
        <p>API Available at <code>/api/ports</code> and <code>/api/system</code></p>
        <p>Run <code>npm run build</code> to serve the React control panel frontend directly from Express.</p>
      </div>
    `);
  });
}

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`⚡ portFree Dev-Ops Dashboard active on http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
