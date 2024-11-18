import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  jsonData: any = null;

  constructor() { }

  ngOnInit(): void {
    const applyBtn = document.getElementById("applyBtn") as HTMLButtonElement;

    document.getElementById("IFormFile")?.addEventListener("change", (event: any) => {
      const file = event.target.files[0];
      
      if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            this.jsonData = JSON.parse(e.target.result);
            alert("Arquivo JSON carregado com sucesso!");
            applyBtn.disabled = false;
          } catch (error) {
            alert("Erro ao ler o arquivo JSON.");
            applyBtn.disabled = true;
          }
        };
        reader.readAsText(file);
      } else {
        alert("Por favor, selecione um arquivo JSON válido.");
        applyBtn.disabled = true;
      }
    });
  }

  validateEvenChromosomes(): void {
    const Cromossomos = document.getElementById("Cromossomos") as HTMLInputElement;
    const value = parseInt(Cromossomos.value);

    if (value % 2 !== 0) {
      alert("O valor de Cromossomos deve ser um número par.");
      Cromossomos.value = ''; // Limpa o campo caso o valor seja ímpar
    }
  }

  validateElitismCount(): void {
    const Cromossomos = parseInt((document.getElementById("Cromossomos") as HTMLInputElement).value);
    const CromossomosPorElitismo = parseInt((document.getElementById("CromossomosPorElitismo") as HTMLInputElement).value);

    if (CromossomosPorElitismo >= Cromossomos) {
      alert("O valor de Cromossomos por Elitismo deve ser menor que o valor de Cromossomos.");
      (document.getElementById("CromossomosPorElitismo") as HTMLInputElement).value = '';
    }
  }

  applySettings(): void {
    const ProbabilidadeCruzamento = (document.getElementById("ProbabilidadeCruzamento") as HTMLInputElement).value;
    const ProbabilidadeMutacao = (document.getElementById("ProbabilidadeMutacao") as HTMLInputElement).value;
    const Cromossomos = (document.getElementById("Cromossomos") as HTMLInputElement).value;
    const CromossomosPorElitismo = (document.getElementById("CromossomosPorElitismo") as HTMLInputElement).value;
    const QuantidadeMaxInteracoes = (document.getElementById("QuantidadeMaxInteracoes") as HTMLInputElement).value;
    const InteracoesSemMelhorias = (document.getElementById("InteracoesSemMelhorias") as HTMLInputElement).value;

    if (!ProbabilidadeCruzamento || !ProbabilidadeMutacao || !Cromossomos || !CromossomosPorElitismo || !QuantidadeMaxInteracoes || !InteracoesSemMelhorias) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const resultData = {
      bestScore: "95.7",
      iterations: 1200,
      executionTime: "2 minutos"
    };

    this.showResultScreen(resultData);
    alert("Configurações aplicadas com sucesso!");
  }

  showResultScreen(resultData: any): void {
    const resultContainer = document.getElementById("resultContainer") as HTMLDivElement;
    resultContainer.style.display = "block";
    (document.getElementById("bestChromosomeScore") as HTMLInputElement).value = resultData.bestScore;
    (document.getElementById("iterationsCount") as HTMLInputElement).value = resultData.iterations;
    (document.getElementById("executionTime") as HTMLInputElement).value = resultData.executionTime;
  }

  resetForm(): void {
    (document.getElementById("IFormFile") as HTMLInputElement).value = "";
    (document.getElementById("ProbabilidadeCruzamento") as HTMLInputElement).value = "";
    (document.getElementById("ProbabilidadeMutacao") as HTMLInputElement).value = "";
    (document.getElementById("Cromossomos") as HTMLInputElement).value = "";
    (document.getElementById("CromossomosPorElitismo") as HTMLInputElement).value = "";
    (document.getElementById("QuantidadeMaxInteracoes") as HTMLInputElement).value = "";
    (document.getElementById("InteracoesSemMelhorias") as HTMLInputElement).value = "";
    (document.getElementById("applyBtn") as HTMLButtonElement).disabled = true;
    this.jsonData = null;
  }

  closeForm(): void {
    const container = document.querySelector(".container") as HTMLDivElement;
    container.style.display = "none";
  }

  closeResults(): void {
    const resultContainer = document.getElementById("resultContainer") as HTMLDivElement;
    resultContainer.style.display = "none";
  }

  exportResults(): void {
    alert("Funcionalidade para exportar resultados ainda não implementada.");
  }
}
