import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormCreateComponent } from '../../components/forms/form-create/form-create.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormCreateComponent],
  template: `
    <app-form></app-form>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ClassSchedullingFrontEnd2';
}
