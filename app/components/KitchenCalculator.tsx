"use client";

import { useState } from 'react';

type Material = 'dsp' | 'mdf' | 'massiv';
type Facade = 'plastic' | 'painted' | 'enamel';
type Hardware = 'standard' | 'premium';

const prices = {
  material: { dsp: 15000, mdf: 25000, massiv: 45000 },
  facade: { plastic: 8000, painted: 15000, enamel: 25000 },
  hardware: { standard: 5000, premium: 15000 }
};

export default function KitchenCalculator() {
  const [length, setLength] = useState(3);
  const [material, setMaterial] = useState<Material>('mdf');
  const [facade, setFacade] = useState<Facade>('painted');
  const [hardware, setHardware] = useState<Hardware>('standard');

  const basePrice = prices.material[material] + prices.facade[facade] + prices.hardware[hardware];
  const totalPrice = basePrice * length;

  return (
    <div className="glass-neon p-8">
      <h3 className="font-display text-2xl font-bold text-center">
        <span className="bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
          Калькулятор стоимости кухни
        </span>
      </h3>
      <p className="mt-2 text-center text-neutral-400 text-sm">Примерный расчёт. Точная цена — после замера</p>

      <div className="mt-8 space-y-6">
        {/* Длина кухни */}
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-2">
            Длина кухни: <span className="text-yellow-400 font-bold">{length} м</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>1м</span>
            <span>10м</span>
          </div>
        </div>

        {/* Материал */}
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-3">Материал корпуса</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'dsp' as Material, label: 'ДСП', desc: 'ЛДСП 16мм' },
              { id: 'mdf' as Material, label: 'МДФ', desc: 'МДФ 18мм' },
              { id: 'massiv' as Material, label: 'Массив', desc: 'Дуб/Ясень' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMaterial(m.id)}
                className={`p-3 rounded-lg text-sm transition-all ${
                  material === m.id
                    ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400'
                    : 'glass-panel text-neutral-300 hover:border-yellow-500/50'
                }`}
              >
                <div className="font-semibold">{m.label}</div>
                <div className="text-xs text-neutral-500 mt-1">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Тип фасадов */}
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-3">Тип фасадов</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'plastic' as Facade, label: 'Пластик', desc: 'ДСП+пластик' },
              { id: 'painted' as Facade, label: 'Крашенный', desc: 'МДФ крашен.' },
              { id: 'enamel' as Facade, label: 'Эмаль', desc: 'МДФ эмаль' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFacade(f.id)}
                className={`p-3 rounded-lg text-sm transition-all ${
                  facade === f.id
                    ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400'
                    : 'glass-panel text-neutral-300 hover:border-yellow-500/50'
                }`}
              >
                <div className="font-semibold">{f.label}</div>
                <div className="text-xs text-neutral-500 mt-1">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Фурнитура */}
        <div>
          <label className="block text-sm font-medium text-neutral-200 mb-3">Фурнитура</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'standard' as Hardware, label: 'Стандарт', desc: 'Базовая фурн.' },
              { id: 'premium' as Hardware, label: 'Премиум', desc: 'Blum, Hettich' },
            ].map(h => (
              <button
                key={h.id}
                onClick={() => setHardware(h.id)}
                className={`p-3 rounded-lg text-sm transition-all ${
                  hardware === h.id
                    ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400'
                    : 'glass-panel text-neutral-300 hover:border-yellow-500/50'
                }`}
              >
                <div className="font-semibold">{h.label}</div>
                <div className="text-xs text-neutral-500 mt-1">{h.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Результат */}
        <div className="glass-panel p-6 border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-400">Примерная стоимость</div>
              <div className="mt-1 font-display text-3xl font-bold text-yellow-400">
                {totalPrice.toLocaleString('ru-RU')} ₽
              </div>
            </div>
            <div className="text-right text-xs text-neutral-500">
              <div>за {length}м</div>
              <div className="mt-1">≈ {Math.round(totalPrice / length).toLocaleString()} ₽/м</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <a
          href={`/contacts?calc=length:${length},material:${material},facade:${facade},hardware:${hardware}`}
          className="block w-full btn-neon px-6 py-4 text-center text-lg"
        >
          Получить точный расчёт
        </a>
        <p className="text-center text-xs text-neutral-500">
          Оставьте заявку — дизайнер приедет на бесплатный замер и рассчитает точную стоимость
        </p>
      </div>
    </div>
  );
}


