/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, LifeBuoy, Send, Ticket } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/reusable/Button/Button';
import { usePostSupportTicketMutation } from '@/redux/Features/User/userApi';
import { useRouter } from 'next/navigation';

const categories = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'billing', label: 'Billing Question' },
  { value: 'account', label: 'Account Problem' },
  { value: 'trading', label: 'Trading Related' },
  { value: 'withdrawal', label: 'Withdrawal Issue' },
  { value: 'deposit', label: 'Deposit Issue' },
  { value: 'other', label: 'Other' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];



type FormValues = {
  priority: string;
  category: string;
  subject: string;
  description: string;
};

export default function SupportPage() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const [postSupportTicket, { isLoading }] = usePostSupportTicketMutation();
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      await postSupportTicket(data).unwrap();
      toast.success('Ticket submitted successfully!');
      reset();
      router.push("/support/my-support-tickets")
    } catch (error: any) {
      toast.error(error?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D27] via-[#1C1F2A] to-[#252833] text-white flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 group">
            <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Trading
          </Link>
          <Link href={"/support/my-support-tickets"}>
          <Button
            variant="outline"
            className="bg-transparent border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 flex items-center"
          >
            <Ticket size={16} className="mr-2" /> My Tickets
          </Button>
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-[#141720]/80 backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-10">
          <div className="text-center mb-8">
            <LifeBuoy className="mx-auto h-16 w-16 text-blue-500 mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Get Support</h1>
            <p className="mt-3 text-base text-gray-400 max-w-md mx-auto">
              Have an issue or a question? Fill out the form below, and our support team will assist you.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name & Email */}
              <div className="space-y-1">
                <label htmlFor="name" className="text-gray-300 flex items-center">
                   Subject
                </label>
                <Input
                  id="subject"
                  {...register('subject', { required: 'subject is required' })}
                  className="bg-[#252833] border-gray-700 focus:border-blue-500 text-white placeholder-gray-500"
                  placeholder="Enter subject"
                />
                {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
              </div>

            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-gray-300 flex items-center">
                 Category
              </label>
              <Select
                onValueChange={(val) => setValue('category', val)}
                value={getValues('category')}
              >
                <SelectTrigger className="bg-[#252833] border-gray-700 text-white">
                  <SelectValue placeholder="Select the nature of your issue" />
                </SelectTrigger>
                <SelectContent className="bg-[#252833] border-gray-700 text-white">
                  {categories.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>

            {/* Priority Select */}
            <div className="space-y-1">
              <label className="text-gray-300 flex items-center">
                 Priority
              </label>
              <Select
                onValueChange={(val) => setValue('priority', val)}
                value={getValues('priority')}
              >
                <SelectTrigger className="bg-[#252833] border-gray-700 text-white">
                  <SelectValue placeholder="Select the nature of your issue" />
                </SelectTrigger>
                <SelectContent className="bg-[#252833] border-gray-700 text-white">
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-red-500">{errors.priority.message}</p>}
            </div>

             {/* Message */}
            <div className="space-y-1">
              <label htmlFor="description" className="text-gray-300">
                Detailed Description
              </label>
              <Textarea
                id="description"
                {...register('description', {
                  required: 'Description is required',
                })}
                placeholder="Describe your issue or question in detail..."
                className="resize-y min-h-[120px] bg-[#252833] border-gray-700 focus:border-blue-500 text-white placeholder-gray-500"
              />
              <p className="text-xs text-gray-500">
                Please provide as much detail as possible, including steps to reproduce the issue.
              </p>
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base transition-all duration-150 ease-in-out transform hover:scale-105 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" /> Submit Ticket
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
