import { db, toUUID } from '../services/supabase';

export const samagriApi = {
  getProducts: async () => {
    return await db.samagri().select("*").eq("active", true).order("name");
  },
  
  createOrder: async (orderData) => {
    const { data, error } = await db.orders().insert({
      user_id: toUUID(orderData.userId),
      items: orderData.items, // JSONB
      total_amount: orderData.totalAmount,
      delivery_address: orderData.deliveryAddress, // JSONB
      payment_id: orderData.paymentId,
      status: "pending"
    }).select().single();
    
    return { data, error };
  }
};
