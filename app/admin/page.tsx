import AdminDashboard from '@/app/components/AdminDashboard';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

type ApplicationRecord = {
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
};

async function loadApplications(limit = 500): Promise<ApplicationRecord[]> {
  try {
    const ids = (await kv.lrange<string>('applications:all', 0, limit - 1)) ?? [];
    if (!ids.length) return [];

    const uniqueIds = Array.from(new Set(ids));
    const records = await Promise.all(
      uniqueIds.map(async (id) => {
        const data = await kv.get<Omit<ApplicationRecord, 'id'>>(`application:${id}`);
        if (!data) return null;
        return { id, ...data };
      })
    );

    return records
      .filter((record): record is ApplicationRecord => record !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('[Admin] Failed to load applications:', error);
    return [];
  }
}

export default async function AdminPage() {
  const applications = await loadApplications();

  return (
    <div className="min-h-screen bg-[#0B1A1F] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <div>
          <p className="text-sm uppercase tracking-[0.6em] text-[#2B7574]">Администрирование</p>
          <h1 className="font-display text-4xl font-bold text-white">Заявки и лиды</h1>
          <p className="mt-2 text-sm text-white/60">
            Все обращения, пришедшие из Telegram и сайта. Фильтруйте заявки, обновляйте статусы и фиксируйте быстрые действия.
          </p>
        </div>
        <AdminDashboard applications={applications} />
      </div>
    </div>
  );
}

