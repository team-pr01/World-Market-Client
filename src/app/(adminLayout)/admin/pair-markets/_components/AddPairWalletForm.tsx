/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/reusable/Button/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAddPairMarketMutation } from "@/redux/Features/Admin/adminApi";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddPairWalletForm = ({
  open,
  onOpenChange,
  setIsAddWalletOpen,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsAddWalletOpen: (open: boolean) => void;
}) => {
  const [addPairMarket, { isLoading }] = useAddPairMarketMutation();
  const { register, handleSubmit, reset } = useForm<any>();

  const onSubmit = async (data: any) => {
    try{
      const response = await addPairMarket(data).unwrap();
      console.log(response);
    if (response) {
      reset();
      setIsAddWalletOpen(false);
    }
    
    }
    catch (error) {
      toast.error(
        (typeof error === "object" && error !== null && "data" in error && (error as any).data?.message) ||
          "Failed to add payment method"
      );
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add New Pair
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

               <div>
                <Label>type</Label>
                <select
                  {...register("type")}
                  className="w-full bg-gray-700 border-gray-600 text-white mt-1"
                >
                  <option value="crypto">Crypto</option>
                  <option value="forex">Forex</option>
                </select>
              </div>

              <div>
                <Label htmlFor="baseAsset">Base Asset</Label>
                <Input
                  id="baseAsset"
                  {...register("baseAsset", { required: true })}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="quoteAsset">Quote Asset</Label>
                <Input
                  id="quoteAsset"
                  {...register("quoteAsset", { required: true })}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>

               <div>
                <Label>Market Type</Label>
                <select
                  {...register("market_type")}
                  className="w-full bg-gray-700 border-gray-600 text-white mt-1"
                >
                  <option value="otc">OTC</option>
                  <option value="real">Real</option>
                </select>
              </div>


              <div>
                <Label htmlFor="min_market_price">Min Market Price</Label>
                <Input
                  id="min_market_price"
                  type="number"
                  {...register("min_market_price", { required: true })}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="max_market_price">Max Market Price</Label>
                <Input
                  id="max_market_price"
                  type="number"
                  {...register("max_market_price", { required: true })}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="start_market_price">Start Market Price</Label>
                <Input
                  id="start_market_price"
                  type="number"
                  {...register("start_market_price", { required: true })}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                />
              </div>

              <div>
                <Label>Status</Label>
                <select
                  {...register("status")}
                  className="w-full bg-gray-700 border-gray-600 text-white mt-1"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

            </div>

          <DialogFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {isLoading ? "Adding..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPairWalletForm;
