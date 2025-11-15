import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

interface ApplicationAction {
  type: 'status' | 'note';
  by: string;
  at: string;
  details?: string;
}

interface ApplicationRecord {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message?: string;
  source: string;
  priority: string;
  status: string;
  serviceType?: string | null;
  createdAt: string;
  updatedAt: string;
  actions?: ApplicationAction[];
}

const ALLOWED_STATUSES = new Set(['new', 'in_progress', 'call_completed', 'processed', 'deleted']);

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const payload = await request.json();
    const status = payload?.status as string | undefined;

    if (!status || !ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Некорректный статус' }, { status: 400 });
    }

    const application = await kv.get<ApplicationRecord>(`application:${id}`);
    if (!application) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
    }

    const updated: ApplicationRecord = {
      ...application,
      status,
      updatedAt: new Date().toISOString(),
      actions: [
        ...(application.actions || []),
        {
          type: 'status',
          by: 'admin-panel',
          at: new Date().toISOString(),
          details: `Статус изменён на ${status}`
        }
      ]
    };

    await kv.set(`application:${id}`, updated);
    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error('[Admin API] Ошибка обновления статуса:', error);
    return NextResponse.json({ error: 'Не удалось обновить статус' }, { status: 500 });
  }
}
