"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { updateProfileEmployee } from "@/actions";
import { uploadFile, deleteFile } from "@/lib/upload-s3";
import { User } from "@prisma/client";
import { useRouter } from 'next/navigation';

const ProfileClientPage = ({ user }: { user: User }) => {
	const router = useRouter();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    image: user?.image || "",
  });

  const [preview, setPreview] = useState<string | null>(user?.image || null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // ✅ Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ✅ Handle image selection + upload to S3
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // Upload to S3 in "profile-photos" folder
      const { url } = await uploadFile(file, "profile-photos", (progress) => {
        setUploadProgress(progress);
      });

      setPreview(url);
      setFormData({ ...formData, image: url });
      toast.success("Profile image uploaded successfully!");
	  router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Error uploading image.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // ✅ Remove image (also delete from S3 if it’s uploaded)
  const handleRemoveImage = async () => {
    if (formData.image && formData.image.startsWith("https://")) {
      const key = formData.image.split(".com/")[1]; // extract S3 key
      await deleteFile(key);
    }
    setPreview(null);
    setFormData({ ...formData, image: "" });
    toast.info("Profile image removed.");
	router.refresh();
  };

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const res = await updateProfileEmployee(user.id, data);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
	  router.refresh();
    } catch (err) {
      toast.error("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Loading user information...
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Personal Information</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={preview || ""} />
                  <AvatarFallback>
                    {formData.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-2">
                  <Label className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Upload size={16} />
                      {uploading
                        ? `Uploading... (${uploadProgress}%)`
                        : "Upload Image"}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </Label>

                  {preview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                      disabled={uploading}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={loading || uploading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileClientPage;
