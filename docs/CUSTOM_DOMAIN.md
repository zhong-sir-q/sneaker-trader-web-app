# Use custom doamin url with CloudFront

For example, suppose I want to point my xyz.com domain to 123.cloudfront.net. I will do so with the following steps:

1. Add xyz.com to the alternate domain names of 123.cloudfront.net, see [guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html).
2. Add 123.cloudfront.net to the CNAME record of xyz.com.
3. Wait for DNS record to get updated, and visit xyz.com, you should see the content of what is on 123.cloudfront.net.
