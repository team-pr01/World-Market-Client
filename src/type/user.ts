export type User = {
     _id: string;
     name: string;
     username: string;
     email: string;
     phone: string;
     demo_balance: number;
     main_balance: number;
     referral_code: string;
     referred_by: Record<string, any> | null;
     is_email_verified: boolean;
     is_phone_verified: boolean;
     is_kyc_verified: boolean;
     deposit_status: boolean;
     withdraw_status: boolean;
     status: "active" | "inactive" | "banned";
     created_at: string;
};
