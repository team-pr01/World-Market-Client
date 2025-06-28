/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/reusable/Button/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetAllPaymentMethodsQuery,
  useMakeDepositMutation,
} from "@/redux/Features/User/userApi";

type TDepositForm = {
  amount: number;
  currency: string;
  transaction_id: string;
  sender_address: string;
  receiver_address: string;
  payment_method: string; // this will be _id from dropdown
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsDepositFormOpen: (open: boolean) => void;
};

const MakeDepositForm = ({
  open,
  onOpenChange,
  setIsDepositFormOpen,
}: Props) => {
  const { register, handleSubmit, reset } = useForm<TDepositForm>();
  const { data: paymentMethods = [], isLoading: loadingMethods } =
    useGetAllPaymentMethodsQuery({});
  const [makeDeposit, { isLoading }] = useMakeDepositMutation();
  console.log(paymentMethods);

  const onSubmit: SubmitHandler<TDepositForm> = async (formData) => {
    const payload = {
      ...formData,
      currency: "usd",
      payment_proof: "https://dummy-proof.com/image.png", // hardcoded proof
      note: "Manual deposit request", // hardcoded note
    };

    try {
      const res = await makeDeposit(payload).unwrap();
      if (res) {
        toast.success("Deposit submitted successfully!");
        reset();
        setIsDepositFormOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Deposit submission failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Make Deposit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register("amount", { required: true })}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                disabled
                value="usd"
                className="w-full bg-gray-700 border-gray-600 text-white mt-1 cursor-not-allowed"
              >
                <option value="usd">USD</option>
              </select>
            </div>

            <div>
              <Label htmlFor="transaction_id">Transaction ID</Label>
              <Input
                id="transaction_id"
                {...register("transaction_id", { required: true })}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="sender_address">Sender Address</Label>
              <Input
                id="sender_address"
                {...register("sender_address", { required: true })}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="receiver_address">Receiver Address</Label>
              <Input
                id="receiver_address"
                {...register("receiver_address", { required: true })}
                className="bg-gray-700 border-gray-600 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="payment_method">Payment Method</Label>
              <select
                id="payment_method"
                {...register("payment_method", { required: true })}
                className="w-full bg-gray-700 border-gray-600 text-white mt-1"
              >
                <option value="">Select Method</option>
                {!loadingMethods &&
                  paymentMethods?.data?.map((method: any) => (
                    <option key={method._id} value={method._id}>
                      {method?.method_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <DialogFooter className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MakeDepositForm;
