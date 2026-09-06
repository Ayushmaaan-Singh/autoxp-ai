import { apiFetch } from './api';

/** Fetch all listings from the database. */
export async function fetchListings() {
  return apiFetch('/listings');
}

/** Create a new listing. Requires authentication (JWT in localStorage). */
export async function createListing(listingData) {
  return apiFetch('/listings', {
    method: 'POST',
    body: JSON.stringify(listingData),
  });
}

/** Update an existing listing by its id. Owner-only. */
export async function updateListing(id, updates) {
  return apiFetch(`/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

/** Delete a listing by id. Owner-only. */
export async function deleteListing(id) {
  return apiFetch(`/listings/${id}`, { method: 'DELETE' });
}

/** Increment view count for a listing (anonymous, fire-and-forget). */
export function incrementListingView(id) {
  apiFetch(`/listings/${id}/view`, { method: 'POST' }).catch(() => {});
}
