"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  resetForgotPassword,
  validateForgotPasswordUsername,
} from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Step = "username" | "reset" | "success";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("username");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [validatedUserName, setValidatedUserName] = useState<string>("");

  const resetErrors = () => {
    setErrors({});
  };

  const handleValidateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (!username.trim()) {
      setErrors({ username: "Username is required." });
      return;
    }

    setLoading(true);
    try {
      const response = await validateForgotPasswordUsername(username);

      if (response.error) {
        setErrors({ username: response.error });
        return;
      }

      setValidatedUserName(response.data?.username ?? username.trim());
      setStep("reset");
    } catch (error) {
      console.error(error);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (!newPassword) {
      setErrors({ newPassword: "New password is required." });
      return;
    }

    if (!confirmPassword) {
      setErrors({ confirmPassword: "Please confirm your new password." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const response = await resetForgotPassword(
        validatedUserName || username,
        newPassword,
        confirmPassword
      );

      if (response.error) {
        setErrors({ general: response.error });
        return;
      }

      setStep("success");
    } catch (error) {
      console.error(error);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          {step === "username" &&
            "Step 1: Enter your username so we can verify your account."}
          {step === "reset" &&
            "Step 2: Set your new password and confirm it."}
          {step === "success" &&
            "Password reset complete. You can now sign in using your new password."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "username" && (
          <form onSubmit={handleValidateUsername}>
            <FieldGroup>
              <Field>
                <FieldLabel>Username</FieldLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={loading}
                />
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                )}
              </Field>

              {errors.general && (
                <p className="text-sm text-red-500 text-center">
                  {errors.general}
                </p>
              )}

              <div className="flex items-center justify-between gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href="/sign-in">Back to Login</Link>
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Checking..." : "Next"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword}>
            <FieldGroup>
              <Field>
                <FieldLabel>Username</FieldLabel>
                <Input value={validatedUserName} disabled />
              </Field>

              <Field>
                <FieldLabel>New Password</FieldLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={loading}
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel>Confirm New Password</FieldLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </Field>

              {errors.general && (
                <p className="text-sm text-red-500 text-center">
                  {errors.general}
                </p>
              )}

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetErrors();
                    setStep("username");
                  }}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Reset Password"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        )}

        {step === "success" && (
          <div className="space-y-4">
            <p className="text-sm text-center">
              Password for <span className="font-medium">{validatedUserName}</span>{" "}
              was updated successfully.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/sign-in">Back to Login</Link>
              </Button>
              <Button type="button" onClick={() => router.push("/sign-in")}>
                Go to Sign In
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
