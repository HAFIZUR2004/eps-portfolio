import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify payload with Svix
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response('Error occured', { status: 400 });
  }

  const eventType = evt.type;

  // ১. ইউজার যখন রেজিস্টার করবে (user.created)
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;

    // TODO: আপনার ডাটাবেজে (MongoDB / PostgreSQL) ইউজার সেভ করার লজিক
    /*
      await db.user.create({
        data: {
          clerkId: id,
          email: primaryEmail,
          name: `${first_name || ''} ${last_name || ''}`,
          image: image_url,
          role: "user" // ডিফল্ট রোল 'user' থাকবে
        }
      });
    */

    console.log(`User created in DB: ${primaryEmail}`);
  }

  return new Response('', { status: 200 });
}