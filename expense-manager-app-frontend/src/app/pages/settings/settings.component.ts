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
                Set the state for default checkbox "Required". Ideal if you want to differentiate between essential and non-essential expenses.
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
                 Set the state for default checkbox "Cash". Button best used if you want to differentiate between cash and online expenses.
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
                 Set the state for default checkbox "Spent". Button used to differentiate money going out from your bank account and money going into your bank account.
              </p>
            </div>
             <input type="checkbox" 
                   [(ngModel)]="settings.defaultSpent" 
                   (change)="save()"
                   class="h-4 w-4 accent-primary rounded" />
          </div>
        </ui-card-content>
      </ui-card>
      <ui-card>
        <ui-card-header>
          <ui-card-title>Display Settings</ui-card-title>
          <ui-card-description>Customize how your financial data is presented.</ui-card-description>
        </ui-card-header>
        <ui-card-content class="space-y-4">
          <div class="flex items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <label class="text-base font-medium">Currency</label>
              <p class="text-sm text-muted-foreground">
                Select the currency symbol used across the dashboard.
              </p>
            </div>
            <select [(ngModel)]="settings.currencyCode" 
                    (change)="save()"
                    class="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
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
    defaultSpent: true,
    currencyCode: 'USD'
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

