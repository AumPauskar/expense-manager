import { Component } from '@angular/core';

@Component({
    selector: 'app-timemachine',
    standalone: true,
    template: `
    <div class="space-y-8">
      <h2 class="text-3xl font-bold tracking-tight mb-4">Time Machine</h2>
      <p>Time Machine content here.</p>
    </div>
  `,
    imports: []
})
export class TimeMachineComponent { }