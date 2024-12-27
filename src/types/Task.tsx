export interface Task {
    _id: string;
    title: string;
    description?: string; // Optional
    status: string;
    assignedTo?: string | null; // Optional
    createdBy: string;
    createdAt: string;
  }
  