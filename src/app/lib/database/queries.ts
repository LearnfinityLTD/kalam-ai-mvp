// /lib/database/queries.ts
// Prepared statements for executive dashboard with proper typing

interface RiskMatrixData {
  risk_level: RiskLevel;
  compliance_risk_score: number;
  count: number;
}

interface ROIData {
  sum: number;
}

export const dashboardQueries = {
  // Risk Matrix data for executive dashboard
  async getRiskMatrix(tenantId: string): Promise<RiskMatrixData[]> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('clarity_scores')
      .select('risk_level, compliance_risk_score, COUNT(*)')
      .eq('tenant_id', tenantId)
      .gte('created_at', thirtyDaysAgo)
      .group('risk_level, compliance_risk_score');
    
    if (error) {
      throw new Error(`Risk matrix query failed: ${error.message}`);
    }
    
    return data as RiskMatrixData[];
  },

  // Monthly ROI calculation
  async getMonthlyROI(tenantId: string): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('analytics_metrics')
      .select('SUM(metric_value)')
      .eq('tenant_id', tenantId)
      .eq('metric_type', 'risk_reduction')
      .eq('time_period', 'monthly')
      .gte('recorded_date', thirtyDaysAgo);
    
    if (error) {
      throw new Error(`ROI query failed: ${error.message}`);
    }
    
    const result = data as ROIData[];
    return result[0]?.sum || 0;
  },

  // Critical incidents for compliance reporting
  async getCriticalIncidents(tenantId: string, limit = 10): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('risk_level', 'high')
      .eq('regulatory_impact', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Critical incidents query failed: ${error.message}`);
    }
    
    return data as AuditLog[];
  },

  // User adoption metrics
  async getUserAdoption(tenantId: string): Promise<UserAdoptionData[]> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('user_conversations')
      .select('user_id, COUNT(*), AVG(user_satisfaction_score)')
      .eq('tenant_id', tenantId)
      .gte('started_at', thirtyDaysAgo)
      .group('user_id');
    
    if (error) {
      throw new Error(`User adoption query failed: ${error.message}`);
    }
    
    return data as UserAdoptionData[];
  }
};

interface UserAdoptionData {
  user_id: string;
  count: number;
  avg: number;
}
