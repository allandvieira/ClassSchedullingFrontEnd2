import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-result',
  standalone: true,
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnChanges {
  @Input() resultData: any;
  @Output() closeResultsEvent = new EventEmitter<void>();

  constructor(private toastr: ToastrService) {}

  ngOnChanges(): void {
    if (this.resultData) {
      this.displayResults();
    }
  }

  displayResults(): void {
    (document.getElementById("bestChromosomeScore") as HTMLInputElement).value = this.resultData.notaDoMaiorCromosso;
    (document.getElementById("iterationsCount") as HTMLInputElement).value = this.resultData.quantidadeDeIterações;
    (document.getElementById("executionTime") as HTMLInputElement).value = this.resultData.tempoDeExecuçãoEmMinutos;

    const generatedSchedule = document.getElementById("generatedSchedule");
    if (generatedSchedule) {
      // Convert the response header date to Brasília time
      const responseDate = new Date();
      const brasiliaTime = new Date(responseDate.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
      generatedSchedule.textContent = `Horário gerado: ${brasiliaTime.toLocaleString()}`;
    }
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
      const tableData = this.resultData.cursos.map((curso: any) => {
        return curso.disciplinas.map((disciplina: any) => {
          return {
            Curso: curso.nomeCurso,
            Dia: disciplina.dia,
            Período: disciplina.periodo,
            Professor: disciplina.nomeProfessor,
            Disciplina: disciplina.nomeDisciplina,
            Fase: disciplina.fase,
            CargaHorária: disciplina.ch
          };
        });
      }).flat();

      const csvContent = "data:text/csv;charset=utf-8," 
        + tableData.map((e: any) => Object.values(e).join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "resultado.csv");
      document.body.appendChild(link); // Required for FF

      link.click();
      document.body.removeChild(link);
    } else {
      this.toastr.warning("Nenhum dado de curso disponível para converter.", "Aviso");
    }
  }

  closeResults(): void {
    this.closeResultsEvent.emit();
  }
}