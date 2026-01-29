import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                customer: true,
                service: true
            },
            orderBy: {
                scheduled_date: 'desc'
            }
        });
        return NextResponse.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // 1. Get or create customer
        let customer = await prisma.customer.findUnique({
            where: { email: data.email }
        });

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    city: data.city,
                    postal_code: data.postal_code
                }
            });
        }

        // 2. Create appointment
        const appointment = await prisma.appointment.create({
            data: {
                customer_id: customer.id,
                service_id: Number(data.service_id),
                scheduled_date: new Date(data.scheduled_date), // expects YYYY-MM-DD string
                scheduled_time: new Date(`${data.scheduled_date}T${data.scheduled_time}`), // expects HH:MM
                notes: data.notes,
                status: 'pending'
            }
        });

        return NextResponse.json(appointment, { status: 201 });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
}
