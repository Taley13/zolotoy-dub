/**
 * 💰 КАЛЬКУЛЯТОР ЦЕН ДЛЯ КУХОНЬ
 * 
 * Единая система расчёта цен для калькулятора и галереи
 * Соответствует московским ценам 2025 года
 */

// Типы для параметров кухни
export type KitchenConfiguration = 'Прямая' | 'Угловая' | 'Индивидуальная';
export type FacadeMaterial = 'ДСП' | 'МДФ' | 'Эмаль';
export type HardwareType = 'Стандарт' | 'Премиум Blum';
export type CountertopType = 'HPL' | 'Искусственный камень' | 'Кварцевый агломерат';

export interface KitchenParams {
  configuration: KitchenConfiguration;
  facade: FacadeMaterial;
  hardware: HardwareType;
  countertop: CountertopType;
  length: number; // в метрах
}

// ════════════════════════════════════════════════════════════
// БАЗОВАЯ ЦЕНА И НАЦЕНКИ
// ════════════════════════════════════════════════════════════

const BASE_PRICE_PER_METER = 45000; // руб/м

// Наценки на конфигурацию
const CONFIGURATION_MARKUP: Record<KitchenConfiguration, number> = {
  'Прямая': 0,          // +0%
  'Угловая': 0.25,      // +25%
  'Индивидуальная': 0.40 // +40%
};

// Наценки на фасады
const FACADE_MARKUP: Record<FacadeMaterial, number> = {
  'ДСП': 0,     // +0% (базовый)
  'МДФ': 0.30,  // +30%
  'Эмаль': 0.70 // +70%
};

// Наценки на фурнитуру
const HARDWARE_MARKUP: Record<HardwareType, number> = {
  'Стандарт': 0,        // +0%
  'Премиум Blum': 0.40  // +40%
};

// Наценки на столешницу
const COUNTERTOP_MARKUP: Record<CountertopType, number> = {
  'HPL': 0,                        // +0% (базовый)
  'Искусственный камень': 0.90,    // +90%
  'Кварцевый агломерат': 1.60      // +160%
};

// ════════════════════════════════════════════════════════════
// ФУНКЦИЯ РАСЧЁТА ЦЕНЫ
// ════════════════════════════════════════════════════════════

/**
 * Рассчитать полную стоимость кухни
 */
export function calculateKitchenPrice(params: KitchenParams): number {
  const configMarkup = CONFIGURATION_MARKUP[params.configuration];
  const facadeMarkup = FACADE_MARKUP[params.facade];
  const hardwareMarkup = HARDWARE_MARKUP[params.hardware];
  const countertopMarkup = COUNTERTOP_MARKUP[params.countertop];

  // Формула: Длина × 45,000 × (1 + наценка_конфигурации) × (1 + наценка_фасада) × 
  //          × (1 + наценка_фурнитуры) × (1 + наценка_столешницы)
  const price = params.length * BASE_PRICE_PER_METER * 
                (1 + configMarkup) * 
                (1 + facadeMarkup) * 
                (1 + hardwareMarkup) * 
                (1 + countertopMarkup);

  return Math.round(price);
}

/**
 * Рассчитать цену с учётом скидки
 */
export function calculateDiscountedPrice(basePrice: number, discountPercent: number = 15): number {
  return Math.round(basePrice * (1 - discountPercent / 100));
}

/**
 * Рассчитать экономию от скидки
 */
export function calculateSavings(basePrice: number, discountPercent: number = 15): number {
  return Math.round(basePrice * (discountPercent / 100));
}

// ════════════════════════════════════════════════════════════
// ФОРМАТИРОВАНИЕ
// ════════════════════════════════════════════════════════════

/**
 * Форматировать цену с разделителями
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU');
}

/**
 * Получить диапазон цен для конкретных параметров
 */
