import { Controller, Post, Get } from '@nestjs/common';
import { AutomationService } from './automation.service';

@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  // GET http://localhost:3000/automation/test/hot-leads
  @Get('test/hot-leads')
  async triggerHotLeadAlerts() {
    await this.automationService.handleHotLeadAlerts();
    return { success: true, message: '🔥 Alertes leads chauds exécutées manuellement.' };
  }

  // GET http://localhost:3000/automation/test/weekly-summary
  @Get('test/weekly-summary')
  async triggerWeeklySummary() {
    await this.automationService.handleWeeklySummary();
    return { success: true, message: '📊 Résumé hebdomadaire envoyé manuellement.' };
  }

  // GET http://localhost:3000/automation/test/overdue-tasks
  @Get('test/overdue-tasks')
  async triggerOverdueTaskReminders() {
    await this.automationService.handleOverdueTaskReminders();
    return { success: true, message: '⏰ Rappels tâches en retard exécutés manuellement.' };
  }

  // GET http://localhost:3000/automation/test/all
  @Get('test/all')
  async triggerAll() {
    await this.automationService.handleHotLeadAlerts();
    await this.automationService.handleWeeklySummary();
    await this.automationService.handleOverdueTaskReminders();
    return { success: true, message: '✅ Toutes les tâches automatisées ont été exécutées.' };
  }
}
