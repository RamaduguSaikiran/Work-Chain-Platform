import type { TaskSubmission, CreateSubmissionRequest, UpdateSubmissionRequest, SubmissionResponse, SubmissionCreationResponse, SubmissionFile } from '../types/submission';
import { createEvent } from './eventService';
import { recalculateUserPoints } from './userService';
import { getTaskTemplateById } from './taskTemplateApi';

const SUBMISSIONS_STORAGE_KEY = 'workchain_mock_submissions';

const initialSubmissions: TaskSubmission[] = [
  {
    _id: 'sub_001',
    templateId: '1',
    templateName: 'Bug Report Template',
    formData: {
      title: 'Login button not working on Safari',
      description: 'The main login button on the homepage is unresponsive when using the Safari browser on macOS. No errors are shown in the console. The button works fine on Chrome and Firefox.',
      severity: 'high',
      steps: '1. Open the website on Safari.\n2. Click the main login button.\n3. Observe that nothing happens.',
      screenshot: 'safari_bug.png'
    },
    files: {
      screenshot: {
        name: 'safari_bug.png',
        size: 125829,
        type: 'image/png',
        url: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/800x600.png?text=Bug+Screenshot'
      }
    },
    status: 'approved',
    submittedBy: 'user123',
    createdAt: new Date('2025-01-11').toISOString(),
    updatedAt: new Date('2025-01-11').toISOString(),
    pointsAwarded: 132,
    reviewNotes: 'Excellent catch! This was a critical bug affecting Safari users. The fix has been deployed. Great work!',
    rewardCalculation: {
      basePoints: 100,
      difficultyMultiplier: 1.2,
      qualityMultiplier: 1.0,
      timelinessBonus: 1.1,
      finalPoints: 132,
    }
  },
  {
    _id: 'sub_002',
    templateId: '2',
    templateName: 'Feature Request Template',
    formData: {
      title: 'Implement Dark Mode',
      description: 'The application should have a dark mode option for better usability in low-light environments. This would reduce eye strain for users working at night.',
      priority: 'high',
      requirements: ['A toggle in the settings menu', 'Persist the choice across sessions', 'Ensure all components are styled correctly']
    },
    status: 'in_review',
    submittedBy: 'user456',
    validationResults: {
      preflightPassed: true,
      validatedAt: new Date('2025-01-12').toISOString(),
      errors: [],
      warnings: ['Consider adding mockups for the dark mode UI.']
    },
    createdAt: new Date('2025-01-12').toISOString(),
    updatedAt: new Date('2025-01-12').toISOString(),
  },
  {
    _id: 'sub_003',
    templateId: '1',
    templateName: 'Bug Report Template',
    formData: {
      title: 'Typo on the homepage main banner',
      description: 'There is a small typo in the main heading. It says "Welocme" instead of "Welcome".',
      severity: 'low',
      steps: 'Go to the homepage and read the main heading.',
      screenshot: 'typo.png'
    },
    files: {
      screenshot: {
        name: 'typo.png',
        size: 45829,
        type: 'image/png',
        url: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/800x200.png?text=Typo+Screenshot'
      }
    },
    status: 'in_review',
    submittedBy: 'user789',
    validationResults: {
      preflightPassed: true,
      validatedAt: new Date('2025-01-13').toISOString(),
      errors: [],
      warnings: []
    },
    createdAt: new Date('2025-01-13').toISOString(),
    updatedAt: new Date('2025-01-13').toISOString(),
  },
  {
    _id: 'sub_004',
    templateId: '2',
    templateName: 'Feature Request Template',
    formData: {
      title: 'Export data to CSV',
      description: 'Users should be able to export their task data to a CSV file for offline analysis.',
      priority: 'medium',
      requirements: ['An "Export" button on the dashboard', 'The CSV should include all relevant task fields']
    },
    status: 'rejected',
    submittedBy: 'user101',
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-01-10').toISOString(),
    reviewNotes: 'Thank you for the suggestion. While this is a good idea, it is currently out of scope for our immediate roadmap. We will reconsider it for a future release.',
    pointsAwarded: 10,
  },
  {
    _id: 'sub_005',
    templateId: '1',
    templateName: 'Bug Report Template',
    formData: {
      title: 'Mobile view layout is broken on the settings page',
      description: 'On mobile devices, the settings page layout is broken. Elements overlap and are difficult to click.',
      severity: 'medium',
      steps: '1. Open the site on a mobile device.\n2. Navigate to the settings page.\n3. Observe the broken layout.',
      screenshot: 'mobile_layout_bug.jpg'
    },
    files: {
      screenshot: {
        name: 'mobile_layout_bug.jpg',
        size: 210450,
        type: 'image/jpeg',
        url: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x800.png?text=Mobile+Layout+Bug'
      }
    },
    status: 'in_review',
    submittedBy: 'user222',
    validationResults: {
      preflightPassed: true,
      validatedAt: new Date('2025-01-14').toISOString(),
      errors: [],
      warnings: []
    },
    createdAt: new Date('2025-01-14').toISOString(),
    updatedAt: new Date('2025-01-14').toISOString(),
  }
];

export const getSubmissionsFromStorage = (): TaskSubmission[] => {
  try {
    const stored = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse submissions from localStorage", e);
  }
  localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(initialSubmissions));
  return initialSubmissions;
};

