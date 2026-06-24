import { Controller, Get, Param, Patch, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(+userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }

  // POST /notifications — Créer une notification manuellement
  @Post()
  create(@Body() body: { userId: number; type: string; message: string; degree?: string; relatedId?: number }) {
    return this.notificationsService.create(body);
  }

  // POST /notifications/test — Générer des notifications IA de test
  @Post('test')
  async createTestNotifications(@Body() body: { userId: number }) {
    const { userId } = body;

    const testNotifications = [
      {
        userId,
        type: 'LEAD',
        message: '🔥 Lead "Entreprise Alpha" est devenu chaud (Score: 92/100). Action recommandée : Appeler maintenant.',
        degree: 'HIGH',
      },
      {
        userId,
        type: 'LEAD',
        message: '🔥 Lead "Société Beta" est devenu chaud (Score: 87/100). Action recommandée : Planifier un rendez-vous.',
        degree: 'HIGH',
      },
      {
        userId,
        type: 'TASK',
        message: '⏰ Tâche en retard : "Relancer le client TechCorp". Échéance dépassée de 2 jours.',
        degree: 'CRITICAL',
      },
      {
        userId,
        type: 'SYSTEM',
        message: '📊 Résumé hebdomadaire :\n• Nouveaux leads : 12\n• Deals gagnés : 3\n• Revenu généré : 45 000 $\n• Tâches complétées : 8\n• Emails envoyés : 24',
        degree: 'LOW',
      },
      {
        userId,
        type: 'LEAD',
        message: '📈 Le score du lead "Global Services" a augmenté de 45 à 78. Il passe en catégorie "Warm".',
        degree: 'MEDIUM',
      },
    ];

    const created = [];
    for (const notif of testNotifications) {
      const result = await this.notificationsService.create(notif);
      created.push(result);
    }

    return { message: `${created.length} notifications de test créées avec succès.`, notifications: created };
  }
}
