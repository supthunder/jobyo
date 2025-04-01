import React from 'react';
import { Chart } from 'react-google-charts';
import type { JobApplication } from '@/lib/types';

interface JobSankeyChartProps {
  jobs: JobApplication[];
}

export function JobSankeyChart({ jobs }: JobSankeyChartProps) {
  // Transform job data into the format needed for Google Charts Sankey
  const transformDataForSankey = () => {
    // Define header row
    const dataArray: (string | number)[][] = [["From", "To", "Weight"]];
    
    // Count jobs by status
    const statusCounts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Add data rows for the Sankey diagram
    // Jobs Applied to Online Tests
    if (statusCounts['ONLINE_TEST']) {
      dataArray.push(["Jobs Applied", "Online Test", statusCounts['ONLINE_TEST']]);
    }
    
    // Online Tests to Recorded Interviews
    if (statusCounts['RECORDED_INTERVIEW']) {
      dataArray.push(["Online Test", "Recorded Interview", statusCounts['RECORDED_INTERVIEW']]);
    }
    
    // Recorded Interviews to First Interviews
    if (statusCounts['FIRST_INTERVIEW']) {
      dataArray.push(["Recorded Interview", "First Interview", statusCounts['FIRST_INTERVIEW']]);
    }
    
    // First Interviews to Second Interviews
    if (statusCounts['SECOND_INTERVIEW']) {
      dataArray.push(["First Interview", "Second Interview", statusCounts['SECOND_INTERVIEW']]);
    }
    
    // Second Interviews to Assessment Centers
    if (statusCounts['ASSESSMENT_CENTER']) {
      dataArray.push(["Second Interview", "Assessment Center", statusCounts['ASSESSMENT_CENTER']]);
    }
    
    // Rejected applications
    if (statusCounts['REJECTED']) {
      dataArray.push(["Jobs Applied", "Rejected", statusCounts['REJECTED']]);
    }
    
    // Withdrawn applications
    if (statusCounts['WITHDRAWN']) {
      dataArray.push(["Jobs Applied", "Withdrawn", statusCounts['WITHDRAWN']]);
    }
    
    // Calculate no replies
    const appliedCount = statusCounts['APPLIED'] || 0;
    if (appliedCount > 0) {
      dataArray.push(["Jobs Applied", "No Reply", appliedCount]);
    }
    
    return dataArray;
  };

  // Options for the Sankey chart
  const options = {
    sankey: {
      node: {
        colors: [
          '#2c9f42', // Jobs Applied - Green
          '#4c9be8', // Online Test - Light blue
          '#e855c6', // Recorded Interview - Pink
          '#e87155', // First Interview - Orange-red
          '#9055e8', // Second Interview - Purple
          '#e8b055', // Assessment Center - Gold
          '#e05151', // Rejected - Red
          '#7d7d7d', // Withdrawn - Gray
          '#5d5d5d', // No Reply - Darker Gray
        ],
        label: {
          fontName: 'Arial',
          fontSize: 15,
          color: '#333',
          bold: true,
        },
        width: 22,
        nodePadding: 50,
      },
      link: {
        colorMode: 'source',
        colors: [
          '#2c9f42', // Jobs Applied - Green
          '#4c9be8', // Online Test - Light blue
          '#e855c6', // Recorded Interview - Pink
          '#e87155', // First Interview - Orange-red
          '#9055e8', // Second Interview - Purple
        ],
      },
      iterations: 64, // More iterations for better layout
    },
    tooltip: {
      isHtml: true,
      textStyle: {
        fontName: 'Arial',
        fontSize: 14,
      },
    },
    height: 500,
  };

  // If no jobs data, show a message
  if (jobs.length === 0) {
    return (
      <div className="rounded-xl bg-white/90 border border-gray-200 shadow-sm p-6 text-center">
        <p className="text-gray-500">No job applications to display.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white/90 border border-gray-200 shadow-sm p-6">
      <Chart
        chartType="Sankey"
        width="100%"
        height="500px"
        data={transformDataForSankey()}
        options={options}
      />
    </div>
  );
} 