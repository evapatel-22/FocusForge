export type RootStackParamList = {
  Tabs: undefined;
  Login: undefined;
  Signup: undefined;


  Session: {
    taskName: string;
    milestones: number;
    mode: string;
    completedMilestones?: number;
    seconds?: number;
      aiResult?: {
        verified: boolean;
        confidence: number;
        reason: string;
    };
  };

  Camera: {
    taskName: string;
    milestones: number;
    completedMilestones: number;
    mode: string;
    seconds: number;
  };

  Complete: {
    duration: number;
    taskName: string;

    aiResult?: {
        verified: boolean;
        confidence: number;
        reason: string;
    };
};

  SessionFailed: {
    aiResult?: {
      verified: boolean;
      confidence: number;
      reason: string;
    };
  };
};