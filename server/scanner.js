import { exec } from 'child_process';
import util from 'util';
import si from 'systeminformation';
import findProcess from 'find-process';
import { classifyPort } from './classifier.js';

const execAsync = util.promisify(exec);
const isWindows = process.platform === 'win32';

/**
 * Parses lsof output for macOS / Linux
 */
async function getPortsUnix() {
  try {
    // -i: internet files, -P: no port names, -n: no host names
    const { stdout } = await execAsync('lsof -i -P -n | grep LISTEN');
    const lines = stdout.trim().split('\n').filter(Boolean);
    const results = [];
    const seenPorts = new Set();

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 9) continue;

      const processName = parts[0];
      const pid = parseInt(parts[1], 10);
      const user = parts[2];
      const protocol = parts[7] || 'TCP';
      const addressPort = parts[8]; // e.g. *:3000 or 127.0.0.1:8080 or [::1]:5173

      if (!addressPort) continue;

      // Extract port number and IP
      const lastColonIndex = addressPort.lastIndexOf(':');
      if (lastColonIndex === -1) continue;

      const address = addressPort.substring(0, lastColonIndex);
      const port = parseInt(addressPort.substring(lastColonIndex + 1), 10);

      if (isNaN(port) || isNaN(pid)) continue;

      const key = `${port}-${pid}`;
      if (seenPorts.has(key)) continue;
      seenPorts.add(key);

      results.push({
        port,
        pid,
        processName,
        user,
        protocol,
        address: address === '*' ? '0.0.0.0' : address
      });
    }
    return results;
  } catch (err) {
    // If lsof fails or no LISTEN ports found, fallback to findProcess or ss
    return [];
  }
}

/**
 * Parses netstat output for Windows
 */
async function getPortsWindows() {
  try {
    const { stdout } = await execAsync('netstat -ano | findstr LISTENING');
    const lines = stdout.trim().split('\r\n').filter(Boolean);
    const results = [];
    const seenPorts = new Set();

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 5) continue;

      const protocol = parts[0];
      const localAddress = parts[1];
      const pid = parseInt(parts[4], 10);

      const lastColonIndex = localAddress.lastIndexOf(':');
      if (lastColonIndex === -1) continue;

      const address = localAddress.substring(0, lastColonIndex);
      const port = parseInt(localAddress.substring(lastColonIndex + 1), 10);

      if (isNaN(port) || isNaN(pid) || pid === 0) continue;

      const key = `${port}-${pid}`;
      if (seenPorts.has(key)) continue;
      seenPorts.add(key);

      results.push({
        port,
        pid,
        processName: 'Unknown',
        user: 'System',
        protocol,
        address: address === '[::]' ? '0.0.0.0' : address
      });
    }
    return results;
  } catch (err) {
    return [];
  }
}

/**
 * Enriches basic port info with systeminformation process telemetry
 */
export async function scanPorts() {
  let basicPorts = [];

  if (isWindows) {
    basicPorts = await getPortsWindows();
  } else {
    basicPorts = await getPortsUnix();
  }

  // Fetch process list from systeminformation for CPU/RAM & Command details
  let processList = [];
  try {
    const procData = await si.processes();
    processList = procData.list || [];
  } catch (e) {
    // Ignore error if process fetch fails
  }

  const procMap = new Map();
  for (const proc of processList) {
    procMap.set(proc.pid, proc);
  }

  // Build final detailed port metrics
  const enrichedPorts = await Promise.all(
    basicPorts.map(async (item) => {
      let proc = procMap.get(item.pid);

      // Fallback to find-process if process info missing
      if (!proc || !item.processName || item.processName === 'Unknown') {
        try {
          const fpList = await findProcess('pid', item.pid);
          if (fpList && fpList.length > 0) {
            const fp = fpList[0];
            item.processName = fp.name || item.processName;
            item.command = fp.cmd || item.command;
          }
        } catch (e) {}
      }

      const processName = proc?.name || item.processName || 'system';
      const command = proc?.command || item.command || processName;
      const cpu = proc?.cpu !== undefined ? parseFloat(proc.cpu.toFixed(1)) : 0.0;
      const mem = proc?.memRss !== undefined ? parseFloat((proc.memRss / 1024 / 1024).toFixed(1)) : 0.0;
      const user = proc?.user || item.user || 'User';

      const classification = classifyPort({
        port: item.port,
        processName,
        address: item.address,
        command,
        user
      });

      return {
        port: item.port,
        pid: item.pid,
        processName,
        command,
        protocol: item.protocol || 'TCP',
        address: item.address || '127.0.0.1',
        user,
        cpu,
        memoryMB: mem,
        status: classification.status, // 'safe', 'caution', 'danger'
        category: classification.category,
        reasoning: classification.reasoning,
        isPubliclyExposed: classification.isPubliclyExposed,
        startedAt: proc?.started || new Date().toISOString()
      };
    })
  );

  // Sort by port number ascending
  return enrichedPorts.sort((a, b) => a.port - b.port);
}
