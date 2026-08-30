export interface ActionItem {
  id: string;
  title: string;
  priority: 'URGENT' | 'IMPORTANT' | 'OPTIONAL';
  instructions: string;
  deadline: string | null;
  why: string;
  source: string | null;
  completed: boolean;
}

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  description: string;
  source: string | null;
}

export interface WarningRisk {
  id: string;
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  source: string | null;
}

export interface RequiredInfoDoc {
  id: string;
  name: string;
  reason: string;
  source: string | null;
}

export interface AnalysisResult {
  documentTitle: string;
  documentType: string;
  summary: string;
  actions: ActionItem[];
  deadlines: ImportantDate[];
  warnings: WarningRisk[];
  requiredDocuments: RequiredInfoDoc[];
  keyInformation: any[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
