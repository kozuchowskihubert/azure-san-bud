import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            where: {
                is_active: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        return NextResponse.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const service = await prisma.service.create({
            data: {
                name: data.name,
                description: data.description,
                category: data.category,
                price: data.price,
                duration_minutes: data.duration_minutes,
                is_active: data.is_active ?? true
            }
        });
        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        console.error('Error creating service:', error);
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}
