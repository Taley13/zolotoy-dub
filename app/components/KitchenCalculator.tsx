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

  // Базовая цена за погонный метр (включает стандартную фурнитуру и наполнение)
  const BASE_PRICE = 39000;

  // Наценки в процентах
  const MARKUP = {
    configuration: {
      'Прямая': 0,
      'Угловая': 0.18,
      'Индивидуальная': 0.28
    },
    facade: {
      'ДСП': 0,
      'МДФ': 0.22,
      'Эмаль': 0.50
    },
    fittings: {
      'Стандарт': 0,
      'Премиум Blum': 0.28
    },
    countertop: {
      'HPL': 0,
      'Искусственный камень': 0.65,
      'Кварцевый агломерат': 1.15
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
  }, [
    configuration,
    facade,
    fittings,
    countertop,
    length,
    discountActive,
    MARKUP.configuration,
    MARKUP.facade,
    MARKUP.fittings,
    MARKUP.countertop,
    BASE_PRICE
  ]);

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
      <div className="rounded-3xl border border-[#12484C] bg-[#0E2931] p-8 text-[#E2E2E0] shadow-[0_30px_80px_rgba(4,10,12,0.65)] md:p-12">
        <h2 className="mb-3 text-center font-display text-4xl font-bold text-[#E2E2E0]">
          Калькулятор стоимости
        </h2>
        
        {discountActive && (
          <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-[#2B7574] bg-[#2B7574]/15 p-5 shadow-[0_20px_60px_rgba(18,72,76,0.4)]">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="text-lg font-bold text-[#E2E2E0]">Скидка 15% активирована!</p>
                  <p className="text-sm text-[#E2E2E0]/70">Специальное предложение для вас</p>
                </div>
              </div>
              <div className="text-right">
                <p className="mb-1 text-xs text-[#E2E2E0]/60">Действует:</p>
                <p className="font-mono text-xl font-bold text-[#E2E2E0]">{timeRemaining}</p>
              </div>
            </div>
          </div>
        )}
        
        <p className="mb-10 text-center text-[#E2E2E0]/70">
          Рассчитайте стоимость вашей кухни • Прозрачное ценообразование
        </p>

        <div className="mx-auto max-w-4xl space-y-8">
          {/* 1. КОНФИГУРАЦИЯ КУХНИ (первый блок) */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-[#E2E2E0]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B7574]/30 text-sm text-[#2B7574]">1</span>
              Конфигурация кухни
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {([
                { type: 'Прямая', desc: 'Классическая планировка', icon: '━' },
                { type: 'Угловая', desc: 'Оптимальное использование пространства', icon: '⌞' },
                { type: 'Индивидуальная', desc: 'Любая сложная планировка', icon: '⚙' }
              ] as Array<{ type: ConfigurationType; desc: string; icon: string }>).map(({ type, desc, icon }) => (
                <button
                  key={type}
                  onClick={() => setConfiguration(type)}
                  className={`
                    rounded-2xl border p-5 text-left transition-all duration-300
                    ${configuration === type
                      ? 'border-[#2B7574] bg-[#2B7574]/20 text-[#E2E2E0] shadow-[0_18px_45px_rgba(0,0,0,0.45)]'
                      : 'border-[#12484C] bg-[#12484C]/20 text-[#E2E2E0]/70 hover:border-[#2B7574]/70 hover:bg-[#2B7574]/10'
                    }
                  `}
                >
                  <div className="mb-2 text-3xl text-[#2B7574]">{icon}</div>
                  <div className="mb-1 font-semibold">{type}</div>
                  <div className="text-xs text-[#E2E2E0]/60">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. ФАСАДЫ (второй блок) */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-[#E2E2E0]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B7574]/30 text-sm text-[#2B7574]">2</span>
              Фасады
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {([
                { type: 'ДСП', desc: 'Надежный эконом-вариант' },
                { type: 'МДФ', desc: 'Оптимальное качество' },
                { type: 'Эмаль', desc: 'Премиум-внешний вид' }
              ] as Array<{ type: FacadeType; desc: string }>).map(({ type, desc }) => (
                <button
                  key={type}
                  onClick={() => setFacade(type)}
                  className={`
                    rounded-2xl border p-4 text-left transition-all duration-300
                    ${facade === type
                      ? 'border-[#2B7574] bg-[#2B7574]/20 text-[#E2E2E0]'
                      : 'border-[#12484C] bg-[#12484C]/20 text-[#E2E2E0]/70 hover:border-[#2B7574]/70 hover:bg-[#2B7574]/10'
                    }
                  `}
                >
                  <div className="mb-1 font-semibold">{type}</div>
                  <div className="text-xs text-[#E2E2E0]/60">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. ФУРНИТУРА (третий блок) */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-[#E2E2E0]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B7574]/30 text-sm text-[#2B7574]">3</span>
              Фурнитура
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {([
                { type: 'Стандарт', desc: 'Качественная базовая' },
                { type: 'Премиум Blum', desc: 'Максимальная долговечность' }
              ] as Array<{ type: FittingsType; desc: string }>).map(({ type, desc }) => (
                <button
                  key={type}
                  onClick={() => setFittings(type)}
                  className={`
                    rounded-2xl border p-4 text-left transition-all duration-300
                    ${fittings === type
                      ? 'border-[#2B7574] bg-[#2B7574]/20 text-[#E2E2E0]'
                      : 'border-[#12484C] bg-[#12484C]/20 text-[#E2E2E0]/70 hover:border-[#2B7574]/60 hover:bg-[#2B7574]/10'
                    }
                  `}
                >
                  <div className="mb-1 font-semibold">{type}</div>
                  <div className="text-xs text-[#E2E2E0]/60">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. СТОЛЕШНИЦА (четвёртый блок) */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-[#E2E2E0]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B7574]/30 text-sm text-[#2B7574]">4</span>
              Столешница
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {([
                { type: 'HPL', desc: 'Износостойкая практичная' },
                { type: 'Искусственный камень', desc: 'Элегантная классика' },
                { type: 'Кварцевый агломерат', desc: 'Люкс-уровень' }
              ] as Array<{ type: CountertopType; desc: string }>).map(({ type, desc }) => (
                <button
                  key={type}
                  onClick={() => setCountertop(type)}
                  className={`
                    rounded-2xl border p-4 text-left transition-all duration-300
                    ${countertop === type
                      ? 'border-[#2B7574] bg-[#2B7574]/20 text-[#E2E2E0]'
                      : 'border-[#12484C] bg-[#12484C]/20 text-[#E2E2E0]/70 hover:border-[#2B7574]/60 hover:bg-[#2B7574]/10'
                    }
                  `}
                >
                  <div className="mb-1 text-sm font-semibold">{type}</div>
                  <div className="text-xs text-[#E2E2E0]/60">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. РАЗМЕРЫ (пятый блок) */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-[#E2E2E0]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B7574]/30 text-sm text-[#2B7574]">5</span>
              Размеры
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#E2E2E0]/75">Длина кухни:</span>
                <span className="text-2xl font-bold text-[#2B7574]">{length} м</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                className="slider-thumb h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#12484C]"
                style={{
                  background: `linear-gradient(to right, #2B7574 0%, #2B7574 ${((length - 1) / 9) * 100}%, rgba(255,255,255,0.1) ${((length - 1) / 9) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-[#E2E2E0]/50">
                <span>1 м</span>
                <span>5 м</span>
                <span>10 м</span>
              </div>
            </div>
          </div>

          {/* ПРОЗРАЧНЫЙ РАСЧЁТ */}
          <div className="rounded-2xl border border-[#12484C] bg-[#12484C]/20 p-6">
            <h4 className="mb-4 font-display text-lg font-semibold text-[#E2E2E0]">
              💡 Ваша конфигурация:
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#E2E2E0]/60">Конфигурация:</span>
                <span className="font-medium text-[#E2E2E0]">{configuration}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#E2E2E0]/60">Фасады:</span>
                <span className="font-medium text-[#E2E2E0]">{facade}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#E2E2E0]/60">Фурнитура:</span>
                <span className="font-medium text-[#E2E2E0]">{fittings}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#E2E2E0]/60">Столешница:</span>
                <span className="font-medium text-[#E2E2E0]">{countertop}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#E2E2E0]/60">Длина:</span>
                <span className="font-medium text-[#E2E2E0]">{length} м</span>
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
                <span className="font-semibold text-[#E2E2E0]">Итоговая стоимость:</span>
                <span className={`text-2xl font-bold ${discountActive ? 'text-[#43d17a]' : 'text-[#E2E2E0]'}`}>
                  {price.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
          </div>

          {/* Кнопка получения расчёта */}
          <button
            onClick={handleGetQuote}
            className="relative w-full overflow-hidden rounded-2xl bg-[#861211] px-8 py-5 text-xl font-semibold text-[#E2E2E0] shadow-[0_20px_70px_rgba(134,18,17,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a41b1a] active:translate-y-0"
          >
            <span className="relative z-10">Получить точный расчёт</span>
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/30 to-white/0 transition-transform duration-700 hover:translate-x-[100%]" />
          </button>

          {/* Примечание */}
          <p className="text-center text-sm text-[#E2E2E0]/60">
            Финальная цена уточняется после замера • Гарантия 2 года • Установка под ключ
          </p>
        </div>

        <style jsx>{`
          .slider-thumb::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #2B7574;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(43, 117, 116, 0.5);
          }
          .slider-thumb::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #2B7574;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px rgba(43, 117, 116, 0.5);
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
