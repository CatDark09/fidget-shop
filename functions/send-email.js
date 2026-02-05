export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const { name, email, message } = await request.json();

        // Define the Send Email function using fetch
        const sendEmail = async (to, subject, text, replyTo) => {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Fidget Piac Webshop <info@fidget-piac.com>',
                    to: [to],
                    reply_to: replyTo,
                    subject: subject,
                    text: text
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Resend API Error: ${response.status} ${errorText}`);
            }
            return response.json();
        };

        // 1. Értesítés a Kereskedőnek (Neked)
        await sendEmail(
            'info@fidget-piac.com',
            `Új rendelés tőle: ${name}`,
            `Szia!\n\nÚj üzenet/rendelés érkezett a webshopról!\n\nKüldő neve: ${name}\nEmail címe: ${email}\n\nÜzenet:\n--------------------------------\n${message}\n--------------------------------`,
            email
        );

        // 2. Automata válasz a Vásárlónak
        await sendEmail(
            email,
            'Visszaigazolás: Megkaptuk az üzeneted! - Fidget Piac',
            `Szia ${name}!\n\nKöszönöm, hogy írtál nekünk! Megkaptam a rendelési szándékodat / üzenetedet.\nHamarosan feldolgozom, és felveszem veled a kapcsolatot a további részletekkel (szállítás, fizetés).\n\nAz általad küldött üzenet:\n"${message}"\n\nÜdvözlettel,\nA Fidget Piac Csapata`,
            'info@fidget-piac.com'
        );

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
