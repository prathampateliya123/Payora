import { 
  mockPlans, 
  mockUser, 
  mockSubscription, 
  mockSubscriptionHistory,
  mockUsers,
  mockAdminSubscriptions,
  mockWebhookEvents,
  mockDashboardStats,
  mockRevenueData,
  mockPlanDistribution
} from '../data/mockData';

// TODO: Replace mock data with API response

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getPlans = async () => {
  await delay(500);
  return { success: true, data: mockPlans };
};

export const getCurrentUser = async () => {
  await delay(500);
  return { success: true, data: mockUser };
};

export const getMySubscription = async () => {
  await delay(600);
  return { success: true, data: mockSubscription };
};

export const getSubscriptionHistory = async () => {
  await delay(600);
  return { success: true, data: mockSubscriptionHistory };
};

export const getAdminUsers = async () => {
  await delay(800);
  return { success: true, data: mockUsers };
};

export const getAdminSubscriptions = async () => {
  await delay(800);
  return { success: true, data: mockAdminSubscriptions };
};

export const getAdminWebhooks = async () => {
  await delay(800);
  return { success: true, data: mockWebhookEvents };
};

export const getDashboardData = async () => {
  await delay(700);
  return { 
    success: true, 
    data: {
      stats: mockDashboardStats,
      revenueData: mockRevenueData,
      planDistribution: mockPlanDistribution
    } 
  };
};
