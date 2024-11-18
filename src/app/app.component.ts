import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormComponent],
  template: `
    <app-form></app-form>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ClassSchedullingFrontEnd2';
}
