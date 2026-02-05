import { Resend } from 'resend';

export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const body = await request.json();
        const { name, email, message } = body;

        const resend = new Resend(env.RESEND_API_KEY);

        // 1. Notification to Merchant (You)
        await resend.emails.send({
            from: 'Fidget Piac Webshop <info@fidget-piac.com>',
            to: 'info@fidget-piac.com',
            reply_to: email, // If you reply, it goes to the customer
            subject: `Új rendelés tőle: ${name}`,
            text: `Szia!\n\nÚj üzenet/rendelés érkezett a webshopról!\n\nKüldő neve: ${name}\nEmail címe: ${email}\n\nÜzenet:\n--------------------------------\n${message}\n--------------------------------`
        });

        // 2. Auto-reply to Customer
        await resend.emails.send({
            from: 'Fidget Piac <info@fidget-piac.com>',
            to: email,
            reply_to: 'info@fidget-piac.com', // If they reply, it comes to you
            subject: 'Visszaigazolás: Megkaptuk az üzeneted! - Fidget Piac',
            text: `Szia ${name}!\n\nKöszönöm, hogy írtál nekünk! Megkaptam a rendelési szándékodat / üzenetedet.\nHamarosan feldolgozom, és felveszem veled a kapcsolatot a további részletekkel (szállítás, fizetés).\n\nAz általad küldött üzenet:\n"${message}"\n\nÜdvözlettel,\nA Fidget Piac Csapata`
        });

        return new Response(JSON.stringify({ message: 'Emails sent successfully via Resend' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Resend Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
