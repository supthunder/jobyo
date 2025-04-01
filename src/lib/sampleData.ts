import { addDays, subDays } from 'date-fns';
import type { JobFormData } from './types';

// Create an array of job applications with variety in status
export const sampleData: JobFormData[] = [
  // APPLIED jobs (remained at applied stage)
  {
    companyName: 'Google',
    position: 'Senior Software Engineer',
    jobUrl: 'https://careers.google.com',
    dateApplied: subDays(new Date(), 60),
    status: 'APPLIED',
  },
  {
    companyName: 'Facebook',
    position: 'Full Stack Developer',
    jobUrl: 'https://careers.facebook.com',
    dateApplied: subDays(new Date(), 55),
    status: 'APPLIED',
  },
  {
    companyName: 'Tesla',
    position: 'Frontend Engineer',
    jobUrl: 'https://www.tesla.com/careers',
    dateApplied: subDays(new Date(), 50),
    status: 'APPLIED',
  },
  {
    companyName: 'IBM',
    position: 'Cloud Engineer',
    jobUrl: 'https://www.ibm.com/careers',
    dateApplied: subDays(new Date(), 48),
    status: 'APPLIED',
  },
  {
    companyName: 'Intel',
    position: 'Software Developer',
    jobUrl: 'https://jobs.intel.com',
    dateApplied: subDays(new Date(), 45),
    status: 'APPLIED',
  },
  {
    companyName: 'Nvidia',
    position: 'AI Engineer',
    jobUrl: 'https://www.nvidia.com/en-us/about-nvidia/careers/',
    dateApplied: subDays(new Date(), 43),
    status: 'APPLIED',
  },
  {
    companyName: 'Dell',
    position: 'Software Engineer',
    jobUrl: 'https://jobs.dell.com',
    dateApplied: subDays(new Date(), 40),
    status: 'APPLIED',
  },
  {
    companyName: 'HP',
    position: 'DevOps Engineer',
    jobUrl: 'https://jobs.hp.com',
    dateApplied: subDays(new Date(), 35),
    status: 'APPLIED',
  },
  
  // ONLINE_TEST jobs
  {
    companyName: 'Microsoft',
    position: 'Senior Developer',
    jobUrl: 'https://careers.microsoft.com',
    dateApplied: subDays(new Date(), 40),
    status: 'ONLINE_TEST',
  },
  {
    companyName: 'Amazon',
    position: 'Backend Engineer',
    jobUrl: 'https://www.amazon.jobs',
    dateApplied: subDays(new Date(), 38),
    status: 'ONLINE_TEST',
  },
  {
    companyName: 'Stripe',
    position: 'Full Stack Engineer',
    jobUrl: 'https://stripe.com/jobs',
    dateApplied: subDays(new Date(), 35),
    status: 'ONLINE_TEST',
  },
  {
    companyName: 'Shopify',
    position: 'Ruby Developer',
    jobUrl: 'https://www.shopify.com/careers',
    dateApplied: subDays(new Date(), 33),
    status: 'ONLINE_TEST',
  },
  {
    companyName: 'Twitch',
    position: 'Platform Engineer',
    jobUrl: 'https://www.twitch.tv/jobs',
    dateApplied: subDays(new Date(), 30),
    status: 'ONLINE_TEST',
  },
  
  // RECORDED_INTERVIEW jobs
  {
    companyName: 'Apple',
    position: 'iOS Developer',
    jobUrl: 'https://www.apple.com/careers',
    dateApplied: subDays(new Date(), 33),
    status: 'RECORDED_INTERVIEW',
  },
  {
    companyName: 'Netflix',
    position: 'Senior Frontend Engineer',
    jobUrl: 'https://jobs.netflix.com',
    dateApplied: subDays(new Date(), 30),
    status: 'RECORDED_INTERVIEW',
  },
  {
    companyName: 'Zoom',
    position: 'Video Engineer',
    jobUrl: 'https://zoom.us/careers',
    dateApplied: subDays(new Date(), 28),
    status: 'RECORDED_INTERVIEW',
  },
  
  // FIRST_INTERVIEW jobs
  {
    companyName: 'Salesforce',
    position: 'Platform Engineer',
    jobUrl: 'https://salesforce.com/careers',
    dateApplied: subDays(new Date(), 28),
    status: 'FIRST_INTERVIEW',
  },
  {
    companyName: 'Oracle',
    position: 'Database Engineer',
    jobUrl: 'https://www.oracle.com/corporate/careers/',
    dateApplied: subDays(new Date(), 25),
    status: 'FIRST_INTERVIEW',
  },
  {
    companyName: 'Twitter',
    position: 'Backend Developer',
    jobUrl: 'https://careers.twitter.com',
    dateApplied: subDays(new Date(), 23),
    status: 'FIRST_INTERVIEW',
  },

  // SECOND_INTERVIEW jobs
  {
    companyName: 'Adobe',
    position: 'UI Engineer',
    jobUrl: 'https://www.adobe.com/careers.html',
    dateApplied: subDays(new Date(), 20),
    status: 'SECOND_INTERVIEW',
  },
  {
    companyName: 'LinkedIn',
    position: 'Senior SDE',
    jobUrl: 'https://careers.linkedin.com',
    dateApplied: subDays(new Date(), 18),
    status: 'SECOND_INTERVIEW',
  },

  // ASSESSMENT_CENTER job
  {
    companyName: 'Meta',
    position: 'React Native Developer',
    jobUrl: 'https://www.meta.com/careers',
    dateApplied: subDays(new Date(), 15),
    status: 'ASSESSMENT_CENTER',
  },

  // REJECTED jobs (at different stages)
  {
    companyName: 'Uber',
    position: 'Frontend Developer',
    jobUrl: 'https://www.uber.com/us/en/careers/',
    dateApplied: subDays(new Date(), 50),
    status: 'REJECTED',
    notes: 'Rejected after application review'
  },
  {
    companyName: 'Slack',
    position: 'Software Engineer',
    jobUrl: 'https://slack.com/careers',
    dateApplied: subDays(new Date(), 45),
    status: 'REJECTED',
    notes: 'Rejected after online test'
  },
  {
    companyName: 'Dropbox',
    position: 'Full Stack Developer',
    jobUrl: 'https://www.dropbox.com/jobs',
    dateApplied: subDays(new Date(), 40),
    status: 'REJECTED',
    notes: 'Rejected after first interview'
  },
  {
    companyName: 'Spotify',
    position: 'Backend Engineer',
    jobUrl: 'https://www.spotify.com/us/jobs/',
    dateApplied: subDays(new Date(), 35),
    status: 'REJECTED',
    notes: 'Rejected after second interview'
  },
  {
    companyName: 'Pinterest',
    position: 'Frontend Developer',
    jobUrl: 'https://www.pinterestcareers.com/',
    dateApplied: subDays(new Date(), 32),
    status: 'REJECTED',
    notes: 'Rejected after recorded interview'
  },
  {
    companyName: 'Reddit',
    position: 'Full Stack Engineer',
    jobUrl: 'https://www.redditinc.com/careers',
    dateApplied: subDays(new Date(), 30),
    status: 'REJECTED',
    notes: 'Rejected after online test'
  },
  {
    companyName: 'Atlassian',
    position: 'Product Engineer',
    jobUrl: 'https://www.atlassian.com/company/careers',
    dateApplied: subDays(new Date(), 28),
    status: 'REJECTED',
    notes: 'Rejected after application review'
  },
  {
    companyName: 'Square',
    position: 'Mobile Engineer',
    jobUrl: 'https://squareup.com/us/en/careers',
    dateApplied: subDays(new Date(), 25),
    status: 'REJECTED',
    notes: 'Rejected after first interview'
  },
  {
    companyName: 'Robinhood',
    position: 'Frontend Engineer',
    jobUrl: 'https://careers.robinhood.com/',
    dateApplied: subDays(new Date(), 20),
    status: 'REJECTED',
    notes: 'Rejected after online test'
  },
  {
    companyName: 'Lyft',
    position: 'Software Engineer',
    jobUrl: 'https://www.lyft.com/careers',
    dateApplied: subDays(new Date(), 18),
    status: 'REJECTED',
    notes: 'Rejected after application review'
  },
  
  // WITHDRAWN jobs
  {
    companyName: 'Airbnb',
    position: 'Frontend Engineer',
    jobUrl: 'https://careers.airbnb.com',
    dateApplied: subDays(new Date(), 40),
    status: 'WITHDRAWN',
    notes: 'Withdrew after receiving another offer'
  },
  {
    companyName: 'Square',
    position: 'Payment Engineer',
    jobUrl: 'https://careers.squareup.com/us/en',
    dateApplied: subDays(new Date(), 35),
    status: 'WITHDRAWN',
    notes: 'Withdrew due to low compensation'
  },
  {
    companyName: 'DoorDash',
    position: 'Backend Developer',
    jobUrl: 'https://www.doordash.com/careers/',
    dateApplied: subDays(new Date(), 30),
    status: 'WITHDRAWN',
    notes: 'Withdrew after learning more about the role'
  },
]; 