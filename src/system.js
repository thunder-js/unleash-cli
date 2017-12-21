import acm from './components/aws-services/acm'
import cloudFront from './components/aws-services/cloudfront'
import route53 from './components/aws-services/route53'
import s3 from './components/aws-services/s3'
import acmMock from './components/aws-services-mock/acm'
import cloudFrontMock from './components/aws-services-mock/cloudfront'
import route53Mock from './components/aws-services-mock/route53'
import s3Mock from './components/aws-services-mock/s3'
import ui from './components/ui'

export const prod = {
  acm,
  cloudFront,
  route53,
  s3,
  ui,
}
export const test = {
  acm: acmMock,
  cloudFront: cloudFrontMock,
  route53: route53Mock,
  s3: s3Mock,
  ui,
}
