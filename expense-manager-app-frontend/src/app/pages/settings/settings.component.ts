import { Component } from '@angular/core';

@Component({
    selector: 'app-settings',
    standalone: true,
    template: `
    <div class="space-y-8">
      <h2 class="text-3xl font-bold tracking-tight mb-4">Settings</h2>
      <p>Settings content here.</p>
    </div>
  `,
    imports: []
})
export class SettingsComponent { }
