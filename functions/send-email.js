import { Resend } from 'resend';

export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const { name, email, message } = await request.json();
        const resend = new Resend(env.RESEND_API_KEY);

        // 1. Értesítés a Kereskedőnek (Neked)
        await resend.emails.send({
            from: 'Fidget Piac Webshop <info@fidget-piac.com>',
            to: 'info@fidget-piac.com',
            reply_to: email, // Ha válaszolsz, a vevőnek megy
            subject: `Új rendelés tőle: ${name}`,
            text: `Szia!\n\nÚj üzenet/rendelés érkezett a webshopról!\n\nKüldő neve: ${name}\nEmail címe: ${email}\n\nÜzenet:\n--------------------------------\n${message}\n--------------------------------`
        });

        // 2. Automata válasz a Vásárlónak
        await resend.emails.send({
            from: 'Fidget Piac <info@fidget-piac.com>',
            to: email,
            reply_to: 'info@fidget-piac.com', // Ha válaszol, neked jön
            subject: 'Visszaigazolás: Megkaptuk az üzeneted! - Fidget Piac',
            text: `Szia ${name}!\n\nKöszönöm, hogy írtál nekünk! Megkaptam a rendelési szándékodat / üzenetedet.\nHamarosan feldolgozom, és felveszem veled a kapcsolatot a további részletekkel (szállítás, fizetés).\n\nAz általad küldött üzenet:\n"${message}"\n\nÜdvözlettel,\nA Fidget Piac Csapata`
        });

        return new Response(JSON.stringify({ message: 'Emails sent successfully via Resend' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        console.error('Resend Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
