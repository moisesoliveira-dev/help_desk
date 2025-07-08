import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Ticket, Clock, CheckCircle, Users } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Ícones Lucide
  readonly Ticket = Ticket;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly Users = Users;
}
