export interface Disciplina {
    dia: string;
    periodo: string;
    nomeProfessor: string;
    nomeDisciplina: string;
    fase: number;
    ch: number;
  }
  
  export interface Curso {
    nomeCurso: string;
    disciplinas: Disciplina[];
  }