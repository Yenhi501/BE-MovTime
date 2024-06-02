import { Rating } from "../../models/Rating";

export interface IQRCodeService{
    createQRCode(url: string): Promise<string>;
}