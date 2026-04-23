import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const HealthCheckContext = createContext(undefined);

export const HealthCheckProvider = ({ children }) => {
  const [healthStatus, setHealthStatus] = useState({
    ok: true, // Optimistic default to avoid flash of banner
    service: null,
    timestamp: null
  });
  const [isChecking, setIsChecking] = useState(true);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    try {
      const response = await axios.get('https://inmejora-dash-n45svwn6.manus.space/api/horizon/health');
      setHealthStatus({
        ok: true, // Assuming 200 OK means healthy if response structure varies
        service: response.data?.service || 'Online',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({
        ok: false,
        service: 'Offline',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // Optional: periodic check could go here
  }, [checkHealth]);

  return (
    <HealthCheckContext.Provider value={{ healthStatus, isChecking, checkHealth }}>
      {children}
    </HealthCheckContext.Provider>
  );
};

export const useHealthCheck = () => {
  const context = useContext(HealthCheckContext);
  if (context === undefined) {
    throw new Error('useHealthCheck must be used within a HealthCheckProvider');
  }
  return context;
};