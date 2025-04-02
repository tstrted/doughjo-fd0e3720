
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account, Category } from "@/types/finance";

interface TransactionFormData {
  account: string;
  date: string;
  description: string;
  category: string;
  payment?: number;
  deposit?: number;
  memo: string;
  cleared: boolean;
  type: "payment" | "deposit" | "transfer" | "balance" | string;
}

interface TransactionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: TransactionFormData;
  setFormData: React.Dispatch<React.SetStateAction<TransactionFormData>>;
  onSubmit: () => void;
  accounts: Account[];
  categories: Category[];
  title: string;
  description: string;
  submitLabel: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  accounts,
  categories,
  title,
  description,
  submitLabel,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="account">Account</Label>
            <Select
              value={formData.account}
              onValueChange={(value) => setFormData({ ...formData, account: value })}
            >
              <SelectTrigger id="account">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Groceries at SuperMarket"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="payment">Payment Amount</Label>
              <Input
                id="payment"
                type="number"
                value={formData.payment === undefined ? "" : formData.payment}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  setFormData({ 
                    ...formData, 
                    payment: value,
                    deposit: value !== undefined ? undefined : formData.deposit 
                  });
                }}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deposit">Deposit Amount</Label>
              <Input
                id="deposit"
                type="number"
                value={formData.deposit === undefined ? "" : formData.deposit}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  setFormData({ 
                    ...formData, 
                    deposit: value,
                    payment: value !== undefined ? undefined : formData.payment 
                  });
                }}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Input
              id="memo"
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              placeholder="Additional notes"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
