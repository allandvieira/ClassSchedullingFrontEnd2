import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CommonModule } from "@angular/common";
import { ApiService } from "../api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ResultComponent } from "../result/result.component";

@Component({
  selector: "app-form",
  standalone: true,
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
  imports: [CommonModule, FormsModule, ResultComponent],
})
export class FormComponent implements OnInit {
  @ViewChild(ResultComponent) resultComponent!: ResultComponent;

  probabilidadeCruzamento: number | null = null;
  probabilidadeMutacao: number | null = null;
  cromossomos: number | null = null;
  cromossomosPorElitismo: number | null = null;
  quantidadeMaxInteracoes: number | null = null;
  interacoesSemMelhorias: number | null = null;
  jsonData: any = null;
  resultData: any = null;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.toastr.toastrConfig.positionClass = "toast-bottom-right";
  }

  ngOnInit(): void {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    const applyBtn = document.getElementById("applyBtn") as HTMLButtonElement;

    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          this.jsonData = JSON.parse(e.target.result);
          this.toastr.success(
            "Arquivo JSON carregado com sucesso!",
            "Sucesso!"
          );
          if (applyBtn) {
            applyBtn.disabled = false;
          }
        } catch (error) {
          this.toastr.error("Erro ao ler o arquivo JSON.", "Erro");
          if (applyBtn) {
            applyBtn.disabled = true;
          }
        }
      };
      reader.readAsText(file);
    } else {
      this.toastr.warning(
        "Por favor, selecione um arquivo JSON válido.",
        "Aviso"
      );
      if (applyBtn) {
        applyBtn.disabled = true;
      }
    }
  }

  onSubmit() {
    if (
      this.probabilidadeCruzamento === null ||
      this.probabilidadeMutacao === null ||
      this.cromossomos === null ||
      this.cromossomosPorElitismo === null ||
      this.quantidadeMaxInteracoes === null ||
      this.interacoesSemMelhorias === null ||
      this.jsonData === null
    ) {
      this.toastr.warning(
        "Campos preenchidos indevidamente, por favor validar.",
        "Aviso"
      );
      return;
    }

    if (!this.validateAllFields()) {
      return;
    }

    const formData = new FormData();
    const blob = new Blob([JSON.stringify(this.jsonData)], {
      type: "application/json",
    });
    formData.append("file", blob, "disciplinas_professores.json");

    let url = `https://localhost:7018/ClassSchedulling?ProbabilidadeCruzamento=${this.probabilidadeCruzamento}&ProbabilidadeMutacao=${this.probabilidadeMutacao}&Cromossomos=${this.cromossomos}&CromossomosPorElitismo=${this.cromossomosPorElitismo}&QuantidadeMaxInteracoes=${this.quantidadeMaxInteracoes}&InteracoesSemMelhorias=${this.interacoesSemMelhorias}`;

    const headers = new HttpHeaders({
      Accept: "application/json",
    });

    const waitingToast = this.toastr.info(
      "Aguardando retorno da API...",
      "Aguarde",
      {
        disableTimeOut: true,
        tapToDismiss: false,
      }
    );

    this.hideInitialScreen();
    this.showResultScreen();

    this.http.post(url, formData, { headers }).subscribe({
      next: (response: any) => {
        this.toastr.clear(waitingToast.toastId);
        this.toastr.success("Configurações aplicadas com sucesso!", "Sucesso!");
        this.resultData = response;
        this.updateResultScreen();
      },
      error: (error) => {
        this.toastr.clear(waitingToast.toastId);
        this.toastr.error("Erro ao aplicar configurações.", "Erro");
        this.showInitialScreen();
        this.hideResultScreen();
      },
    });
  }

  validateAllFields(): boolean {
    return this.validateProbabilities() && this.validateCromossomos() && this.validateElitismCount() && this.validateIterationCount();
  }

  validateProbabilities(): boolean {
    if (this.probabilidadeCruzamento !== null && (this.probabilidadeCruzamento < 0 || this.probabilidadeCruzamento > 100)) {
      this.toastr.warning(
        "A probabilidade de cruzamento deve ser um valor entre 0 e 100.",
        "Aviso"
      );
      return false;
    }

    if (this.probabilidadeMutacao !== null && (this.probabilidadeMutacao < 0 || this.probabilidadeMutacao > 5)) {
      this.toastr.warning(
        "A probabilidade de mutação deve ser um valor entre 0 e 5.",
        "Aviso"
      );
      return false;
    }

    return true;
  }

  validateCromossomos(): boolean {
    if (this.cromossomos !== null && (this.cromossomos < 2 || this.cromossomos % 2 !== 0)) {
      this.toastr.warning(
        "O valor de Cromossomos deve ser 2 ou mais e deve ser um número par.",
        "Aviso"
      );
      return false;
    }
    return true;
  }

  validateElitismCount(): boolean {
    if (this.cromossomosPorElitismo !== null && (this.cromossomosPorElitismo >= this.cromossomos! || this.cromossomosPorElitismo % 2 !== 0)) {
      this.toastr.warning(
        "O valor de Cromossomos por Elitismo deve ser menor que o valor de Cromossomos e deve ser um número par.",
        "Aviso"
      );
      return false;
    }
    return true;
  }

  validateIterationCount(): boolean {
    if (this.quantidadeMaxInteracoes !== null && this.interacoesSemMelhorias !== null) {
      if (this.quantidadeMaxInteracoes < 1 || this.quantidadeMaxInteracoes <= this.interacoesSemMelhorias) {
        this.toastr.warning(
          "A quantidade máxima de interações deve ser maior que 0 e maior que a quantidade de iterações sem melhoria.",
          "Aviso"
        );
        return false;
      }
      if (this.interacoesSemMelhorias >= this.quantidadeMaxInteracoes) {
        this.toastr.warning(
          "A quantidade de iterações sem melhoria deve ser menor que a quantidade máxima de interações.",
          "Aviso"
        );
        return false;
      }
    }
    return true;
  }

  onProbabilidadeCruzamentoChange() {
    this.validateProbabilities();
  }

  onProbabilidadeMutacaoChange() {
    this.validateProbabilities();
  }

  onCromossomosChange() {
    this.validateCromossomos();
  }

  onCromossomosPorElitismoChange() {
    this.validateElitismCount();
  }

  onQuantidadeMaxInteracoesChange() {
    this.validateIterationCount();
  }

  onInteracoesSemMelhoriasChange() {
    this.validateIterationCount();
  }

  resetForm(): void {
    (document.getElementById("IFormFile") as HTMLInputElement).value = "";
    this.probabilidadeCruzamento = null;
    this.probabilidadeMutacao = null;
    this.cromossomos = null;
    this.cromossomosPorElitismo = null;
    this.quantidadeMaxInteracoes = null;
    this.interacoesSemMelhorias = null;
    const applyBtn = document.getElementById("applyBtn") as HTMLButtonElement;
    if (applyBtn) {
      applyBtn.disabled = true;
    }
    this.jsonData = null;
  }

  closeForm(): void {
    const container = document.querySelector(".container") as HTMLDivElement;
    container.style.display = "none";
  }

  hideInitialScreen(): void {
    const container = document.querySelector(".container") as HTMLDivElement;
    container.style.display = "none";
  }

  showInitialScreen(): void {
    const container = document.querySelector(".container") as HTMLDivElement;
    container.style.display = "block";
  }

  showResultScreen(): void {
    const resultContainer = document.getElementById(
      "resultContainer"
    ) as HTMLDivElement;
    resultContainer.style.display = "block";
  }

  hideResultScreen(): void {
    const resultContainer = document.getElementById(
      "resultContainer"
    ) as HTMLDivElement;
    resultContainer.style.display = "none";
  }

  updateResultScreen(): void {
    if (this.resultData) {
      (
        document.getElementById("bestChromosomeScore") as HTMLInputElement
      ).value = this.resultData.notaDoMaiorCromosso;
      (document.getElementById("iterationsCount") as HTMLInputElement).value =
        this.resultData.quantidadeDeIterações;
      (document.getElementById("executionTime") as HTMLInputElement).value =
        this.resultData.tempoDeExecuçãoEmMinutos;
    }
  }

  showFormScreen(): void {
    this.resetForm();
    this.hideResultScreen();
    this.showInitialScreen();
  }

  closeResults(): void {
    this.showFormScreen();
  }
}