# LDS Church API ETL

This is a lambda function with an SQS queue as trigger which handles content updates from the Church API. The Queue should receive notifications from an SNS topic provided and owned by the church.

The resources managed and deployed by the Struck team are Lambda and SQS.