export const saveSubmissionsToStorage = (submissions: TaskSubmission[]): void => {
  localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllSubmissions = async (): Promise<SubmissionResponse> => {
  await delay(300);
  const submissions = getSubmissionsFromStorage();
  return { success: true, data: submissions };
};

export const getSubmissionById = async (id: string): Promise<SubmissionResponse> => {
  await delay(200);
  const submissions = getSubmissionsFromStorage();
  const submission = submissions.find(s => s._id === id);
  if (!submission) throw new Error('Submission not found');
  return { success: true, data: submission };
};

export const createSubmission = async (data: CreateSubmissionRequest): Promise<SubmissionCreationResponse> => {
  await delay(500);
  let submissions = getSubmissionsFromStorage();
  
  const templateResponse = await getTaskTemplateById(data.templateId);
  const templateName = (templateResponse.success && !Array.isArray(templateResponse.data)) 
    ? templateResponse.data.name 
    : 'Unknown Template';

  const processedFiles: Record<string, SubmissionFile> = {};
  if (data.files) {
    for (const key in data.files) {
      const file = data.files[key];
      processedFiles[key] = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      };
    }
  }

  const newSubmission: TaskSubmission = {
    _id: `sub_${Date.now()}`,
    templateId: data.templateId,
    templateName,
    formData: data.formData,
    files: processedFiles,
    status: data.status || 'draft',
    submittedBy: data.submittedBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  submissions.push(newSubmission);

  let receiptHash: string | undefined = undefined;
  if (newSubmission.status !== 'draft') {
    const event = await createEvent('TASK_SUBMITTED', newSubmission._id, {
      formData: newSubmission.formData,
      submittedBy: newSubmission.submittedBy,
      files: Object.values(processedFiles).map(f => f.name),
    });
    receiptHash = event.hash;
    newSubmission.receiptHash = receiptHash;
  }
  
  saveSubmissionsToStorage(submissions);
  
  return {
    success: true,
    data: newSubmission,
    message: 'Task submission created successfully',
    receiptHash,
  };
};

export const updateSubmission = async (id: string, data: UpdateSubmissionRequest): Promise<SubmissionResponse> => {
  await delay(400);
  let submissions = getSubmissionsFromStorage();
  const submissionIndex = submissions.findIndex(s => s._id === id);
  
  if (submissionIndex === -1) throw new Error('Submission not found');

  const oldStatus = submissions[submissionIndex].status;
  const newStatus = data.status;
  
  const updatedSubmission = {
    ...submissions[submissionIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // Point calculation logic
  if (newStatus && newStatus !== oldStatus) {
    if (newStatus === 'approved' && data.qualityScore) {
      const templateResponse = await getTaskTemplateById(updatedSubmission.templateId);
      if (templateResponse.success && !Array.isArray(templateResponse.data)) {
          const template = templateResponse.data;
          
          const basePoints = 100;
          const difficultyMultiplier = template.schema.difficulty || 1.0;
          const qualityMultiplier = data.qualityScore;

          let timelinessBonus = 1.0;
          if (template.deadline) {
            const deadlineDate = new Date(template.deadline);
            const submissionDate = new Date(updatedSubmission.createdAt);
            const hoursDifference = (deadlineDate.getTime() - submissionDate.getTime()) / (1000 * 60 * 60);
            if (hoursDifference > 24) {
              timelinessBonus = 1.1;
            }
          }
          
          const finalPoints = Math.round(basePoints * difficultyMultiplier * qualityMultiplier * timelinessBonus);
          
          updatedSubmission.pointsAwarded = finalPoints;
          updatedSubmission.rewardCalculation = {
            basePoints,
            difficultyMultiplier,
            qualityMultiplier,
 timelinessBonus,
            finalPoints,
          };
          
          await createEvent('REWARD_CALCULATED', id, { ...updatedSubmission.rewardCalculation });
      }
    } else if (newStatus === 'rejected') {
      const consolationPoints = 10;
      updatedSubmission.pointsAwarded = consolationPoints;
      updatedSubmission.rewardCalculation = undefined; // Clear any previous calculation

      await createEvent('REWARD_CALCULATED', id, {
        points: consolationPoints,
        reason: 'Consolation points for effort on a rejected submission.'
      });
    }
  }
  
  submissions[submissionIndex] = updatedSubmission;
  saveSubmissionsToStorage(submissions);

  // Event logging for review
  if (newStatus && newStatus !== oldStatus && (newStatus === 'approved' || newStatus === 'rejected')) {
    await createEvent('REVIEW_SUBMITTED', id, {
      newStatus,
      oldStatus,
      reviewedBy: 'admin_user', // Mock admin user
      qualityScore: data.qualityScore,
      reviewNotes: data.reviewNotes,
    });
    // Recalculate total points for the user to ensure consistency
    await recalculateUserPoints(updatedSubmission.submittedBy);
  }

  return {
    success: true,
    data: updatedSubmission,
    message: 'Submission updated successfully',
  };
};

export const deleteSubmission = async (id: string): Promise<SubmissionResponse> => {
  await delay(300);
  let submissions = getSubmissionsFromStorage();
  const submissionIndex = submissions.findIndex(s => s._id === id);
  
  if (submissionIndex === -1) throw new Error('Submission not found');
  
  const deletedSubmission = submissions[submissionIndex];
  submissions.splice(submissionIndex, 1);
  saveSubmissionsToStorage(submissions);
  
  return {
    success: true,
    data: deletedSubmission,
    message: 'Submission deleted successfully',
  };
};
