import * as crypto from 'crypto';
import * as https from 'https';
import { Service } from 'typedi';

@Service()
export class MomoService {
    private accessKey: string;
    private secretKey: string;
    private partnerCode: string;
    private redirectUrl: string;
    private ipnUrl: string;
    private requestType: string;
    // private amount: string;
    private lang: string;
  
    constructor() {
      this.accessKey = 'F8BBA842ECF85';
      this.secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
      this.partnerCode = 'MOMO';
      this.redirectUrl = 'http://localhost:8000/api/payments/momo/verify';
      this.ipnUrl = 'http://localhost:8000/api/payments/momo/verify';
      this.requestType = 'payWithMethod';
      this.lang = 'vi';
    }
  
    async getPaymentUrl(orderId: string ,orderInfo: string, extraData: string, amount: number): Promise<void> {
      const requestId = this.partnerCode + new Date().getTime();
      // const orderId = requestId;
  
      const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${this.requestType}`;
  
      const signature = crypto.createHmac('sha256', this.secretKey)
        .update(rawSignature)
        .digest('hex');

      const requestBody = JSON.stringify({
        partnerCode: this.partnerCode,
        partnerName: "Movies Website",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: this.redirectUrl,
        ipnUrl: this.ipnUrl,
        lang: this.lang,
        requestType: this.requestType,
        autoCapture: true,
        extraData: extraData,
        orderGroupId: '',
        signature: signature
      });
  
      const options: https.RequestOptions = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody)
        }
      };
      return new Promise((resolve, reject) => {
          const req = https.request(options, res => {
            let data = '';
      
            res.on('data', chunk => {
              data += chunk;
            });
      
            res.on('end', () => {
              const responseBody = JSON.parse(data);
              if (responseBody && responseBody.payUrl) {
                resolve(responseBody.payUrl);
              } else {
                reject(new Error('Failed to get payment URL'));
              }
            });
          });
      
          req.on('error', (e) => {
            reject(new Error(`Problem with request: ${e.message}`));
          });
      
          req.write(requestBody);
          req.end();
        });
  
    }
}
