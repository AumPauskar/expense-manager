import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
    selector: 'ui-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiInputComponent),
            multi: true,
        },
    ],
    template: `
    <input
      [type]="type"
      [class]="'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' + class"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [value]="value"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
  `,
})
export class UiInputComponent implements ControlValueAccessor {
    @Input() type = 'text';
    @Input() placeholder = '';
    @Input() class = '';
    @Input() disabled = false;

    value = '';
    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(event: Event) {
        const val = (event.target as HTMLInputElement).value;
        this.value = val;
        this.onChange(val);
    }
}
