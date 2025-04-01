import { PrismaClient } from '@prisma/client';
import { addDays, subDays } from 'date-fns';

const prisma = new PrismaClient();

const sampleData = [
  {
    companyName: 'Google',
    position: 'Senior Software Engineer',
    jobUrl: 'https://careers.google.com',
    dateApplied: subDays(new Date(), 30),
    status: 'SECOND_INTERVIEW',
  },
  {
    companyName: 'Microsoft',
    position: 'Full Stack Developer',
    jobUrl: 'https://careers.microsoft.com',
    dateApplied: subDays(new Date(), 25),
    status: 'FIRST_INTERVIEW',
  },
  {
    companyName: 'Apple',
    position: 'iOS Developer',
    jobUrl: 'https://www.apple.com/careers',
    dateApplied: subDays(new Date(), 20),
    status: 'ONLINE_TEST',
  },
  {
    companyName: 'Meta',
    position: 'React Native Developer',
    jobUrl: 'https://www.meta.com/careers',
    dateApplied: subDays(new Date(), 15),
    status: 'ASSESSMENT_CENTER',
  },
  {
    companyName: 'Amazon',
    position: 'Backend Engineer',
    jobUrl: 'https://www.amazon.jobs',
    dateApplied: subDays(new Date(), 45),
    status: 'REJECTED',
  },
  {
    companyName: 'Netflix',
    position: 'Senior Frontend Engineer',
    jobUrl: 'https://jobs.netflix.com',
    dateApplied: subDays(new Date(), 10),
    status: 'RECORDED_INTERVIEW',
  },
  {
    companyName: 'Tesla',
    position: 'Software Engineer, Autopilot',
    jobUrl: 'https://www.tesla.com/careers',
    dateApplied: subDays(new Date(), 5),
    status: 'APPLIED',
  },
  {
    companyName: 'Stripe',
    position: 'Full Stack Engineer',
    jobUrl: 'https://stripe.com/jobs',
    dateApplied: subDays(new Date(), 8),
    status: 'ONLINE_TEST',
  },
  {
    companyName: 'Airbnb',
    position: 'Frontend Engineer',
    jobUrl: 'https://careers.airbnb.com',
    dateApplied: subDays(new Date(), 40),
    status: 'WITHDRAWN',
  },
  {
    companyName: 'Salesforce',
    position: 'Platform Engineer',
    jobUrl: 'https://salesforce.com/careers',
    dateApplied: subDays(new Date(), 12),
    status: 'FIRST_INTERVIEW',
  },
];

async function main() {
  console.log('Start seeding...');
  
  // Clear existing data
  await prisma.jobApplication.deleteMany();
  
  // Insert sample data
  for (const data of sampleData) {
    const job = await prisma.jobApplication.create({
      data,
    });
    console.log(`Created job application with id: ${job.id}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 