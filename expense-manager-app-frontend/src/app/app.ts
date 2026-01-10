import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from './components/ui/sonner/src';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ...HlmToasterImports],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('expense-manager-app-frontend');
}
