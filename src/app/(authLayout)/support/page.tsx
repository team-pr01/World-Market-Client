/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, LifeBuoy, Mail, MessageSquare, Send, Ticket, User } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/reusable/Button/Button';
// import { useSubmitSupportTicketMutation } from '@/redux/api/supportApi';

const subjectOptions = [
  { value: 'deposit_issue', label: 'Deposit Issue' },
  { value: 'withdrawal_issue', label: 'Withdrawal Issue' },
  { value: 'account_problem', label: 'Account Problem/Access' },
  { value: 'technical_glitch', label: 'Technical Glitch/Bug Report' },
  { value: 'trading_question', label: 'Trading Question' },
  { value: 'verification_help', label: 'Verification Help' },
  { value: 'general_inquiry', label: 'General Inquiry' },
  { value: 'feedback_suggestion', label: 'Feedback/Suggestion' },
  { value: 'other', label: 'Other' },
];

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
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

  const isLoading = false
  // const [submitSupportTicket, { isLoading }] = useSubmitSupportTicketMutation();

  const onSubmit = async (values: FormValues) => {
    try {
      // await submitSupportTicket(values).unwrap();
      toast.success('Ticket submitted successfully!');
      reset();
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label htmlFor="name" className="text-gray-300 flex items-center">
                  <User size={16} className="mr-2 text-blue-400" /> Your Name
                </label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  className="bg-[#252833] border-gray-700 focus:border-blue-500 text-white placeholder-gray-500"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-gray-300 flex items-center">
                  <Mail size={16} className="mr-2 text-blue-400" /> Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  className="bg-[#252833] border-gray-700 focus:border-blue-500 text-white placeholder-gray-500"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            {/* Subject Select */}
            <div className="space-y-1">
              <label className="text-gray-300 flex items-center">
                <MessageSquare size={16} className="mr-2 text-blue-400" /> Subject
              </label>
              <Select
                onValueChange={(val) => setValue('subject', val)}
                value={getValues('subject')}
              >
                <SelectTrigger className="bg-[#252833] border-gray-700 text-white">
                  <SelectValue placeholder="Select the nature of your issue" />
                </SelectTrigger>
                <SelectContent className="bg-[#252833] border-gray-700 text-white">
                  {subjectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label htmlFor="message" className="text-gray-300">
                Detailed Description
              </label>
              <Textarea
                id="message"
                {...register('message', {
                  required: 'Message is required',
                  minLength: { value: 10, message: 'Minimum 10 characters required' },
                })}
                placeholder="Describe your issue or question in detail..."
                className="resize-y min-h-[120px] bg-[#252833] border-gray-700 focus:border-blue-500 text-white placeholder-gray-500"
              />
              <p className="text-xs text-gray-500">
                Please provide as much detail as possible, including steps to reproduce the issue.
              </p>
              {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
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

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          For urgent matters, you can also check our{' '}
          <Link href="/faq" className="underline hover:text-blue-400">
            FAQ section
          </Link>{' '}
          or contact us via live chat (if available).
        </p>
      </div>
    </div>
  );
}
