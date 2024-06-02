import { Request, Response } from 'express';
import Container from 'typedi';
import { ActorService } from '../services/ActorService';
import { IActorService } from '../services/Interfaces/IActorService';
import IDirectorService from '../services/Interfaces/IDirectorService';
import { S3Service } from '../services/S3Service';
import { DirectorService } from './../services/DirectorSevice';

export class IndividualController {
	private actorService: IActorService;
	private directorService: IDirectorService;
	private s3Service: S3Service;


	constructor() {
		this.actorService = Container.get(ActorService);
		this.directorService = Container.get(DirectorService);
		this.s3Service= Container.get(S3Service);
	}

	createActor = async (req: Request, res: Response) => {
		try {
			const result = await this.actorService.createActor(req);

			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: result
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ message: "Server error!" });
		}
	};

	updateActor = async (req: Request, res: Response) => {
		try {
			const result = await this.actorService.updateActor(req);
			if(result) {
				return res.status(200).json({
					status: 'Ok!',
					message: 'Successfully',
					data: result
				});
			}
			return res.status(404).json({
				message: 'Failed, Actor not found',
			});

		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi :' + error.message });
		}
	};

	getActorDetails = async (req: Request, res: Response) => {
		try {
			const { actorId } = req.params;

			const data = await this.actorService.findActorInfomation(Number(actorId));
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: data,
			});
		} catch (error: any) {
			console.log(error);
			return res.status(404).json({ message: 'Actor not found!' });
		}
	};

	deleteActor = async (req: Request, res: Response) => {
		try {
			const { actorId } = req.params;

			const rs = await this.actorService.deleteActorByActorId(Number(actorId));
			if(rs){
				return res.status(200).json({
					status: 'Ok!',
					message: 'Successfully',
				});
			}
			return res.status(404).json({
				message: 'Failed!, Actor not found!',
			});
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	getActors = async (req: Request, res: Response) => {
		try {
			let search = req.query.name ||'';
			let page = req.query.page||1;
			let pageSize = req.query.pageSize||10;

			const data = await this.actorService.getActors(
				String(search),
				Number(page),
				Number(pageSize)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: {
					totalActors: data.count,
					totalPages: Math.floor(data.count/Number(pageSize)),
					actorsPerPage: Number(pageSize),
					actors: data.rows,
				},
			});
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	createDirector = async (req: Request, res: Response) => {
		try {
			const result = await this.directorService.createDirector(req);

			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: result
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ message: "Server error!" });
		}
	};

	updateDirector = async (req: Request, res: Response) => {
		try {
			const result = await this.directorService.updateDirector(req);
			if(result) {
				return res.status(200).json({
					status: 'Ok!',
					message: 'Successfully',
					data: result
				});
			}
			return res.status(404).json({
				message: 'Failed, Director not found',
			});

		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi :' + error.message });
		}
	};

	getDirectorDetails = async (req: Request, res: Response) => {
		try {
			const { directorId } = req.params;

			const data = await this.directorService.findDirectortorInfomation(
				Number(directorId)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: data,
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi :' + error.message });
		}
	};

	deleteDirector = async (req: Request, res: Response) => {
		try {
			const { directorId } = req.params;

			const rs = await this.directorService.deleteDirector(Number(directorId));
			if(rs){
				return res.status(200).json({
                    status: 'Ok!',
                    message: 'Successfully',
                });
			}
			return res.status(404).json({
				message: 'Failed!, Director not found!',
			});
		} catch (error: any) {
			throw(error);
		}
	};

	getDirectors = async (req: Request, res: Response) => {
		try {
			let search = req.query.name ||'';
			let page = req.query.page||1;
			let pageSize = req.query.pageSize||10;

			const data = await this.directorService.getDirectors(
				String(search),
				Number(page),
				Number(pageSize)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: {
					totalDirectors: data.count,
					totalPages: Math.floor(data.count/Number(pageSize)),
					directorsPerPage: Number(pageSize),
					directors: data.rows,
				},
			});
		} catch (error: any) {
			return res.status(500).json({
				message: "Server error!"
			});
		}
	};
	
	getPresignUrlToUploadAvatarActor = async (req: Request, res: Response)=>{
		try {
			const actorId = req.query.actorId;
			if(!actorId){
				return res.status(200).json({
					message:'actorId is required!',
				});
			}
            const presignUrl = await this.actorService.getPresignUrlToUploadAvatar(Number(actorId));
			if (!presignUrl) {
				return res.status(404).json({
					status: 'Ok!',
					message: 'Actor not found or is deleted!',
				});
			}
            return res.status(200).json({
                status: 'Ok!',
                message: 'Successfully',
                data: presignUrl,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "Server error!"
            });
        }
	}

	getPresignUrlToUploadAvatarDirector = async (req: Request, res: Response)=>{
		try {
			const directorId = req.query.directorId;
			if(!directorId){
				return res.status(200).json({
					message:'directorId is required!',
				});
			}
            const presignUrl = await this.directorService.getPresignUrlToUploadAvatar(Number(directorId));
			if (!presignUrl) {
				return res.status(404).json({
					status: 'Ok!',
					message: 'Director not found or is deleted!',
				});
			}
            return res.status(200).json({
                status: 'Ok!',
                message: 'Successfully',
                data: presignUrl,
            });
        } catch (error: any) {
			console.log(error);
            return res.status(500).json({
                message: "Server error!"
            });
        }
	}

	clearCacheCloudFrontIndividual= async(req: Request, res: Response) => {
		try {
			const id = req.body.id;
			const option = req.body.option;

			await this.s3Service.clearCacheCloudFront(option+'/'+id+'/avatar.jpg');
			res.status(200).json({
				message: "successful",
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server Error!"
			});
		}
	}
	// getPopularActors = async (req: Request, res: Response)=>{
	// 	try {
    //         const data = await this.actorService.getPopularActors(1,5);
    //         return res.status(200).json({
    //             status: 'Ok!',
    //             message: 'Successfully',
    //             data: data,
    //         });
    //     } catch (error: any) {
    //         return res.status(500).json({
    //             message: "Server error!"
    //         });
    //     }
	// }
}
