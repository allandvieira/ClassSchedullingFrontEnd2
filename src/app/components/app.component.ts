import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageFormComponent } from './page/page-form/page-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PageFormComponent],
  template: `
    <app-form></app-form>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ClassSchedullingFrontEnd2';
}