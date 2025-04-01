'use client';

import { useState, useEffect } from 'react';
import { JobForm } from '@/components/JobForm';
import { JobSankeyChart } from '@/components/JobSankeyChart';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { JobApplication, JobFormData } from '@/lib/types';
import Image from 'next/image';

// Cookie helper functions
const setCookie = (name: string, value: string, days: number = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export default function Home() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadJobsFromCookie();
    // Set dark mode
    document.documentElement.classList.add('dark');
  }, []);

  const loadJobsFromCookie = () => {
    const jobsCookie = getCookie('jobApplications');
    if (jobsCookie) {
      try {
        const parsedJobs = JSON.parse(jobsCookie);
        // Ensure dates are parsed correctly
        const jobsWithDates = parsedJobs.map((job: any) => ({
          ...job,
          dateApplied: new Date(job.dateApplied),
          createdAt: job.createdAt ? new Date(job.createdAt) : new Date(),
          updatedAt: job.updatedAt ? new Date(job.updatedAt) : new Date(),
        }));
        setJobs(jobsWithDates);
      } catch (error) {
        console.error('Error parsing jobs from cookie:', error);
        setJobs([]);
      }
    } else {
      // Load sample data from seed.ts when cookie doesn't exist
      fetch('/api/jobs')
        .then(response => response.json())
        .then(data => {
          setJobs(data);
          saveToCookie(data);
        })
        .catch(error => {
          console.error('Error fetching initial data:', error);
        });
    }
  };

  const saveToCookie = (jobsData: JobApplication[]) => {
    setCookie('jobApplications', JSON.stringify(jobsData));
  };

  const handleSubmit = async (data: JobFormData) => {
    const newJob: JobApplication = {
      ...data,
      id: `job_${Date.now()}`, // Generate a simple ID
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    saveToCookie(updatedJobs);
    setIsDialogOpen(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Jobby Logo" 
              width={40} 
              height={40} 
              className="rounded-md"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Jobby
            </h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="glow-effect bg-primary/90 hover:bg-primary/80 text-primary-foreground"
              >
                Add Job Application
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border border-border/50 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add New Job Application</DialogTitle>
              </DialogHeader>
              <JobForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          <div className="job-card p-6 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-primary mr-2"></span>
              Application Flow
            </h2>
            <JobSankeyChart jobs={jobs} />
          </div>

          <div className="job-card p-6 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-accent mr-2"></span>
              Recent Applications
            </h2>
            
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30 hover:border-primary/50 transition-all"
                >
                  <div>
                    <h3 className="font-semibold">{job.position}</h3>
                    <p className="text-sm text-muted-foreground">{job.companyName}</p>
                    {job.jobUrl && (
                      <a 
                        href={job.jobUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary/80 hover:text-primary transition-colors"
                      >
                        View Job Posting
                      </a>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary-foreground">
                      {job.status.replace(/_/g, ' ')}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(job.dateApplied).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
