/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAllDepositsQuery,
  useGetAllUserQuery,
  useGetAllWithdrawalsQuery,
} from "@/redux/Features/Admin/adminApi";
import {
  Users,
  DollarSign,
  ArrowUpCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: users } = useGetAllUserQuery({});
  const { data: deposits } = useGetAllDepositsQuery({});
  const { data: withdrawals } = useGetAllWithdrawalsQuery({});
  // console.log(deposits);
  const isLoading = false;

  const totalDepositsAmount =
    deposits?.data?.deposits?.reduce((acc:any, deposit:any) => {
      return acc + (deposit.amount || 0);
    }, 0) || 0;

  const totalWithdrawalsAmount =
    withdrawals?.data?.withdraws?.reduce((acc:any, withdrawal:any) => {
      return acc + (withdrawal.amount || 0);
    }, 0) || 0;

  const stats = {
    totalUsers: users?.data?.users?.length || 0,
    totalDepositsAmount: totalDepositsAmount || 0,
    totalWithdrawalsAmount: totalWithdrawalsAmount || 0,
    totalApprovedWithdrawals:
      withdrawals?.data?.withdraws?.filter(
        (withdrawal:any) => withdrawal.status === "approved"
      ).length || 0,
    totalPendingWithdrawals:
      withdrawals?.data?.withdraws?.filter(
        (withdrawal:any) => withdrawal.status === "pending"
      ).length || 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="bg-white dark:bg-gray-800 shadow-lg animate-pulse"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers,
      icon: Users,
      description: "All registered users",
      color: "text-blue-500",
    },
    {
      title: "Total Deposit Amount",
      value: `$${stats?.totalDepositsAmount}`,
      icon: DollarSign,
      description: "Sum of all approved deposits",
      color: "text-green-500",
    },
    // {
    //   title: "Approved Deposits",
    //   value: stats?.totalApprovedDeposits,
    //   icon: ArrowDownCircle,
    //   description: "Count of approved deposits",
    //   color: "text-emerald-500",
    // },
    // {
    //   title: "Pending Deposits",
    //   value: stats?.totalPendingDeposits,
    //   icon: ArrowDownCircle,
    //   description: "Deposits awaiting approval",
    //   color: "text-yellow-500 opacity-75",
    // },
    {
      title: "Total Withdrawal Amount",
      value: `$${stats?.totalWithdrawalsAmount}`,
      icon: DollarSign,
      description: "Sum of all approved withdrawals",
      color: "text-red-500",
    },
    {
      title: "Approved Withdrawals",
      value: stats?.totalApprovedWithdrawals,
      icon: ArrowUpCircle,
      description: "Count of approved withdrawals",
      color: "text-rose-500",
    },
    {
      title: "Pending Withdrawals",
      value: stats?.totalPendingWithdrawals,
      icon: ArrowUpCircle,
      description: "Withdrawals awaiting approval",
      color: "text-amber-500 opacity-75",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of platform statistics.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="bg-gray-800 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {card.title}
                </CardTitle>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {card.value}
                </div>
                <p className="text-xs text-gray-400 pt-1">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
