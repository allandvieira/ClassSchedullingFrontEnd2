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
    if (!this.cromossomos || !this.quantidadeMaxInteracoes || !this.jsonData) {
      this.toastr.warning(
        "Por favor, preencha todos os campos obrigatórios.",
        "Aviso"
      );
      return;
    }

    if (!this.validateElitismCount()) {
      return;
    }

    const formData = new FormData();
    const blob = new Blob([JSON.stringify(this.jsonData)], {
      type: "application/json",
    });
    formData.append("file", blob, "disciplinas_professores.json");

    let url = `https://localhost:7018/ClassSchedulling?Cromossomos=${this.cromossomos}&QuantidadeMaxInteracoes=${this.quantidadeMaxInteracoes}`;

    if (this.probabilidadeCruzamento !== null) {
      url += `&ProbabilidadeCruzamento=${this.probabilidadeCruzamento}`;
    }
    if (this.probabilidadeMutacao !== null) {
      url += `&ProbabilidadeMutacao=${this.probabilidadeMutacao}`;
    }
    if (this.cromossomosPorElitismo !== null) {
      url += `&CromossomosPorElitismo=${this.cromossomosPorElitismo}`;
    }
    if (this.interacoesSemMelhorias !== null) {
      url += `&InteracoesSemMelhorias=${this.interacoesSemMelhorias}`;
    }

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

  validateElitismCount(): boolean {
    if (
      this.cromossomosPorElitismo !== null &&
      (this.cromossomosPorElitismo >= this.cromossomos! ||
        this.cromossomosPorElitismo % 2 !== 0)
    ) {
      this.toastr.warning(
        "O valor de Cromossomos por Elitismo deve ser menor que o valor de Cromossomos e deve ser um número par.",
        "Aviso"
      );
      this.cromossomosPorElitismo = null;
      return false;
    }
    return true;
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