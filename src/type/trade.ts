export type Trade = {
     _id: string;
     pair: {
          _id: string;
          logo: string;
          pair: string;
          market_type: string;
     };
     user: {
          _id: string;
          username: string;
          email: string;
          name: string;
     };
     amount: number;
     bidPrice: number;
     account_type: string;
     system_type: string;
     bidTime: string;
     status: string;
     direction: string;
     resultPrice: number;
     expiryTime: string;
     payout: number;
     createdAt: string;
};