export function getPriceRange(params: Partial<KitchenParams>): { min: number; max: number } {
  // Минимальная конфигурация (1м, прямая, ДСП, стандарт, HPL)
  const minParams: KitchenParams = {
    configuration: 'Прямая',
    facade: 'ДСП',
    hardware: 'Стандарт',
    countertop: 'HPL',
    length: 1,
    ...params
  };

  // Максимальная конфигурация (10м, индивидуальная, эмаль, премиум, кварц)
  const maxParams: KitchenParams = {
    configuration: 'Индивидуальная',
    facade: 'Эмаль',
    hardware: 'Премиум Blum',
    countertop: 'Кварцевый агломерат',
    length: 10,
    ...params
  };

  return {
    min: calculateKitchenPrice(minParams),
    max: calculateKitchenPrice(maxParams)
  };
}

// ════════════════════════════════════════════════════════════
// ПРЕДУСТАНОВЛЕННЫЕ КОНФИГУРАЦИИ ДЛЯ ГАЛЕРЕИ
// ════════════════════════════════════════════════════════════

export interface PresetKitchen extends KitchenParams {
  id: string;
  name: string;
  description: string;
}

export const KITCHEN_PRESETS: Record<string, PresetKitchen> = {
  // Эконом-класс
  'budget_straight': {
    id: 'budget_straight',
    name: 'Эконом прямая',
    description: 'ДСП, стандартная фурнитура, HPL столешница',
    configuration: 'Прямая',
    facade: 'ДСП',
    hardware: 'Стандарт',
    countertop: 'HPL',
    length: 3
  },
  
  // Средний класс
  'standard_corner': {
    id: 'standard_corner',
    name: 'Стандарт угловая',
    description: 'МДФ, стандартная фурнитура, HPL столешница',
    configuration: 'Угловая',
    facade: 'МДФ',
    hardware: 'Стандарт',
    countertop: 'HPL',
    length: 4
  },
  
  'standard_straight_stone': {
    id: 'standard_straight_stone',
    name: 'Стандарт с камнем',
    description: 'МДФ, премиум фурнитура, искусственный камень',
    configuration: 'Прямая',
    facade: 'МДФ',
    hardware: 'Премиум Blum',
    countertop: 'Искусственный камень',
    length: 5
  },
  
  // Премиум-класс
  'premium_corner': {
    id: 'premium_corner',
    name: 'Премиум угловая',
    description: 'Эмаль, премиум фурнитура, искусственный камень',
    configuration: 'Угловая',
    facade: 'Эмаль',
    hardware: 'Премиум Blum',
    countertop: 'Искусственный камень',
    length: 6
  },
  
  'premium_island': {
    id: 'premium_island',
    name: 'Премиум островная',
    description: 'Эмаль, премиум фурнитура, кварцевый агломерат',
    configuration: 'Индивидуальная',
    facade: 'Эмаль',
    hardware: 'Премиум Blum',
    countertop: 'Кварцевый агломерат',
    length: 8
  },
  
  'premium_large': {
    id: 'premium_large',
    name: 'Премиум большая',
    description: 'МДФ, премиум фурнитура, кварцевый агломерат',
    configuration: 'Индивидуальная',
    facade: 'МДФ',
    hardware: 'Премиум Blum',
    countertop: 'Кварцевый агломерат',
    length: 7
  }
};

// ════════════════════════════════════════════════════════════
// УТИЛИТЫ
// ════════════════════════════════════════════════════════════

/**
 * Получить краткое описание комплектации
 */
export function getShortSpec(params: KitchenParams): string {
  return `${params.configuration} ${params.length}м • ${params.facade} • ${params.hardware} • ${params.countertop}`;
}

/**
 * Получить полное описание с ценой
 */
export function getFullPriceDescription(params: KitchenParams): {
  spec: string;
  price: number;
  formattedPrice: string;
} {
  const price = calculateKitchenPrice(params);
  
  return {
    spec: getShortSpec(params),
    price,
    formattedPrice: formatPrice(price)
  };
}

