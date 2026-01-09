import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button
      [class]="'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ' + variantClasses + ' ' + class"
      [disabled]="disabled"
      (click)="onClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class UiButtonComponent {
    @Input() variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'default';
    @Input() size: 'default' | 'sm' | 'lg' | 'icon' = 'default';
    @Input() class = '';
    @Input() disabled = false;

    get variantClasses(): string {
        const variants: Record<string, string> = {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
        };

        const sizes: Record<string, string> = {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            icon: 'h-10 w-10',
        };

        return `${variants[this.variant]} ${sizes[this.size]}`;
    }

    onClick(event: MouseEvent) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
}
