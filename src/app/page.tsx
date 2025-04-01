'use client';

import { useState, useEffect } from 'react';
import { JobForm } from '@/components/JobForm';
import { JobSankeyChart } from '@/components/JobSankeyChart';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { JobApplication, JobFormData } from '@/lib/types';

export default function Home() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
    // Set dark mode
    document.documentElement.classList.add('dark');
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleSubmit = async (data: JobFormData) => {
    try {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setIsDialogOpen(false);
      fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Job Search Tracker
          </h1>
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
