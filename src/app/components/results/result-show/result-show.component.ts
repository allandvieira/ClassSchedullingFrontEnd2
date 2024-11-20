import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Curso, Disciplina } from '../../../models/course.model';

@Component({
  selector: 'app-result',
  standalone: true,
  templateUrl: './result-show.component.html',
  styleUrls: ['./result-show.component.scss']
})
export class ResultShowComponent implements OnChanges {
  @Input() resultData: any;
  @Output() closeResultsEvent = new EventEmitter<void>();

  constructor(private toastr: ToastrService) {
    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
  }

  ngOnChanges(): void {
    if (this.resultData) {
      this.displayResults();
    }
  }

  displayResults(): void {
    (document.getElementById("bestChromosomeScore") as HTMLInputElement).value = this.resultData.notaDoMaiorCromosso;
    (document.getElementById("iterationsCount") as HTMLInputElement).value = this.resultData.quantidadeDeIterações;
    (document.getElementById("executionTime") as HTMLInputElement).value = this.resultData.tempoDeExecuçãoEmMinutos;
  }

  exportResults(): void {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.resultData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "result.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    this.toastr.info("Resultados exportados com sucesso.", "Info");
  }

  convertJsonToTable(): void {
    if (this.resultData && this.resultData.cursos) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Grade de Horários</title>
              <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
            </head>
            <body>
              <div class="container">
                <h1 class="mt-5">Grade de Horários</h1>
                ${this.generateHtmlTable(this.resultData.cursos)}
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } else {
      this.toastr.warning("Nenhum dado de curso disponível para converter.", "Aviso");
    }
  }

  generateHtmlTable(cursos: Curso[]): string {
    let html = '';
    cursos.forEach(curso => {
      html += `
        <h2>${curso.nomeCurso}</h2>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Dia</th>
              <th>Período</th>
              <th>Professor</th>
              <th>Disciplina</th>
              <th>Fase</th>
              <th>Carga Horária</th>
            </tr>
          </thead>
          <tbody>
      `;
      curso.disciplinas.forEach((disciplina: Disciplina) => {
        html += `
          <tr>
            <td>${disciplina.dia}</td>
            <td>${disciplina.periodo}</td>
            <td>${disciplina.nomeProfessor}</td>
            <td>${disciplina.nomeDisciplina}</td>
            <td>${disciplina.fase}</td>
            <td>${disciplina.ch}</td>
          </tr>
        `;
      });
      html += `
          </tbody>
        </table>
      `;
    });
    return html;
  }

  closeForm(): void {
    const container = document.getElementById("resultContainer") as HTMLDivElement;
    container.style.display = "none";
  }
}