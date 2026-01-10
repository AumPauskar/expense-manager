import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, AppSettings } from '../../services/settings.service';
import { UiCardComponent, UiCardContentComponent, UiCardDescriptionComponent, UiCardHeaderComponent, UiCardTitleComponent } from '../../components/ui/card.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  settings: AppSettings = {
    defaultRequired: true,
    defaultCash: false,
    defaultSpent: true,
    currencyCode: 'USD',
    pageSize: 10
  };

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.settingsService.settings$.subscribe(settings => {
      this.settings = { ...settings };
    });
  }

  save() {
    this.settingsService.updateSettings(this.settings);
  }
}

