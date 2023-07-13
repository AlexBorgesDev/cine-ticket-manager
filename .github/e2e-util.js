const { CreateBucketCommand, S3Client } = require('@aws-sdk/client-s3');

async function main() {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  await s3.send(
    new CreateBucketCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      CreateBucketConfiguration: { LocationConstraint: process.env.AWS_REGION },
    }),
  );
}

main();
