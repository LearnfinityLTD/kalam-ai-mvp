// app/profile/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Upload,
  Save,
  Shield,
  Bell,
  User,
  LogOut,
  Trash2,
  Globe,
  Flag,
} from "lucide-react";

type Role = "guard" | "guide" | "professional";

type Profile = {
  id: string;
  full_name: string | null;
  display_name: string | null;
  phone: string | null;
  language: string | null;
  timezone: string | null;
  role: Role | null;
  weekly_goal: number | null;
  learning_focus: string | null;
  notify_email: boolean | null;
  notify_push: boolean | null;
  avatar_url: string | null;
  deactivated_at: string | null;
};

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "ur", label: "Urdu" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
];

const TIMEZONES = [
  "Europe/London",
  "Europe/Paris",
  "Europe/Istanbul",
  "Africa/Cairo",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Riyadh",
  "America/New_York",
  "America/Los_Angeles",
];

const ROLES: Role[] = ["guard", "guide", "professional"];

export default function ProfilePage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);

  // password/email local inputs
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: userResp } = await supabase.auth.getUser();
      if (!mounted) return;

      const user = userResp?.user;
      if (!user) {
        router.replace("/auth/signin");
        return;
      }
      setUserId(user.id);
      setEmail(user.email ?? null);

      // fetch profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
      }

      // bootstrap defaults if missing
      const initial: Profile = {
        id: user.id,
        full_name: data?.full_name ?? "",
        display_name: data?.display_name ?? "",
        phone: data?.phone ?? "",
        language: data?.language ?? "en",
        timezone:
          data?.timezone ??
          Intl.DateTimeFormat().resolvedOptions().timeZone ??
          "Europe/London",
        role: (data?.role as Role) ?? "guard",
        weekly_goal: data?.weekly_goal ?? 5,
        learning_focus: data?.learning_focus ?? "",
        notify_email: data?.notify_email ?? true,
        notify_push: data?.notify_push ?? false,
        avatar_url: data?.avatar_url ?? null,
        deactivated_at: data?.deactivated_at ?? null,
      };

      setProfile(initial);
      setNewEmail(user.email ?? "");
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  const initials = (name?: string | null) =>
    (name ?? email ?? "U")
      .trim()
      .split(/\s+/)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("");

  async function handleSaveProfile() {
    if (!profile || !userId) return;
    setSaving(true);
    try {
      const payload = {
        ...profile,
        id: userId,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
    } catch (e) {
      console.error(e);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(file: File) {
    if (!userId) return;
    const ext = file.name.split(".").pop() || "png";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    // 1) upload
    const { error: uploadErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        upsert: false,
        cacheControl: "3600",
      });
    if (uploadErr) {
      console.error(uploadErr);
      alert("Failed to upload avatar.");
      return;
    }

    // 2) get public URL (or use signed URL if you prefer)
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);
    const publicUrl = urlData?.publicUrl;

    // 3) save to profile
    setProfile((prev) => (prev ? { ...prev, avatar_url: publicUrl } : prev));
  }

  async function applyEmailChange() {
    if (!newEmail || !userId) return;
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      alert(
        "If your project requires email confirmation, check your inbox to complete the change."
      );
      setEmail(newEmail);
    } catch (e) {
      console.error(e);
      alert("Could not update email.");
    }
  }

  async function applyPasswordChange() {
    if (!newPassword || newPassword.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      alert("Password updated.");
      setNewPassword("");
    } catch (e) {
      console.error(e);
      alert("Could not update password.");
    }
  }

  async function softDeactivateAccount() {
    if (!userId) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ deactivated_at: new Date().toISOString() })
        .eq("id", userId);
      if (error) throw error;

      // sign out and redirect
      await supabase.auth.signOut();
      router.replace("/");
    } catch (e) {
      console.error(e);
      alert("Failed to deactivate account.");
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading profile…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NOTE: page-level header should live in your layout/page wrapper.
          This page renders content only to respect your "one header" rule. */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-sm text-gray-600">
            Manage your KalamAI account details and preferences.
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">
              <User className="w-4 h-4 mr-2" /> Account
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Globe className="w-4 h-4 mr-2" /> Preferences
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" /> Security
            </TabsTrigger>
          </TabsList>

          {/* ACCOUNT */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={profile.avatar_url ?? undefined}
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {initials(profile.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) await handleAvatarUpload(file);
                      }}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <Label htmlFor="full_name">Full name</Label>
                      <Input
                        id="full_name"
                        placeholder="e.g. Ahmed Khan"
                        value={profile.full_name ?? ""}
                        onChange={(e) =>
                          setProfile({ ...profile, full_name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="display_name">Display name</Label>
                      <Input
                        id="display_name"
                        placeholder="Shown in leaderboards/messages"
                        value={profile.display_name ?? ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            display_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+44 7…"
                        value={profile.phone ?? ""}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={(profile.role ?? "guard") as Role}
                        onValueChange={(v: Role) =>
                          setProfile({ ...profile, role: v })
                        }
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Choose role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r.charAt(0).toUpperCase() + r.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="learning_focus">Learning focus</Label>
                      <Textarea
                        id="learning_focus"
                        placeholder="e.g. ‘Improve hospitality greetings and emergency communication.’"
                        value={profile.learning_focus ?? ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            learning_focus: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PREFERENCES */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Language & Time</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={profile.language ?? "en"}
                    onValueChange={(v) =>
                      setProfile({ ...profile, language: v })
                    }
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Choose language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profile.timezone ?? "Europe/London"}
                    onValueChange={(v) =>
                      setProfile({ ...profile, timezone: v })
                    }
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Choose timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="weekly_goal">Weekly goal (sessions)</Label>
                  <Input
                    id="weekly_goal"
                    type="number"
                    min={1}
                    max={21}
                    value={String(profile.weekly_goal ?? 5)}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setProfile({
                        ...profile,
                        weekly_goal: Number.isFinite(v) ? v : 5,
                      });
                    }}
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <Flag className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-600">
                    KalamAI will recommend scenarios to hit your weekly goal.
                  </p>
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-gray-600">
                      Reminders and weekly summaries.
                    </p>
                  </div>
                  <Switch
                    checked={!!profile.notify_email}
                    onCheckedChange={(checked) =>
                      setProfile({ ...profile, notify_email: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push notifications</p>
                    <p className="text-sm text-gray-600">
                      Real-time nudges while practicing.
                    </p>
                  </div>
                  <Switch
                    checked={!!profile.notify_push}
                    onCheckedChange={(checked) =>
                      setProfile({ ...profile, notify_push: checked })
                    }
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save notification settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Login & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                    <Button
                      className="mt-2"
                      variant="secondary"
                      onClick={applyEmailChange}
                    >
                      Update email
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="password">New password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <Button
                      className="mt-2"
                      variant="secondary"
                      onClick={applyPasswordChange}
                    >
                      Update password
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Sign out</p>
                      <p className="text-sm text-gray-600">
                        Sign out of this device.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={signOut}>
                    Sign out
                  </Button>
                </div>

                <Separator />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="font-medium text-red-600">
                        Deactivate account
                      </p>
                      <p className="text-sm text-gray-600 max-w-md">
                        This will pause your access and scheduling. You can
                        contact support to reactivate. (Soft delete)
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setDeactivateOpen(true)}
                  >
                    Deactivate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save bar (sticky) */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save all changes
          </Button>
        </div>
      </main>

      {/* Deactivate dialog */}
      <AlertDialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate your account?</AlertDialogTitle>
            <AlertDialogDescription>
              We’ll mark your account as deactivated and sign you out. You can
              contact support to reactivate later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={softDeactivateAccount}
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
