import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // 1. Parse name
        const nameParts = (data.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // 2. Get or create customer
        const email = data.email?.trim() || '';
        const phone = data.phone?.trim() || '';

        let customer = await prisma.customer.findFirst({
            where: {
                OR: [
                    { email: email || undefined },
                    { phone: phone || undefined }
                ]
            }
        });

        if (!customer) {
            if (!email && !phone) {
                return NextResponse.json({ error: 'Email or phone required' }, { status: 400 });
            }
            customer = await prisma.customer.create({
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    email: email || `temp-${Date.now()}@example.com`, // Fallback if no email provided
                    phone: phone,
                }
            });
        }

        // 3. Find service
        const serviceName = data.service || 'Instalacje wodne';
        let service = await prisma.service.findFirst({
            where: { name: serviceName }
        });

        if (!service) {
            service = await prisma.service.findFirst();
            if (!service) {
                return NextResponse.json({ error: 'No services available' }, { status: 400 });
            }
        }

        // 4. Create appointment
        const scheduledDate = new Date(data.date);
        // Combine date and time for scheduled_time (as it's DateTime in Prisma)
        const scheduledTime = new Date(`${data.date}T${data.time}`);

        const appointment = await prisma.appointment.create({
            data: {
                customer_id: customer.id,
                service_id: service.id,
                scheduled_date: scheduledDate,
                scheduled_time: scheduledTime,
                notes: data.description,
                status: 'pending'
            }
        });

        // TODO: Send Confirmation Email (nodemailer)

        return NextResponse.json({
            success: true,
            appointment,
            message: 'Rezerwacja została pomyślnie utworzona'
        }, { status: 201 });

    } catch (error) {
        console.error('Error processing booking:', error);
        return NextResponse.json({
            success: false,
            message: 'Wystąpił błąd podczas tworzenia rezerwacji'
        }, { status: 500 });
    }
}
