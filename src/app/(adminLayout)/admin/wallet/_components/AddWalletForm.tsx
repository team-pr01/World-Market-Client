/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/reusable/Button/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddPaymentMethodMutation } from "@/redux/Features/Admin/adminApi";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form"

const AddWalletForm = ({open, onOpenChange, setIsAddWalletOpen} : {open: boolean, onOpenChange: (open: boolean) => void, setIsAddWalletOpen: (open: boolean) => void}) => {
  const [addPaymentMethod] = useAddPaymentMethodMutation();
     const fileInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<string>("");
  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm<any>({
    defaultValues: {
      method_type: ["deposit"],
      method_category: "online",
      status: "pending",
      type: "manual",
    },
  });

  const selectedType = watch("type");

  const onSubmit = (data: any) => {
    if (selectedType === "auto") {
      delete data.wallet_info;
    } else {
      delete data.api_key;
    }
    data.logo = logo;
    console.log("Submit Data:", data);

    const response = addPaymentMethod(data).unwrap();
    console.log(response, "Add Payment Method Response");
    // Make API request here
    reset();
    setIsAddWalletOpen(false);
  };

  const handleLogoUpload = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Wallet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="method_name">Method Name</Label>
                <Input id="method_name" {...register("method_name", { required: true })} className="bg-gray-700 border-gray-600 text-white mt-1" />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" {...register("currency", { required: true })} className="bg-gray-700 border-gray-600 text-white mt-1" />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  {...register("type")}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-10 text-white mt-1"
                >
                  <option value="auto">Auto</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {selectedType === "auto" && (
                <div className="space-y-2">
                  <Label>API Key Info</Label>
                  <Input placeholder="Public Key" {...register("api_key.public_key")} className="bg-gray-700 border-gray-600 text-white" />
                  <Input placeholder="Secret Key" {...register("api_key.secret_key")} className="bg-gray-700 border-gray-600 text-white" />
                  <Input placeholder="Webhook Secret" {...register("api_key.webhook_secret")} className="bg-gray-700 border-gray-600 text-white" />
                  <Input placeholder="Merchant ID" {...register("api_key.merchant_id")} className="bg-gray-700 border-gray-600 text-white" />
                  <Input placeholder="API URL" {...register("api_key.api_url")} className="bg-gray-700 border-gray-600 text-white" />
                </div>
              )}

              {selectedType === "manual" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Crypto Info</Label>
                    <Input placeholder="Wallet Address" {...register("wallet_info.crypto.wallet_address")} className="bg-gray-700 border-gray-600 text-white" />
                    <Input placeholder="Network" {...register("wallet_info.crypto.network")} className="bg-gray-700 border-gray-600 text-white" />
                    <Input placeholder="QR Code URL" {...register("wallet_info.crypto.qr_code")} className="bg-gray-700 border-gray-600 text-white" />
                    <Textarea placeholder="Instructions" {...register("wallet_info.crypto.instructions")} className="bg-gray-700 border-gray-600 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label>Mobile Banking</Label>
                    <Input placeholder="Account Type" {...register("wallet_info.mobile.account_type")} className="bg-gray-700 border-gray-600 text-white" />
                    <Input placeholder="Account Name" {...register("wallet_info.mobile.account_name")} className="bg-gray-700 border-gray-600 text-white" />
                    <Input placeholder="Account Number" {...register("wallet_info.mobile.account_number")} className="bg-gray-700 border-gray-600 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label>Bank Info</Label>
                    <Input placeholder="Bank Name" {...register("wallet_info.bank.bank_name")} className="bg-gray-700 border-gray-600 text-white" />
                    <Input placeholder="Bank Code" {...register("wallet_info.bank.bank_code")} className="bg-gray-700 border-gray-600 text-white" />
                    <Input placeholder="Bank Address" {...register("wallet_info.bank.bank_address")} className="bg-gray-700 border-gray-600 text-white" />
                    <Input placeholder="SWIFT Code" {...register("wallet_info.bank.bank_swift")} className="bg-gray-700 border-gray-600 text-white" />
                    <Input placeholder="Bank Account" {...register("wallet_info.bank.bank_account")} className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <select {...register("status")} className="w-full bg-gray-700 border-gray-600 text-white mt-1">
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <Label className="text-gray-300 block mb-2">Wallet Logo</Label>
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-lg bg-gray-700 border border-gray-600 flex items-center justify-center overflow-hidden">
                    {logo ? (
                      <img src={logo} alt="Logo preview" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs text-center">No Logo</span>
                    )}
                  </div>
                  <Button type="button" variant="outline" onClick={handleLogoUpload} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Upload className="mr-2 h-4 w-4" />Select Logo
                  </Button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Add Wallet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    );
};

export default AddWalletForm;