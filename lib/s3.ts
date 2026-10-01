import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import type { Photo, PhotoCategory } from "./photos";

const BUCKET = process.env.S3_BUCKET ?? "frolens";
const ENDPOINT = process.env.S3_ENDPOINT ?? "https://s3.eu-central-3.ionoscloud.com";
const REGION = process.env.AWS_REGION ?? "eu-central-3";
// Mapping from S3 folder name → site category
const FOLDER_MAP: Record<string, PhotoCategory> = {
  Portraits: "portraits",
  Street: "street",
  Fashion: "fashion",
  Corporate: "corporate",
  Editorial: "editorial",
  Family: "family",
  Newborn: "newborn",
};

export async function fetchPhotosFromS3(): Promise<Photo[]> {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    return [];
  }

  const client = new S3Client({
    endpoint: ENDPOINT,
    region: REGION,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });

  const photos: Photo[] = [];
  const host = ENDPOINT.replace("https://", "");

  for (const [folder, category] of Object.entries(FOLDER_MAP)) {
    try {
      const res = await client.send(
        new ListObjectsV2Command({ Bucket: BUCKET, Prefix: `${folder}/` })
      );
      for (const obj of res.Contents ?? []) {
        if (!obj.Key || !/\.(jpg|jpeg|png|webp)$/i.test(obj.Key)) continue;
        const name = obj.Key.split("/").pop()!.replace(/\.[^.]+$/, "");
        const printable = true; // enabled/disabled is now controlled via DB
        photos.push({
          id: `${category}-${name}`,
          src: `https://${BUCKET}.${host}/${obj.Key}`,
          alt: `${category} photography — Frolens by Winston`,
          category,
          printable,
        });
      }
    } catch {
      // skip this folder if listing fails
    }
  }

  return photos;
}

// Returns null if no config saved yet (meaning all photos are printable by default).
// Returns a Set of S3 keys that are enabled once the admin has saved a config.
async function fetchShopConfig(client: S3Client): Promise<Set<string> | null> {
  try {
    const res = await client.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: "shop-config.json" })
    );
    const body = await res.Body?.transformToString();
    if (!body) return null;
    const config = JSON.parse(body) as { enabled: string[] | null };
    return config.enabled ? new Set(config.enabled) : null;
  } catch {
    return null;
  }
}
