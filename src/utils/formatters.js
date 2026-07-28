/**
 * Formats uptime seconds into HH:MM:SS or readable duration
 */
export function formatUptime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num) => String(num).padStart(2, '0');
  if (hrs > 0) {
    return `${hrs}h ${pad(mins)}m ${pad(secs)}s`;
  }
  return `${pad(mins)}m ${pad(secs)}s`;
}

/**
 * Truncates long command paths safely for preview
 */
export function formatCommand(cmd, maxLength = 45) {
  if (!cmd) return 'Unknown Command';
  if (cmd.length <= maxLength) return cmd;
  const start = cmd.substring(0, 20);
  const end = cmd.substring(cmd.length - 20);
  return `${start}...${end}`;
}

/**
 * Formats memory in MB/GB
 */
export function formatMemory(mb) {
  if (!mb || mb <= 0) return '< 1 MB';
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`;
  }
  return `${mb.toFixed(0)} MB`;
}

/**
 * Formats port numbers with leading colon
 */
export function formatPort(port) {
  return `:${port}`;
}
