import { Request, Response } from 'express'

class TestController {
  public index (req: Request, res: Response): Response {
    return res.json({
      message: 'success'
    })
  }
}

export default new TestController()
