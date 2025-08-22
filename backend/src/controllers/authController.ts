import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// const users = [
//     { username: 'abd', password: '123'}
// ]

export const signup = (req: Request, res: Response) => {
  res.send('Signup route');
};

export const login = (req: Request, res: Response) => {
  // res.send('Login route');
  // const username = req.body.username
  // const password = req.body.password

  // const user = users.find((user)=> user.username == username && user.password == password)
  // if(user){
  //   const token =jwt.sign({username: user.username}, 'SECRETKEY')
  //   res.json({success: true, token: token})
  // } else {
  //   res.json({success: false, message: 'Not authenticated'})
  // }
};
