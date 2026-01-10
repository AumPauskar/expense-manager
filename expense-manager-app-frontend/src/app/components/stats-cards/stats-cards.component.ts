import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { UiCardComponent, UiCardContentComponent, UiCardHeaderComponent, UiCardTitleComponent } from '../ui/card.component';

@Component({
    selector: 'app-stats-cards',
    standalone: true,
    imports: [
        CommonModule,
        UiCardComponent,
        UiCardHeaderComponent,
        UiCardTitleComponent,
        UiCardContentComponent,
        CurrencyPipe
    ],
    templateUrl: './stats-cards.component.html',
    styleUrl: './stats-cards.component.css'
})
export class StatsCardsComponent {
    @Input() totalSpent: number = 0;
    @Input() totalEarned: number = 0;
    @Input() spentThisWeek: number = 0;
    @Input() averageSpent: number = 0;
    @Input() currencyCode: string = 'USD';
}
