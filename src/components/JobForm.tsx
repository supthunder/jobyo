import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { jobFormSchema, jobStatuses, type JobFormData } from '@/lib/types';
import { format } from 'date-fns';

interface JobFormProps {
  onSubmit: (data: JobFormData) => void;
  initialData?: Partial<JobFormData>;
}

export function JobForm({ onSubmit, initialData }: JobFormProps) {
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      ...initialData,
      dateApplied: initialData?.dateApplied || today,
      status: initialData?.status || 'APPLIED',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="companyName" className="text-sm font-medium text-foreground/90">Company Name</Label>
        <Input 
          id="companyName" 
          {...register('companyName')} 
          className="mt-1.5 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          placeholder="e.g. Google, Microsoft, etc."
        />
        {errors.companyName && (
          <p className="text-sm text-destructive mt-1">{errors.companyName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="position" className="text-sm font-medium text-foreground/90">Position</Label>
        <Input 
          id="position" 
          {...register('position')} 
          className="mt-1.5 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          placeholder="e.g. Software Engineer, Product Manager"
        />
        {errors.position && (
          <p className="text-sm text-destructive mt-1">{errors.position.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="jobUrl" className="text-sm font-medium text-foreground/90">Job URL (optional)</Label>
        <Input 
          id="jobUrl" 
          {...register('jobUrl')} 
          className="mt-1.5 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          placeholder="https://careers.company.com/job"
        />
        {errors.jobUrl && (
          <p className="text-sm text-destructive mt-1">{errors.jobUrl.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="dateApplied" className="text-sm font-medium text-foreground/90">Date Applied</Label>
        <Input
          id="dateApplied"
          type="date"
          defaultValue={formattedToday}
          className="mt-1.5 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          {...register('dateApplied', {
            setValueAs: (value) => new Date(value),
          })}
        />
      </div>

      <div>
        <Label htmlFor="status" className="text-sm font-medium text-foreground/90">Status</Label>
        <Select
          onValueChange={(value) => setValue('status', value as (typeof jobStatuses)[number])}
          defaultValue={initialData?.status || 'APPLIED'}
        >
          <SelectTrigger className="mt-1.5 bg-background/50 border-border/50 focus:ring-primary/20">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 border-border/50">
            {jobStatuses.map((status) => (
              <SelectItem key={status} value={status} className="hover:bg-primary/10">
                {status.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes" className="text-sm font-medium text-foreground/90">Notes (optional)</Label>
        <Input 
          id="notes" 
          {...register('notes')} 
          className="mt-1.5 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          placeholder="Any additional notes about this application"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground glow-effect"
      >
        Submit Application
      </Button>
    </form>
  );
} 