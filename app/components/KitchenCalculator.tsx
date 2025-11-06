"use client";

import { useState, useEffect, useCallback } from 'react';
import CalculationModal from './CalculationModal';
import { safeLocalStorage } from '@/lib/safeStorage';

type ConfigurationType = 'Прямая' | 'Угловая' | 'Индивидуальная';
type FacadeType = 'ДСП' | 'МДФ' | 'Эмаль';
type FittingsType = 'Стандарт' | 'Премиум Blum';
type CountertopType = 'HPL' | 'Искусственный камень' | 'Кварцевый агломерат';

interface CalculatorState {
  configuration: string;
  facade: string;
  hardware: string;
  countertop: string;
  length: number;
  calculatedPrice: number;
}

export default function KitchenCalculator() {
  // 1. КОНФИГУРАЦИЯ КУХНИ (первый параметр)
  const [configuration, setConfiguration] = useState<ConfigurationType>('Прямая');
  
  // 2. ФАСАДЫ (второй параметр)
  const [facade, setFacade] = useState<FacadeType>('МДФ');
  
  // 3. ФУРНИТУРА (третий параметр)
  const [fittings, setFittings] = useState<FittingsType>('Стандарт');
  
  // 4. СТОЛЕШНИЦА (четвёртый параметр)
  const [countertop, setCountertop] = useState<CountertopType>('HPL');
  
  // 5. РАЗМЕРЫ (пятый параметр)
  const [length, setLength] = useState(3);

  // Состояние модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояние скидки
  const [discountActive, setDiscountActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Базовая цена за погонный метр
  const BASE_PRICE = 45000;

  // Наценки в процентах
  const MARKUP = {
    configuration: {
      'Прямая': 0,
      'Угловая': 0.25,
      'Индивидуальная': 0.40
    },
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
  // Обернуто в useCallback для предотвращения stale closures
  const calculatePrice = useCallback((): number => {
    const configurationMarkup = 1 + MARKUP.configuration[configuration];
    const facadeMarkup = 1 + MARKUP.facade[facade];
    const fittingsMarkup = 1 + MARKUP.fittings[fittings];
    const countertopMarkup = 1 + MARKUP.countertop[countertop];

    let totalPrice = length * BASE_PRICE * configurationMarkup * facadeMarkup * fittingsMarkup * countertopMarkup;
    
    // Применяем скидку 15% если активирована
    if (discountActive) {
      totalPrice = totalPrice * 0.85; // 15% скидка
    }
    
    return Math.round(totalPrice);
  }, [configuration, facade, fittings, countertop, length, discountActive]);

  const price = calculatePrice();

  // Состояние для хранения всех параметров
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    configuration: 'Прямая',
    facade: 'МДФ',
    hardware: 'Стандарт',
    countertop: 'HPL',
    length: 3,
    calculatedPrice: 0
  });

  // Проверка активности скидки (SSR-безопасная)
  useEffect(() => {
    const checkDiscount = () => {
      // Безопасное чтение из localStorage
      const activationTime = safeLocalStorage.getItem('discount_activation');
      if (!activationTime) {
        setDiscountActive(false);
        return;
      }

      const activation = parseInt(activationTime);
      const now = Date.now();
      const elapsed = now - activation;
      const duration24h = 24 * 60 * 60 * 1000; // 24 часа

      if (elapsed < duration24h) {
        setDiscountActive(true);
        
        // Обновляем таймер каждую секунду
        const remaining = duration24h - elapsed;
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
        
        setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setDiscountActive(false);
        safeLocalStorage.removeItem('discount_activation');
      }
    };

    checkDiscount();
    const interval = setInterval(checkDiscount, 1000);

    return () => clearInterval(interval);
  }, []);

  // Обновление состояния при изменении параметров
  useEffect(() => {
    const newPrice = calculatePrice();
    setCalculatorState({
      configuration: configuration,
      facade: facade,
      hardware: fittings,
      countertop: countertop,
      length: length,
      calculatedPrice: newPrice
    });
  }, [configuration, facade, fittings, countertop, length, discountActive, calculatePrice]);

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
        
        {/* Баннер скидки */}
        {discountActive && (
          <div className="mb-6 mx-auto max-w-2xl bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-2 border-green-500/50 rounded-xl p-4 shadow-lg shadow-green-500/20 animate-pulse">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="text-green-400 font-bold text-lg">Скидка 15% активирована!</p>
                  <p className="text-green-300 text-sm">Специальное предложение для вас</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-300 mb-1">Действует:</p>
                <p className="text-green-400 font-mono font-bold text-xl">{timeRemaining}</p>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-center text-neutral-400 mb-10">
          Рассчитайте стоимость вашей кухни • Прозрачное ценообразование
        </p>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1. КОНФИГУРАЦИЯ КУХНИ (первый блок) */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">1</span>
              Конфигурация кухни
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { type: 'Прямая', desc: 'Классическая планировка', icon: '━' },
                { type: 'Угловая', desc: 'Оптимальное использование пространства', icon: '⌞' },
                { type: 'Индивидуальная', desc: 'Любая сложная планировка', icon: '⚙' }
              ] as Array<{ type: ConfigurationType; desc: string; icon: string }>).map(({ type, desc, icon }) => (
                <button
                  key={type}
                  onClick={() => setConfiguration(type)}
                  className={`
                    p-5 rounded-xl border-2 transition-all duration-300
                    ${configuration === type
                      ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20 scale-105'
                      : 'border-white/10 bg-white/5 text-neutral-300 hover:border-yellow-500/50 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="font-semibold mb-1">{type}</div>
                  <div className="text-xs text-neutral-400 mt-1">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. ФАСАДЫ (второй блок) */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">2</span>
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
                  <div className="text-xs text-neutral-400 mt-1">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. ФУРНИТУРА (третий блок) */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">3</span>
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
                  <div className="text-xs text-neutral-400 mt-1">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. СТОЛЕШНИЦА (четвёртый блок) */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">4</span>
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
                  <div className="text-xs text-neutral-400 mt-1">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. РАЗМЕРЫ (пятый блок) */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-yellow-400 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-sm">5</span>
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
              💡 Ваша конфигурация:
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Конфигурация:</span>
                <span className="text-neutral-200 font-medium">{configuration}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Фасады:</span>
                <span className="text-neutral-200 font-medium">{facade}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Фурнитура:</span>
                <span className="text-neutral-200 font-medium">{fittings}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Столешница:</span>
                <span className="text-neutral-200 font-medium">{countertop}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Длина:</span>
                <span className="text-neutral-200 font-medium">{length} м</span>
              </div>

              <div className="border-t border-white/10 pt-3 mt-3"></div>
              
              {/* Скидка если активна */}
              {discountActive && (
                <div className="flex justify-between items-center text-base bg-green-500/10 rounded-lg p-2 -mx-2">
                  <span className="text-green-400 font-semibold">🎉 Скидка 15%:</span>
                  <span className="text-green-400 font-bold">-{Math.round((length * BASE_PRICE * (1 + MARKUP.configuration[configuration]) * (1 + MARKUP.facade[facade]) * (1 + MARKUP.fittings[fittings]) * (1 + MARKUP.countertop[countertop])) * 0.15).toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-lg">
                <span className="text-neutral-200 font-semibold">Итоговая стоимость:</span>
                <span className={`font-bold text-2xl ${discountActive ? 'text-green-400' : 'text-yellow-400'}`}>
                  {price.toLocaleString('ru-RU')} ₽
                </span>
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
