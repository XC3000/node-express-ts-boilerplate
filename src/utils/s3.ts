import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "../../config/env";

const s3 = new S3Client({
  region: env.BUCKET_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

const cloudFront = new CloudFrontClient({
  region: env.BUCKET_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

export const pushFileToS3 = async (params: {
  Key: string;
  Body: Buffer;
  ContentType: string;
}) => {
  const bucketParams = {
    ...params,
    Bucket: env.BUCKET_NAME,
  };

  const command = new PutObjectCommand(bucketParams);
  return s3.send(command);
};

export const deleteFileFromS3 = async (params: { Key: string }) => {
  const bucketParams = {
    ...params,
    Bucket: env.BUCKET_NAME,
  };

  const command = new DeleteObjectCommand(bucketParams);

  const invalidationParams = {
    DistributionId: env.CLOUDFRONT_DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: params.Key,
      Paths: {
        Quantity: 1,
        Items: ["/" + params.Key],
      },
    },
  };

  const invalidateCommand = new CreateInvalidationCommand(invalidationParams);

  await cloudFront.send(invalidateCommand);

  return s3.send(command);
};
