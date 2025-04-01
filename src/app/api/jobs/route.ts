import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sampleData } from '@/lib/sampleData';
import type { JobFormData } from '@/lib/types';

// Initialize PrismaClient - will be used if available
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.warn('PrismaClient initialization failed, using sample data fallback');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // If Prisma is available, use it
    if (prisma) {
      const job = await prisma.jobApplication.create({
        data: body,
      });
      return NextResponse.json(job);
    }
    
    // Otherwise, just return a mock response for client-side handling
    return NextResponse.json({
      ...body,
      id: `job_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating job application' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // If Prisma is available, use it
    if (prisma) {
      const jobs = await prisma.jobApplication.findMany({
        orderBy: {
          dateApplied: 'desc',
        },
      });
      return NextResponse.json(jobs);
    }
    
    // Otherwise, return sample data
    const formattedSampleData = sampleData.map((job: JobFormData) => ({
      ...job,
      id: `job_${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    return NextResponse.json(formattedSampleData);
  } catch (error) {
    console.error('Error fetching jobs, using sample data:', error);
    
    // Return sample data in case of any error
    const formattedSampleData = sampleData.map((job: JobFormData) => ({
      ...job,
      id: `job_${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    return NextResponse.json(formattedSampleData);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    // If Prisma is available, use it
    if (prisma) {
      const job = await prisma.jobApplication.update({
        where: { id },
        data,
      });
      return NextResponse.json(job);
    }
    
    // Otherwise, return the updated data for client-side handling
    return NextResponse.json({
      ...body,
      updatedAt: new Date(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating job application' }, { status: 500 });
  }
} 