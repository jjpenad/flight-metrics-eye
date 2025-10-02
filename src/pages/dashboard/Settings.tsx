import { Card } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">Settings coming soon...</p>
      </Card>
    </div>
  );
};

export default Settings;
