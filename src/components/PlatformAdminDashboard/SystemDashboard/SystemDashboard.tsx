// fe/src/components/platformAdminDashboard/SystemDashboard/SystemDashboard.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/authContext';
import { getSystemHealth, getPerformanceMetrics, getDatabaseStats, getServerInfo } from '../../../services/api/common/systemApi';
import './SystemDashboard.scss';

const SystemsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      const [healthRes, metricsRes, dbRes, serverRes] = await Promise.allSettled([
        getSystemHealth(),
        getPerformanceMetrics(),
        getDatabaseStats(),
        getServerInfo()
      ]);

      if (healthRes.status === 'fulfilled') setHealth(healthRes.value.data);
      if (metricsRes.status === 'fulfilled') setMetrics(metricsRes.value.data);
      if (dbRes.status === 'fulfilled') setDbStats(dbRes.value.data);
      if (serverRes.status === 'fulfilled') setServerInfo(serverRes.value.data);

    } catch (err) {
      setError('Failed to fetch system data');
      console.error('System data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) return <div className="systems-loading">Loading system data...</div>;
  if (error) return <div className="systems-error">{error}</div>;

  return (
    <div className="systems-dashboard">
      <div className="systems-header">
        <h1>System Health & Performance</h1>
        <button onClick={fetchSystemData} className="refresh-btn">
          Refresh
        </button>
      </div>

      {/* Overall Status Card */}
      <div className="status-card">
        <h2>Overall System Status</h2>
        <div className="status-indicator" style={{ backgroundColor: getStatusColor(health?.status || 'unknown') }}>
          {health?.status?.toUpperCase() || 'UNKNOWN'}
        </div>
        <p>Last checked: {new Date(health?.timestamp || '').toLocaleString()}</p>
      </div>

      <div className="metrics-grid">
        {/* Component Health */}
        <div className="metric-card">
          <h3>Component Health</h3>
          {health?.components && Object.entries(health.components).map(([component, data]) => (
            <div key={component} className="component-health">
              <span className="component-name">{component.toUpperCase()}</span>
              <span 
                className="component-status" 
                style={{ color: getStatusColor(data.status) }}
              >
                {data.status}
              </span>
              <span className="response-time">{data.responseTime}ms</span>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="metric-card">
          <h3>Performance Metrics</h3>
          {metrics && (
            <>
              <div className="metric-row">
                <span>CPU Usage:</span>
                <span>{metrics.cpu.usage}%</span>
              </div>
              <div className="metric-row">
                <span>Memory:</span>
                <span>{formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}</span>
              </div>
              <div className="metric-row">
                <span>Uptime:</span>
                <span>{formatUptime(metrics.uptime)}</span>
              </div>
              <div className="metric-row">
                <span>Requests/sec:</span>
                <span>{metrics.requests.perSecond}</span>
              </div>
            </>
          )}
        </div>

        {/* Database Stats */}
        <div className="metric-card">
          <h3>Database Statistics</h3>
          {dbStats && (
            <>
              <div className="metric-row">
                <span>Total Documents:</span>
                <span>{dbStats.totalDocuments.toLocaleString()}</span>
              </div>
              <div className="metric-row">
                <span>Collections:</span>
                <span>{dbStats.collections}</span>
              </div>
              <div className="metric-row">
                <span>Storage:</span>
                <span>{formatBytes(dbStats.storageSize)}</span>
              </div>
              <div className="metric-row">
                <span>Connections:</span>
                <span>{dbStats.connections.current}/{dbStats.connections.available}</span>
              </div>
            </>
          )}
        </div>

        {/* Server Info */}
        <div className="metric-card">
          <h3>Server Information</h3>
          {serverInfo && (
            <>
              <div className="metric-row">
                <span>Node.js:</span>
                <span>{serverInfo.nodeVersion}</span>
              </div>
              <div className="metric-row">
                <span>Platform:</span>
                <span>{serverInfo.platform} ({serverInfo.arch})</span>
              </div>
              <div className="metric-row">
                <span>Environment:</span>
                <span>{serverInfo.environment}</span>
              </div>
              <div className="metric-row">
                <span>Uptime:</span>
                <span>{formatUptime(serverInfo.uptime)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn-primary">Run Diagnostics</button>
        <button className="btn-secondary">Clear Cache</button>
        <button className="btn-warning">Restart Services</button>
      </div>
    </div>
  );
};

export default SystemsDashboard;