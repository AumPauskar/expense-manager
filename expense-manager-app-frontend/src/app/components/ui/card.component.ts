import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  template: `
    <div [class]="'rounded-xl border bg-card text-card-foreground shadow ' + class">
      <ng-content></ng-content>
    </div>
  `,
})
export class UiCardComponent {
  @Input() class = '';
}

@Component({
  selector: 'ui-card-header',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  template: `
    <div [class]="'flex flex-col space-y-1.5 p-6 ' + class">
      <ng-content></ng-content>
    </div>
  `,
})
export class UiCardHeaderComponent {
  @Input() class = '';
}

@Component({
  selector: 'ui-card-title',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  template: `
    <h3 [class]="'m-0 font-semibold leading-snug tracking-tight ' + class">
      <ng-content></ng-content>
    </h3>
  `,
})
export class UiCardTitleComponent {
  @Input() class = '';
}

@Component({
  selector: 'ui-card-description',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  template: `
    <p [class]="'text-sm text-muted-foreground ' + class">
      <ng-content></ng-content>
    </p>
  `,
})
export class UiCardDescriptionComponent {
  @Input() class = '';
}

@Component({
  selector: 'ui-card-content',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  template: `
    <div [class]="'p-6 pt-0 ' + class">
      <ng-content></ng-content>
    </div>
  `,
})
export class UiCardContentComponent {
  @Input() class = '';
}

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'block' },
  template: `
    <div [class]="'flex items-center p-6 pt-0 ' + class">
      <ng-content></ng-content>
    </div>
  `,
})
export class UiCardFooterComponent {
  @Input() class = '';
}
