interface UsageMetrics {
  totalTokens: number;
  totalCost: number;
  totalConversations: number;
  timestamp: number;
  availableBalance: number;
}

const METRICS_KEY = 'ltii_usage_metrics';
const DEFAULT_BALANCE = 10.00; // Saldo inicial padrão em dólares
const COST_PER_TOKEN = 0.00002;

const DEFAULT_METRICS: UsageMetrics = {
  totalTokens: 0,
  totalCost: 0,
  totalConversations: 0,
  timestamp: Date.now(),
  availableBalance: DEFAULT_BALANCE,
};

function getStoredMetrics(): UsageMetrics {
  try {
    const stored = localStorage.getItem(METRICS_KEY);
    if (!stored) return { ...DEFAULT_METRICS };
    
    const parsed = JSON.parse(stored);
    return {
      totalTokens: Number(parsed.totalTokens) || 0,
      totalCost: Number(parsed.totalCost) || 0,
      totalConversations: Number(parsed.totalConversations) || 0,
      timestamp: Number(parsed.timestamp) || Date.now(),
      availableBalance: Number(parsed.availableBalance) || DEFAULT_BALANCE,
    };
  } catch (error) {
    console.error('Error reading metrics:', error);
    return { ...DEFAULT_METRICS };
  }
}

function saveMetrics(metrics: UsageMetrics) {
  try {
    localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
  } catch (error) {
    console.error('Error saving metrics:', error);
  }
}

export function updateMetrics(newTokens: number, isNewConversation: boolean = false): UsageMetrics {
  const currentMetrics = getStoredMetrics();
  const newCost = (newTokens || 0) * COST_PER_TOKEN;
  
  const updatedMetrics = {
    totalTokens: currentMetrics.totalTokens + (newTokens || 0),
    totalCost: currentMetrics.totalCost + newCost,
    availableBalance: Math.max(0, currentMetrics.availableBalance - newCost),
    totalConversations: isNewConversation 
      ? currentMetrics.totalConversations + 1 
      : currentMetrics.totalConversations,
    timestamp: Date.now(),
  };

  saveMetrics(updatedMetrics);
  return updatedMetrics;
}

export function getMetrics(): UsageMetrics {
  return getStoredMetrics();
}

export function resetMetrics(): UsageMetrics {
  saveMetrics({ ...DEFAULT_METRICS });
  return { ...DEFAULT_METRICS };
}

export function addBalance(amount: number): UsageMetrics {
  const currentMetrics = getStoredMetrics();
  const updatedMetrics = {
    ...currentMetrics,
    availableBalance: currentMetrics.availableBalance + Math.max(0, amount || 0),
    timestamp: Date.now(),
  };
  saveMetrics(updatedMetrics);
  return updatedMetrics;
}
