import { SettingsTabs } from '@/components/settings/SettingsTabs';

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      <p className="text-muted-foreground">
        Manage your organization's security settings. Available to Admins only.
      </p>
      <SettingsTabs />
    </div>
  );
}
