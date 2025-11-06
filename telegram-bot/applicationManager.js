/**
 * 📦 МЕНЕДЖЕР ЗАЯВОК
 * 
 * Модуль для управления заявками с персистентным хранилищем
 * Поддерживает как файловое хранилище (JSON), так и кэш в памяти
 */

const fs = require('fs').promises;
const path = require('path');

// ════════════════════════════════════════════════════════════
// КОНФИГУРАЦИЯ
// ════════════════════════════════════════════════════════════

const STORAGE_PATH = path.join(__dirname, 'applications.json');
const BACKUP_PATH = path.join(__dirname, 'applications.backup.json');

// ════════════════════════════════════════════════════════════
// ХРАНИЛИЩЕ
// ════════════════════════════════════════════════════════════

class ApplicationManager {
  constructor() {
    // Кэш в памяти для быстрого доступа
    this.applications = new Map();
    
    // Счетчик для генерации ID
    this.lastId = 0;
    
    // Флаг инициализации
    this.initialized = false;
  }

  /**
   * Инициализация - загрузка данных из файла
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Пытаемся загрузить существующие данные
      const data = await fs.readFile(STORAGE_PATH, 'utf8');
      const parsed = JSON.parse(data);
      
      // Восстанавливаем Map из объекта
      if (parsed.applications && Array.isArray(parsed.applications)) {
        parsed.applications.forEach(app => {
          this.applications.set(app.id, app);
        });
      }
      
      this.lastId = parsed.lastId || 0;
      
      console.log(`[ApplicationManager] ✅ Загружено ${this.applications.size} заявок из файла`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Файл не существует - это первый запуск
        console.log('[ApplicationManager] 📝 Создан новый файл хранилища');
        await this.save();
      } else {
        console.error('[ApplicationManager] ❌ Ошибка загрузки:', error.message);
      }
    }
    
    this.initialized = true;
  }

  /**
   * Сохранение данных в файл
   */
  async save() {
    try {
      // Создаем резервную копию перед сохранением
      try {
        const currentData = await fs.readFile(STORAGE_PATH, 'utf8');
        await fs.writeFile(BACKUP_PATH, currentData, 'utf8');
      } catch (error) {
        // Если файла нет - это нормально
      }

      // Преобразуем Map в массив для JSON
      const data = {
        lastId: this.lastId,
        applications: Array.from(this.applications.values()),
        updatedAt: new Date().toISOString()
      };

      // Сохраняем с красивым форматированием
      await fs.writeFile(
        STORAGE_PATH,
        JSON.stringify(data, null, 2),
        'utf8'
      );

      return { success: true };
    } catch (error) {
      console.error('[ApplicationManager] ❌ Ошибка сохранения:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Генерация уникального ID
   */
  generateId() {
    this.lastId++;
    return `APP_${Date.now()}_${this.lastId}`;
  }

  /**
   * Создание новой заявки
   * @param {Object} data - данные заявки
   * @returns {Object} созданная заявка
   */
  async createApplication(data) {
    const id = data.id || this.generateId();
    
    const application = {
      id,
      name: data.name || 'Не указано',
      phone: data.phone || null,
      email: data.email || null,
      message: data.message || null,
      calculationData: data.calculationData || null,
      status: 'new',
      priority: data.priority || 'normal',
      source: data.source || 'website',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      actions: [],
      notes: []
    };

    this.applications.set(id, application);
    await this.save();

    console.log(`[ApplicationManager] ✅ Создана заявка ${id}`);
    return application;
  }

  /**
   * Получение заявки по ID
   * @param {string} id - ID заявки
   * @returns {Object|null} заявка или null
   */
  getApplication(id) {
    return this.applications.get(id) || null;
  }

  /**
   * Получение всех заявок
   * @param {Object} filters - фильтры (status, priority)
   * @returns {Array} массив заявок
   */
  getAllApplications(filters = {}) {
    let apps = Array.from(this.applications.values());

    // Фильтрация по статусу
    if (filters.status) {
      apps = apps.filter(app => app.status === filters.status);
    }

    // Фильтрация по приоритету
    if (filters.priority) {
      apps = apps.filter(app => app.priority === filters.priority);
    }

    // Сортировка по дате создания (новые первыми)
    apps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return apps;
  }

  /**
   * Обновление статуса заявки
   * @param {string} id - ID заявки
   * @param {string} status - новый статус
   * @returns {Object} результат операции
   */
  async updateStatus(id, status, comment = null) {
    const app = this.applications.get(id);
    
    if (!app) {
      return { success: false, error: 'Заявка не найдена' };
    }

    const oldStatus = app.status;
    app.status = status;
    app.updatedAt = new Date().toISOString();

    // Добавляем действие в историю
    app.actions.push({
      type: 'status_change',
      from: oldStatus,
      to: status,
      comment,
      timestamp: new Date().toISOString()
    });

    await this.save();

    console.log(`[ApplicationManager] 📝 Заявка ${id}: ${oldStatus} → ${status}`);
    return { success: true, application: app };
  }

  /**
   * Добавление действия к заявке
   * @param {string} id - ID заявки
   * @param {string} actionType - тип действия
   * @param {Object} data - дополнительные данные
   */
  async addAction(id, actionType, data = {}) {
    const app = this.applications.get(id);
    
    if (!app) {
      return { success: false, error: 'Заявка не найдена' };
    }

    app.actions.push({
      type: actionType,
      ...data,
      timestamp: new Date().toISOString()
    });

    app.updatedAt = new Date().toISOString();
    await this.save();

    console.log(`[ApplicationManager] 📌 Добавлено действие "${actionType}" к заявке ${id}`);
    return { success: true, application: app };
  }

  /**
   * Добавление заметки к заявке
   * @param {string} id - ID заявки
   * @param {string} note - текст заметки
   */
  async addNote(id, note) {
    const app = this.applications.get(id);
    
    if (!app) {
      return { success: false, error: 'Заявка не найдена' };
    }

    app.notes.push({
      text: note,
      timestamp: new Date().toISOString()
    });

    app.updatedAt = new Date().toISOString();
    await this.save();

    return { success: true, application: app };
  }

  /**
   * Удаление заявки
   * @param {string} id - ID заявки
   * @returns {Object} результат операции
   */
  async deleteApplication(id) {
    const app = this.applications.get(id);
    
    if (!app) {
      return { success: false, error: 'Заявка не найдена' };
    }

    this.applications.delete(id);
    await this.save();

    console.log(`[ApplicationManager] 🗑 Удалена заявка ${id}`);
    return { success: true };
  }

  /**
   * Получение статистики
   */
  getStatistics() {
    const all = Array.from(this.applications.values());
    
    return {
      total: all.length,
      new: all.filter(app => app.status === 'new').length,
      work: all.filter(app => app.status === 'work').length,
      done: all.filter(app => app.status === 'done').length,
      called: all.filter(app => 
        app.actions.some(action => action.type === 'called')
      ).length,
      messaged: all.filter(app => 
        app.actions.some(action => action.type === 'messaged')
      ).length,
      highPriority: all.filter(app => app.priority === 'high').length,
      
      // Временная статистика
      today: all.filter(app => {
        const today = new Date().toDateString();
        return new Date(app.createdAt).toDateString() === today;
      }).length,
      
      week: all.filter(app => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(app.createdAt) >= weekAgo;
      }).length
    };
  }

  /**
   * Очистка старых обработанных заявок
   * @param {number} daysOld - возраст в днях
   */
  async cleanupOldApplications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    let deletedCount = 0;

    for (const [id, app] of this.applications.entries()) {
      if (app.status === 'done' && new Date(app.updatedAt) < cutoffDate) {
        this.applications.delete(id);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      await this.save();
      console.log(`[ApplicationManager] 🧹 Удалено ${deletedCount} старых заявок`);
    }

    return { success: true, deletedCount };
  }

  /**
   * Экспорт данных
   */
  async exportData() {
    const exportPath = path.join(__dirname, `export_${Date.now()}.json`);
    
    const data = {
      exportedAt: new Date().toISOString(),
      applications: Array.from(this.applications.values()),
      statistics: this.getStatistics()
    };

    await fs.writeFile(
      exportPath,
      JSON.stringify(data, null, 2),
      'utf8'
    );

    console.log(`[ApplicationManager] 💾 Экспорт сохранен: ${exportPath}`);
    return { success: true, path: exportPath };
  }
}

// ════════════════════════════════════════════════════════════
// ЭКСПОРТ
// ════════════════════════════════════════════════════════════

// Создаем единственный экземпляр (singleton)
const applicationManager = new ApplicationManager();

module.exports = applicationManager;

