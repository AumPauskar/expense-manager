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
  template: `
    <div class="space-y-8">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Settings</h2>
        <p class="text-muted-foreground">Manage your application preferences.</p>
      </div>

      <ui-card>
        <ui-card-header>
          <ui-card-title>Dashboard Defaults</ui-card-title>
          <ui-card-description>Set the default state for new expense checkboxes.</ui-card-description>
        </ui-card-header>
        <ui-card-content class="space-y-4">
          <div class="flex items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <label class="text-base font-medium">Default Required</label>
              <p class="text-sm text-muted-foreground">
                Set the "Required" checkbox to checked by default.
              </p>
            </div>
            <input type="checkbox" 
                   [(ngModel)]="settings.defaultRequired" 
                   (change)="save()"
                   class="h-4 w-4 accent-primary rounded" />
          </div>

          <div class="flex items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <label class="text-base font-medium">Default Cash</label>
              <p class="text-sm text-muted-foreground">
                 Set the "Cash" checkbox to checked by default.
              </p>
            </div>
             <input type="checkbox" 
                   [(ngModel)]="settings.defaultCash" 
                   (change)="save()"
                   class="h-4 w-4 accent-primary rounded" />
          </div>

          <div class="flex items-center justify-between rounded-lg border p-4">
             <div class="space-y-0.5">
              <label class="text-base font-medium">Default Spent</label>
              <p class="text-sm text-muted-foreground">
                 Set the "Spent" checkbox to checked by default.
              </p>
            </div>
             <input type="checkbox" 
                   [(ngModel)]="settings.defaultSpent" 
                   (change)="save()"
                   class="h-4 w-4 accent-primary rounded" />
          </div>
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  settings: AppSettings = {
    defaultRequired: true,
    defaultCash: false,
    defaultSpent: true
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

