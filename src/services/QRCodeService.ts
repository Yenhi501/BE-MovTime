import { Inject, Service } from "typedi";
import { IQRCodeService } from "./Interfaces/IQRCodeService";
import QRCode from 'qrcode';

@Service()
export class QRCodeService implements IQRCodeService {

     async createQRCode(url: string): Promise<string> {
        try {
            let img = '';
            const qr = await QRCode.toDataURL(url);
            img = `<img src= ' `+qr+ `' />`;
            return img;
          } catch (error) {
            console.error('Error:', error);
            throw(error);
          }
    }
}