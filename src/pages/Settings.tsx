
import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  CreditCard, 
  Tags, 
  FileText, 
  AlertCircle, 
  Database, 
  Download, 
  Upload, 
  Save, 
  Trash2 
} from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const { settings, updateSettings, categories, addCategory, accounts } = useFinance();
  
  // Local settings state
  const [localSettings, setLocalSettings] = useState({
    currency: settings.currency,
    financialYearStart: settings.financialYearStart,
    darkMode: false,
    notifications: true,
    autoSync: true,
  });
  
  // Category form state
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "F" as "F" | "S" | "G" | "V",
    description: "",
  });
  
  // Explain category types
  const categoryTypeDescriptions = {
    F: "Fixed (Regular monthly expenses that don't change much)",
    S: "Seasonal (Expenses that occur irregularly)",
    G: "Goal (Savings or special purpose funds)",
    V: "Variable (Transfers, adjustments, etc.)",
  };
  
  // Handle settings form submission
  const handleSaveSettings = () => {
    updateSettings({
      currency: localSettings.currency,
      financialYearStart: localSettings.financialYearStart,
    });
    
    toast.success("Settings saved successfully");
  };
  
  // Handle category form submission
  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error("Category name is required");
      return;
    }
    
    addCategory({
      name: newCategory.name,
      type: newCategory.type,
      description: newCategory.description || undefined,
    });
    
    setNewCategory({
      name: "",
      type: "F",
      description: "",
    });
    
    toast.success("Category added successfully");
  };
  
  // Export data as JSON
  const handleExportData = () => {
    try {
      const data = JSON.stringify({
        accounts,
        categories,
        settings,
      }, null, 2);
      
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "pocket-savings-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full flex justify-start">
          <TabsTrigger value="general" className="flex-1 max-w-[150px]">
            <Settings className="h-4 w-4 mr-2" /> General
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex-1 max-w-[150px]">
            <Tags className="h-4 w-4 mr-2" /> Categories
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex-1 max-w-[150px]">
            <CreditCard className="h-4 w-4 mr-2" /> Accounts
          </TabsTrigger>
          <TabsTrigger value="data" className="flex-1 max-w-[150px]">
            <Database className="h-4 w-4 mr-2" /> Data
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your app's general preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={localSettings.currency}
                  onValueChange={(value) => setLocalSettings({ ...localSettings, currency: value as any })}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                    <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="financial-year-start">Financial Year Start</Label>
                <Input
                  id="financial-year-start"
                  type="date"
                  value={localSettings.financialYearStart}
                  onChange={(e) => setLocalSettings({ ...localSettings, financialYearStart: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <Switch
                    id="dark-mode"
                    checked={localSettings.darkMode}
                    onCheckedChange={(checked) => setLocalSettings({ ...localSettings, darkMode: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark theme
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={localSettings.notifications}
                    onCheckedChange={(checked) => setLocalSettings({ ...localSettings, notifications: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable notifications for important events
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-sync">Auto-Sync</Label>
                  <Switch
                    id="auto-sync"
                    checked={localSettings.autoSync}
                    onCheckedChange={(checked) => setLocalSettings({ ...localSettings, autoSync: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically sync data with cloud storage
                </p>
              </div>
              
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" /> Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>
                Add, edit, or remove spending and income categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add New Category</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="e.g., Groceries"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category-type">Category Type</Label>
                    <RadioGroup
                      value={newCategory.type}
                      onValueChange={(value) => setNewCategory({ ...newCategory, type: value as any })}
                      className="grid grid-cols-1 gap-2"
                    >
                      {Object.entries(categoryTypeDescriptions).map(([type, description]) => (
                        <div key={type} className="flex items-start space-x-2">
                          <RadioGroupItem value={type} id={`type-${type}`} className="mt-1" />
                          <div>
                            <Label htmlFor={`type-${type}`} className="font-medium">
                              Type {type}
                            </Label>
                            <p className="text-sm text-muted-foreground">{description}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category-description">Description (Optional)</Label>
                    <Input
                      id="category-description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Brief description of the category"
                    />
                  </div>
                  
                  <Button onClick={handleAddCategory}>
                    <Save className="mr-2 h-4 w-4" /> Add Category
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accounts" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Configure settings for your accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Account Sync</h3>
                  <Button variant="outline" disabled>
                    <AlertCircle className="mr-2 h-4 w-4" /> Coming Soon
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  Connect to your bank accounts for automatic transaction syncing.
                  This feature is still in development and will be available soon.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Account Templates</h3>
                  <Button variant="outline" disabled>
                    <FileText className="mr-2 h-4 w-4" /> Coming Soon
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  Create and manage account templates for quick setup.
                  This feature is still in development and will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Import, export, and manage your financial data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Button variant="outline" className="h-24 flex flex-col" onClick={handleExportData}>
                  <Download className="h-8 w-8 mb-2" />
                  <span>Export Data</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Import Data</span>
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium text-destructive mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All Data
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    This action will permanently delete all your data and cannot be undone.
                    Make sure to export your data before proceeding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
