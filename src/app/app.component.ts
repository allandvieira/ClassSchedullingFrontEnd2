import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormComponent],
  template: `
    <h1>Welcome to {{title}}!</h1>
    <app-form></app-form>
  `,
  styles: [],
})
export class AppComponent {
  title = 'ClassSchedullingFrontEnd2';
}
