'use client';

import { useState, useEffect, useCallback } from 'react';
import { JobForm } from '@/components/JobForm';
import { JobSankeyChart } from '@/components/JobSankeyChart';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
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
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Define saveToCookie function
  const saveToCookie = useCallback((jobsData: JobApplication[]) => {
    setCookie('jobApplications', JSON.stringify(jobsData));
  }, []);

  // Define loadJobsFromCookie function with saveToCookie as a dependency
  const loadJobsFromCookie = useCallback(() => {
    const jobsCookie = getCookie('jobApplications');
    if (jobsCookie) {
      try {
        const parsedJobs = JSON.parse(jobsCookie);
        // Ensure dates are parsed correctly
        const jobsWithDates = parsedJobs.map((job: JobApplication) => ({
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
  }, [saveToCookie]);

  useEffect(() => {
    loadJobsFromCookie();
    // Set dark mode
    document.documentElement.classList.add('dark');
  }, [loadJobsFromCookie]);

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

  const handleRemoveJob = useCallback((jobId: string) => {
    setJobs(currentJobs => {
      const updatedJobs = currentJobs.filter(job => job.id !== jobId);
      saveToCookie(updatedJobs);
      return updatedJobs;
    });
  }, [saveToCookie]);

  const handleClearAllJobs = useCallback(() => {
    setJobs([]);
    saveToCookie([]);
    setIsConfirmDialogOpen(false);
  }, [saveToCookie]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Jobby Logo" 
              width={80} 
              height={80} 
              className="rounded-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-500"
                  variant="outline"
                  size="sm"
                  disabled={jobs.length === 0}
                >
                  Clear All Jobs
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border border-border/50 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Confirm Delete All</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Are you sure you want to delete all {jobs.length} job applications? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsConfirmDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleClearAllJobs}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete All
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
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
              Recent Applications {jobs.length > 0 && <span className="text-sm ml-2 text-muted-foreground">({jobs.length} total)</span>}
            </h2>
            
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No job applications yet. Click &quot;Add Job Application&quot; to get started.
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30 hover:border-primary/50 transition-all group"
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
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary-foreground">
                          {job.status.replace(/_/g, ' ')}
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(job.dateApplied).toLocaleDateString()}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRemoveJob(job.id)}
                        className="p-1.5 rounded-full text-red-400 hover:bg-red-500/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove job"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
