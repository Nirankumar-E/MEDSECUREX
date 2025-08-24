export type Role = 'Admin' | 'Analyst' | 'Viewer';

export interface User {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
}

export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AlertStatus = 'New' | 'In Progress' | 'Resolved' | 'Dismissed';

export interface Alert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  description: string;
  ttp_id: string;
  status: AlertStatus;
  source: string;
  entity: string;
}
