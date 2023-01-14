import {
    Request,
    Response,
    NextFunction,
    SetMapsDto
} from "../helpers/imports"

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        let userData: SetMapsDto = {
            name: req.body.name,
            surname: req.body.surname
        }

        let newSet = new Set()
        
        newSet.add(userData)
        
        return res.send(newSet);
        
    }   
    catch (err) {
        console.log(err);
        next()
    }
}
