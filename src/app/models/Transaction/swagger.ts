
/**
 * @swagger
 *
 * definitions:
 *   Transaction:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       user_id:
 *         type: integer
 *       transaction_id:
 *         type: integer
 *       type:
 *         type: string
 *       amount:
 *         type: number
 *       date:
 *         type: string
 *       currency_type:
 *         type: string
 *       currency_purchase_value_in_brl:
 *         type: number
 *       currency_liquidate_value_in_brl:
 *         type: number
 *       created_at:
 *         type: string
 *       updated_at:
 *         type: string
 *   BuyTransaction:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       user_id:
 *         type: integer
 *       transaction_id:
 *         type: integer
 *       type:
 *         type: string
 *       amount:
 *         type: number
 *       date:
 *         type: string
 *       currency_type:
 *         type: string
 *       currency_purchase_value_in_brl:
 *         type: number
 *       currency_liquidate_value_in_brl:
 *         type: number
 *       created_at:
 *         type: string
 *       updated_at:
 *         type: string
 *       children:
 *         $ref: '#/definitions/Transaction'
 *   Position:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       currency_purchase_value_in_brl:
 *         type: number
 *       currency_liquidate_value_in_brl:
 *         type: number
 *       current_currency_purchase_value_in_brl:
 *         type: number
 *       current_currency_liquidate_value_in_brl:
 *         type: number
 *       purchased_brl_amount:
 *         type: number
 *       current_brl_amount:
 *         type: number
 *       btc_variation:
 *         type: number
 *       date:
 *         type: string
 */
