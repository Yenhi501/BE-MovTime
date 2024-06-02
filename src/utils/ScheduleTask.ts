import * as schedule from 'node-schedule';
import axios from 'axios';
import xml2js from 'xml2js';
import { UserService } from '../services/UserService';
import { PaypalService } from '../services/payments/PaypalService';
import Container from 'typedi';

export const setupSchedule = () => {
    try {
		console.log(new Date())
		console.log('Cronjob started at:', new Date().toLocaleString());
        sendReverseMailJob.schedule();
        transferRateJob.schedule();
    } catch (error:any) {
        throw new Error(error);
    }
};

export const sendReverseMailJob = {
    schedule: () => {
        schedule.scheduleJob({hour: 8, minute: 0, dayOfWeek: new schedule.Range(0, 6), tz: 'UTC+7'}, async () => {
            try {
                console.log("Gửi mail hằng ngày");
                const userService = Container.get(UserService);
                await userService.sendMailForReserveMovie();
                console.log("Đã gửi mail thành công");
            } catch (error: any) {
                throw new Error(error);
            }
        });
    },
};

export const transferRateJob = {
    schedule: () => {
        schedule.scheduleJob('*/15 * * * *', async () => {
            try {
                console.log("Công việc transferRate");
                await transferRate();
            } catch (error: any) {
                throw new Error(error);
            }
        });
    },
};

export const transferRate = async () => {
    try {
        const response = await axios.get(
            'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10'
        );

        if (response.status === 200) {
            const xmlData = response.data;
            const parser = new xml2js.Parser();
            const result = await parser.parseStringPromise(xmlData);

            const exrateList = result.ExrateList.Exrate as Array<any>;

            exrateList.forEach((exrate) => {
                const currencyCode = exrate.$.CurrencyCode;
                if (currencyCode === 'VND' || currencyCode === 'USD') {
                    console.log(exrate.$.Transfer.replace(/,/g, ''));
                    PaypalService.transferRate = parseFloat(
                        exrate.$.Transfer.replace(/,/g, '')
                    );
                }
            });
        } else {
            console.log(`Yêu cầu không thành công. Status code: ${response.status}`);
            return 1;
        }
    } catch (error) {
        console.error('Lỗi khi thực hiện yêu cầu:', error);
    }
};

