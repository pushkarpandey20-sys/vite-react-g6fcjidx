import { supabase } from './supabase';
import { SEED_PANDITS, SEED_TEMPLES, SEED_DEVOTEES, SEED_BOOKINGS } from '../data/seedData';

export async function seedDatabase() {
  const results = { pandits: 0, temples: 0, devotees: 0, bookings: 0, errors: [] };

  try {
    const { error } = await supabase.from('pandits').upsert(SEED_PANDITS, { onConflict: 'id' });
    if (error) results.errors.push(`Pandits: ${error.message}`);
    else results.pandits = SEED_PANDITS.length;
  } catch (e) { results.errors.push(`Pandits: ${e.message}`); }

  try {
    const { error } = await supabase.from('temples').upsert(SEED_TEMPLES, { onConflict: 'id' });
    if (error) results.errors.push(`Temples: ${error.message}`);
    else results.temples = SEED_TEMPLES.length;
  } catch (e) { results.errors.push(`Temples: ${e.message}`); }

  try {
    const { error } = await supabase.from('devotees').upsert(SEED_DEVOTEES, { onConflict: 'id' });
    if (error) results.errors.push(`Devotees: ${error.message}`);
    else results.devotees = SEED_DEVOTEES.length;
  } catch (e) { results.errors.push(`Devotees: ${e.message}`); }

  try {
    const { error } = await supabase.from('bookings').upsert(SEED_BOOKINGS, { onConflict: 'id' });
    if (error) results.errors.push(`Bookings: ${error.message}`);
    else results.bookings = SEED_BOOKINGS.length;
  } catch (e) { results.errors.push(`Bookings: ${e.message}`); }

  return results;
}
