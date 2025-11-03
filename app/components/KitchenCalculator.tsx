"use client";

import { useState } from 'react';

type FacadeType = 'ДСП' | 'МДФ' | 'Эмаль';
type FittingsType = 'Стандарт' | 'Премиум';
type CountertopType = 'HPL' | 'Искусственный камень' | 'Кварцевый агломерат';

export default function KitchenCalculator() {
  // 1. ФАСАДЫ (первый параметр)
  const [facade, setFacade] = useState<FacadeType>('МДФ');
  
  // 2. ФУРНИТУРА (второй параметр)
  const [fittings, setFittings] = useState<FittingsType>('Стандарт');
  
  // 3. СТОЛЕШНИЦА (третий параметр)
  const [countertop, setCountertop] = useState<CountertopType>('HPL');
  
  // 4. РАЗМЕРЫ (четвертый параметр)
  const [length, setLength] = useState(3);

  // Логика расчета стоимости
  const calculatePrice = (): number => {
    let basePrice = 0;

    // 1. Цена за фасады (за погонный метр)
    const facadePrices = {
      'ДСП': 25000,
      'МДФ': 35000,
      'Эмаль': 55000
    };
    basePrice += facadePrices[facade] * length;

    // 2. Надбавка за фурнитуру
    const fittingsPrices = {
      'Стандарт': 0,
      'Премиум': 15000 * length
    };
    basePrice += fittingsPrices[fittings];

    // 3. Цена за столешницу (за погонный метр)
    const countertopPrices = {
      'HPL': 3000,
      'Искусственный камень': 8000,
      'Кварцевый агломерат': 12000
    };
    basePrice += countertopPrices[countertop] * length;

    return Math.round(basePrice);
  };

  const price = calculatePrice();

  const handleGetQuote = () => {
    const params = new URLSearchParams({
      facade,
      fittings,
      countertop,
      length: length.toString(),
      estimatedPrice: price.toString()
    });
    window.location.href = `/contacts?${params.toString()}`;
  };

  return (
    <div className="glass-neon p-8 md:p-12">
      <h2 className="text-center font-display text-4xl font-bold mb-3">
        <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
          Калькулятор стоимости
        </span>
      </h2>
      <p className="text-center text-neutral-400 mb-10">
        Рассчитайте примерную стоимость вашей кухни
      </p>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* 1. ФАСАДЫ (первый блок) */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">1</span>
            Фасады
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {(['ДСП', 'МДФ', 'Эмаль'] as FacadeType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFacade(type)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300 font-medium
                  ${facade === type
                    ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20'
                    : 'border-white/10 bg-white/5 text-neutral-300 hover:border-yellow-500/50 hover:bg-white/10'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="text-sm text-neutral-500 pl-10">
            {facade === 'ДСП' && 'Бюджетный вариант, практичное решение'}
            {facade === 'МДФ' && 'Оптимальное соотношение цены и качества'}
            {facade === 'Эмаль' && 'Премиум класс, глянцевая поверхность'}
          </p>
        </div>

        {/* 2. ФУРНИТУРА (второй блок) */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">2</span>
            Фурнитура
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {(['Стандарт', 'Премиум'] as FittingsType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFittings(type)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300 font-medium
                  ${fittings === type
                    ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20'
                    : 'border-white/10 bg-white/5 text-neutral-300 hover:border-yellow-500/50 hover:bg-white/10'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="text-sm text-neutral-500 pl-10">
            {fittings === 'Стандарт' && 'Надежная фурнитура для повседневного использования'}
            {fittings === 'Премиум' && 'Фурнитура Blum - плавное закрывание, долговечность'}
          </p>
        </div>

        {/* 3. СТОЛЕШНИЦА (третий блок) */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">3</span>
            Столешница
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['HPL', 'Искусственный камень', 'Кварцевый агломерат'] as CountertopType[]).map((type) => (
              <button
                key={type}
                onClick={() => setCountertop(type)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300 font-medium
                  ${countertop === type
                    ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20'
                    : 'border-white/10 bg-white/5 text-neutral-300 hover:border-yellow-500/50 hover:bg-white/10'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="text-sm text-neutral-500 pl-10">
            {countertop === 'HPL' && 'Практичный ламинат, устойчивый к влаге'}
            {countertop === 'Искусственный камень' && 'Акриловый камень, бесшовная поверхность'}
            {countertop === 'Кварцевый агломерат' && 'Премиум материал, максимальная прочность'}
          </p>
        </div>

        {/* 4. РАЗМЕРЫ (четвертый блок) */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">4</span>
            Размеры
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Длина кухни:</span>
              <span className="text-2xl font-bold text-yellow-400">{length} м</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, rgb(234 179 8) 0%, rgb(234 179 8) ${((length - 1) / 9) * 100}%, rgba(255,255,255,0.1) ${((length - 1) / 9) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-neutral-500">
              <span>1 м</span>
              <span>5 м</span>
              <span>10 м</span>
            </div>
          </div>
        </div>

        {/* Разделитель */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Итоговая стоимость и кнопка */}
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-neutral-400 text-sm mb-2">Примерная стоимость</p>
            <div className="text-5xl font-bold text-yellow-400 mb-1">
              {price.toLocaleString('ru-RU')} ₽
            </div>
            <p className="text-neutral-500 text-sm">
              Финальная цена может отличаться после замера
            </p>
          </div>

          <button
            onClick={handleGetQuote}
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-8 py-5 text-xl font-semibold text-black shadow-2xl transition-all duration-300 hover:from-yellow-400 hover:to-amber-500 hover:shadow-yellow-500/50 hover:scale-[1.02] active:scale-95"
          >
            <span className="relative z-10">Получить точный расчёт</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgb(234 179 8);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgb(234 179 8);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
        }
      `}</style>
    </div>
  );
}
