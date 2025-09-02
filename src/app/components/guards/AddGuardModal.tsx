import React, { useState, useEffect } from "react";
import { guardService } from "@/services/guardService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  UserPlus,
  Shield,
  User,
  Mail,
  Building2,
  Landmark,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

// Types based on your schema
type UserType = "guard" | "professional";
type Dialect = "gulf" | "egyptian" | "levantine" | "standard";
type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1";

interface Organization {
  id: string;
  name: string;
  type: "mosque" | "company";
  admin_email?: string;
  location?: string;
  industry?: string;
}

interface AddGuardForm {
  // Auth data
  email: string;
  password: string;
  confirmPassword: string;

  // Profile data
  full_name: string;
  user_type: UserType;
  dialect: Dialect | null;
  english_level: EnglishLevel | null;

  // Organization assignment
  mosque_id: string | null;
  company_id: string | null;

  // Admin settings
  is_admin: boolean;

  // Assessment data
  assessment_completed: boolean;
  assessment_score: number | null;
  strengths: string[];
  recommendations: string[];
}

export default function AddGuardModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [currentStep, setCurrentStep] = useState<
    "basic" | "profile" | "organization" | "assessment"
  >("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const [form, setForm] = useState<AddGuardForm>({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    user_type: "guard",
    dialect: null,
    english_level: null,
    mosque_id: null,
    company_id: null,
    is_admin: false,
    assessment_completed: false,
    assessment_score: null,
    strengths: [],
    recommendations: [],
  });

  // Load data - UPDATED VERSION
  useEffect(() => {
    if (isOpen) {
      // Fetch organizations from API
      const loadOrganizations = async () => {
        try {
          const orgs = await guardService.fetchOrganizations();
          setOrganizations(orgs);
        } catch (error) {
          console.error("Failed to load organizations:", error);
        }
      };

      loadOrganizations();
    }
  }, [isOpen]);

  const updateForm = (
    field: keyof AddGuardForm,
    value: string | boolean | number | null | string[]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (step: typeof currentStep): boolean => {
    switch (step) {
      case "basic":
        if (!form.email || !form.password || !form.confirmPassword) {
          setError("All fields are required");
          return false;
        }
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        if (form.password.length < 8) {
          setError("Password must be at least 8 characters");
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
          setError("Please enter a valid email address");
          return false;
        }
        return true;

      case "profile":
        if (!form.full_name.trim()) {
          setError("Full name is required");
          return false;
        }
        return true;

      case "organization":
        // Optional step - validation passes regardless
        return true;

      case "assessment":
        if (form.assessment_completed && !form.assessment_score) {
          setError("Assessment score is required when marked as completed");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;

    const steps: (typeof currentStep)[] = [
      "basic",
      "profile",
      "organization",
      "assessment",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: (typeof currentStep)[] = [
      "basic",
      "profile",
      "organization",
      "assessment",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Creating guard with data:", form);

      const result = await guardService.createGuard(form);

      if (result.success) {
        onSuccess();
        onClose();
        resetForm();
      } else {
        setError(result.error || "Failed to create guard");
      }
    } catch (err: unknown) {
      console.error("Error creating guard:", err);
      setError(err instanceof Error ? err.message : "Failed to create guard");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      user_type: "guard",
      dialect: null,
      english_level: null,
      mosque_id: null,
      company_id: null,
      is_admin: false,
      assessment_completed: false,
      assessment_score: null,
      strengths: [],
      recommendations: [],
    });
    setCurrentStep("basic");
    setError(null);
  };

  const addStrength = (strength: string) => {
    if (strength.trim() && !form.strengths.includes(strength)) {
      updateForm("strengths", [...form.strengths, strength.trim()]);
    }
  };

  const removeStrength = (strength: string) => {
    updateForm(
      "strengths",
      form.strengths.filter((s) => s !== strength)
    );
  };

  const addRecommendation = (rec: string) => {
    if (rec.trim() && !form.recommendations.includes(rec)) {
      updateForm("recommendations", [...form.recommendations, rec.trim()]);
    }
  };

  const removeRecommendation = (rec: string) => {
    updateForm(
      "recommendations",
      form.recommendations.filter((r) => r !== rec)
    );
  };

  const steps = [
    { id: "basic", title: "Basic Info", icon: User },
    { id: "profile", title: "Profile", icon: Shield },
    { id: "organization", title: "Organization", icon: Building2 },
    { id: "assessment", title: "Assessment", icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="w-5 h-5" />
            Add New Guard
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 px-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 ml-4 ${
                      isCompleted ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Information Step */}
          {currentStep === "basic" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="guard@example.com"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={(e) => updateForm("password", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateForm("confirmPassword", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Step */}
          {currentStep === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    value={form.full_name}
                    onChange={(e) => updateForm("full_name", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>User Type</Label>
                    <Select
                      value={form.user_type}
                      onValueChange={(value) =>
                        updateForm("user_type", value as UserType)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guard">Security Guard</SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Arabic Dialect</Label>
                    <Select
                      value={form.dialect || ""}
                      onValueChange={(value) =>
                        updateForm("dialect", value || null)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select dialect" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gulf">Gulf</SelectItem>
                        <SelectItem value="egyptian">Egyptian</SelectItem>
                        <SelectItem value="levantine">Levantine</SelectItem>
                        <SelectItem value="standard">
                          Standard Arabic
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>English Level</Label>
                  <Select
                    value={form.english_level || ""}
                    onValueChange={(value) =>
                      updateForm("english_level", value || null)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select English level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1">A1 - Beginner</SelectItem>
                      <SelectItem value="A2">A2 - Elementary</SelectItem>
                      <SelectItem value="B1">B1 - Intermediate</SelectItem>
                      <SelectItem value="B2">
                        B2 - Upper Intermediate
                      </SelectItem>
                      <SelectItem value="C1">C1 - Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAdmin"
                    checked={form.is_admin}
                    onCheckedChange={(checked) =>
                      updateForm("is_admin", checked)
                    }
                  />
                  <Label htmlFor="isAdmin" className="text-sm font-medium">
                    Grant admin privileges
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Organization Step */}
          {currentStep === "organization" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Organization Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="mosque" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="mosque"
                      className="flex items-center gap-2"
                    >
                      <Landmark className="w-4 h-4" />
                      Mosque
                    </TabsTrigger>
                    <TabsTrigger
                      value="company"
                      className="flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4" />
                      Company
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="mosque" className="space-y-4">
                    <div>
                      <Label>Select Mosque</Label>
                      <Select
                        value={form.mosque_id || ""}
                        onValueChange={(value) => {
                          updateForm("mosque_id", value || null);
                          updateForm("company_id", null);
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a mosque" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations
                            .filter((org) => org.type === "mosque")
                            .map((mosque) => (
                              <SelectItem key={mosque.id} value={mosque.id}>
                                <div className="flex flex-col">
                                  <span>{mosque.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {mosque.location}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="company" className="space-y-4">
                    <div>
                      <Label>Select Company</Label>
                      <Select
                        value={form.company_id || ""}
                        onValueChange={(value) => {
                          updateForm("company_id", value || null);
                          updateForm("mosque_id", null);
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a company" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations
                            .filter((org) => org.type === "company")
                            .map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                <div className="flex flex-col">
                                  <span>{company.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {company.industry}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Organization assignment is optional. Guards can be assigned
                    later or work independently.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assessment Step */}
          {currentStep === "assessment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Assessment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="assessmentCompleted"
                    checked={form.assessment_completed}
                    onCheckedChange={(checked) =>
                      updateForm("assessment_completed", checked)
                    }
                  />
                  <Label
                    htmlFor="assessmentCompleted"
                    className="text-sm font-medium"
                  >
                    Initial assessment completed
                  </Label>
                </div>

                {form.assessment_completed && (
                  <>
                    <div>
                      <Label htmlFor="assessmentScore">
                        Assessment Score (0-100)
                      </Label>
                      <Input
                        id="assessmentScore"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Enter score"
                        value={form.assessment_score || ""}
                        onChange={(e) =>
                          updateForm(
                            "assessment_score",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Strengths</Label>
                      <div className="mt-1 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {form.strengths.map((strength) => (
                            <Badge
                              key={strength}
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => removeStrength(strength)}
                            >
                              {strength} ×
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {[
                            "Pronunciation",
                            "Grammar",
                            "Vocabulary",
                            "Listening",
                            "Confidence",
                          ].map((strength) => (
                            <Button
                              key={strength}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addStrength(strength)}
                              disabled={form.strengths.includes(strength)}
                            >
                              {strength}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Recommendations</Label>
                      <div className="mt-1 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {form.recommendations.map((rec) => (
                            <Badge
                              key={rec}
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => removeRecommendation(rec)}
                            >
                              {rec} ×
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {[
                            "Focus on basics",
                            "Practice conversation",
                            "Improve pronunciation",
                            "Study vocabulary",
                          ].map((rec) => (
                            <Button
                              key={rec}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addRecommendation(rec)}
                              disabled={form.recommendations.includes(rec)}
                            >
                              {rec}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {currentStepIndex > 0 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>

            {currentStepIndex < steps.length - 1 ? (
              <Button onClick={nextStep} disabled={loading}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Guard
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
