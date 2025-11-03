"use client";

import { useState, useEffect } from 'react';
import CalculationModal from './CalculationModal';

type FacadeType = 'ДСП' | 'МДФ' | 'Эмаль';
type FittingsType = 'Стандарт' | 'Премиум Blum';
type CountertopType = 'HPL' | 'Искусственный камень' | 'Кварцевый агломерат';

interface CalculatorState {
  facade: string;
  hardware: string;
  countertop: string;
  length: number;
  calculatedPrice: number;
}

export default function KitchenCalculator() {
  // 1. ФАСАДЫ (первый параметр)
  const [facade, setFacade] = useState<FacadeType>('МДФ');
  
  // 2. ФУРНИТУРА (второй параметр)
  const [fittings, setFittings] = useState<FittingsType>('Стандарт');
  
  // 3. СТОЛЕШНИЦА (третий параметр)
  const [countertop, setCountertop] = useState<CountertopType>('HPL');
  
  // 4. РАЗМЕРЫ (четвертый параметр)
  const [length, setLength] = useState(3);

  // Состояние модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Базовая цена за погонный метр
  const BASE_PRICE = 45000;

  // Наценки в процентах
  const MARKUP = {
    facade: {
      'ДСП': 0,
      'МДФ': 0.30,
      'Эмаль': 0.70
    },
    fittings: {
      'Стандарт': 0,
      'Премиум Blum': 0.40
    },
    countertop: {
      'HPL': 0,
      'Искусственный камень': 0.90,
      'Кварцевый агломерат': 1.60
    }
  };

  // Логика расчета стоимости
  const calculatePrice = (): number => {
    const facadeMarkup = 1 + MARKUP.facade[facade];
    const fittingsMarkup = 1 + MARKUP.fittings[fittings];
    const countertopMarkup = 1 + MARKUP.countertop[countertop];

    const totalPrice = length * BASE_PRICE * facadeMarkup * fittingsMarkup * countertopMarkup;
    
    return Math.round(totalPrice);
  };

  // Расчёт наценок для прозрачности
  const getBreakdown = () => {
    const baseCost = length * BASE_PRICE;
    const facadeMarkup = MARKUP.facade[facade];
    const fittingsMarkup = MARKUP.fittings[fittings];
    const countertopMarkup = MARKUP.countertop[countertop];

    return {
      base: baseCost,
      facadePercent: Math.round(facadeMarkup * 100),
      fittingsPercent: Math.round(fittingsMarkup * 100),
      countertopPercent: Math.round(countertopMarkup * 100)
    };
  };

  const price = calculatePrice();
  const breakdown = getBreakdown();

  // Состояние для хранения всех параметров
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    facade: 'МДФ',
    hardware: 'Стандарт',
    countertop: 'HPL',
    length: 3,
    calculatedPrice: 0
  });

  // Обновление состояния при изменении параметров
  useEffect(() => {
    const newPrice = calculatePrice();
    setCalculatorState({
      facade: facade,
      hardware: fittings,
      countertop: countertop,
      length: length,
      calculatedPrice: newPrice
    });
  }, [facade, fittings, countertop, length]);

  const handleGetQuote = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="glass-neon p-8 md:p-12">
        <h2 className="text-center font-display text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
            Калькулятор стоимости
          </span>
        </h2>
        <p className="text-center text-neutral-400 mb-10">
          Рассчитайте стоимость вашей кухни • Прозрачное ценообразование
        </p>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1. ФАСАДЫ (первый блок) */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">1</span>
              Фасады
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { type: 'ДСП', desc: 'Надежный эконом-вариант' },
                { type: 'МДФ', desc: 'Оптимальное качество' },
                { type: 'Эмаль', desc: 'Премиум-внешний вид' }
              ] as Array<{ type: FacadeType; desc: string }>).map(({ type, desc }) => (
                <button
                  key={type}
                  onClick={() => setFacade(type)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-300
                    ${facade === type
                      ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20 scale-105'
                      : 'border-white/10 bg-white/5 text-neutral-300 hover:border-yellow-500/50 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="font-semibold mb-1">{type}</div>
                  {facade === type && MARKUP.facade[type] > 0 && (
                    <div className="text-xs text-yellow-300">+{Math.round(MARKUP.facade[type] * 100)}%</div>
                  )}
                  <div className="text-xs text-neutral-400 mt-1">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. ФУРНИТУРА (второй блок) */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">2</span>
              Фурнитура
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { type: 'Стандарт', desc: 'Качественная базовая' },
                { type: 'Премиум Blum', desc: 'Максимальная долговечность' }
              ] as Array<{ type: FittingsType; desc: string }>).map(({ type, desc }) => (
                <button
                  key={type}
                  onClick={() => setFittings(type)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-300
                    ${fittings === type
                      ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20 scale-105'
                      : 'border-white/10 bg-white/5 text-neutral-300 hover:border-yellow-500/50 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="font-semibold mb-1">{type}</div>
                  {fittings === type && MARKUP.fittings[type] > 0 && (
                    <div className="text-xs text-yellow-300">+{Math.round(MARKUP.fittings[type] * 100)}%</div>
                  )}
                  <div className="text-xs text-neutral-400 mt-1">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. СТОЛЕШНИЦА (третий блок) */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">3</span>
              Столешница
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { type: 'HPL', desc: 'Износостойкая практичная' },
                { type: 'Искусственный камень', desc: 'Элегантная классика' },
                { type: 'Кварцевый агломерат', desc: 'Люкс-уровень' }
              ] as Array<{ type: CountertopType; desc: string }>).map(({ type, desc }) => (
                <button
                  key={type}
                  onClick={() => setCountertop(type)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-300
                    ${countertop === type
                      ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20 scale-105'
                      : 'border-white/10 bg-white/5 text-neutral-300 hover:border-yellow-500/50 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="font-semibold mb-1 text-sm">{type}</div>
                  {countertop === type && MARKUP.countertop[type] > 0 && (
                    <div className="text-xs text-yellow-300">+{Math.round(MARKUP.countertop[type] * 100)}%</div>
                  )}
                  <div className="text-xs text-neutral-400 mt-1">{desc}</div>
                </button>
              ))}
            </div>
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

          {/* ПРОЗРАЧНЫЙ РАСЧЁТ */}
          <div className="bg-white/5 border border-yellow-500/30 rounded-2xl p-6">
            <h4 className="font-display text-lg font-semibold text-yellow-400 mb-4">
              💡 Формирование цены:
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Базовая цена ({length} м × 45 000 ₽):</span>
                <span className="text-neutral-200 font-medium">{breakdown.base.toLocaleString('ru-RU')} ₽</span>
              </div>
              
              {breakdown.facadePercent > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">• Наценка за {facade}:</span>
                  <span className="text-yellow-400">+{breakdown.facadePercent}%</span>
                </div>
              )}
              
              {breakdown.fittingsPercent > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">• Наценка за {fittings}:</span>
                  <span className="text-yellow-400">+{breakdown.fittingsPercent}%</span>
                </div>
              )}
              
              {breakdown.countertopPercent > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">• Наценка за {countertop}:</span>
                  <span className="text-yellow-400">+{breakdown.countertopPercent}%</span>
                </div>
              )}

              <div className="border-t border-white/10 pt-3 mt-3"></div>
              
              <div className="flex justify-between items-center text-lg">
                <span className="text-neutral-200 font-semibold">Итоговая стоимость:</span>
                <span className="text-yellow-400 font-bold text-2xl">{price.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>

          {/* Кнопка получения расчёта */}
          <button
            onClick={handleGetQuote}
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-8 py-5 text-xl font-semibold text-black shadow-2xl transition-all duration-300 hover:from-yellow-400 hover:to-amber-500 hover:shadow-yellow-500/50 hover:scale-[1.02] active:scale-95"
          >
            <span className="relative z-10">Получить точный расчёт</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          {/* Примечание */}
          <p className="text-center text-sm text-neutral-500">
            Финальная цена уточняется после замера • Гарантия 2 года • Установка под ключ
          </p>
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

      {/* Модальное окно */}
      <CalculationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        params={calculatorState}
      />
    </>
  );
}
