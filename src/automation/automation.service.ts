import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ─── 1. Alerte Leads Chauds (toutes les heures) ────────────────────────
  @Cron(CronExpression.EVERY_HOUR)
  async handleHotLeadAlerts() {
    this.logger.log('🔥 [CRON] Vérification des leads devenus chauds...');

    // Récupérer tous les leads dont la température est "Hot"
    const hotLeads = await this.prisma.lead.findMany({
      where: {
        isDeleted: false,
        leadScore: {
          temperature: 'Hot',
        },
      },
      include: {
        leadScore: true,
        user: true,
      },
    });

    for (const lead of hotLeads) {
      if (!lead.userId) continue;

      // Vérifier qu'on n'a pas déjà envoyé cette alerte récemment (24h)
      const existingNotification = await this.prisma.notification.findFirst({
        where: {
          userId: lead.userId,
          type: 'LEAD',
          message: { contains: `Lead "${lead.name}" est devenu chaud` },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Dernières 24h
          },
        },
      });

      if (existingNotification) continue; // Déjà alerté

      // Créer la notification d'alerte
      await this.notificationsService.create({
        userId: lead.userId,
        type: 'LEAD',
        message: `🔥 Lead "${lead.name}" est devenu chaud (Score: ${lead.leadScore?.score}/100). Action recommandée : Appeler maintenant.`,
        degree: 'HIGH',
        relatedId: lead.id,
      });

      this.logger.log(`  → Alerte envoyée pour le lead "${lead.name}" (userId: ${lead.userId})`);
    }

    this.logger.log(`🔥 [CRON] ${hotLeads.length} leads chauds détectés.`);
  }

  // ─── 2. Résumé Hebdomadaire des Performances (chaque vendredi à 18h) ───
  @Cron('0 18 * * 5') // Chaque vendredi à 18h00
  async handleWeeklySummary() {
    this.logger.log('📊 [CRON] Génération du résumé hebdomadaire...');

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Récupérer tous les utilisateurs actifs
    const users = await this.prisma.user.findMany();

    for (const user of users) {
      // Statistiques de la semaine pour cet utilisateur
      const [newLeads, wonDeals, completedTasks, emailsSent] = await Promise.all([
        this.prisma.lead.count({
          where: { userId: user.id, isDeleted: false, createdAt: { gte: oneWeekAgo } },
        }),
        this.prisma.deal.count({
          where: { userId: user.id, status: 'WON', updatedAt: { gte: oneWeekAgo } },
        }),
        this.prisma.task.count({
          where: { userId: user.id, status: 'COMPLETED', updatedAt: { gte: oneWeekAgo } },
        }),
        this.prisma.email.count({
          where: { userId: user.id, createdAt: { gte: oneWeekAgo } },
        }),
      ]);

      // Calculer le revenu de la semaine
      const weekDeals = await this.prisma.deal.findMany({
        where: { userId: user.id, status: 'WON', updatedAt: { gte: oneWeekAgo } },
      });
      const weekRevenue = weekDeals.reduce((sum, d) => sum + d.amount, 0);

      // Construire le message de résumé
      const summary = [
        `📊 Résumé hebdomadaire (${oneWeekAgo.toLocaleDateString('fr-FR')} - ${new Date().toLocaleDateString('fr-FR')})`,
        `• Nouveaux leads : ${newLeads}`,
        `• Deals gagnés : ${wonDeals}`,
        `• Revenu généré : ${weekRevenue.toLocaleString('fr-FR')} $`,
        `• Tâches complétées : ${completedTasks}`,
        `• Emails envoyés : ${emailsSent}`,
      ].join('\n');

      // Créer la notification de résumé
      await this.notificationsService.create({
        userId: user.id,
        type: 'SYSTEM',
        message: summary,
        degree: 'LOW',
      });

      this.logger.log(`  → Résumé envoyé à ${user.name}`);
    }

    this.logger.log('📊 [CRON] Résumés hebdomadaires envoyés avec succès.');
  }

  // ─── 3. Rappel de tâches en retard (chaque jour à 9h) ──────────────────
  @Cron('0 9 * * *') // Chaque jour à 9h00
  async handleOverdueTaskReminders() {
    this.logger.log('⏰ [CRON] Vérification des tâches en retard...');

    const overdueTasks = await this.prisma.task.findMany({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS'] },
        dueDate: { lt: new Date() },
      },
      include: { user: true, lead: true },
    });

    for (const task of overdueTasks) {
      // Mettre à jour le statut en OVERDUE
      await this.prisma.task.update({
        where: { id: task.id },
        data: { status: 'OVERDUE' },
      });

      // Envoyer la notification
      await this.notificationsService.create({
        userId: task.userId,
        type: 'TASK',
        message: `⏰ Tâche en retard : "${task.title}" (Lead: ${task.lead?.name || 'N/A'}). Échéance dépassée.`,
        degree: 'HIGH',
        relatedId: task.id,
      });
    }

    this.logger.log(`⏰ [CRON] ${overdueTasks.length} tâches en retard détectées.`);
  }
}
