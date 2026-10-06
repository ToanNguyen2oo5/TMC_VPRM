import { useState, useEffect } from 'react';

export function useDeviceTier() {
  const [tier, setTier] = useState('high'); // 'high' | 'low'
  
  useEffect(() => {
    let isLow = false;
    
    // Check Hardware Concurrency
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      isLow = true;
    }
    
    // Check Device Memory
    if (navigator.deviceMemory && navigator.deviceMemory <= 4) {
      isLow = true;
    }
    
    // Data Saver
    if (navigator.connection && navigator.connection.saveData) {
      isLow = true;
    }
    
    setTier(isLow ? 'low' : 'high');
  }, []);
  
  return tier;
}
