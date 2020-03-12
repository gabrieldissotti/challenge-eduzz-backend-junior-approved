
/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       email:
 *         type: string
 *   Session:
 *     type: object
 *     properties:
 *       user:
 *         $ref: '#/definitions/User'
 *       token:
 *         type: string
 */
