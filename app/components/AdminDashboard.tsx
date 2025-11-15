"use client";

import { useMemo, useState, useTransition } from "react";
import dayjs from "dayjs";

type AdminApplication = {
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

type Props = {
  applications: AdminApplication[];
};

const STATUS_OPTIONS = [
  { value: "all", label: "Все" },
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "call_completed", label: "Позвонили" },
  { value: "processed", label: "Завершена" },
  { value: "deleted", label: "Удалена" }
];

const DATE_FILTERS = [
  { value: "all", label: "За всё время" },
  { value: "7", label: "Последние 7 дней" },
  { value: "30", label: "Последние 30 дней" }
];

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  call_completed: "Позвонили",
  processed: "Завершена",
  deleted: "Удалена"
};

const statusClasses: Record<string, string> = {
  new: "border-[#facc15]/35 bg-[#facc15]/15 text-[#facc15]",
  in_progress: "border-[#c084fc]/35 bg-[#c084fc]/15 text-[#f0abfc]",
  call_completed: "border-[#2B7574]/35 bg-[#2B7574]/15 text-[#6fe0d6]",
  processed: "border-[#43d17a]/35 bg-[#43d17a]/15 text-[#43d17a]",
  deleted: "border-white/20 bg-white/10 text-white/70"
};

export default function AdminDashboard({ applications }: Props) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchStatus = statusFilter === "all" || app.status === statusFilter;
      const matchDate =
        dateRange === "all"
          ? true
          : dayjs(app.createdAt).isAfter(dayjs().subtract(Number(dateRange), "day"));
      return matchStatus && matchDate;
    });
  }, [applications, statusFilter, dateRange]);

  const stats = useMemo(() => {
    const total = applications.length;
    const byStatus = applications.reduce<Record<string, number>>((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    const last7 = applications.filter((app) =>
      dayjs(app.createdAt).isAfter(dayjs().subtract(7, "day"))
    ).length;
    return { total, byStatus, last7 };
  }, [applications]);

  const updateStatus = (id: string, status: string) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/applications/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        });

        if (!res.ok) {
          console.error("[Admin] Не удалось обновить статус");
          return;
        }

        window.location.reload();
      } catch (error) {
        console.error("[Admin] Ошибка обновления статуса", error);
      }
    });
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-white/60 text-sm">Всего заявок</p>
          <p className="text-3xl font-semibold text-white">{stats.total}</p>
        </div>
        <div>
          <p className="text-white/60 text-sm">Новых</p>
          <p className="text-3xl font-semibold text-white">{stats.byStatus["new"] ?? 0}</p>
        </div>
        <div>
          <p className="text-white/60 text-sm">В работе</p>
          <p className="text-3xl font-semibold text-white">{stats.byStatus["in_progress"] ?? 0}</p>
        </div>
        <div>
          <p className="text-white/60 text-sm">За 7 дней</p>
          <p className="text-3xl font-semibold text-white">{stats.last7}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-white/60 text-sm mb-1">Статус</p>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-white/20 bg-transparent px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f7e5b1]"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#0B1A1F] text-black">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Период</p>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="rounded-xl border border-white/20 bg-transparent px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f7e5b1]"
              >
                {DATE_FILTERS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#0B1A1F] text-black">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-white/60 text-sm">
            Найдено: <span className="text-white font-semibold">{filtered.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-white/80">
            <thead className="text-xs uppercase text-white/60">
              <tr>
                <th className="py-3 pr-4">Заявка</th>
                <th className="py-3 pr-4">Контакты</th>
                <th className="py-3 pr-4">Статус</th>
                <th className="py-3 pr-4">Создана</th>
                <th className="py-3 pr-4">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-white/60">
                    Нет заявок по выбранным фильтрам
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5">
                    <td className="py-4 pr-4 align-top">
                      <p className="font-semibold text-white flex items-center gap-2">
                        {app.name}
                        {app.serviceType && (
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/80">
                            {app.serviceType}
                          </span>
                        )}
                      </p>
                      <p className="text-white/60 text-xs mt-1">Источник: {app.source}</p>
                      {app.message && (
                        <p className="mt-2 text-white/70 text-sm line-clamp-3">{app.message}</p>
                      )}
                    </td>
                    <td className="py-4 pr-4 align-top space-y-2">
                      <p className="text-white/90 font-medium">{app.phone || "—"}</p>
                      {app.email && (
                        <p className="text-white/70 text-xs break-all">{app.email}</p>
                      )}
                    </td>
                    <td className="py-4 pr-4 align-top">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${
                          statusClasses[app.status] || "border-white/20 bg-white/10 text-white"
                        }`}
                      >
                        {STATUS_LABELS[app.status] || "Неизвестно"}
                      </span>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.keys(STATUS_LABELS)
                          .filter((s) => s !== app.status)
                          .map((status) => (
                            <button
                              key={status}
                              onClick={() => updateStatus(app.id, status)}
                              disabled={isPending}
                              className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#f7e5b1] transition hover:border-[#f7e5b1] disabled:opacity-50"
                            >
                              {STATUS_LABELS[status]}
                            </button>
                          ))}
                      </div>
                    </td>
                    <td className="py-4 pr-4 align-top text-white/70 text-sm">
                      <p>{dayjs(app.createdAt).format("DD.MM.YYYY")}</p>
                      <p className="text-xs">{dayjs(app.createdAt).format("HH:mm")}</p>
                    </td>
                    <td className="py-4 align-top space-y-2">
                      {app.phone && (
                        <a
                          href={`tel:${app.phone.replace(/[^\d+]/g, "")}`}
                          className="block rounded-full border border-white/20 px-3 py-1 text-xs text-white text-center hover:bg-white/10"
                        >
                          Позвонить
                        </a>
                      )}
                      {app.phone && (
                        <a
                          href={`https://wa.me/${app.phone.replace(/[^\d]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-full border border-white/20 px-3 py-1 text-xs text-white text-center hover:bg-white/10"
                        >
                          Написать
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
