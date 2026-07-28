import treeKill from 'tree-kill';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);
const isWindows = process.platform === 'win32';

/**
 * Terminates a process by PID across platforms
 */
export async function killProcess(pid, signal = 'SIGTERM') {
  const numericPid = parseInt(pid, 10);
  if (isNaN(numericPid) || numericPid <= 0) {
    throw new Error('Invalid PID provided for termination');
  }

  // Prevent killing core system PIDs
  if (numericPid === 1 || numericPid === 0) {
    throw new Error('Termination blocked: Attempted to kill system init process');
  }

  return new Promise((resolve, reject) => {
    // Attempt treeKill first
    treeKill(numericPid, signal === 'SIGKILL' ? 'SIGKILL' : 'SIGTERM', async (err) => {
      if (!err) {
        return resolve({ success: true, pid: numericPid, method: 'tree-kill' });
      }

      // Fallback to native process termination or OS CLI
      try {
        if (isWindows) {
          await execAsync(`taskkill /F /PID ${numericPid}`);
        } else {
          await execAsync(`kill -9 ${numericPid}`);
        }
        resolve({ success: true, pid: numericPid, method: 'os-fallback' });
      } catch (fallbackErr) {
        reject(new Error(`Failed to kill process ${numericPid}: ${fallbackErr.message}`));
      }
    });
  });
}
