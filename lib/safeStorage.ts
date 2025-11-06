/**
 * 🔒 Безопасная работа с localStorage для SSR
 * 
 * Предотвращает ReferenceError при Server-Side Rendering
 */

export const safeLocalStorage = {
  /**
   * Безопасное чтение из localStorage
   */
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('localStorage.getItem error:', error);
      return null;
    }
  },
  
  /**
   * Безопасная запись в localStorage
   */
  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('localStorage.setItem error:', error);
      return false;
    }
  },
  
  /**
   * Безопасное удаление из localStorage
   */
  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('localStorage.removeItem error:', error);
      return false;
    }
  },
  
  /**
   * Проверка доступности localStorage
   */
  isAvailable: (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * React Hook для безопасной работы с localStorage
 */
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Инициализируем состояние только начальным значением
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Загружаем значение из localStorage только на клиенте
  useEffect(() => {
    try {
      const item = safeLocalStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Функция для сохранения значения
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      safeLocalStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

