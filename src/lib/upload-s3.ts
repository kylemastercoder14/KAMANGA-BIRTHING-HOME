import AWS from "aws-sdk";

// ✅ Initialize S3 client once (no global config mutation)
const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_S3_REGION,
});

/**
 * Upload a file to AWS S3.
 * @param file - The file to upload.
 * @param folder - The folder inside the bucket where the file will be stored.
 * @param progressCallback - Optional progress callback.
 * @returns {Promise<{ url: string; key: string }>} - The uploaded file URL and key.
 */
export async function uploadFile(
  file: File,
  folder: string,
  progressCallback?: (progress: number) => void
): Promise<{ url: string; key: string }> {
  // ✅ Unique filename: timestamp + random hash + original name
  const uniqueFileName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}-${file.name.replace(/ /g, "-")}`;
  const file_key = `${folder}/${uniqueFileName}`;

  try {
    // ✅ Use s3.upload for managed streaming uploads with progress tracking
    const upload = s3
      .upload({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      })
      .on("httpUploadProgress", (evt) => {
        if (evt.total && progressCallback) {
          const progress = Math.round((evt.loaded / evt.total) * 100);
          progressCallback(progress);
        }
      });

    const result = await upload.promise();

    console.log("✅ Uploaded to S3:", result.Location);

    return {
      url: result.Location, // The full public URL of the uploaded file
      key: file_key, // The S3 key path
    };
  } catch (error) {
    console.error("❌ Error uploading to S3:", error);
    throw error;
  }
}

/**
 * Delete a file from AWS S3.
 * @param fileKey - The full key of the file to delete in S3 (including folder).
 * @returns {Promise<{ success: boolean; message: string }>}
 */
export async function deleteFile(
  fileKey: string
): Promise<{ success: boolean; message: string }> {
  try {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: fileKey,
    };

    await s3.deleteObject(params).promise();

    console.log(`🗑️ Successfully deleted file: ${fileKey}`);

    return {
      success: true,
      message: `File ${fileKey} deleted successfully.`,
    };
  } catch (error) {
    console.error("❌ Error deleting file from S3:", error);
    return {
      success: false,
      message: "Error deleting file from S3.",
    };
  }
}
