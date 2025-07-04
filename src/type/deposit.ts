interface User {
     _id: string;
     username: string;
     email: string;
     name: string;
}

interface PaymentMethod {
     _id: string;
     method_name: string;
     slug: string;
     currency: string;
     logo: string;
     type: string;
     method_category: string;
     method_type: string;
}

export interface Deposit {
     _id: string;
     amount: number;
     currency: string;
     transaction_id: string;
     user_id: User;
     sender_address: string;
     receiver_address: string;
     payment_method: PaymentMethod;
     payment_proof: string;
     note: string;
     status: string;
     charge_fee: number;
     approved_at: string;
     rejected_at: string;
     approved_by: User;
     rejected_by: User;
     created_at: string;
}

interface Pagination {
     currentPage: number;
     totalPages: number;
     totalItems: number;
     itemsPerPage: number;
     hasNextPage: boolean;
     hasPrevPage: boolean;
}

export interface DepositResponse {
     success: boolean;
     message: string;
     data: {
          deposits: Deposit[];
          pagination: Pagination;
     };
}
