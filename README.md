# LDS Church API ETL

This is a lambda function with an SQS queue as trigger which handles content updates from the Church API. The Queue should receive notifications from an SNS topic provided and owned by the church.

The resources managed and deployed by the Struck team are Lambda and SQS.

## Purpose

All the media the church wants their users to listen to is available through their website and API, previously some scrapping scripts were used to populate the database the skill uses as datasource. Currently two features are being updated automatically without the need of scraping:

- General Conference talks
- Old testament verse-level audios

## Integration

`SNS (Church) > SQS > Lambda > DynamoDB`

## Environment

Region: us-east-1 (N.Virginia)

Staging:

- SNS Topic -> arn:aws:sns:us-east-1:198956318666:ips-packaging-pipeline_int
- KMS Key   -> arn:aws:kms:us-east-1:198956318666:key/2cd5371d-e7e9-481a-b61d-4c94b4c9e37f

Production:

- SNS Topic -> arn:aws:sns:us-east-1:595553333039:ips-packaging-pipeline_prod
- KMS Key   -> arn:aws:kms:us-east-1:595553333039:key/d4a4276e-fa45-4cac-ac9e-764125dcdba7
