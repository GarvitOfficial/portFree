/**
 * Security & Status Classifier for portFree
 * Categorizes active ports into Safe, Caution, or Danger
 */

const KNOWN_DEV_PORTS = new Set([
  3000, 3001, 3002, 3003, 4000, 4200, 5000, 5173, 5174, 8000, 8080, 8081, 8888, 9000, 1337, 7000
]);

const KNOWN_DB_PORTS = new Set([
  5432, // PostgreSQL
  6379, // Redis
  27017, // MongoDB
  3306, // MySQL / MariaDB
  9200, // Elasticsearch
  11211, // Memcached
  8500, // Consul
  9092, // Kafka
]);

const KNOWN_SYS_PORTS = new Set([
  22,   // SSH
  53,   // DNS
  80,   // HTTP
  443,  // HTTPS
  631,  // CUPS printing
]);

const KNOWN_SAFE_PROCESSES = [
  'node', 'node.exe',
  'python', 'python3', 'python.exe',
  'vite', 'next', 'webpack',
  'docker', 'com.docker.backend', 'dockerd',
  'postgres', 'postgres.exe', 'postmaster',
  'redis-server', 'redis-server.exe',
  'mysqld', 'mysqld.exe',
  'mongod', 'mongod.exe',
  'java', 'java.exe',
  'go', 'main',
  'ruby', 'rails',
  'bun', 'deno',
  'code', 'Code Helper', 'VS Code',
  'nginx', 'apache2', 'httpd',
  'ControlCenter', 'airplayd', 'rapportd' // macOS safe services
];

export function classifyPort(portData) {
  const { port, processName, address, command, user } = portData;
  const lowerName = (processName || '').toLowerCase();
  const lowerCommand = (command || '').toLowerCase();

  let status = 'safe';
  let category = 'Dev Tool';
  let reasoning = 'Recognized application or development port';

  const isDevPort = KNOWN_DEV_PORTS.has(port);
  const isDbPort = KNOWN_DB_PORTS.has(port);
  const isSysPort = KNOWN_SYS_PORTS.has(port);
  const isSafeProc = KNOWN_SAFE_PROCESSES.some(p => lowerName.includes(p.toLowerCase()));

  // Categorize
  if (isDbPort) {
    category = 'Database';
  } else if (isDevPort) {
    category = 'Dev Server';
  } else if (isSysPort) {
    category = 'System Service';
  } else if (lowerName.includes('docker')) {
    category = 'Container';
  } else {
    category = 'Application';
  }

  // Determine Danger / Caution triggers
  const isPubliclyExposed = address === '0.0.0.0' || address === '::' || address === '*';
  const isTempDirectory = lowerCommand.includes('/tmp/') || lowerCommand.includes('\\temp\\') || lowerCommand.includes('/var/tmp/');
  const isUnknownHighPort = port > 30000 && !isSafeProc;
  const isSuspiciousName = lowerName.includes('malware') || lowerName.includes('miner') || lowerName.includes('hack');

  if (isSuspiciousName || isTempDirectory) {
    status = 'danger';
    reasoning = isTempDirectory
      ? 'Process running from temporary directory'
      : 'Suspicious process signature detected';
  } else if (isUnknownHighPort || (!isSafeProc && !isDevPort && !isDbPort && isPubliclyExposed)) {
    status = 'caution';
    reasoning = isPubliclyExposed
      ? 'Exposed on all network interfaces (0.0.0.0)'
      : 'Unrecognized high port process';
  } else if (isPubliclyExposed && !isDevPort && !isDbPort) {
    status = 'caution';
    reasoning = 'Listening globally on 0.0.0.0';
  } else {
    status = 'safe';
    reasoning = `Trusted process (${processName || 'system'}) operating normally`;
  }

  return {
    status,
    category,
    reasoning,
    isPubliclyExposed
  };
}
